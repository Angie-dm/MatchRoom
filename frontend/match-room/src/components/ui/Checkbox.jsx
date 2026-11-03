export default function Checkbox({ children, error, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted">
        <input type="checkbox" className="mt-0.5 size-4 accent-brand-500" {...props} />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
