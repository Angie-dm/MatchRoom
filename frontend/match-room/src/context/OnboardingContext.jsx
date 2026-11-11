import { useCallback, useMemo, useState } from "react";
import { OnboardingContext } from "./onboardingCtx";
import { useAutosave } from "../hooks/useAutosave";
import { clearOnboardingDraft, onboardingDraftKey } from "../utils/onboardingStorage";
import { useAuth } from "../hooks/useAuth";

const OMIT = ["password"]; // la contraseña nunca se guarda

const initialData = {
  proveedor: "correo", // "correo" | "google"
  // 1. Datos básicos
  firstName: "",
  lastName: "",
  birthDate: "",
  ocupacion: "",
  correo: "",
  password: "",
  terminos: false,
  // 2. Presupuesto y ubicación
  cityId: "",
  zoneIds: [],
  presupuestoMin: 5000,
  presupuestoMax: 10000,
  mudanza: "",
  propertyType: null,
  requiresFurnished: null,
  requiresPetsAllowed: null,
  // 3. Horarios y limpieza
  jornada: "",
  descanso: "",
  orden: "",
  noiseLevel: null,
  smokes: null,
  convivencia: "",
  rutina: "",
  // 4. Mascotas y convivencia
  mascotas: "",
  convivirMascotas: "",
  fumar: "",
  visitas: "",
  espacio: "",
  maxNoiseLevel: null,
  maxVisitsFrequency: null,
  minCleanlinessLevel: null,
  minAge: null,
  maxAge: null,
  exclusiveCriteria: [],
};

function load(key) {
  try {
    return { ...initialData, ...JSON.parse(localStorage.getItem(key) ?? "{}") };
  } catch {
    return initialData;
  }
}

export function OnboardingProvider({ children }) {
  const { user } = useAuth();
  const key = onboardingDraftKey(user?.id);
  const [data, setData] = useState(() => load(key));
  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  const reset = useCallback(() => {
    clearOnboardingDraft(user?.id);
    setData(initialData);
  }, [user?.id]);

  useAutosave(key, data, OMIT);

  const value = useMemo(() => ({ data, update, reset }), [data, update, reset]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
