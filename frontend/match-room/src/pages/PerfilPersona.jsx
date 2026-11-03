import {
  ArrowLeft, BadgeCheck, BookOpen, Briefcase, Camera, ChefHat, CigaretteOff, Check, Coffee,
  Dumbbell, Film, Flag, Heart, Leaf, MapPin, MessageCircle, Moon, Music, PawPrint, PenTool,
  Plane, ShieldCheck, Sparkles, Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { PERFILES } from "../data/mockProfiles";
import { useCountUp } from "../hooks/useCountUp";
import { formatFecha, formatMoney } from "../utils/format";
import { initials } from "../utils/initials";

const INTERES_ICONOS = {
  Café: Coffee, Diseño: PenTool, Cocina: ChefHat, Plantas: Leaf, Música: Music,
  Ejercicio: Dumbbell, Fotografía: Camera, Lectura: BookOpen, Cine: Film, Viajes: Plane,
};

const HABITOS = [
  ["trabajo", "Trabajo", Briefcase],
  ["descanso", "Descanso", Moon],
  ["limpieza", "Limpieza", Sparkles],
  ["ambiente", "Ambiente", CigaretteOff],
  ["mascotas", "Mascotas", PawPrint],
  ["visitas", "Visitas", Users],
];

const etiquetaMatch = (pct) =>
  pct >= 90 ? "Un gran match" : pct >= 80 ? "Un muy buen match" : "Buena compatibilidad";

const cardClass = "rounded-3xl border border-line/70 bg-white p-5 shadow-sm sm:p-6";

export default function PerfilPersona() {
  const { id } = useParams();
  const navigate = useNavigate();
  const perfil = PERFILES.find((p) => p.id === Number(id));
  const [interes, setInteres] = useState(false);
  const pct = useCountUp(perfil?.compat ?? 0);

  if (!perfil) {
    return (
      <div className="grid animate-fade-up place-items-center py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">No encontramos este perfil</h1>
        <p className="mt-2 text-sm text-muted">Puede que ya no esté disponible.</p>
        <Link to="/explorar" className="mt-5 text-sm font-semibold text-brand-700 hover:underline">
          Volver a compañeros
        </Link>
      </div>
    );
  }

  const { nombre, edad, ocupacion, ciudad, zona, frase, bio, intereses, habitos, tags, presupuesto,
    mudanza, activo, razones, verificado, foto, tono, compat } = perfil;

  return (
    <div>
      <Link
        to="/explorar"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-brand-700"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a compañeros
      </Link>

      {/* Encabezado */}
      <section className="mt-4 grid animate-fade-up gap-5 sm:grid-cols-[176px_1fr] sm:gap-7">
        <div
          className={`relative h-56 overflow-hidden rounded-3xl bg-linear-to-br sm:h-44 ${tono}`}
          style={foto ? { backgroundImage: `url(${foto})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {!foto && (
            <span className="absolute inset-0 grid place-items-center font-display text-6xl font-semibold text-white/90">
              {initials(nombre)}
            </span>
          )}
        </div>

        <div>
          {verificado && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-brand-700">
              <BadgeCheck size={14} aria-hidden="true" />
              Perfil verificado
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            {nombre}, {edad}
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {ocupacion} · {ciudad}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={14} className="shrink-0" aria-hidden="true" />
            {zona}
          </p>
          <blockquote className="mt-4 max-w-xl text-[15px] text-ink/90">“{frase}”</blockquote>

          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <li
                key={tag}
                className={`rounded-full border px-3.5 py-1.5 text-sm ${
                  i === 0 ? "border-brand-500/50 bg-brand-100 font-semibold text-brand-700" : "border-line bg-white text-muted"
                }`}
              >
                {tag}
              </li>
            ))}
          </ul>

          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3 border-t border-line/60 pt-4">
            <div>
              <dt className="text-xs text-muted">Presupuesto mensual</dt>
              <dd className="font-display text-2xl font-semibold">{formatMoney(presupuesto)} MXN</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Fecha de mudanza</dt>
              <dd className="font-display text-xl font-semibold">{formatFecha(mudanza)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Contenido (en celular va después de la compatibilidad) */}
        <div className="order-2 flex flex-col gap-5 lg:order-1">
          <section className={cardClass}>
            <h2 className="font-display text-xl font-semibold">Un poco sobre mí</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{bio}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {intereses.map((nombreInteres) => {
                const Icon = INTERES_ICONOS[nombreInteres] ?? Sparkles;
                return (
                  <li
                    key={nombreInteres}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-brand-50 px-3.5 py-1.5 text-sm text-muted"
                  >
                    <Icon size={14} aria-hidden="true" />
                    {nombreInteres}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={cardClass}>
            <h2 className="font-display text-xl font-semibold">Así se vive conmigo</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {HABITOS.map(([clave, etiqueta, Icon]) => (
                <li key={clave} className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs text-muted">{etiqueta}</p>
                    <p className="text-sm font-semibold">{habitos[clave]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Compatibilidad y acciones (en celular va arriba) */}
        <aside className="order-1 flex flex-col gap-4 lg:sticky lg:top-24 lg:order-2">
          <section className="animate-fade-up overflow-hidden rounded-3xl bg-[linear-gradient(150deg,var(--color-brand-500),var(--color-brand-700))] p-6 text-white shadow-xl shadow-brand-500/25">
            <div className="flex items-center gap-4">
              <p className="font-display text-6xl leading-none font-semibold" aria-label={`${compat}% de compatibilidad`}>
                {pct}%
              </p>
              <p className="text-sm text-white/85">
                <span className="block font-semibold text-white">{etiquetaMatch(compat)}</span>
                con tu forma de vivir
              </p>
            </div>
            <p className="mt-4 text-sm text-white/80">Coinciden en lo que hace más fácil el día a día.</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {razones.map((razon) => (
                <li key={razon} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/20">
                    <Check size={12} aria-hidden="true" />
                  </span>
                  {razon}
                </li>
              ))}
            </ul>
          </section>

          <section className={`${cardClass} flex flex-col gap-3`}>
            <Button icon={MessageCircle} onClick={() => navigate("/mensajes")}>
              Enviar mensaje
            </Button>
            <Button variant="secondary" onClick={() => setInteres((v) => !v)} aria-pressed={interes}>
              <Heart
                size={18}
                className={interes ? "animate-pop fill-pink-500 text-pink-500" : ""}
                aria-hidden="true"
              />
              {interes ? "Interés enviado" : "Mostrar interés"}
            </Button>
            <p className="text-center text-xs text-muted">Activa {activo}</p>
          </section>

          <section className="flex gap-3 rounded-3xl border border-line/70 bg-brand-100/70 p-5">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-brand-700">Tu tranquilidad va primero.</p>
              <p className="mt-1 text-sm text-muted">
                Conoce el espacio antes de transferir dinero. Mantén la conversación aquí.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <footer className="mt-8 flex flex-col gap-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        {verificado ? (
          <p className="flex items-start gap-2">
            <BadgeCheck size={16} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
            <span>
              La insignia indica que {nombre.split(" ")[0]} completó las comprobaciones de perfil de Match Room. No es
              una garantía legal ni sustituye tu criterio.
            </span>
          </p>
        ) : (
          <span />
        )}
        <button type="button" className="inline-flex items-center gap-1.5 self-start transition hover:text-brand-700">
          <Flag size={14} aria-hidden="true" />
          Reportar perfil
        </button>
      </footer>
    </div>
  );
}