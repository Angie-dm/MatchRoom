import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../../components/LocationSelector";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import Input from "../../components/ui/Input";
import RangeSlider from "../../components/ui/RangeSlider";
import { useOnboarding } from "../../hooks/useOnboarding";
import { profileService } from "../../services/profileService";

const money = (n) => `$${n.toLocaleString("es-MX")} MXN`;

export default function StepBudget() {
  const navigate = useNavigate();
  const { data, update } = useOnboarding();
  const [cities, setCities] = useState([]);
  const [citiesError, setCitiesError] = useState("");
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesSource, setCitiesSource] = useState("network");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    profileService.cities({ signal: controller.signal, onSource: setCitiesSource })
      .then((items) => { if (!controller.signal.aborted) setCities(items); })
      .catch(() => { if (!controller.signal.aborted) setCitiesError("No pudimos cargar las ciudades. Intenta de nuevo."); })
      .finally(() => { if (!controller.signal.aborted) setCitiesLoading(false); });
    return () => controller.abort();
  }, []);

  const selectCity = (cityId) => update({ cityId, zoneIds: [] });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!data.cityId) next.cityId = "Elige una ciudad.";
    if (!data.zoneIds.length) next.zoneIds = "Elige al menos una zona.";
    if (!data.mudanza) next.mudanza = "Elige una fecha aproximada.";
    const budgetMin = Number(data.presupuestoMin);
    const budgetMax = Number(data.presupuestoMax);
    if (!Number.isFinite(budgetMin) || budgetMin < 0) next.presupuestoMin = "Indica un presupuesto mínimo válido.";
    if (!Number.isFinite(budgetMax) || budgetMax < budgetMin) next.presupuestoMax = "El presupuesto máximo debe ser mayor o igual al mínimo.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      // City must be saved before zones because the API validates the relation.
      await profileService.patchMe({ cityId: data.cityId });
      await profileService.replacePreferredZones(data.zoneIds);
      await profileService.putHousingPreferences({
        budgetMin,
        budgetMax,
        moveInDate: data.mudanza,
        propertyType: data.propertyType,
        requiresFurnished: data.requiresFurnished,
        requiresPetsAllowed: data.requiresPetsAllowed,
      });
      navigate("/registro/3");
    } catch (error) {
      setErrors({ form: error.message || "No pudimos guardar ubicación y presupuesto." });
    } finally {
      setSaving(false);
    }
  };

  return <form onSubmit={handleSubmit} noValidate>
    <StepHeader title="Un hogar dentro de tus planes." subtitle="Elige dónde y cuánto te gustaría invertir al mes." />
    <div className="flex flex-col gap-5">
      <div>
        {citiesLoading && <span className="text-xs font-normal text-muted">Cargando ciudades…</span>}
        {citiesError && <span className="text-xs font-normal text-red-600">{citiesError}</span>}
        {citiesSource === "offline" && <span role="status" className="text-xs font-normal text-amber-700">Mostrando catálogo guardado en este dispositivo.</span>}
        {!citiesLoading && !citiesError && <LocationSelector cities={cities} cityId={data.cityId} zoneIds={data.zoneIds} onCityChange={selectCity} onZoneIdsChange={(zoneIds) => update({ zoneIds })} disabled={saving} />}
        {errors.cityId && <span className="text-xs font-normal text-red-600">{errors.cityId}</span>}
        {errors.zoneIds && <p className="mt-1 text-xs text-red-600">{errors.zoneIds}</p>}
      </div>

      <div><p className="mb-3 text-xs font-semibold">Tu presupuesto mensual</p><div className="mb-4 grid grid-cols-2 gap-4"><Input label="Desde" name="desde" readOnly value={money(data.presupuestoMin)} /><Input label="Hasta" name="hasta" readOnly value={money(data.presupuestoMax)} /></div><RangeSlider min={2000} max={20000} step={500} valueMin={data.presupuestoMin} valueMax={data.presupuestoMax} onChange={({ min, max }) => update({ presupuestoMin: min, presupuestoMax: max })} /></div>
      {(errors.presupuestoMin || errors.presupuestoMax) && <p role="alert" className="-mt-3 text-xs text-red-600">{errors.presupuestoMin || errors.presupuestoMax}</p>}
      <Input label="¿Cuándo te gustaría mudarte?" name="mudanza" type="date" icon={Calendar} value={data.mudanza} onChange={(event) => update({ mudanza: event.target.value })} hint="Tu presupuesto nos ayuda a mostrar opciones realistas. Puedes cambiarlo después." error={errors.mudanza} />
    </div>
    {errors.form && <p role="alert" className="mt-3 text-xs text-red-600">{errors.form}</p>}
    <StepFooter onBack={() => navigate("/registro/1")} loading={saving} />
  </form>;
}
