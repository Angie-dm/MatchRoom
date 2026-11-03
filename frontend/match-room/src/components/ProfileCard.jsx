import { ArrowUpRight, BadgeCheck, Heart, MapPin, Sparkles } from "lucide-react";
import { initials } from "../utils/initials";
import { Link } from "react-router-dom";

export default function ProfileCard({ perfil, favorito, onToggleFavorito }) {
  const { nombre, edad, ocupacion, zona, compat, tags, presupuesto, verificado, foto, tono } = perfil;

  return (
    <article className="group overflow-hidden rounded-3xl border border-line/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/15">
      <div
        className={`relative h-44 bg-linear-to-br sm:h-48 ${tono}`}
        style={foto ? { backgroundImage: `url(${foto})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        {!foto && (
          <span className="absolute inset-0 grid place-items-center font-display text-5xl font-semibold text-white/90 transition duration-500 group-hover:scale-110">
            {initials(nombre)}
          </span>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm">
          <Sparkles size={12} aria-hidden="true" />
          {compat}% compatible
        </span>
        <button
          type="button"
          aria-pressed={favorito}
          aria-label={favorito ? `Quitar a ${nombre} de favoritos` : `Guardar a ${nombre} en favoritos`}
          onClick={onToggleFavorito}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm transition active:scale-90"
        >
          <Heart size={17} className={favorito ? "animate-pop fill-pink-500 text-pink-500" : "text-muted"} aria-hidden="true" />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-lg font-semibold">
            {nombre}, {edad}
          </h3>
          {verificado && <BadgeCheck size={17} className="shrink-0 text-brand-500" aria-label="Perfil verificado" />}
        </div>
        <p className="mt-0.5 text-sm text-muted">{ocupacion}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} className="shrink-0" aria-hidden="true" />
          {zona}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line bg-brand-50 px-2.5 py-1 text-xs text-muted">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between border-t border-line/60 pt-4">
          <div>
            <p className="text-xs text-muted">Presupuesto mensual</p>
            <p className="font-display text-xl font-semibold">
              ${presupuesto.toLocaleString("es-MX")} <span className="text-xs font-normal text-muted">MXN</span>
            </p>
          </div>
          <Link
            to={`/explorar/${perfil.id}`}
            aria-label={`Ver perfil de ${nombre}`}
            className="grid size-10 place-items-center rounded-xl bg-brand-100 text-brand-700 transition hover:bg-brand-500 hover:text-white active:scale-95"
          >
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}