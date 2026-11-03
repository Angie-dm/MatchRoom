export default function ProgressBar({ step, total = 4 }) {
  return (
    <div role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step}>
      <div className="mb-2 flex items-center justify-between text-[11px]">
        <span className="font-semibold text-brand-500 uppercase">
          Paso {step} de {total}
        </span>
        <span className="text-muted">{Math.round((step / total) * 100)}% completado</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-100">
            <span
              className={`block h-full origin-left rounded-full bg-brand-500 transition-transform duration-700 ease-out ${
                i < step ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}