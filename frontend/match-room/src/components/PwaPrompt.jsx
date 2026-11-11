import { CircleCheck, RefreshCw, X } from "lucide-react";
import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { updateAppShellMetadata } from "../services/appShellStorage";

export default function PwaPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 5000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (offlineReady) updateAppShellMetadata({ serviceWorkerReadyAt: Date.now() });
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) updateAppShellMetadata({ updateAvailableAt: Date.now() });
  }, [needRefresh]);

  if (!offlineReady && !needRefresh) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 animate-fade-up rounded-2xl border border-line bg-white p-4 shadow-2xl shadow-brand-500/20 sm:left-auto sm:w-96 lg:right-6 lg:bottom-6"
    >
      {needRefresh ? (
        <div className="flex items-start gap-3">
          <RefreshCw size={20} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Hay una nueva versión</p>
            <p className="mt-0.5 text-xs text-muted">Actualiza para ver lo último de Match Room.</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => { updateAppShellMetadata({ lastUpdateRequestedAt: Date.now() }); updateServiceWorker(true); }}
                className="h-10 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white transition active:scale-95"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setNeedRefresh(false)}
                className="h-10 rounded-xl border border-line px-4 text-sm font-semibold text-muted transition active:scale-95"
              >
                Después
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <CircleCheck size={20} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Lista para usar sin conexión</p>
            <p className="mt-0.5 text-xs text-muted">Ya puedes abrir Match Room aunque no tengas internet.</p>
          </div>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setOfflineReady(false)}
            className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-brand-50"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
