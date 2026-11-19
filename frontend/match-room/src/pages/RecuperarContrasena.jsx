import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authService } from "../services/authService";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Escribe un correo válido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // The backend always answers 204 so the form never reveals whether the
      // email belongs to an account.
      await authService.forgotPassword(email);
      setSent(true);
    } catch (requestError) {
      setError(requestError.message || "No pudimos enviar el enlace.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="stagger">
        <Badge>Recuperar acceso</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Revisa tu correo.</h1>
        <p className="mt-3 text-[15px] text-muted">
          Si existe una cuenta con <strong className="text-ink">{email}</strong>, te enviamos un
          enlace para crear una nueva contraseña. Vence en una hora.
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-brand-500 hover:underline">
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="stagger">
      <Badge>Recuperar acceso</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">¿Olvidaste tu contraseña?</h1>
      <p className="mt-2 text-[15px] text-muted">
        Escribe el correo de tu cuenta y te enviaremos un enlace para restablecerla.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error}
        />
        <Button type="submit" icon={ArrowRight} disabled={loading}>
          {loading ? "Enviando…" : "Enviar enlace"}
        </Button>
      </form>

      <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-brand-500 hover:underline">
        Volver a iniciar sesión
      </Link>
    </div>
  );
}
