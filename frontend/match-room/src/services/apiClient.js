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
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
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
    throw new ApiError(publicMessages[response.status] || body.message || "No pudimos completar la solicitud.", response.status);
  }
  return body;
}
