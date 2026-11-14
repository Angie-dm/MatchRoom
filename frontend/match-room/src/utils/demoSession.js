import { Capacitor } from "@capacitor/core";

const DEMO_KEY = "matchroom:demo-session";

export const DEMO_USER = {
  id: "demo-local-user",
  email: "demo@matchroom.local",
  activeMode: "seeker",
};

export function isDemoAvailable() {
  if (Capacitor.isNativePlatform()) return true;
  // En builds publicados el modo demo se habilita explícitamente con
  // VITE_ENABLE_DEMO=true (ver netlify.toml) y se muestra como una opción
  // visible en el login. Nunca se activa solo.
  if (import.meta.env.VITE_ENABLE_DEMO === "true") return true;
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get("demo") === "1";
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
