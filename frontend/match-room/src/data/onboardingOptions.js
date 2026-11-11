export const STEPS = [
  { id: 1, label: "Datos básicos" },
  { id: 2, label: "Presupuesto y ubicación" },
  { id: 3, label: "Horarios y limpieza" },
  { id: 4, label: "Mascotas y convivencia" },
];

export const OPTIONS = {
  jornada: [{ value: "morning", label: "Mañana" }, { value: "afternoon", label: "Tarde" }, { value: "night", label: "Noche" }, { value: "remote", label: "Trabajo remoto" }, { value: "flexible", label: "Flexible o híbrido" }],
  descanso: [{ value: "early", label: "Temprano" }, { value: "regular", label: "Horario regular" }, { value: "late", label: "Tarde o noche" }],
  orden: [{ value: 1, label: "Relajado" }, { value: 3, label: "Equilibrado" }, { value: 5, label: "Muy ordenado" }],
  mascotas: [{ value: false, label: "No" }, { value: true, label: "Sí" }],
  convivirMascotas: [{ value: "accept", label: "Sí" }, { value: "reject", label: "No" }, { value: "indifferent", label: "Me es indiferente" }],
  fumar: [{ value: "accept", label: "Acepto que fumen en casa" }, { value: "reject", label: "No acepto que fumen en casa" }, { value: "indifferent", label: "Me es indiferente" }],
  visitas: [{ value: "never", label: "Nunca" }, { value: "rare", label: "Raras veces" }, { value: "sometimes", label: "A veces" }, { value: "often", label: "Frecuentes" }],
  convivencia: [{ value: "join_existing_home", label: "Unirme a un hogar" }, { value: "find_place_together", label: "Encontrar vivienda juntos" }, { value: "any", label: "Cualquiera" }],
};
