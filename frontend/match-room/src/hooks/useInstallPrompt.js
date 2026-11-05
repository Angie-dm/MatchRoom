import { useEffect, useState } from "react";

// Chrome y Edge (Android y escritorio) avisan cuando la app se puede instalar.
// Safari en iPhone no: ahí se instala con Compartir → "Agregar a pantalla de inicio".
export function useInstallPrompt() {
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setEvento(e);
    };
    const onInstalled = () => setEvento(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const instalar = async () => {
    if (!evento) return;
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  };

  return { puedeInstalar: Boolean(evento), instalar };
}