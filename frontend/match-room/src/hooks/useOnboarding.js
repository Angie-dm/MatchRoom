import { useContext } from "react";
import { OnboardingContext } from "../context/onboardingCtx";

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding debe usarse dentro de OnboardingProvider");
  return ctx;
}
