import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import { ChipGroup } from "../../components/ui/Chip";
import Textarea from "../../components/ui/Textarea";
import { OPTIONS } from "../../data/onboardingOptions";
import { useOnboarding } from "../../hooks/useOnboarding";

export default function StepRoutine() {
  const navigate = useNavigate();
  const { data, update } = useOnboarding();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    ["jornada", "descanso", "orden", "limpieza"].forEach((field) => {
      if (!data[field]) next[field] = "Elige una opción.";
    });
    setErrors(next);
    if (!Object.keys(next).length) navigate("/registro/4");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader title="Tu rutina también hace match." subtitle="No hay hábitos perfectos, solo personas compatibles." />
      <div className="flex flex-col gap-5">
        <ChipGroup label="¿Cómo es tu jornada?" options={OPTIONS.jornada} value={data.jornada} onChange={(v) => update({ jornada: v })} error={errors.jornada} />
        <ChipGroup label="¿Cuándo sueles descansar?" options={OPTIONS.descanso} value={data.descanso} onChange={(v) => update({ descanso: v })} error={errors.descanso} />
        <ChipGroup label="¿Qué tan importante es el orden para ti?" options={OPTIONS.orden} value={data.orden} onChange={(v) => update({ orden: v })} error={errors.orden} />
        <ChipGroup label="Limpieza de espacios compartidos" options={OPTIONS.limpieza} value={data.limpieza} onChange={(v) => update({ limpieza: v })} error={errors.limpieza} />
        <Textarea
          label="Algo más sobre tu rutina"
          name="rutina"
          value={data.rutina}
          onChange={(e) => update({ rutina: e.target.value })}
        />
        <p className="text-xs text-muted">Estos hábitos se usan para calcular tu compatibilidad, no para juzgarte.</p>
      </div>
      <StepFooter onBack={() => navigate("/registro/2")} />
    </form>
  );
}
