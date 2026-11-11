const KEY = "matchroom:app-shell";
const VERSION = 1;

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch { return {}; }
}

export function updateAppShellMetadata(patch) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, ...read(), ...patch }));
  } catch { /* La interfaz no depende de Local Storage. */ }
}

export function markAppShellVisited() {
  updateAppShellMetadata({ lastVisitedAt: Date.now(), displayMode: window.matchMedia?.("(display-mode: standalone)").matches ? "standalone" : "browser" });
}
