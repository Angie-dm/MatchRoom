import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function ConnectionStatus() {
  const online = useOnlineStatus();
  if (online) return null;
  return <div role="status" className="fixed inset-x-0 top-0 z-[90] flex items-center justify-center gap-2 bg-brand-100 px-4 py-2 text-center text-xs font-medium text-brand-700"><WifiOff size={14} aria-hidden="true" />Sin conexión. La interfaz y los catálogos ya consultados siguen disponibles; los cambios requieren internet.</div>;
}
