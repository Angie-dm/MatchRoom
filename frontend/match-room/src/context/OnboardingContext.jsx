import { useCallback, useMemo, useState } from "react";
import { OnboardingContext } from "./onboardingCtx";
import { useAutosave } from "../hooks/useAutosave";

const STORAGE_KEY = "matchroom:onboarding";
const OMIT = ["password"]; // la contraseña nunca se guarda

const initialData = {
  proveedor: "correo", // "correo" | "google"
  // 1. Datos básicos
  nombre: "",
  edad: "",
  ocupacion: "",
  correo: "",
  password: "",
  terminos: false,
  // 2. Presupuesto y ubicación
  ciudad: "Ciudad de México",
  zonas: [],
  presupuestoMin: 5000,
  presupuestoMax: 10000,
  mudanza: "",
  // 3. Horarios y limpieza
  jornada: "",
  descanso: "",
  orden: "",
  limpieza: "",
  rutina: "",
  // 4. Mascotas y convivencia
  mascotas: "",
  convivirMascotas: "",
  fumar: "",
  visitas: "",
  espacio: "",
};

function load() {
  try {
    return { ...initialData, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") };
  } catch {
    return initialData;
  }
}

export function OnboardingProvider({ children }) {
  const [data, setData] = useState(load);
  const update = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), []);
  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialData);
  }, []);

  useAutosave(STORAGE_KEY, data, OMIT);

  const value = useMemo(() => ({ data, update, reset }), [data, update, reset]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
