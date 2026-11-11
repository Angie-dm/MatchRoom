import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, sessionUnavailable } = useCurrentUser();
  if (isLoading) return <div className="min-h-dvh bg-canvas" aria-busy="true" />;
  if (sessionUnavailable) return <div className="grid min-h-dvh place-items-center bg-canvas p-6 text-center"><div className="max-w-sm rounded-3xl border border-line bg-white p-6 shadow-sm"><h1 className="font-display text-xl font-semibold">No pudimos verificar tu sesión</h1><p className="mt-2 text-sm text-muted">Conéctate a internet para abrir información privada. Tus datos no se guardan en cachés públicas.</p></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
