import { Bell, Building2, CircleHelp, Compass, Heart, MapPin, MessageCircle, Plus, User } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Avatar from "../components/Avatar";
import Logo from "../components/Logo";
import Button from "../components/ui/Button";
import { useCurrentUser } from "../hooks/useCurrentUser";

const NAV = [
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/alojamientos", label: "Alojamientos", icon: Building2 },
  { to: "/matches", label: "Mis matches", icon: Heart },
  { to: "/mensajes", label: "Mensajes", icon: MessageCircle, badge: 2 },
  { to: "/perfil", label: "Mi perfil", icon: User },
];

const sideLink = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] transition ${
    isActive ? "bg-brand-100 font-semibold text-brand-700" : "font-medium text-muted hover:bg-brand-50 hover:text-ink"
  }`;

const tabLink = ({ isActive }) =>
  `flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition ${
    isActive ? "text-brand-700" : "text-muted"
  }`;

export default function AppLayout() {
  const user = useCurrentUser();
  const { pathname } = useLocation();

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[256px_1fr]">
      {/* Barra lateral (escritorio) */}
      <aside className="hidden border-r border-line/60 bg-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:gap-6 lg:p-5">
        <Logo />
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to} className={sideLink}>
              <Icon size={19} aria-hidden="true" />
              {label}
              {badge && (
                <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <Button icon={Plus}>Publicar anuncio</Button>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-line/70 bg-brand-50/60 p-3">
            <Avatar name={user.nombre} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.nombre}</p>
              <p className="text-xs text-muted">Mi espacio personal</p>
            </div>
          </div>
          <a href="#" className="flex items-center gap-2 px-2 text-sm text-muted transition hover:text-brand-700">
            <CircleHelp size={16} aria-hidden="true" />
            Ayuda y seguridad
          </a>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Barra superior */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line/60 bg-white/85 px-4 backdrop-blur sm:px-8">
          <Logo className="lg:hidden" />
          <p className="hidden items-center gap-2 text-sm font-medium lg:flex">
            <MapPin size={16} className="text-brand-500" aria-hidden="true" />
            {user.ciudad}
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-muted md:block">Tu próximo hogar empieza aquí</span>
            <button
              type="button"
              aria-label="Notificaciones"
              className="relative grid size-10 place-items-center rounded-xl text-muted transition hover:bg-brand-50 hover:text-ink"
            >
              <Bell size={20} aria-hidden="true" />
              <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-pink-500 ring-2 ring-white" />
            </button>
            <Avatar name={user.nombre} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-8 lg:pb-12">
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Navegación inferior (celular) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line/60 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {NAV.map(({ to, label, icon: Icon, badge }) => (
          <NavLink key={to} to={to} className={tabLink}>
            {({ isActive }) => (
              <>
                <span className={`relative grid h-7 w-12 place-items-center rounded-full transition ${isActive ? "bg-brand-100" : ""}`}>
                  <Icon size={20} aria-hidden="true" />
                  {badge && (
                    <span className="absolute top-0 right-1 grid size-4 place-items-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
                      {badge}
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}