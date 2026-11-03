import { ArrowRight, BedDouble, Building2, MapPin, PawPrint, Plus, Search, ShieldCheck, Wallet, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FilterChip from "../components/FilterChip";
import RoomPhoto from "../components/RoomPhoto";
import SpaceCard from "../components/SpaceCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { ESPACIOS } from "../data/mockSpaces";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { formatMoney } from "../utils/format";

const SORTS = {
  relevantes: "Más relevantes",
  menor: "Menor precio",
  mayor: "Mayor precio",
};

const FILTROS_INICIALES = {
  ciudad: true,
  presupuesto: true,
  habitacion: false,
  departamento: false,
  mascotas: false,
  servicios: false,
  verificados: false,
};

export default function Alojamientos() {
  const user = useCurrentUser();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevantes");
  const [favs, setFavs] = useState(() => new Set());
  const [chips, setChips] = useState(FILTROS_INICIALES);

  const toggleChip = (key) => setChips((c) => ({ ...c, [key]: !c[key] }));
  const toggleFav = (id) =>
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const espacios = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tipos = [chips.habitacion && "habitacion", chips.departamento && "departamento"].filter(Boolean);
    const lista = ESPACIOS.filter((e) => !q || `${e.titulo} ${e.zona}`.toLowerCase().includes(q))
      .filter((e) => !chips.presupuesto || e.precio <= user.presupuestoMax)
      .filter((e) => tipos.length === 0 || tipos.includes(e.tipo))
      .filter((e) => !chips.mascotas || e.mascotas)
      .filter((e) => !chips.servicios || e.servicios)
      .filter((e) => !chips.verificados || e.verificado);

    if (sort === "menor") return [...lista].sort((a, b) => a.precio - b.precio);
    if (sort === "mayor") return [...lista].sort((a, b) => b.precio - a.precio);
    return lista;
  }, [query, chips, sort, user.presupuestoMax]);

  const limpiar = () => {
    setQuery("");
    setChips({ ...FILTROS_INICIALES, presupuesto: false });
  };

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase">Alojamientos</p>
          <h1 className="mt-2 max-w-xl font-display text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">
            Un espacio para sentirte en casa.
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            Habitaciones y departamentos compartidos en {user.ciudad}.
          </p>
        </div>
        <Button icon={Plus} className="self-start">
          Publicar anuncio
        </Button>
      </header>

      {/* Búsqueda */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mt-6 flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-sm transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15"
      >
        <MapPin size={18} className="ml-3 shrink-0 text-muted" aria-hidden="true" />
        <input
          type="search"
          aria-label="Zona donde quieres vivir"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿En qué zona quieres vivir?"
          className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted/70 sm:text-[15px]"
        />
        <Button type="submit" icon={Search} className="px-4 sm:px-6">
          <span className="hidden sm:inline">Buscar espacios</span>
          <span className="sm:hidden">Buscar</span>
        </Button>
      </form>

      {/* Filtros: en celular se deslizan de lado */}
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterChip active={chips.ciudad} icon={MapPin} onClick={() => toggleChip("ciudad")}>
          {user.ciudad === "Ciudad de México" ? "CDMX" : user.ciudad}
        </FilterChip>
        <FilterChip active={chips.presupuesto} icon={Wallet} onClick={() => toggleChip("presupuesto")}>
          Hasta {formatMoney(user.presupuestoMax)}
        </FilterChip>
        <FilterChip active={chips.habitacion} icon={BedDouble} onClick={() => toggleChip("habitacion")}>
          Habitación
        </FilterChip>
        <FilterChip active={chips.departamento} icon={Building2} onClick={() => toggleChip("departamento")}>
          Departamento
        </FilterChip>
        <FilterChip active={chips.mascotas} icon={PawPrint} onClick={() => toggleChip("mascotas")}>
          Mascotas
        </FilterChip>
        <FilterChip active={chips.servicios} icon={Wifi} onClick={() => toggleChip("servicios")}>
          Servicios
        </FilterChip>
        <FilterChip active={chips.verificados} icon={ShieldCheck} onClick={() => toggleChip("verificados")}>
          Verificados
        </FilterChip>
      </div>

      {/* Resultados */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold sm:text-2xl">Lugares con buena energía</h2>
          <p className="mt-1 text-sm text-muted">
            {espacios.length} {espacios.length === 1 ? "espacio" : "espacios"}
            {chips.presupuesto ? " dentro de tu presupuesto" : ""}
          </p>
        </div>
        <label>
          <span className="sr-only">Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          >
            {Object.entries(SORTS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {espacios.length > 0 ? (
        <div className="stagger mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {espacios.map((espacio) => (
            <SpaceCard
              key={espacio.id}
              espacio={espacio}
              favorito={favs.has(espacio.id)}
              onToggleFavorito={() => toggleFav(espacio.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 animate-fade-up rounded-3xl border border-dashed border-line bg-white/70 px-6 py-14 text-center">
          <p className="font-semibold">No encontramos espacios con esos filtros.</p>
          <p className="mt-1 text-sm text-muted">Prueba con otra zona o quita algún filtro.</p>
          <Button variant="secondary" className="mt-4" onClick={limpiar}>
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Banner */}
      <section className="mt-8 overflow-hidden rounded-3xl border border-line/70 bg-white shadow-sm md:grid md:grid-cols-[260px_1fr]">
        <RoomPhoto className="hidden min-h-44 md:block" />
        <div className="p-6 sm:p-8">
          <Badge>Mudarte, con más calma</Badge>
          <h2 className="mt-3 max-w-lg font-display text-xl leading-snug font-semibold sm:text-2xl">
            No solo elijas una habitación. Conoce a quienes la comparten.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Revisa sus hábitos, conoce quién vive y agenda una visita antes de decidir.
          </p>
          <Link
            to="/explorar"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all hover:gap-2.5"
          >
            Consejos para tu primera visita <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-muted">
        Mostramos ubicaciones aproximadas para proteger la privacidad de la comunidad.
      </p>
    </div>
  );
}