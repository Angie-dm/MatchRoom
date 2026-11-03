import { Sparkles } from "lucide-react";

export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-[11px] font-semibold text-brand-700 uppercase">
      <Sparkles size={12} aria-hidden="true" />
      {children}
    </span>
  );
}
