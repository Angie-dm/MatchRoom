import { ArrowLeft, Check } from "lucide-react";
import { STEPS } from "../data/onboardingOptions";

export default function Stepper({ current }) {
  return (
    <ol className="flex flex-col gap-2.5">
      {STEPS.map(({ id, label }) => {
        const done = id < current;
        const active = id === current;
        return (
          <li
            key={id}
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-3.5 rounded-2xl border px-4 py-3 text-[15px] transition-all duration-300 ${
              active
                ? "translate-x-1 border-brand-500/50 bg-white font-semibold text-brand-700 shadow-lg shadow-brand-500/15"
                : "border-line/70 bg-white/70 text-muted"
            }`}
          >
            <span className="relative grid size-8 shrink-0 place-items-center">
              {active && <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/30" />}
              <span
                className={`relative grid size-8 place-items-center rounded-full text-xs font-semibold ${
                  active || done ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-700"
                }`}
              >
                {done ? (
                  <Check size={14} className="animate-pop" aria-hidden="true" />
                ) : (
                  String(id).padStart(2, "0")
                )}
              </span>
            </span>
            <span className="flex-1">{label}</span>
            {active && <ArrowLeft size={16} className="animate-fade-in" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}