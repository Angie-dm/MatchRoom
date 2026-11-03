import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import { ChipGroup } from "../../components/ui/Chip";
import Textarea from "../../components/ui/Textarea";
import { OPTIONS } from "../../data/onboardingOptions";
import { useOnboarding } from "../../hooks/useOnboarding";
import { authService } from "../../services/authService";

export default function StepCoexistence() {
  const navigate = useNavigate();
  const { data, update } = useOnboarding();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    ["mascotas", "convivirMascotas", "fumar", "visitas"].forEach((field) => {
      if (!data[field]) next[field] = "Elige una opción.";
    });
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await authService.register(data);
    setLoading(false);
        navigate("/explorar");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader title="Los detalles hacen la convivencia." subtitle="Un último paso para encontrar personas que van contigo." />
      <div className="flex flex-col gap-5">
        <ChipGroup label="¿Tienes mascotas?" options={OPTIONS.mascotas} value={data.mascotas} onChange={(v) => update({ mascotas: v })} error={errors.mascotas} />
        <ChipGroup label="¿Convivirías con mascotas?" options={OPTIONS.convivirMascotas} value={data.convivirMascotas} onChange={(v) => update({ convivirMascotas: v })} error={errors.convivirMascotas} />
        <ChipGroup label="¿Qué prefieres sobre fumar?" options={OPTIONS.fumar} value={data.fumar} onChange={(v) => update({ fumar: v })} error={errors.fumar} />
        <ChipGroup label="Visitas en casa" options={OPTIONS.visitas} value={data.visitas} onChange={(v) => update({ visitas: v })} error={errors.visitas} />
        <Textarea
          label="¿Cómo te gusta compartir tu espacio?"
          name="espacio"
          value={data.espacio}
          onChange={(e) => update({ espacio: e.target.value })}
        />
        <p className="flex items-center gap-2 rounded-xl bg-brand-100 px-4 py-3 text-xs text-brand-700">
          <Sparkles size={16} aria-hidden="true" />
          {data.nombre ? `¡Todo listo, ${data.nombre.split(" ")[0]}!` : "¡Todo listo!"} Ya podemos encontrar tus primeras conexiones.
        </p>
      </div>
      <StepFooter onBack={() => navigate("/registro/3")} nextLabel="Encontrar mi match" loading={loading} />
    </form>
  );
}
