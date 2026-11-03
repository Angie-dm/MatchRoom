import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Input from "../components/ui/Input";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Escribe un correo válido.";
    if (!form.password) next.password = "Escribe tu contraseña.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await authService.login({ email: form.email, password: form.password });
    setLoading(false);
        navigate("/explorar");
  };

  const googleError = () => setErrors({ form: "No pudimos iniciar con Google. Intenta de nuevo." });

  const handleGoogle = async ({ credential }) => {
    try {
      await authService.loginWithGoogle(credential);
      navigate("/registro/1"); // TODO: ir al inicio de la app cuando exista
    } catch {
      googleError();
    }
  };

  return (
    <div className="stagger">
      <Badge>Tu espacio. Tu gente.</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Qué gusto encontrarte.</h1>
      <p className="mt-2 text-[15px] text-muted">Inicia sesión y encuentra un lugar donde sentirte en casa.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4 sm:mt-7">
        <Input label="Correo electrónico" name="email" type="email" icon={Mail} autoComplete="email"
          value={form.email} onChange={set("email")} error={errors.email} />
        <Input label="Contraseña" name="password" type="password" icon={Lock} autoComplete="current-password"
          value={form.password} onChange={set("password")} error={errors.password} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Checkbox checked={form.remember} onChange={set("remember")}>Recordarme</Checkbox>
          <a href="#" className="text-sm font-semibold text-brand-500 hover:underline">Olvidé mi contraseña</a>
        </div>
        <Button type="submit" icon={ArrowRight} disabled={loading}>Iniciar sesión</Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-brand-100" />o bien<span className="h-px flex-1 bg-brand-100" />
      </div>

      <GoogleButton onSuccess={handleGoogle} onError={googleError} />
      {errors.form && <p className="mt-2 text-center text-xs text-red-600">{errors.form}</p>}

      <p className="mt-6 text-center text-sm text-muted">
        ¿Primera vez aquí?{" "}
        <Link to="/registro" className="font-semibold text-brand-500 hover:underline">Crear cuenta</Link>
      </p>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <ShieldCheck size={14} className="shrink-0 text-brand-500" aria-hidden="true" />
        Tus datos son tuyos. Tú decides qué compartir.
      </p>
      <nav className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted">
        <a href="#">Privacidad</a>
        <a href="#">Términos de uso</a>
        <a href="#">¿Necesitas ayuda?</a>
      </nav>
    </div>
  );
}