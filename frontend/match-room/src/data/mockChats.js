export const ORDEN_CHATS = [1, 2, 3, 4];

// cuando: "Hoy" | "Ayer" | "Lun". de: "ellos" | "yo".
export const CHATS_INICIALES = {
  1: {
    cuando: "Hoy",
    noLeido: false,
    mensajes: [
      { id: "1-1", de: "ellos", hora: "10:28", texto: "¡Hola, Sofía! Vi que tenemos rutinas muy parecidas. ¿Sigues buscando en Roma Norte?" },
      { id: "1-2", de: "yo", hora: "10:30", texto: "¡Hola, Lucía! Sí, me mudo en diciembre. Me encantó la luz de tu departamento ☀️" },
      { id: "1-3", de: "ellos", hora: "10:32", texto: "¡Qué bien! La habitación está disponible desde el 1 de diciembre. La renta es de $7,800 MXN con servicios." },
      { id: "1-4", de: "yo", hora: "10:34", texto: "Está dentro de mi presupuesto. ¿Podríamos hacer una visita esta semana?" },
      { id: "1-5", de: "ellos", hora: "10:35", texto: "Claro, el jueves después de las 18:00 me viene perfecto. ¿Te funciona?" },
      { id: "1-6", de: "yo", hora: "10:38", texto: "¡Sí! El jueves a las 18:30 estaría genial. Gracias, Lucía.", pendiente: true },
    ],
  },
  2: {
    cuando: "Ayer",
    noLeido: true,
    mensajes: [
      { id: "2-1", de: "ellos", hora: "18:02", texto: "¡Hola, Sofía! Vi tu perfil y creo que nos llevaríamos muy bien." },
      { id: "2-2", de: "ellos", hora: "18:03", texto: "¿Te gustaría conocer el depa?" },
    ],
  },
  3: {
    cuando: "Ayer",
    noLeido: true,
    mensajes: [
      { id: "3-1", de: "ellos", hora: "13:40", texto: "¡Hola! Vi que buscas por Roma Norte." },
      { id: "3-2", de: "ellos", hora: "13:41", texto: "También estudio por esa zona" },
    ],
  },
  4: {
    cuando: "Lun",
    noLeido: false,
    mensajes: [
      { id: "4-1", de: "yo", hora: "12:15", texto: "Te comparto la información del depa. Cuando quieras lo vemos." },
      { id: "4-2", de: "ellos", hora: "12:40", texto: "Gracias, Sofía. Lo reviso :)" },
    ],
  },
};