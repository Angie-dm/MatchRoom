import { Heart, MapPin, ShieldCheck } from "lucide-react";
import { Outlet } from "react-router-dom";
import Backdrop from "../components/Backdrop";
import Logo from "../components/Logo";
import RoomPhoto from "../components/RoomPhoto";

export default function AuthLayout() {
  return (
    <Backdrop>
      <div className="grid w-full max-w-5xl animate-fade-up overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_30px_80px_-30px_rgba(91,33,182,0.45)] backdrop-blur lg:grid-cols-2 lg:rounded-[2rem]">
        {/* Foto: banner arriba en móvil, panel completo en escritorio */}
        <section className="relative p-2.5 lg:p-3">
          <RoomPhoto
            animated
            className="h-40 rounded-2xl sm:h-52 lg:h-full lg:min-h-[600px] lg:rounded-[1.5rem]"
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent lg:from-black/70 lg:via-black/5" />
            <Logo className="absolute top-3 left-3 rounded-xl bg-white/90 py-1 pr-3 pl-1 lg:top-5 lg:left-5 lg:py-1.5 lg:pr-4 lg:pl-1.5" />

            {/* Solo escritorio */}
            <div className="absolute top-24 right-5 hidden animate-bob items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-ink shadow-xl lg:flex">
              <Heart size={16} className="text-pink-500" aria-hidden="true" />
              Compatibilidad 92%
            </div>
            <div className="absolute top-44 left-5 hidden animate-bob items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-ink shadow-xl [animation-delay:-2.5s] lg:flex">
              <MapPin size={16} className="text-brand-500" aria-hidden="true" />
              Roma Norte
            </div>
            <div className="absolute inset-x-6 bottom-6 hidden text-white lg:block">
              <h2 className="font-display text-3xl leading-tight font-semibold xl:text-4xl">
                Encuentra tu próximo hogar y a la persona ideal para compartirlo
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/85">
                Más que compartir renta, comparte tu forma de vivir. Conecta con personas que van contigo.
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs">
                <ShieldCheck size={16} aria-hidden="true" />
                Compatibilidad real. Conexiones más seguras.
              </p>
            </div>
          </RoomPhoto>
        </section>

        {/* Formulario */}
        <main className="flex items-center px-5 pt-5 pb-8 sm:px-12 sm:py-10">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </Backdrop>
  );
}