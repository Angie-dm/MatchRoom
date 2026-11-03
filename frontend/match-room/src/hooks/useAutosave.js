import { useEffect } from "react";

// Guarda el borrador en localStorage. `omit` evita guardar datos sensibles.
export function useAutosave(key, value, omit = []) {
  useEffect(() => {
    try {
      const copy = { ...value };
      omit.forEach((field) => delete copy[field]);
      localStorage.setItem(key, JSON.stringify(copy));
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }, [key, value, omit]);
}
