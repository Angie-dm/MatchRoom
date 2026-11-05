import {
  ArrowLeft, Bath, BedDouble, Check, CookingPot, Droplets, Flag, Heart, Images, Laptop, MapPin,
  MessageCircle, ShieldCheck, Sofa, Sparkles, Users, WashingMachine, Wifi, Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PersonAvatar from "../components/PersonAvatar";
import Button from "../components/ui/Button";
import { PERFILES } from "../data/mockProfiles";
import { ESPACIOS } from "../data/mockSpaces";
import { formatFecha, formatMoney } from "../utils/format";

const INCLUYE = {
  wifi: [Wifi, "Wi-Fi de alta velocidad"],
  agua: [Droplets, "Agua y gas"],
  luz: [Zap, "Electricidad"],
  lavadora: [WashingMachine, "Lavadora"],
  cocina: [CookingPot, "Cocina equipada"],
  trabajo: [Laptop, "Área de trabajo"],
};
const CHIP_ICONOS = [BedDouble, Bath, Users, Sofa];
const card = "rounded-3xl border border-line/70 bg-white p-5 shadow-sm sm:p-6";

export default function DetalleEspacio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guardado, setGuardado] = useState(false);
  const espacio = ESPACIOS.find((e) => e.id === Number(id));

  if (!espacio) {
    return (
      <div className="grid animate-fade-up place-items-center py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">No encontramos este espacio</h1>
        <p className="mt-2 text-sm text-muted">Puede que ya no esté disponible.</p>
        <Link to="/alojamientos" className="mt-5 text-sm font-semibold text-brand-700 hover:underline">
          Volver a alojamientos
        </Link>
      </div>
    );
  }

  const { titulo, zona, tipo, tipoLabel, precio, servicios, descripcion, chips, incluye, acuerdos, ubicacion, desde, estanciaMin, fotos, foto, tono } = espacio;
  const anfitrion = PERFILES.find((p) => p.id === espacio.anfitrionId);
  const primerNombre = anfitrion?.nombre.split(" ")[0] ?? "la persona";
  const Icono = tipo === "habitacion" ? BedDouble : Sofa;

  return (
    <div>
      <Link to="/alojamientos" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-brand-700">
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a alojamientos
      </Link>

      <header className="mt-4 animate-fade-up">
        <h1 className="font-display text-2xl leading-tight font-semibold sm:text-3xl lg:text-4xl">{titulo}</h1>
        <p className="mt-2 text-[15px] text-muted">
          {tipo === "habitacion" ? "Habitación privada en departamento compartido" : tipoLabel} · Ciudad de México
        </p>
      </header>

      {/* Galería */}
      <section aria-label="Fotos del espacio" className="mt-5 grid h-64 animate-fade-up grid-cols-3 grid-rows-2 gap-2.5 sm:h-96 sm:gap-3">
        <div
          className={`col-span-2 row-span-2 grid place-items-center rounded-3xl bg-linear-to-br ${tono}`}
          style={foto ? { backgroundImage: `url(${foto})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {!foto && <Icono size={72} strokeWidth={1.3} className="text-white/80" aria-hidden="true" />}
        </div>
        <div className="rounded-3xl bg-linear-to-br from-brand-100 to-brand-500/40" />
        <div className="relative rounded-3xl bg-linear-to-br from-pink-200 to-brand-100">
          <button
            type="button"
            className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-brand-700 shadow transition active:scale-95 sm:right-3 sm:bottom-3"
          >
            <Images size={14} aria-hidden="true" />
            Ver las {fotos} fotos
          </button>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Contenido (en celular va después del precio) */}
        <div className="order-2 flex flex-col gap-8 lg:order-1">
          {anfitrion && (
            <section>
              <div className="flex flex-wrap items-center gap-3">
                <PersonAvatar perfil={anfitrion} size="size-12" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Comparte con {anfitrion.nombre}</p>
                  <p className="text-sm text-muted">
                    {anfitrion.edad} años · {anfitrion.ocupacion}
                  </p>
                </div>
                <Link
                  to={`/explorar/${anfitrion.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  <Sparkles size={12} aria-hidden="true" />
                  {anfitrion.compat}% compatible
                </Link>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip, i) => {
                  const Icon = CHIP_ICONOS[i] ?? Sofa;
                  return (
                    <li key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-muted">
                      <Icon size={14} aria-hidden="true" />
                      {chip}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section>
            <h2 className="font-display text-xl font-semibold">Luz, calma y una buena compañía</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{descripcion}</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Lo que incluye tu renta</h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {incluye.map((key) => {
                const [Icon, label] = INCLUYE[key];
                return (
                  <li key={key} className="flex items-center gap-3 text-sm">
                    <Icon size={18} className="shrink-0 text-brand-500" aria-hidden="true" />
                    {label}
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Convivencia con acuerdos claros</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {acuerdos.map((a) => (
                <li key={a} className="flex items-start gap-3 text-sm text-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <h2 className="flex items-center gap-2 font-semibold">
              <MapPin size={18} className="text-brand-500" aria-hidden="true" />
              {zona}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{ubicacion}</p>
            <p className="mt-3 text-xs text-muted">
              Por seguridad, no mostramos el domicilio exacto. Acuerda una visita directamente con {primerNombre}.
            </p>
          </section>

          <button type="button" className="inline-flex items-center gap-1.5 self-start text-xs text-muted transition hover:text-brand-700">
            <Flag size={14} aria-hidden="true" />
            Reportar este anuncio
          </button>
        </div>

        {/* Precio y acciones (en celular va arriba) */}
        <aside className="order-1 flex flex-col gap-4 lg:sticky lg:top-24 lg:order-2">
          <section className={`${card} animate-fade-up shadow-lg shadow-brand-500/10`}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Disponible desde el {formatFecha(desde)}
            </span>
            <p className="mt-4 font-display text-4xl font-semibold">{formatMoney(precio)}</p>
            <p className="text-sm text-muted">MXN al mes{servicios ? " · Servicios incluidos" : ""}</p>

            <dl className="mt-4 divide-y divide-line/60 border-t border-line/60 text-sm">
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted">Depósito reembolsable</dt>
                <dd className="font-semibold">{formatMoney(precio)} MXN</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted">Estancia mínima</dt>
                <dd className="font-semibold">{estanciaMin} meses</dd>
              </div>
            </dl>

            <div className="mt-2 flex flex-col gap-3">
              <Button icon={MessageCircle} onClick={() => navigate(`/mensajes/${espacio.anfitrionId}`)}>
                Contactar a {primerNombre}
              </Button>
              <Button variant="secondary" aria-pressed={guardado} onClick={() => setGuardado((v) => !v)}>
                <Heart size={18} className={guardado ? "animate-pop fill-pink-500 text-pink-500" : ""} aria-hidden="true" />
                {guardado ? "Espacio guardado" : "Guardar espacio"}
              </Button>
              <p className="text-center text-xs text-muted">Sin cobros desde la plataforma</p>
            </div>
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
    </div>
  );
}