import { useState } from "react";

const KEY = "matchroom:onboarding";
// "presentacion" es un campo futuro: mantiene el perfil por debajo del 100 %
const FIELDS = [
  "nombre", "edad", "ocupacion", "correo", "ciudad", "zonas", "mudanza",
  "jornada", "descanso", "orden", "limpieza", "rutina",
  "mascotas", "convivirMascotas", "fumar", "visitas", "espacio", "presentacion",
];

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

// TODO: cuando exista la API, estos datos vendrán de la sesión del usuario.
export function useCurrentUser() {
  const [data] = useState(read);
  const nombre = data.nombre?.trim() || "Invitado";
  const filled = FIELDS.filter((f) => (Array.isArray(data[f]) ? data[f].length > 0 : Boolean(data[f]))).length;

  return {
    nombre,
    primerNombre: nombre.split(" ")[0],
    ciudad: data.ciudad || "Ciudad de México",
    zonas: data.zonas ?? [],
    presupuestoMin: data.presupuestoMin ?? 5000,
    presupuestoMax: data.presupuestoMax ?? 10000,
    perfilPct: Math.round((filled / FIELDS.length) * 100),
  };
}