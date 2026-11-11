export const NEW_ONBOARDING_DRAFT_KEY = "matchroom:onboarding:new";
export const ONBOARDING_DRAFT_KEY = NEW_ONBOARDING_DRAFT_KEY;

export function onboardingDraftKey(userId) {
  return userId ? `matchroom:onboarding:${userId}` : NEW_ONBOARDING_DRAFT_KEY;
}

export function clearOnboardingDraft(userId) {
  localStorage.removeItem(onboardingDraftKey(userId));
}

export function startOnboardingDraft(data = {}, userId) {
  const key = onboardingDraftKey(userId);
  clearOnboardingDraft(userId);
  localStorage.setItem(key, JSON.stringify(data));
}
