const MESES = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];

// "2026-12-01" -> "1 dic. 2026" (sin pasar por Date, para evitar el desfase de zona horaria)
export function formatFecha(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
}

export const formatMoney = (n) => `$${n.toLocaleString("es-MX")}`;