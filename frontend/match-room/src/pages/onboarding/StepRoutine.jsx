import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import { ChipGroup } from "../../components/ui/Chip";
import { OPTIONS } from "../../data/onboardingOptions";
import { useOnboarding } from "../../hooks/useOnboarding";
import { profileService } from "../../services/profileService";

export default function StepRoutine() {
  const navigate = useNavigate();
  const { data, update } = useOnboarding();
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    ["jornada", "descanso", "orden"].forEach((field) => {
      if (!data[field]) next[field] = "Elige una opción.";
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      await profileService.putLifestyle({
        workSchedule: data.jornada,
        sleepSchedule: data.descanso,
        cleanlinessLevel: data.orden,
        noiseLevel: data.noiseLevel,
        hasPets: data.mascotas === "" ? null : data.mascotas,
        smokes: data.smokes,
        visitsFrequency: data.visitas || null,
        cohabitationType: data.convivencia || null,
      });
      navigate("/registro/4");
    } catch (error) {
      setErrors({ form: error.message || "No pudimos guardar tus hábitos." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader title="Tu rutina también hace match." subtitle="No hay hábitos perfectos, solo personas compatibles." />
      <div className="flex flex-col gap-5">
        <ChipGroup label="¿Cómo es tu jornada?" options={OPTIONS.jornada} value={data.jornada} onChange={(v) => update({ jornada: v })} error={errors.jornada} />
        <ChipGroup label="¿Cuándo sueles descansar?" options={OPTIONS.descanso} value={data.descanso} onChange={(v) => update({ descanso: v })} error={errors.descanso} />
        <ChipGroup label="¿Qué tan importante es el orden para ti?" options={OPTIONS.orden} value={data.orden} onChange={(v) => update({ orden: v })} error={errors.orden} />
        <p className="text-xs text-muted">Estos hábitos se usan para calcular tu compatibilidad, no para juzgarte.</p>
      </div>
      {errors.form && <p role="alert" className="mt-3 text-xs text-red-600">{errors.form}</p>}
      <StepFooter onBack={() => navigate("/registro/2")} loading={saving} />
    </form>
  );
}
