import { Capacitor } from "@capacitor/core";

const DEMO_KEY = "matchroom:demo-session";

export const DEMO_USER = {
  id: "demo-local-user",
  email: "demo@matchroom.local",
  activeMode: "seeker",
};

export function isDemoAvailable() {
  return Capacitor.isNativePlatform() || (
    import.meta.env.DEV && new URLSearchParams(window.location.search).get("demo") === "1"
  );
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
