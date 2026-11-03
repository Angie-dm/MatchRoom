import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import RoomPhoto from "./RoomPhoto";
import Badge from "./ui/Badge";

export default function ProfileBanner({ pct }) {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-line/70 bg-brand-100/70 md:grid md:grid-cols-[1fr_300px]">
      <div className="p-6 sm:p-8">
        <Badge>Hecho para ti</Badge>
        <h2 className="mt-3 max-w-md font-display text-xl leading-snug font-semibold sm:text-2xl">
          Las buenas conexiones empiezan con los pequeños detalles.
        </h2>
        <p className="mt-2 text-sm text-muted">
          Tu perfil está al {pct}%. Añade una presentación y encuentra mejores coincidencias.
        </p>
        <div className="mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <Link
          to="/perfil"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all hover:gap-2.5"
        >
          Completar mi perfil <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <RoomPhoto className="hidden min-h-44 md:block" />
    </section>
  );
}