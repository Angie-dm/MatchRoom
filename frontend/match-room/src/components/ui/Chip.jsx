import { Check } from "lucide-react";

export function Chip({ selected, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-brand-500 ${
        selected
          ? "animate-pop border-brand-500/50 bg-brand-100 font-semibold text-brand-700"
          : "border-line bg-white font-medium text-muted hover:-translate-y-0.5 hover:border-brand-500/50"
      }`}
      {...props}
    >
      {selected && <Check size={14} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ChipGroup({ label, options, value, onChange, multiple = false, error }) {
  const isOn = (option) => (multiple ? value.includes(option) : value === option);
  const toggle = (option) => {
    if (!multiple) return onChange(option);
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <div role="group" aria-label={label}>
      <p className="mb-2.5 text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          return <Chip key={value} selected={isOn(value)} onClick={() => toggle(value)}>
            {label}
          </Chip>
        })}
      </div>
      {error && <p className="mt-1.5 animate-fade-up text-xs text-red-600">{error}</p>}
    </div>
  );
}
