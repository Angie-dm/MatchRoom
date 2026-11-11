// The Android WebView already receives all assets in the APK. This keeps the
// existing PWA prompt component inert only in the Capacitor-specific bundle.
export function useRegisterSW() {
  return {
    offlineReady: [false, () => {}],
    needRefresh: [false, () => {}],
    updateServiceWorker: async () => {},
  };
}
