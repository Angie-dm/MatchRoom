import { jwtDecode } from "jwt-decode";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const KEY = "matchroom:onboarding";

export const authService = {
  async login({ email }) {
    await wait(400);
    return { ok: true, email };
  },

  async loginWithGoogle(credential) {
    // SOLO FRONT: el token se lee pero NO se verifica la firma.
    // Cuando exista la API, reemplaza el cuerpo por:
    //   const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
    //     method: "POST",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ credential }),
    //   });
    //   if (!res.ok) throw new Error("Google login falló");
    //   return res.json();
    const { name, email, email_verified } = jwtDecode(credential);
    if (!email_verified) throw new Error("Correo no verificado");

    const prev = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...prev, nombre: name, correo: email, proveedor: "google" }),
    );
    return { ok: true };
  },

  async register(profile) {
    await wait(400);
    console.log("registro (stub):", profile);
    return { ok: true };
  },
};