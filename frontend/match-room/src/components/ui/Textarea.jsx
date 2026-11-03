export default function Textarea({ label, id, className = "", ...props }) {
  const inputId = id ?? props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={5}
        className="w-full resize-none rounded-2xl border border-line bg-white px-4 py-3 text-base text-ink shadow-xs outline-none transition duration-200 placeholder:text-muted/70 hover:border-brand-500/50 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 sm:text-[15px]"
        {...props}
      />
    </div>
  );
}