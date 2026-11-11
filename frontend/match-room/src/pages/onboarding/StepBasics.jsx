import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import Checkbox from "../../components/ui/Checkbox";
import Input from "../../components/ui/Input";
import { useOnboarding } from "../../hooks/useOnboarding";
import { authService } from "../../services/authService";
import { profileService } from "../../services/profileService";
import { useAuth } from "../../hooks/useAuth";

export default function StepBasics() {
  const navigate = useNavigate();
  const { data, update } = useOnboarding();
  const { user, refreshSession } = useAuth();
  const [errors, setErrors] = useState({});
  const [confirmacion, setConfirmacion] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const esGoogle = data.proveedor === "google";
  const hasExistingSession = Boolean(user);
  const requiresPassword = !esGoogle && !hasExistingSession;
  const bind = (field) => ({ value: data[field], onChange: (e) => update({ [field]: e.target.value }) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!data.firstName.trim()) next.firstName = "Escribe tu nombre.";
    if (!data.lastName.trim()) next.lastName = "Escribe tus apellidos.";
    if (!data.birthDate) next.birthDate = "Indica tu fecha de nacimiento.";
    if (!data.ocupacion.trim()) next.ocupacion = "Cuéntanos a qué te dedicas.";
    if (!/^\S+@\S+\.\S+$/.test(data.correo)) next.correo = "Escribe un correo válido.";
    if (requiresPassword && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(data.password))
      next.password = "Mínimo 8 caracteres, una letra y un número.";
    if (requiresPassword && data.password !== confirmacion)
      next.confirmacion = "Las contraseñas no coinciden.";
    if (!data.terminos) next.terminos = "Debes aceptar los términos para continuar.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      if (!hasExistingSession && !esGoogle) await authService.register(data);
      const sessionUser = user || await refreshSession();
      if (!sessionUser) throw new Error("No pudimos confirmar tu sesión.");
      await profileService.patchMe({
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        occupation: data.ocupacion,
      });
      navigate("/registro/2");
    } catch (error) {
      setErrors({ form: error.message || "No pudimos guardar tus datos." });
    } finally { setLoading(false); }
  };

  return (
       <div className="stagger flex flex-col gap-4">
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader title="Empecemos por conocerte." subtitle="Cuéntanos un poco de ti. Lo demás lo construimos juntos." />
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre(s)" name="firstName" autoComplete="given-name" error={errors.firstName} {...bind("firstName")} />
          <Input label="Apellidos" name="lastName" autoComplete="family-name" error={errors.lastName} {...bind("lastName")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Fecha de nacimiento" name="birthDate" type="date" max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10)} error={errors.birthDate} {...bind("birthDate")} />
          <Input label="Ocupación" name="ocupacion" error={errors.ocupacion} {...bind("ocupacion")} />
        </div>
        <Input label="Correo electrónico" name="correo" type="email" icon={Mail} autoComplete="email"
          readOnly={esGoogle || hasExistingSession} error={errors.correo} {...bind("correo")} />
        {requiresPassword && (
          <>
            <Input
              label="Crea una contraseña"
              name="password"
              type={mostrarPassword ? "text" : "password"}
              icon={Lock}
              autoComplete="new-password"
              hint="Al menos 8 caracteres, una letra y un número."
              error={errors.password}
              endAdornment={
                <button
                  type="button"
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setMostrarPassword((visible) => !visible)}
                  className="shrink-0 rounded-lg p-1 text-muted transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {mostrarPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              }
              {...bind("password")}
            />
            <Input
              label="Confirmar contraseña"
              name="passwordConfirmation"
              type={mostrarConfirmacion ? "text" : "password"}
              icon={Lock}
              autoComplete="new-password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              error={errors.confirmacion}
              endAdornment={
                <button
                  type="button"
                  aria-label={mostrarConfirmacion ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                  onClick={() => setMostrarConfirmacion((visible) => !visible)}
                  className="shrink-0 rounded-lg p-1 text-muted transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {mostrarConfirmacion ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              }
            />
          </>
        )}
        <Checkbox checked={data.terminos} onChange={(e) => update({ terminos: e.target.checked })} error={errors.terminos}>
          Acepto los términos de uso y el aviso de privacidad. Tengo al menos 18 años.
        </Checkbox>
        {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}
      </div>
      <StepFooter onBack={() => navigate("/login")} loading={loading} />
    </form>
    </div>
  );
}
