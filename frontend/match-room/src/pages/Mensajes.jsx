import { ArrowLeft, CheckCheck, Clock, Ellipsis, Paperclip, Search, Send, ShieldCheck, Sparkles, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FilterChip from "../components/FilterChip";
import PersonAvatar from "../components/PersonAvatar";
import { CHATS_INICIALES, ORDEN_CHATS } from "../data/mockChats";
import { PERFILES } from "../data/mockProfiles";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const getPerfil = (id) => PERFILES.find((p) => p.id === id);
const HOY = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long" }).toUpperCase();
const DIAS = { Hoy: `HOY, ${HOY}`, Ayer: "AYER", Lun: "LUNES" };

function Burbuja({ m, online }) {
  const mio = m.de === "yo";
  const pendiente = mio && m.pendiente && !online;
  const estilo = !mio
    ? "rounded-bl-md border border-line/70 bg-white text-ink"
    : pendiente
      ? "rounded-br-md border border-brand-500/40 bg-brand-100 text-ink"
      : "rounded-br-md bg-brand-500 text-white";

  return (
    <div className={`flex ${mio ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:max-w-[70%] ${estilo}`}>
        <p className="leading-relaxed">{m.texto}</p>
        <p className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${mio && !pendiente ? "text-white/80" : "text-muted"}`}>
          {pendiente ? (
            <>
              <Clock size={12} aria-hidden="true" /> Pendiente · {m.hora}
            </>
          ) : (
            <>
              {m.hora}
              {mio && <CheckCheck size={13} aria-label="Enviado" />}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function Mensajes() {
  const { id } = useParams();
  const online = useOnlineStatus();
  const [chats, setChats] = useState(CHATS_INICIALES);
  const [leidos, setLeidos] = useState(() => new Set());
  const [busqueda, setBusqueda] = useState("");
  const [soloNoLeidos, setSoloNoLeidos] = useState(false);
  const [texto, setTexto] = useState("");
  const listaRef = useRef(null);

  // Chat abierto (si viene de un perfil sin conversación, se crea vacía)
  const abiertoId = id ? Number(id) : null;
  const hayChatAbierto = Boolean(abiertoId && getPerfil(abiertoId));
  const ids = hayChatAbierto && !ORDEN_CHATS.includes(abiertoId) ? [abiertoId, ...ORDEN_CHATS] : ORDEN_CHATS;
  const activoId = hayChatAbierto ? abiertoId : ids[0];
  const perfil = getPerfil(activoId);
  const chat = chats[activoId] ?? { cuando: "Hoy", noLeido: false, mensajes: [] };
  const mensajes = chat.mensajes;

  const sinLeer = (cid) => Boolean(chats[cid]?.noLeido) && !leidos.has(cid) && cid !== activoId;
  const noLeidosCount = ids.filter(sinLeer).length;
  const q = busqueda.trim().toLowerCase();
  const visibles = ids.filter((cid) => {
    const p = getPerfil(cid);
    return (!q || p.nombre.toLowerCase().includes(q)) && (!soloNoLeidos || sinLeer(cid));
  });

  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activoId, mensajes.length]);

  const enviar = (e) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    const hora = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
    setChats((prev) => {
      const actual = prev[activoId] ?? { cuando: "Hoy", noLeido: false, mensajes: [] };
      const nuevo = { id: `${activoId}-${Date.now()}`, de: "yo", hora, texto: t, pendiente: !online };
      return { ...prev, [activoId]: { ...actual, cuando: "Hoy", mensajes: [...actual.mensajes, nuevo] } };
    });
    setTexto("");
  };

  const ultimaDeEllos = [...mensajes].reverse().find((m) => m.de === "ellos");
  const actividad = chat.cuando === "Hoy" ? `hoy, ${ultimaDeEllos?.hora ?? ""}` : chat.cuando.toLowerCase();

  return (
    <div>
      <header className="animate-fade-up rounded-3xl border border-line/70 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase">Mensajes</p>
        <h1 className="mt-2 font-display text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
          Conversaciones que acercan.
        </h1>
        <p className="mt-2 text-[15px] text-muted">Todo empieza con un hola.</p>
      </header>

     <div className="mt-5 grid h-[calc(100dvh-13rem)] min-h-[28rem] grid-cols-1 animate-fade-up overflow-hidden rounded-3xl border border-line/70 bg-white shadow-sm lg:h-[640px] lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Lista (en celular se oculta cuando hay un chat abierto) */}
       <aside className={`${hayChatAbierto ? "hidden lg:flex" : "flex"} min-h-0 min-w-0 flex-col lg:border-r lg:border-line/60`}>
          <div className="p-4 pb-3">
            <label className="flex items-center gap-2 rounded-xl bg-brand-50 px-3.5">
              <Search size={16} className="shrink-0 text-muted" aria-hidden="true" />
              <input
                type="search"
                aria-label="Buscar conversación"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar conversación"
                className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted/70 sm:text-sm"
              />
            </label>
            <div className="mt-3 flex gap-2">
              <FilterChip active={!soloNoLeidos} onClick={() => setSoloNoLeidos(false)}>
                Todos
              </FilterChip>
              <FilterChip active={soloNoLeidos} onClick={() => setSoloNoLeidos(true)}>
                No leídos · {noLeidosCount}
              </FilterChip>
            </div>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto">
            {visibles.map((cid) => {
              const p = getPerfil(cid);
              const c = chats[cid] ?? { cuando: "Hoy", mensajes: [] };
              const ultimo = c.mensajes.at(-1);
              const unread = sinLeer(cid);
              const preview =
                ultimo?.pendiente && !online ? "Mensaje pendiente de envío" : (ultimo?.texto ?? "Empieza la conversación");
              return (
                <li key={cid}>
                  <Link
                    to={`/mensajes/${cid}`}
                    onClick={() => setLeidos((prev) => new Set(prev).add(cid))}
                    aria-current={cid === activoId ? "true" : undefined}
                    className={`flex items-center gap-3 border-b border-line/50 px-4 py-3.5 transition ${
                      cid === activoId ? "bg-brand-100/70" : "hover:bg-brand-50"
                    }`}
                  >
                    <PersonAvatar perfil={p} size="size-11" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`truncate text-sm ${unread ? "font-bold" : "font-semibold"}`}>{p.nombre}</p>
                        <span className="shrink-0 text-[11px] text-muted">
                          {c.cuando === "Hoy" ? (ultimo?.hora ?? "") : c.cuando}
                        </span>
                      </div>
                      <p className={`truncate text-xs ${unread ? "font-semibold text-ink" : "text-muted"}`}>{preview}</p>
                    </div>
                    {unread && <span className="size-2.5 shrink-0 rounded-full bg-brand-500" aria-label="No leído" />}
                  </Link>
                </li>
              );
            })}
            {visibles.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">Sin resultados.</li>}
          </ul>

          <div className="m-3 flex gap-3 rounded-2xl border border-line/70 bg-brand-50/70 p-4 text-xs text-muted">
            <ShieldCheck size={18} className="shrink-0 text-brand-700" aria-hidden="true" />
            <p>
              Conversa aquí y cuida tus datos personales. Puedes reportar o bloquear un contacto en cualquier momento.
            </p>
          </div>
        </aside>

        {/* Chat (en celular solo se ve cuando hay uno abierto) */}
        <section className={`${hayChatAbierto ? "flex" : "hidden lg:flex"} min-h-0 min-w-0 flex-col`}>
          <header className="flex items-center gap-3 border-b border-line/60 px-4 py-3 sm:px-5">
            <Link
              to="/mensajes"
              aria-label="Volver a conversaciones"
              className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-brand-50 lg:hidden"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <PersonAvatar perfil={perfil} size="size-11" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold">{perfil.nombre}</h2>
              <p className="text-xs text-muted">Última actividad {actividad}</p>
            </div>
            <button
              type="button"
              aria-label="Más opciones"
              className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-brand-50"
            >
              <Ellipsis size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="flex items-center justify-between border-b border-line/60 px-4 py-2.5 sm:px-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              <Sparkles size={12} aria-hidden="true" />
              {perfil.compat}% compatible
            </span>
            <Link to={`/explorar/${perfil.id}`} className="text-xs font-semibold text-brand-700 hover:underline">
              Ver perfil →
            </Link>
          </div>

          {!online && (
            <div role="status" className="flex items-start gap-3 border-b border-brand-500/20 bg-brand-100/70 px-4 py-3 sm:px-5">
              <WifiOff size={18} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-brand-700">Sin conexión a internet</p>
                <p className="text-xs text-muted">Tu mensaje se enviará cuando recuperes la conexión.</p>
              </div>
            </div>
          )}

          <div ref={listaRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-brand-50/40 px-4 py-4 sm:px-5">
            <p className="text-center text-[11px] font-semibold tracking-wide text-muted">{DIAS[chat.cuando]}</p>
            <p className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full border border-line/70 bg-white px-3.5 py-1.5 text-xs text-muted">
              <ShieldCheck size={14} className="shrink-0 text-brand-500" aria-hidden="true" />
              No transfieras dinero antes de visitar el espacio.
            </p>
            {mensajes.length === 0 && (
              <p className="py-10 text-center text-sm text-muted">
                Empieza con un hola para {perfil.nombre.split(" ")[0]}.
              </p>
            )}
            {mensajes.map((m) => (
              <Burbuja key={m.id} m={m} online={online} />
            ))}
          </div>

          <form onSubmit={enviar} className="flex items-center gap-2 border-t border-line/60 p-3 sm:p-4">
            <button
              type="button"
              aria-label="Adjuntar archivo"
              className="grid size-11 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-brand-50"
            >
              <Paperclip size={18} aria-hidden="true" />
            </button>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              aria-label="Escribe un mensaje"
              placeholder="Escribe un mensaje…"
              className="h-11 min-w-0 flex-1 rounded-xl bg-brand-50 px-4 text-base outline-none transition placeholder:text-muted/70 focus:ring-4 focus:ring-brand-500/15 sm:text-[15px]"
            />
            <button
              type="submit"
              aria-label="Enviar mensaje"
              disabled={!texto.trim()}
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500 text-white transition active:scale-95 disabled:bg-brand-100 disabled:text-brand-500"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}