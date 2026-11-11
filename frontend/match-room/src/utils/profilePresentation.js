export function hasProfileValue(value) {
  return value !== null && value !== undefined && value !== "";
}

export function profileLivingFields(source = {}) {
  const housing = source.housingPreferences ?? {};
  const lifestyle = source.lifestyle ?? {};
  const roommate = source.roommatePreferences ?? {};
  return {
    cityId: source.cityId ?? "",
    zoneIds: source.preferredZones?.map((zone) => zone.id) ?? [],
    propertyType: housing.propertyType ?? null,
    budgetMin: housing.budgetMin ?? "",
    budgetMax: housing.budgetMax ?? "",
    moveInDate: housing.moveInDate ?? "",
    requiresFurnished: housing.requiresFurnished ?? null,
    requiresPetsAllowed: housing.requiresPetsAllowed ?? null,
    workSchedule: lifestyle.workSchedule ?? "",
    sleepSchedule: lifestyle.sleepSchedule ?? "",
    cleanlinessLevel: lifestyle.cleanlinessLevel ?? "",
    hasPets: lifestyle.hasPets ?? null,
    smokes: lifestyle.smokes ?? null,
    noiseLevel: lifestyle.noiseLevel ?? null,
    visitsFrequency: lifestyle.visitsFrequency ?? "",
    cohabitationType: lifestyle.cohabitationType ?? "",
    smokingPolicy: roommate.smokingPolicy ?? "",
    petsPolicy: roommate.petsPolicy ?? "",
    maxNoiseLevel: roommate.maxNoiseLevel ?? null,
    maxVisitsFrequency: roommate.maxVisitsFrequency ?? null,
    minCleanlinessLevel: roommate.minCleanlinessLevel ?? null,
    minAge: roommate.minAge ?? null,
    maxAge: roommate.maxAge ?? null,
    exclusiveCriteria: roommate.exclusiveCriteria ?? [],
  };
}
