const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const hasValue = (value) => value !== null && value !== undefined && value !== "";

// This deliberately represents only the four screens of this onboarding.
// It does not use the global profile percentage, which includes data this flow
// does not collect (for example, phone, photo and amenities).
export function nextOnboardingStep(profile) {
  if (!profile || ![profile.firstName, profile.lastName, profile.birthDate, profile.occupation].every(hasText)) return 1;

  const housing = profile.housingPreferences;
  if (!profile.cityId || !profile.preferredZones?.length || !hasValue(housing?.budgetMin) || !hasValue(housing?.budgetMax) || !hasText(housing?.moveInDate)) return 2;

  const lifestyle = profile.lifestyle;
  if (!hasValue(lifestyle?.workSchedule) || !hasValue(lifestyle?.sleepSchedule) || !hasValue(lifestyle?.cleanlinessLevel)) return 3;

  const roommate = profile.roommatePreferences;
  if (!hasValue(lifestyle?.hasPets) || !hasValue(lifestyle?.smokes) || !hasValue(lifestyle?.visitsFrequency) || !hasValue(lifestyle?.cohabitationType) || !hasValue(roommate?.smokingPolicy) || !hasValue(roommate?.petsPolicy) || !hasText(profile.bio)) return 4;

  return null;
}

export function draftFromProfile(profile, user) {
  const lifestyle = profile?.lifestyle ?? {};
  const roommate = profile?.roommatePreferences ?? {};
  const housing = profile?.housingPreferences ?? {};
  const toNumber = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

  return {
    proveedor: "sesion",
    correo: user.email,
    firstName: profile?.firstName ?? user.firstName ?? "",
    lastName: profile?.lastName ?? user.lastName ?? "",
    birthDate: profile?.birthDate ?? "",
    ocupacion: profile?.occupation ?? "",
    cityId: profile?.cityId ?? "",
    zoneIds: profile?.preferredZones?.map((zone) => zone.id) ?? [],
    presupuestoMin: toNumber(housing.budgetMin, 5000),
    presupuestoMax: toNumber(housing.budgetMax, 10000),
    mudanza: housing.moveInDate ?? "",
    propertyType: housing.propertyType ?? null,
    requiresFurnished: housing.requiresFurnished ?? null,
    requiresPetsAllowed: housing.requiresPetsAllowed ?? null,
    jornada: lifestyle.workSchedule ?? "",
    descanso: lifestyle.sleepSchedule ?? "",
    orden: lifestyle.cleanlinessLevel ?? "",
    noiseLevel: lifestyle.noiseLevel ?? null,
    mascotas: lifestyle.hasPets ?? "",
    smokes: lifestyle.smokes ?? null,
    convivencia: lifestyle.cohabitationType ?? "",
    convivirMascotas: roommate.petsPolicy ?? "",
    fumar: roommate.smokingPolicy ?? "",
    visitas: lifestyle.visitsFrequency ?? "",
    espacio: profile?.bio ?? "",
    maxNoiseLevel: roommate.maxNoiseLevel ?? null,
    maxVisitsFrequency: roommate.maxVisitsFrequency ?? null,
    minCleanlinessLevel: roommate.minCleanlinessLevel ?? null,
    minAge: roommate.minAge ?? null,
    maxAge: roommate.maxAge ?? null,
    exclusiveCriteria: roommate.exclusiveCriteria ?? [],
  };
}
