import { Edit3, LogOut, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Avatar from "../components/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import LocationSelector from "../components/LocationSelector";
import Textarea from "../components/ui/Textarea";
import { useAuth } from "../hooks/useAuth";
import { profileService } from "../services/profileService";
import { hasProfileValue, profileLivingFields } from "../utils/profilePresentation";

export default function MiPerfil() {
  const navigate = useNavigate();
  const { isDemo, restartDemo, user, logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", birthDate: "", occupation: "", bio: "" });
  const [savedForm, setSavedForm] = useState(form);
  const [livingEditing, setLivingEditing] = useState(false);
  const [living, setLiving] = useState({});
  const [cities, setCities] = useState([]);

  useEffect(() => {
    let active = true;
    if (isDemo) return () => { active = false; };
    profileService.me().then((response) => {
      if (active) { setProfile(response); const next = personalFields(response); setForm(next); setSavedForm(next); setLiving(profileLivingFields(response)); }
    }).catch(() => {
      if (active) setProfileError("No pudimos cargar tu perfil. Intenta de nuevo.");
    });
    return () => { active = false; };
  }, [isDemo, user?.id]);

  const data = profile || {};
  const livingData = profileLivingFields(data);
  const fullName = [data.firstName || user?.firstName, data.lastName || user?.lastName].filter(Boolean).join(" ") || "Perfil sin completar";
  const filled = [data.firstName, data.lastName, data.birthDate, data.occupation, data.bio].filter(Boolean).length;
  const completion = Math.round((filled / 5) * 100);
  const ageError = form.birthDate && !isAdult(form.birthDate) ? "Debes tener al menos 18 años para usar Match Room" : "";
  const setField = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const setLivingField = (field) => (event) => setLiving({ ...living, [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
  const saveProfile = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.birthDate || !form.occupation.trim() || ageError) { setError(ageError || "Completa nombre, apellidos, fecha de nacimiento y ocupación."); return; }
    setLoading(true); setError("");
    try {
      const payload = personalFields(form, true);
      await profileService.patchMe(payload);
      const confirmed = await profileService.me();
      const next = personalFields(confirmed); setProfile(confirmed); setForm(next); setSavedForm(next); setEditing(false); setError("Cambios guardados correctamente.");
    }
    catch (requestError) { setError(requestError.message || "No pudimos guardar los cambios."); }
    finally { setLoading(false); }
  };
  const openLiving = async () => { setError(""); setLiving(profileLivingFields(data)); setLivingEditing(true); try { setCities(await profileService.cities()); } catch { setError("No pudimos cargar los catálogos."); } };
  const saveLiving = async () => {
    const min = Number(living.budgetMin), max = Number(living.budgetMax);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min) { setError("Revisa el presupuesto mínimo y máximo."); return; }
    setLoading(true); setError("");
    try {
      if (living.cityId) {
        await profileService.patchMe({ cityId: living.cityId });
        await profileService.replacePreferredZones(living.zoneIds || []);
      }
      await profileService.putHousingPreferences({ propertyType: living.propertyType, budgetMin: min, budgetMax: max, moveInDate: living.moveInDate || null, requiresFurnished: living.requiresFurnished, requiresPetsAllowed: living.requiresPetsAllowed });
      await profileService.putLifestyle({ cleanlinessLevel: living.cleanlinessLevel, smokes: living.smokes, hasPets: living.hasPets, noiseLevel: living.noiseLevel, visitsFrequency: living.visitsFrequency, sleepSchedule: living.sleepSchedule, workSchedule: living.workSchedule, cohabitationType: living.cohabitationType });
      await profileService.putRoommatePreferences({ smokingPolicy: living.smokingPolicy, petsPolicy: living.petsPolicy, maxNoiseLevel: living.maxNoiseLevel, maxVisitsFrequency: living.maxVisitsFrequency, minCleanlinessLevel: living.minCleanlinessLevel, minAge: living.minAge, maxAge: living.maxAge, exclusiveCriteria: living.exclusiveCriteria || [] });
      const confirmed = await profileService.me(); setProfile(confirmed); setLiving(profileLivingFields(confirmed)); setLivingEditing(false); setError("Preferencias guardadas correctamente.");
    } catch (requestError) { setError(requestError.message || "No pudimos guardar las preferencias."); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "No pudimos cerrar sesión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl animate-fade-up">
      <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase">Mi perfil</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Un perfil tan auténtico como tú.</h1>
      <p className="mt-2 text-[15px] text-muted">Tu información, tus preferencias y tu tranquilidad.</p>

      {!profile && !profileError && <div className="mt-6 h-32 animate-pulse rounded-3xl bg-brand-100" aria-busy="true" />}
      {profileError && <p role="alert" className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">{profileError}</p>}

      <section className="mt-6 rounded-3xl border border-line/70 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={fullName} size="size-16" className="text-lg" />
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold">{fullName}</p>
            <p className="truncate text-sm text-muted">{data.occupation || "Ocupación sin especificar"}</p>
          </div>
          <div className="ml-auto w-32"><p className="text-xs font-semibold text-brand-700">Perfil al {completion}%</p><div className="mt-2 h-2 rounded-full bg-brand-100"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${completion}%` }} /></div></div>
        </div>

      </section>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <section className="rounded-3xl border border-line/70 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Tus datos personales</h2><button type="button" onClick={() => setEditing(true)} className="text-brand-500"><Edit3 size={18}/></button></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" value={data.firstName}/><Field label="Apellidos" value={data.lastName}/><Field label="Fecha de nacimiento" value={formatBirthDate(data.birthDate)}/><Field label="Ocupación" value={data.occupation}/>
          <Input label="Correo electrónico" value={user?.email || ""} disabled icon={Mail} className="sm:col-span-2"/>
        </div>
        <Field label="Biografía" value={data.bio} className="mt-4"/>
        <dl className="mt-7 divide-y divide-line/60 border-y border-line/60">
          <div className="hidden flex gap-3 py-4">
            <Mail size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
            <div>
              <dt className="text-xs font-semibold text-muted">Correo electrónico</dt>
              <dd className="mt-1 text-sm font-medium">{user?.email}</dd>
            </div>
          </div>
          <div className="flex gap-3 py-4">
            <UserRound size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
            <div>
              <dt className="text-xs font-semibold text-muted">Modo de cuenta</dt>
              <dd className="mt-1 text-sm font-medium">{user?.activeMode === "landlord" ? "Anfitrión" : "Busco alojamiento"}</dd>
            </div>
          </div>
        </dl>

      </section><aside className="space-y-5"><section className="h-fit rounded-3xl border border-line/70 bg-white p-6 shadow-sm"><h2 className="font-display text-xl font-semibold">Tu cuenta</h2><div className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm text-muted">
          <ShieldCheck size={17} className="mr-2 inline text-brand-700" aria-hidden="true" />
          Tu contraseña y tus datos de sesión nunca se muestran aquí.
        </div>

        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <Button variant="secondary" icon={LogOut} className="mt-6" onClick={handleLogout} disabled={loading}>
          {loading ? "Cerrando sesión…" : "Cerrar sesión"}
        </Button>
        {isDemo && (
          <Button variant="secondary" className="mt-3" onClick={() => { restartDemo(); navigate("/explorar"); }}>
            Reiniciar datos de demostración
          </Button>
        )}
      </section>
      <section className="rounded-3xl border border-line/70 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-brand-500" aria-hidden="true"/><h2 className="font-display text-lg font-semibold">Privacidad y seguridad</h2></div>
        <div className="mt-4 divide-y divide-line/60">
          <SettingsToggle label="Ubicación aproximada" description="Solo se muestra tu zona, nunca tu domicilio" checked={false} disabled onChange={() => {}} />
          <SettingsToggle label="Datos de contacto privados" description="Tu correo y teléfono no son públicos" checked={false} disabled onChange={() => {}} />
          <SettingsToggle label="Mostrar mi perfil" description="Aparece en recomendaciones compatibles" checked={false} disabled onChange={() => {}} />
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">Configuración de privacidad no disponible todavía. Tus datos personales no se exponen mediante perfiles públicos.</p>
      </section>
      <section className="rounded-3xl border border-line/70 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Notificaciones</h2>
        <div className="mt-4 divide-y divide-line/60">
          <SettingsToggle label="Nuevos matches" description="Entérate cuando el interés sea mutuo" checked={false} disabled onChange={() => {}} />
          <SettingsToggle label="Resúmenes por correo" description="Recibe un resumen si no estás en la app" checked={false} disabled onChange={() => {}} />
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">La configuración de notificaciones no está disponible todavía.</p>
        <Button variant="secondary" className="mt-4 w-full" disabled>Configurar notificaciones</Button>
      </section>
      </aside></div>
      <section className="mt-5 rounded-3xl border border-line/70 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-xl font-semibold">Tu forma de vivir</h2><p className="mt-1 text-sm text-muted">Tus preferencias para encontrar el hogar ideal.</p></div><button onClick={openLiving} className="text-sm font-semibold text-brand-500">Editar</button></div><div className="mt-6 border-b border-line/60 pb-5"><p className="text-xs font-semibold text-muted">TU PRÓXIMO HOGAR</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-muted">Presupuesto mensual</p><p className="mt-1 font-display text-xl font-semibold">{hasProfileValue(livingData.budgetMin) && hasProfileValue(livingData.budgetMax) ? `$${Number(livingData.budgetMin).toLocaleString("es-MX")} – $${Number(livingData.budgetMax).toLocaleString("es-MX")} MXN` : "Sin especificar"}</p></div><div><p className="text-xs text-muted">Fecha de mudanza</p><p className="mt-1 text-sm font-semibold">{livingData.moveInDate || "Sin especificar"}</p></div><div><p className="text-xs text-muted">Ciudad</p><p className="mt-1 text-sm font-semibold">{data.city?.name || "Sin especificar"}</p></div><div><p className="text-xs text-muted">Zonas preferidas</p><p className="mt-1 text-sm font-semibold">{data.preferredZones?.length ? data.preferredZones.map((zone) => zone.name).join(", ") : "Sin especificar"}</p></div></div></div><div className="mt-5"><p className="text-xs font-semibold text-muted">TU ESTILO DE CONVIVENCIA</p><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[["Horario de trabajo",livingData.workSchedule],["Horario de descanso",livingData.sleepSchedule],["Nivel de limpieza",livingData.cleanlinessLevel],["Mascotas",livingData.hasPets],["Fumar",livingData.smokes],["Visitas",livingData.visitsFrequency],["Tipo de convivencia",livingData.cohabitationType]].map(([label,value])=><div key={label} className="rounded-2xl border border-brand-100 bg-brand-50/60 p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-sm font-semibold text-ink">{livingLabel(value)}</p></div>)}</div></div><div className="mt-5 border-t border-line/60 pt-5"><p className="text-xs font-semibold text-muted">PREFERENCIAS DEL HOGAR</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full border border-brand-500/30 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">Fumar: {livingLabel(livingData.smokingPolicy)}</span><span className="rounded-full border border-brand-500/30 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">Mascotas: {livingLabel(livingData.petsPolicy)}</span></div></div></section>
      <section className="mt-5 rounded-3xl border border-line/70 bg-white p-6 shadow-sm"><h2 className="font-display text-xl font-semibold">Verificación de perfil</h2><p className="mt-4 text-sm text-muted">Correo: {user?.email ? "Pendiente de confirmación" : "No disponible"}</p><p className="mt-2 text-sm text-muted">Teléfono: No disponible</p><p className="mt-2 text-sm text-muted">Fotografía: No disponible</p></section>
      {editing && createPortal(<div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" onKeyDown={(e) => { if (e.key === "Escape" && !loading) { setForm(savedForm); setEditing(false); } }} tabIndex="-1">
        <div className="max-h-[90dvh] w-full max-w-[520px] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h2 id="edit-profile-title" className="font-display text-2xl font-semibold">Editar datos personales</h2><p className="mt-1 text-sm text-muted">Actualiza tu información.</p></div><button aria-label="Cerrar" disabled={loading} onClick={() => { setForm(savedForm); setEditing(false); }} className="rounded-xl p-2 text-muted hover:bg-brand-50"><X size={20}/></button></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><Input label="Nombre" value={form.firstName} onChange={setField("firstName")}/><Input label="Apellidos" value={form.lastName} onChange={setField("lastName")}/><Input label="Fecha de nacimiento" type="date" max={adultDate()} value={form.birthDate} onChange={setField("birthDate")} error={ageError}/><Input label="Ocupación" value={form.occupation} onChange={setField("occupation")}/><Input label="Correo electrónico" value={user?.email || ""} disabled icon={Mail} className="sm:col-span-2"/></div><Textarea className="mt-4" label="Biografía" value={form.bio} onChange={setField("bio")}/>{error&&<p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex justify-end gap-3"><Button variant="secondary" disabled={loading} onClick={() => { setForm(savedForm); setEditing(false); }}>Cancelar</Button><Button disabled={loading} onClick={saveProfile}>{loading ? "Guardando…" : "Guardar cambios"}</Button></div>
        </div>
      </div>, document.body)}
      {livingEditing && createPortal(<div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-living-title"><div className="max-h-[90dvh] w-full max-w-[640px] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6"><div className="flex justify-between gap-4"><div><h2 id="edit-living-title" className="font-display text-2xl font-semibold">Editar mi forma de vivir</h2><p className="mt-1 text-sm text-muted">Actualiza tus preferencias de vivienda y convivencia.</p></div><button aria-label="Cerrar" disabled={loading} onClick={()=>setLivingEditing(false)} className="rounded-xl p-2 text-muted hover:bg-brand-50"><X/></button></div><h3 className="mt-5 text-sm font-semibold">Ubicación y presupuesto</h3><div className="mt-3"><LocationSelector cities={cities} cityId={living.cityId} zoneIds={living.zoneIds || []} onCityChange={(cityId) => setLiving((current) => ({ ...current, cityId, zoneIds: [] }))} onZoneIdsChange={(zoneIds) => setLiving((current) => ({ ...current, zoneIds }))} disabled={loading} /></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Input label="Presupuesto mínimo" type="number" value={living.budgetMin ?? ""} onChange={setLivingField("budgetMin")}/><Input label="Presupuesto máximo" type="number" value={living.budgetMax ?? ""} onChange={setLivingField("budgetMax")}/><Input label="Fecha de mudanza" type="date" value={living.moveInDate ?? ""} onChange={setLivingField("moveInDate")} className="sm:col-span-2"/></div><h3 className="mt-5 text-sm font-semibold">Hábitos de convivencia</h3><div className="mt-3 grid gap-4 sm:grid-cols-2">{Object.entries(LIVING_LABELS).map(([key,label])=><Select key={key} label={label} value={living[key]} onChange={setLivingField(key)} options={LIVING_OPTIONS[key]}/>)}</div>{error&&<p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-6 flex justify-end gap-3"><Button variant="secondary" disabled={loading} onClick={()=>setLivingEditing(false)}>Cancelar</Button><Button disabled={loading} onClick={saveLiving}>{loading?"Guardando…":"Guardar preferencias"}</Button></div></div></div>,document.body)}
    </div>
  );
}

function personalFields(source = {}, trim = false) {
  return ["firstName", "lastName", "birthDate", "occupation", "bio"].reduce((result, key) => {
    const value = source[key] ?? "";
    result[key] = trim && typeof value === "string" ? value.trim() : value;
    return result;
  }, {});
}
function adultDate(){const d=new Date();return `${d.getFullYear()-18}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function isAdult(value){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);if(!m)return false;const d=new Date(+m[1],+m[2]-1,+m[3]);if(d.getFullYear()!=m[1]||d.getMonth()!=+m[2]-1||d.getDate()!=m[3])return false;const n=new Date();let a=n.getFullYear()-d.getFullYear();if(n.getMonth()<d.getMonth()||(n.getMonth()==d.getMonth()&&n.getDate()<d.getDate()))a--;return a>=18}
function formatBirthDate(value){if(!value)return "Sin especificar";const [y,m,d]=value.split("-");return `${d}/${m}/${y}${isAdult(value)?` · ${new Date().getFullYear()-Number(y)} años`:""}`}
function Field({label,value,className=""}){return <div className={className}><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 text-sm font-medium">{value||"Sin especificar"}</p></div>}
function livingLabel(value){return ({flexible:"Flexible",morning:"Mañana",afternoon:"Tarde",night:"Noche",remote:"Remoto",early:"Temprano",regular:"Regular",late:"Tarde",rare:"Poco frecuentes",sometimes:"A veces",often:"Frecuentes",never:"Nunca",join_existing_home:"Integrarme a un hogar existente",find_place_together:"Encontrar vivienda juntos",any:"Cualquiera",accept:"Acepto",reject:"No acepto",indifferent:"Me es indiferente",true:"Sí",false:"No"})[String(value)]??(value??"Sin especificar")}
const LIVING_LABELS={workSchedule:"Horario de trabajo o estudio",sleepSchedule:"Horario de descanso",cohabitationType:"Tipo de convivencia",visitsFrequency:"Frecuencia de visitas",smokingPolicy:"Política de fumar",petsPolicy:"Política de mascotas"};
const LIVING_OPTIONS={workSchedule:[["morning","Mañana"],["afternoon","Tarde"],["night","Noche"],["remote","Remoto"],["flexible","Flexible"]],sleepSchedule:[["early","Temprano"],["regular","Regular"],["late","Tarde"]],cohabitationType:[["join_existing_home","Integrarme a un hogar existente"],["find_place_together","Encontrar vivienda juntos"],["any","Cualquiera"]],visitsFrequency:[["never","Nunca"],["rare","Poco frecuentes"],["sometimes","A veces"],["often","Frecuentes"]],smokingPolicy:[["accept","Acepto"],["reject","No acepto"],["indifferent","Me es indiferente"]],petsPolicy:[["accept","Acepto"],["reject","No acepto"],["indifferent","Me es indiferente"]]};
function Select({label,value,onChange,options=[]}){return <label className="flex flex-col gap-1 text-sm font-semibold">{label}<select className="h-11 rounded-xl border border-line bg-white px-3 font-normal" value={value??""} onChange={onChange}>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>}
function SettingsToggle({ label, description, checked, disabled, onChange }) {
  const id = `setting-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <label htmlFor={id} className="flex cursor-pointer items-start gap-3 py-4 first:pt-0 last:pb-0">
    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">{label}</span><span className="mt-1 block text-xs leading-5 text-muted">{description}</span></span>
    <span className="relative mt-1 inline-flex shrink-0"><input id={id} type="checkbox" className="peer sr-only" checked={Boolean(checked)} disabled={disabled} onChange={(event) => onChange(event.target.checked)} /><span aria-hidden="true" className="h-6 w-11 rounded-full bg-line transition peer-checked:bg-brand-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 peer-disabled:opacity-50 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" /></span>
  </label>;
}
