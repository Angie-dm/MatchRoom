import { Lock } from "lucide-react";

export default function PrivacyNote({ light = false }) {
  return (
    <p
      className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-xs ${
        light
          ? "border-white/15 bg-white/10 text-white/80 backdrop-blur"
          : "border-line bg-white text-muted"
      }`}
    >
      <Lock size={14} className={light ? "text-white" : "text-brand-500"} aria-hidden="true" />
      Solo compartimos lo que tú autorizas.
    </p>
  );
}