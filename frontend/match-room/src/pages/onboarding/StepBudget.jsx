import { Calendar, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import Input from "../../components/ui/Input";
import RangeSlider from "../../components/ui/RangeSlider";
import { useOnboarding } from "../../hooks/useOnboarding";

const money = (n) => `$${n.toLocaleString("es-MX")} MXN`;

export default function StepBudget() {
  const navigate = useNavigate();
  const { data, update } = useOnboarding();
  const [zona, setZona] = useState("");
  const [errors, setErrors] = useState({});

  const addZona = () => {
    const value = zona.trim();
    if (value && !data.zonas.includes(value)) update({ zonas: [...data.zonas, value] });
    setZona("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!data.ciudad.trim()) next.ciudad = "Indica tu ciudad.";
    if (data.zonas.length === 0) next.zonas = "Agrega al menos una zona.";
    if (!data.mudanza) next.mudanza = "Elige una fecha aproximada.";
    setErrors(next);
    if (!Object.keys(next).length) navigate("/registro/3");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader title="Un hogar dentro de tus planes." subtitle="Elige dónde y cuánto te gustaría invertir al mes." />
      <div className="flex flex-col gap-5">
        <Input
          label="Ciudad"
          name="ciudad"
          icon={MapPin}
          value={data.ciudad}
          onChange={(e) => update({ ciudad: e.target.value })}
          error={errors.ciudad}
        />

        <div>
          <Input
            label="Zonas que te interesan"
            name="zona"
            icon={Search}
            placeholder="Escribe una zona y presiona Enter"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addZona();
              }
            }}
            error={errors.zonas}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {data.zonas.map((z) => (
              <button
                key={z}
                type="button"
                aria-label={`Quitar ${z}`}
                onClick={() => update({ zonas: data.zonas.filter((v) => v !== z) })}
                className="rounded-full border border-brand-500/40 bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700"
              >
                {z} ×
              </button>
            ))}
            <button
              type="button"
              onClick={addZona}
              className="rounded-full border border-dashed border-brand-100 px-3 py-1 text-xs text-muted"
            >
              + Añadir zona
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold">Tu presupuesto mensual</p>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <Input label="Desde" name="desde" readOnly value={money(data.presupuestoMin)} />
            <Input label="Hasta" name="hasta" readOnly value={money(data.presupuestoMax)} />
          </div>
          <RangeSlider
            min={2000}
            max={20000}
            step={500}
            valueMin={data.presupuestoMin}
            valueMax={data.presupuestoMax}
            onChange={({ min, max }) => update({ presupuestoMin: min, presupuestoMax: max })}
          />
        </div>

        <Input
          label="¿Cuándo te gustaría mudarte?"
          name="mudanza"
          type="date"
          icon={Calendar}
          value={data.mudanza}
          onChange={(e) => update({ mudanza: e.target.value })}
          hint="Tu presupuesto nos ayuda a mostrar opciones realistas. Puedes cambiarlo después."
          error={errors.mudanza}
        />
      </div>
      <StepFooter onBack={() => navigate("/registro/1")} />
    </form>
  );
}
