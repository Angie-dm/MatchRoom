import { Bookmark, Heart, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import FilterChip from "../components/FilterChip";
import PersonAvatar from "../components/PersonAvatar";
import Button from "../components/ui/Button";
import LinkButton from "../components/ui/LinkButton";
import { GUARDADOS, MUTUOS } from "../data/mockMatches";
import { PERFILES } from "../data/mockProfiles";
import { useCurrentUser } from "../hooks/useCurrentUser";

const porCompat = (a, b) => b.compat - a.compat;
const LISTAS = {
  compatibles: PERFILES.filter((p) => p.compat >= 85).sort(porCompat),
  mutuo: PERFILES.filter((p) => MUTUOS.includes(p.id)).sort(porCompat),
  guardados: PERFILES.filter((p) => GUARDADOS.includes(p.id)).sort(porCompat),
};
const TABS = [
  ["compatibles", Sparkles, "Compatibles"],
  ["mutuo", Heart, "Interés mutuo"],
  ["guardados", Bookmark, "Guardados"],
];

export default function Matches() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState("compatibles");
  const destacado = PERFILES.find((p) => p.id === MUTUOS[0]);
  const lista = LISTAS[tab];

  return (
    <div>
      <header className="animate-fade-up">
        <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase">Mis matches</p>
        <h1 className="mt-2 font-display text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
          Conectar se siente bien.
        </h1>
        <p className="mt-2 text-[15px] text-muted">Personas con las que compartes algo más que un presupuesto.</p>
      </header>

      {/* Nuevo match */}
      {destacado && (
        <section className="mt-6 flex animate-fade-up flex-col gap-4 rounded-3xl border border-brand-500/30 bg-brand-100/70 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <div className="flex shrink-0 -space-x-3">
            <Avatar name={user.nombre} size="size-14" className="ring-2 ring-white" />
            <PersonAvatar perfil={destacado} size="size-14" className="ring-2 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-700 uppercase">
              <Heart size={12} aria-hidden="true" />
              Nuevo match
            </span>
            <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
              ¡El interés es mutuo con {destacado.nombre.split(" ")[0]}!
            </h2>
            <p className="mt-1 text-sm text-muted">
              Un {destacado.compat}% de compatibilidad y mucho por conversar. ¿Un café para empezar?
            </p>
          </div>
          <Button icon={MessageCircle} onClick={() => navigate(`/mensajes/${destacado.id}`)}>
            Saludar a {destacado.nombre.split(" ")[0]}
          </Button>
        </section>
      )}

      {/* Pestañas */}
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.map(([id, Icon, label]) => (
          <FilterChip key={id} active={tab === id} icon={Icon} onClick={() => setTab(id)}>
            {label} · {LISTAS[id].length}
          </FilterChip>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold sm:text-2xl">Tus mejores conexiones</h2>
        <p className="text-xs text-muted">Ordenados por compatibilidad</p>
      </div>

      <div key={tab} className="stagger mt-4 grid gap-4 md:grid-cols-2">
        {lista.map((p) => (
          <article
            key={p.id}
            className="rounded-3xl border border-line/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/10"
          >
            <div className="flex items-center gap-4">
              <PersonAvatar perfil={p} size="size-16" />
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold">
                  {p.nombre}, {p.edad}
                </h3>
                <p className="text-sm text-muted">{p.ocupacion}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-brand-500/30 bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                  <Sparkles size={12} aria-hidden="true" />
                  {p.compat}% compatible
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">{[...p.tags, ...p.zona.split(" · ")].join(" · ")}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <LinkButton to={`/explorar/${p.id}`} variant="secondary">
                Ver perfil
              </LinkButton>
              <LinkButton to={`/mensajes/${p.id}`}>Conversar</LinkButton>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6 flex gap-3 rounded-3xl border border-line/70 bg-white p-5 shadow-sm">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">El porcentaje es un punto de partida, no una promesa.</p>
          <p className="mt-1 text-sm text-muted">
            Comparamos presupuesto, zonas, rutinas y preferencias. Conversa y conoce a la persona antes de decidir
            compartir hogar.
          </p>
        </div>
      </section>
    </div>
  );
}