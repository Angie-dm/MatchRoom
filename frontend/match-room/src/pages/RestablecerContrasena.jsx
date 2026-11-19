import { CheckCircle2, Eye, EyeOff, Lock, MailWarning } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authService } from "../services/authService";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function RestablecerContrasena() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!PASSWORD_PATTERN.test(form.password)) {
      next.password = "Mínimo 8 caracteres, una letra y un número.";
    }
    if (form.password !== form.confirm) {
      next.confirm = "Las contraseñas no coinciden.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      setDone(true);
    } catch (requestError) {
      setErrors({
        form: requestError.message || "El enlace no es válido o ya venció. Solicita uno nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="stagger">
        <Badge>Nueva contraseña</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Enlace incompleto.</h1>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <MailWarning size={22} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-sm text-amber-900">
            Abre el enlace completo que te enviamos por correo o solicita uno nuevo.
          </p>
        </div>
        <Link
          to="/recuperar-contrasena"
          className="mt-4 inline-block text-sm font-semibold text-brand-500 hover:underline"
        >
          Solicitar un enlace nuevo
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="stagger">
        <Badge>Nueva contraseña</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Contraseña actualizada.</h1>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
          <p className="text-sm text-emerald-900">
            Por seguridad cerramos tus sesiones anteriores. Inicia sesión con tu nueva contraseña.
          </p>
        </div>
        <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-brand-500 hover:underline">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const visibilityToggle = (
    <button
      type="button"
      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      onClick={() => setShowPassword((visible) => !visible)}
      className="shrink-0 rounded-lg p-1 text-muted transition hover:bg-brand-50 hover:text-brand-700"
    >
      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
    </button>
  );

  return (
    <div className="stagger">
      <Badge>Nueva contraseña</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Elige una nueva contraseña.</h1>
      <p className="mt-2 text-[15px] text-muted">
        Usa al menos 8 caracteres, con una letra y un número.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <Input
          label="Nueva contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          endAdornment={visibilityToggle}
        />
        <Input
          label="Confirmar contraseña"
          name="confirm"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          autoComplete="new-password"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
        />
        {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </form>

      <Link
        to="/recuperar-contrasena"
        className="mt-6 inline-block text-sm font-semibold text-brand-500 hover:underline"
      >
        Solicitar un enlace nuevo
      </Link>
    </div>
  );
}
