import { describe, expect, it } from "vitest";
import { draftFromProfile, nextOnboardingStep } from "./onboardingProgress";

const completeProfile = {
  firstName: "Ana", lastName: "López", birthDate: "2000-01-01", occupation: "Diseñadora", bio: "Hola",
  cityId: "city-1", preferredZones: [{ id: "zone-1" }],
  housingPreferences: { budgetMin: "5000.00", budgetMax: "8000.00", moveInDate: "2027-01-01" },
  lifestyle: { workSchedule: "flexible", sleepSchedule: "regular", cleanlinessLevel: 3, hasPets: false, smokes: false, visitsFrequency: "rare", cohabitationType: "any" },
  roommatePreferences: { smokingPolicy: "reject", petsPolicy: "accept" },
};

describe("nextOnboardingStep", () => {
  it("sends a complete onboarding profile directly to explore", () => {
    expect(nextOnboardingStep(completeProfile)).toBeNull();
  });

  it("returns the first persisted step that is still incomplete", () => {
    expect(nextOnboardingStep({ ...completeProfile, housingPreferences: null })).toBe(2);
    expect(nextOnboardingStep({ ...completeProfile, lifestyle: { ...completeProfile.lifestyle, sleepSchedule: null } })).toBe(3);
    expect(nextOnboardingStep({ ...completeProfile, bio: null })).toBe(4);
  });

  it("hydrates the authenticated user's draft from persisted data", () => {
    expect(draftFromProfile(completeProfile, { email: "ana@example.com" })).toMatchObject({
      correo: "ana@example.com", firstName: "Ana", cityId: "city-1", zoneIds: ["zone-1"], presupuestoMin: 5000,
    });
  });
});
