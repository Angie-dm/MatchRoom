const configuredUrl = import.meta.env.VITE_API_URL;
const API_URL = (configuredUrl || "http://localhost:3000/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request(path, options = {}) {
  if (!API_URL) {
    throw new ApiError("Esta versión no está conectada a un servidor.");
  }
  // `errorMessages` is a client-side override, never sent to the server.
  const { errorMessages = {}, ...init } = options;
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      cache: "no-store",
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    });
  } catch {
    throw new ApiError("No pudimos conectarnos. Revisa tu conexión e intenta de nuevo.");
  }

  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const publicMessages = {
      401: "Correo o contraseña incorrectos.",
      409: "Ya existe una cuenta con este correo.",
      429: "Demasiados intentos. Intenta de nuevo más tarde.",
      503: "Este servicio no está disponible por ahora.",
    };
    const serverMessage = Array.isArray(body.message)
      ? body.message.join(" ")
      : body.message;
    throw new ApiError(
      errorMessages[response.status]
        || publicMessages[response.status]
        || serverMessage
        || "No pudimos completar la solicitud.",
      response.status,
    );
  }
  return body;
}
