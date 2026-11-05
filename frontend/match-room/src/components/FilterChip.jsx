export default function FilterChip({ active, icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition active:scale-95 ${
        active
          ? "border-brand-500/50 bg-brand-100 font-semibold text-brand-700"
          : "border-line bg-white font-medium text-muted hover:border-brand-500/50"
      }`}
    >
      {Icon && <Icon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
}