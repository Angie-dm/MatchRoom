import { profileService } from "./profileService";
import { nextOnboardingStep } from "../utils/onboardingProgress";

export async function getOnboardingState() {
  const [profile, completeness] = await Promise.all([
    profileService.me(),
    profileService.completeness(),
  ]);

  return {
    profile,
    completeness,
    nextStep: nextOnboardingStep(profile),
  };
}
