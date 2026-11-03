import { BedDouble, Building2, CalendarDays, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function SpaceCard({ espacio, favorito, onToggleFavorito }) {
  const { id, titulo, zona, tipo, tipoLabel, personas, extras, precio, disponible, foto, tono } = espacio;
  const Icon = tipo === "habitacion" ? BedDouble : Building2;

  return (
    <article className="group overflow-hidden rounded-3xl border border-line/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/15">
      <div
        className={`relative h-44 bg-linear-to-br sm:h-48 ${tono}`}
        style={foto ? { backgroundImage: `url(${foto})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        {!foto && (
          <Icon
            size={56}
            strokeWidth={1.4}
            className="absolute inset-0 m-auto text-white/80 transition duration-500 group-hover:scale-110"
            aria-hidden="true"
          />
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm">
          <CalendarDays size={12} aria-hidden="true" />
          Disponible en {disponible}
        </span>
        <button
          type="button"
          aria-pressed={favorito}
          aria-label={favorito ? `Quitar ${titulo} de favoritos` : `Guardar ${titulo} en favoritos`}
          onClick={onToggleFavorito}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm transition active:scale-90"
        >
          <Heart size={17} className={favorito ? "animate-pop fill-pink-500 text-pink-500" : "text-muted"} aria-hidden="true" />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display text-lg leading-snug font-semibold">{titulo}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} className="shrink-0" aria-hidden="true" />
          {zona}
        </p>
        <p className="mt-2 text-sm font-medium text-ink/80">
          {tipoLabel} · {personas} {personas === 1 ? "persona" : "personas"}
        </p>
        <p className="mt-0.5 text-xs text-muted">{extras.join(" · ")}</p>

        <div className="mt-4 flex items-end justify-between border-t border-line/60 pt-4">
          <div>
            <p className="font-display text-xl font-semibold">${precio.toLocaleString("es-MX")}</p>
            <p className="text-xs text-muted">MXN / mes</p>
          </div>
          <Link
            to={`/alojamientos/${id}`}
            className="inline-flex h-10 items-center rounded-xl border border-line bg-white px-4 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-brand-50 active:scale-95"
          >
            Ver espacio
          </Link>
        </div>
      </div>
    </article>
  );
}