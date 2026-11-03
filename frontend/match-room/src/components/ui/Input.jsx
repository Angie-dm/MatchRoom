export default function Input({ label, icon: Icon, error, hint, id, className = "", ...props }) {
  const inputId = id ?? props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 shadow-xs transition duration-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15 ${
          error ? "border-red-400" : "border-line hover:border-brand-500/50"
        }`}
      >
        {Icon && <Icon size={18} className="shrink-0 text-muted" aria-hidden="true" />}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className="h-12 w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted/70 sm:text-[15px]"
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 animate-fade-up text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}