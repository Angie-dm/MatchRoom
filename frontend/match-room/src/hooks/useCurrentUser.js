import { useAuth } from "./useAuth";
import { identityDisplayName } from "../utils/authIdentity";

export function useCurrentUser() {
  const { user, status, refreshSession } = useAuth();
  const nombre = identityDisplayName(user);

  return {
    nombre,
    email: user?.email || "",
    primerNombre: nombre.split(" ")[0],
    ciudad: "Ciudad de México",
    zonas: [],
    presupuestoMin: 5000,
    presupuestoMax: 10000,
    perfilPct: 0,
    isAuthenticated: status === "authenticated" || status === "demo",
    isLoading: status === "loading",
    sessionUnavailable: status === "unavailable",
    isDemo: status === "demo",
    refreshSession,
  };
}
