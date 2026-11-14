import { Capacitor } from "@capacitor/core";

const DEMO_KEY = "matchroom:demo-session";

export const DEMO_USER = {
  id: "demo-local-user",
  email: "demo@matchroom.local",
  activeMode: "seeker",
};

/**
 * Reglas del modo demostración:
 * - Plataforma nativa (Capacitor): siempre disponible.
 * - `?demo=1` en desarrollo: disponible.
 * - `VITE_ENABLE_DEMO="true"`: se fuerza aunque haya API configurada.
 * - `VITE_ENABLE_DEMO="false"`: se desactiva siempre.
 * - Sin `VITE_API_URL` no existe forma de autenticarse, así que la demo queda
 *   disponible por defecto para poder probar la aplicación.
 */
export function isDemoAvailable() {
  if (Capacitor.isNativePlatform()) return true;
  const forced = import.meta.env.VITE_ENABLE_DEMO === "true";
  const disabled = import.meta.env.VITE_ENABLE_DEMO === "false";
  const devQuery = import.meta.env.DEV && new URLSearchParams(window.location.search).get("demo") === "1";
  if (devQuery || forced) return true;
  if (disabled) return false;
  return !import.meta.env.VITE_API_URL;
}

export function hasDemoSession() {
  return localStorage.getItem(DEMO_KEY) === "true";
}

export function startDemoSession() {
  localStorage.setItem(DEMO_KEY, "true");
}

export function clearDemoSession() {
  localStorage.removeItem(DEMO_KEY);
}
