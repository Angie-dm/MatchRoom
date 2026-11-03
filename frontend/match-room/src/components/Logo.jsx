import { House } from "lucide-react";

export default function Logo({ className = "", light = false }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`grid size-10 place-items-center rounded-xl ${
          light ? "bg-white text-brand-700" : "bg-brand-500 text-white"
        }`}
      >
        <House size={22} aria-hidden="true" />
      </span>
      <span className={`font-display text-2xl font-semibold ${light ? "text-white" : "text-brand-700"}`}>
        match room
      </span>
    </div>
  );
}