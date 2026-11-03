import { Outlet, useLocation } from "react-router-dom";
import Backdrop from "../components/Backdrop";
import Logo from "../components/Logo";
import PrivacyNote from "../components/PrivacyNote";
import ProgressBar from "../components/ProgressBar";
import RoomPhoto from "../components/RoomPhoto";
import Stepper from "../components/Stepper";
import { OnboardingProvider } from "../context/OnboardingContext";
import { STEPS } from "../data/onboardingOptions";

export default function OnboardingLayout() {
  const { pathname } = useLocation();
  const step = Number(pathname.split("/").pop()) || 1;

  return (
    <OnboardingProvider>
      <Backdrop>
        <div className="grid w-full max-w-6xl animate-fade-up overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_30px_80px_-30px_rgba(91,33,182,0.45)] backdrop-blur lg:grid-cols-[350px_1fr] lg:rounded-[2rem]">
          {/* Panel lateral: solo escritorio */}
          <aside className="hidden flex-col gap-5 border-r border-line/60 bg-brand-50/80 p-7 lg:flex">
            <Logo />
            <div>
              <h2 className="font-display text-3xl leading-tight font-semibold">
                Tu próxima etapa empieza en casa.
              </h2>
              <p className="mt-2 text-sm text-muted">Unos minutos para conocerte. Mucho por compartir.</p>
            </div>
            <Stepper current={step} />
            <RoomPhoto className="min-h-40 flex-1 rounded-2xl shadow-lg shadow-brand-500/20" />
            <PrivacyNote />
          </aside>

          {/* Formulario */}
          <main className="p-5 sm:p-10">
            <Logo className="mb-5 lg:hidden" />
            <ProgressBar step={step} />
            <p className="mt-2 text-sm font-semibold text-brand-700 lg:hidden">{STEPS[step - 1]?.label}</p>
            <div key={pathname} className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </Backdrop>
    </OnboardingProvider>
  );
}