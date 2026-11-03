import { Sparkles } from "lucide-react";

export default function Soon({ title }) {
  return (
    <div className="grid animate-fade-up place-items-center py-24 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-700">
        <Sparkles size={26} aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted">Esta sección llega pronto.</p>
    </div>
  );
}