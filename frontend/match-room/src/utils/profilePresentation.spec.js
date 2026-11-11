import { describe, expect, it } from "vitest";
import { hasProfileValue, profileLivingFields } from "./profilePresentation";

describe("profileLivingFields", () => {
  it("maps nested profile responses without treating false as absent", () => {
    const result = profileLivingFields({
      cityId: "city-1",
      preferredZones: [{ id: "zone-1", name: "Centro" }],
      housingPreferences: { budgetMin: "5000.00", budgetMax: "10000.00", moveInDate: "2027-01-01" },
      lifestyle: { hasPets: false, smokes: false, workSchedule: "flexible" },
      roommatePreferences: { smokingPolicy: "reject", petsPolicy: "accept" },
    });

    expect(result).toMatchObject({
      cityId: "city-1", zoneIds: ["zone-1"], budgetMin: "5000.00", budgetMax: "10000.00",
      hasPets: false, smokes: false, workSchedule: "flexible", smokingPolicy: "reject", petsPolicy: "accept",
    });
    expect(hasProfileValue(result.hasPets)).toBe(true);
    expect(hasProfileValue(result.smokes)).toBe(true);
  });
});
