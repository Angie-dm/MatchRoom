import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import { ChipGroup } from "../../components/ui/Chip";
import Textarea from "../../components/ui/Textarea";
import { OPTIONS } from "../../data/onboardingOptions";
import { useOnboarding } from "../../hooks/useOnboarding";
import { profileService } from "../../services/profileService";
import { getOnboardingState } from "../../services/onboardingService";
import { useAuth } from "../../hooks/useAuth";

export default function StepCoexistence() {
  const navigate = useNavigate();
  const { data, update, reset } = useOnboarding();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { refreshSession } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    ["convivirMascotas", "fumar", "visitas", "convivencia"].forEach((field) => {
      if (data[field] === "") next[field] = "Elige una opción.";
    });
    if (typeof data.mascotas !== "boolean") next.mascotas = "Elige una opción.";
    if (typeof data.smokes !== "boolean") next.smokes = "Elige una opción.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const user = await refreshSession();
      if (!user) throw new Error("No pudimos confirmar tu sesión.");
      await profileService.putLifestyle({
        workSchedule: data.jornada,
        sleepSchedule: data.descanso,
        cleanlinessLevel: data.orden,
        noiseLevel: data.noiseLevel,
        hasPets: data.mascotas,
        smokes: data.smokes,
        visitsFrequency: data.visitas,
        cohabitationType: data.convivencia,
      });
      await profileService.putRoommatePreferences({
        smokingPolicy: data.fumar,
        petsPolicy: data.convivirMascotas,
        maxNoiseLevel: data.maxNoiseLevel,
        maxVisitsFrequency: data.maxVisitsFrequency,
        minCleanlinessLevel: data.minCleanlinessLevel,
        minAge: data.minAge,
        maxAge: data.maxAge,
        exclusiveCriteria: data.exclusiveCriteria,
      });
      await profileService.patchMe({ bio: data.espacio });
      const { nextStep } = await getOnboardingState();
      if (nextStep) throw new Error(`Aún falta completar el paso ${nextStep}.`);
      reset();
      navigate("/explorar");
    } catch (error) {
      setErrors({ form: error.message || "No pudimos crear la cuenta. Intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader title="Los detalles hacen la convivencia." subtitle="Un último paso para encontrar personas que van contigo." />
      <div className="flex flex-col gap-5">
        <ChipGroup label="¿Tienes mascotas?" options={OPTIONS.mascotas} value={data.mascotas} onChange={(v) => update({ mascotas: v })} error={errors.mascotas} />
        <ChipGroup label="¿Fumas?" options={OPTIONS.mascotas} value={data.smokes} onChange={(v) => update({ smokes: v })} error={errors.smokes} />
        <ChipGroup label="¿Convivirías con mascotas?" options={OPTIONS.convivirMascotas} value={data.convivirMascotas} onChange={(v) => update({ convivirMascotas: v })} error={errors.convivirMascotas} />
        <ChipGroup label="¿Qué prefieres sobre fumar?" options={OPTIONS.fumar} value={data.fumar} onChange={(v) => update({ fumar: v })} error={errors.fumar} />
        <ChipGroup label="Visitas en casa" options={OPTIONS.visitas} value={data.visitas} onChange={(v) => update({ visitas: v })} error={errors.visitas} />
        <ChipGroup label="¿Cómo quieres encontrar vivienda?" options={OPTIONS.convivencia} value={data.convivencia} onChange={(v) => update({ convivencia: v })} error={errors.convivencia} />
        <Textarea
          label="Un poco sobre ti"
          name="bio"
          value={data.espacio}
          onChange={(e) => update({ espacio: e.target.value })}
        />
        <p className="flex items-center gap-2 rounded-xl bg-brand-100 px-4 py-3 text-xs text-brand-700">
          <Sparkles size={16} aria-hidden="true" />
          {data.firstName ? `¡Todo listo, ${data.firstName}!` : "¡Todo listo!"} Ya podemos encontrar tus primeras conexiones.
        </p>
      </div>
      {errors.form && <p className="mt-3 text-center text-xs text-red-600">{errors.form}</p>}
      <StepFooter onBack={() => navigate("/registro/3")} nextLabel="Encontrar mi match" loading={loading} />
    </form>
  );
}
