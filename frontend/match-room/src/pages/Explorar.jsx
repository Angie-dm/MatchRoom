import { BedDouble, Clock, MapPin, PawPrint, Plus, Search, ShieldCheck, SlidersHorizontal, Users, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import ProfileBanner from "../components/ProfileBanner";
import ProfileCard from "../components/ProfileCard";
import Button from "../components/ui/Button";
import { PERFILES } from "../data/mockProfiles";
import { useCurrentUser } from "../hooks/useCurrentUser";
import FilterChip from "../components/FilterChip";

const money = (n) => `$${n.toLocaleString("es-MX")}`;

const SORTS = {
  compat: { label: "Mayor compatibilidad", fn: (a, b) => b.compat - a.compat },
  menor: { label: "Menor presupuesto", fn: (a, b) => a.presupuesto - b.presupuesto },
  mayor: { label: "Mayor presupuesto", fn: (a, b) => b.presupuesto - a.presupuesto },
};



export default function Explorar() {
  const user = useCurrentUser();
  const [tab, setTab] = useState("companeros");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("compat");
  const [favs, setFavs] = useState(() => new Set());
  // TODO: solo "verificados" filtra por ahora; el resto se conecta con la API.
  const [chips, setChips] = useState({ zonas: true, presupuesto: true, mascotas: false, horarios: false, verificados: false });

  const toggleChip = (key) => setChips((c) => ({ ...c, [key]: !c[key] }));
  const toggleFav = (id) =>
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const perfiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PERFILES.filter((p) => !q || `${p.nombre} ${p.zona} ${p.ocupacion}`.toLowerCase().includes(q))
      .filter((p) => !chips.verificados || p.verificado)
      .sort(SORTS[sort].fn);
  }, [query, chips.verificados, sort]);

  const zonaLabel = user.zonas.length
    ? `${user.zonas[0]}${user.zonas.length > 1 ? ` +${user.zonas.length - 1}` : ""}`
    : "Zonas";

  const limpiar = () => {
    setQuery("");
    setChips((c) => ({ ...c, verificados: false }));
  };

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase">Hola, {user.primerNombre}</p>
          <h1 className="mt-2 max-w-xl font-display text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
            Tu próximo hogar empieza con un buen match.
          </h1>
          <p className="mt-2 text-[15px] text-muted">Personas y espacios que encajan con tu forma de vivir.</p>
        </div>
        <Button icon={Plus} className="self-start">
          Publicar anuncio
        </Button>
      </header>

      {/* Pestañas */}
      <div role="tablist" className="mt-6 flex gap-6 border-b border-line/60">
        {[
          ["companeros", Users, "Compañeros"],
          ["habitaciones", BedDouble, "Habitaciones"],
        ].map(([id, Icon, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-semibold transition ${
              tab === id ? "border-brand-500 text-brand-700" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {tab === "habitaciones" ? (
        <div className="grid animate-fade-up place-items-center py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-700">
            <BedDouble size={26} aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold">Habitaciones disponibles</h2>
          <p className="mt-1 text-sm text-muted">Muy pronto podrás explorarlas aquí.</p>
        </div>
      ) : (
        <>
          {/* Búsqueda */}
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-sm transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15"
          >
            <Search size={18} className="ml-3 shrink-0 text-muted" aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por nombre, zona o universidad"
              className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted/70 sm:text-[15px]"
            />
            <Button type="submit" className="px-6">
              Buscar
            </Button>
          </form>

          {/* Filtros: en celular se deslizan de lado */}
          <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            <FilterChip active={chips.zonas} icon={MapPin} onClick={() => toggleChip("zonas")}>
              {zonaLabel}
            </FilterChip>
            <FilterChip active={chips.presupuesto} icon={Wallet} onClick={() => toggleChip("presupuesto")}>
              {money(user.presupuestoMin)}-{money(user.presupuestoMax)}
            </FilterChip>
            <FilterChip active={chips.mascotas} icon={PawPrint} onClick={() => toggleChip("mascotas")}>
              Mascotas
            </FilterChip>
            <FilterChip active={chips.horarios} icon={Clock} onClick={() => toggleChip("horarios")}>
              Horarios
            </FilterChip>
            <FilterChip active={chips.verificados} icon={ShieldCheck} onClick={() => toggleChip("verificados")}>
              Verificados
            </FilterChip>
            <FilterChip active={false} icon={SlidersHorizontal} onClick={() => {}}>
              Más filtros
            </FilterChip>
          </div>

          {/* Resultados */}
          <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold sm:text-2xl">Personas que van contigo</h2>
              <p className="mt-1 text-sm text-muted">
                {perfiles.length} {perfiles.length === 1 ? "perfil" : "perfiles"} en tus zonas favoritas
              </p>
            </div>
            <label>
              <span className="sr-only">Ordenar por</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
              >
                {Object.entries(SORTS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {perfiles.length > 0 ? (
            <div className="stagger mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {perfiles.map((perfil) => (
                <ProfileCard
                  key={perfil.id}
                  perfil={perfil}
                  favorito={favs.has(perfil.id)}
                  onToggleFavorito={() => toggleFav(perfil.id)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 animate-fade-up rounded-3xl border border-dashed border-line bg-white/70 px-6 py-14 text-center">
              <p className="font-semibold">No encontramos perfiles con esos filtros.</p>
              <p className="mt-1 text-sm text-muted">Prueba con otra búsqueda o quita algún filtro.</p>
              <Button variant="secondary" className="mt-4" onClick={limpiar}>
                Limpiar filtros
              </Button>
            </div>
          )}

          <ProfileBanner pct={user.perfilPct} />
          <p className="mt-8 text-center text-xs text-muted">
            La compatibilidad se calcula con tus preferencias. Tú decides con quién conectar.
          </p>
        </>
      )}
    </div>
  );
}