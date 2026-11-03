export default function RangeSlider({ min, max, step = 100, valueMin, valueMax, onChange }) {
  const pct = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div className="dual-range relative h-5">
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-brand-100" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-500"
        style={{ left: `${pct(valueMin)}%`, width: `${pct(valueMax) - pct(valueMin)}%` }}
      />
      <input
        type="range"
        aria-label="Presupuesto mínimo"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => onChange({ min: Math.min(Number(e.target.value), valueMax - step), max: valueMax })}
      />
      <input
        type="range"
        aria-label="Presupuesto máximo"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => onChange({ min: valueMin, max: Math.max(Number(e.target.value), valueMin + step) })}
      />
    </div>
  );
}
