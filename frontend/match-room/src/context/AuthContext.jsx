import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./authCtx";
import { clearOnboardingDraft } from "../utils/onboardingStorage";
import { sessionIdentity } from "../utils/authIdentity";
import {
  clearDemoSession,
  DEMO_USER,
  hasDemoSession,
  isDemoAvailable,
  startDemoSession,
} from "../utils/demoSession";

export function AuthProvider({ children }) {
  const demoAvailable = isDemoAvailable();
  const initialDemo = demoAvailable && hasDemoSession();
  const [user, setUser] = useState(() => initialDemo ? DEMO_USER : null);
  const [status, setStatus] = useState(() => initialDemo ? "demo" : (demoAvailable ? "anonymous" : "loading"));

  const refreshSession = useCallback(async () => {
    if (demoAvailable && hasDemoSession()) {
      setUser(DEMO_USER);
      setStatus("demo");
      return DEMO_USER;
    }
    if (demoAvailable) {
      setUser(null);
      setStatus("anonymous");
      return null;
    }
    setStatus("loading");
    try {
      const response = await authService.me();
      const sessionUser = sessionIdentity(response);
      if (!sessionUser) throw new Error("Invalid session response");
      setUser(sessionUser);
      setStatus("authenticated");
      return sessionUser;
    } catch (error) {
      setUser(null);
      setStatus(error.status === 401 ? "anonymous" : "unavailable");
      return null;
    }
  }, [demoAvailable]);

  const startDemo = useCallback(() => {
    if (!demoAvailable) return false;
    startDemoSession();
    setUser(DEMO_USER);
    setStatus("demo");
    return true;
  }, [demoAvailable]);

  const restartDemo = useCallback(() => {
    if (!demoAvailable) return false;
    clearOnboardingDraft();
    startDemoSession();
    setUser(DEMO_USER);
    setStatus("demo");
    return true;
  }, [demoAvailable]);

  const logout = useCallback(async () => {
    if (status === "demo") {
      clearDemoSession();
      clearOnboardingDraft(DEMO_USER.id);
      setUser(null);
      setStatus("anonymous");
      return;
    }
    await authService.logout();
    clearOnboardingDraft(user?.id);
    setUser(null);
    setStatus("anonymous");
  }, [status, user?.id]);

  useEffect(() => {
    let mounted = true;
    if (demoAvailable) return () => { mounted = false; };
    authService.me()
      .then((response) => {
        if (!mounted) return;
        const sessionUser = sessionIdentity(response);
        if (!sessionUser) throw new Error("Invalid session response");
        setUser(sessionUser);
        setStatus("authenticated");
      })
      .catch((error) => {
        if (!mounted) return;
        setUser(null);
        setStatus(error.status === 401 ? "anonymous" : "unavailable");
      });
    return () => { mounted = false; };
  }, [demoAvailable]);

  const value = useMemo(() => ({
    user,
    status,
    refreshSession,
    logout,
    startDemo,
    restartDemo,
    isDemo: status === "demo",
    isDemoAvailable: demoAvailable,
  }), [user, status, refreshSession, logout, startDemo, restartDemo, demoAvailable]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
