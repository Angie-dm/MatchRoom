import { CheckCircle2, MailWarning } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function VerificarCorreo() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";
  const { user, isDemo } = useAuth();
  const [status, setStatus] = useState(token ? "loading" : "missing");
  const [error, setError] = useState("");
  const [resend, setResend] = useState({ sending: false, message: "", error: "" });
  // React StrictMode mounts effects twice in development. The token is
  // single-use, so the second call would always fail and hide the success.
  const attemptedToken = useRef("");

  useEffect(() => {
    if (!token || attemptedToken.current === token) return;
    attemptedToken.current = token;
    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((requestError) => {
        setStatus("error");
        setError(requestError.message || "El enlace no es válido o ya venció.");
      });
  }, [token]);

  const resendEmail = async () => {
    setResend({ sending: true, message: "", error: "" });
    try {
      await authService.resendVerification();
      setResend({
        sending: false,
        message: "Te enviamos un nuevo enlace. Revisa tu bandeja y la carpeta de spam.",
        error: "",
      });
    } catch (requestError) {
      setResend({
        sending: false,
        message: "",
        error: requestError.message || "No pudimos reenviar el correo.",
      });
    }
  };

  return (
    <div className="stagger">
      <Badge>Tu cuenta</Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Verificación de correo</h1>

      {status === "loading" && (
        <p className="mt-3 text-[15px] text-muted">Estamos confirmando tu correo…</p>
      )}

      {status === "success" && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-emerald-900">Tu correo quedó verificado.</p>
              <p className="mt-1 text-sm text-emerald-800">
                Ya puedes iniciar sesión y continuar con tu perfil.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="text-sm font-semibold text-brand-500 hover:underline"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      )}

      {status === "missing" && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <MailWarning size={22} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm text-amber-900">
              El enlace no incluye un token de verificación. Abre el enlace completo que
              recibiste por correo.
            </p>
          </div>
          <Link
            to="/login"
            className="text-sm font-semibold text-brand-500 hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <MailWarning size={22} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-red-900">No pudimos verificar tu correo.</p>
              <p className="mt-1 text-sm text-red-800">{error}</p>
            </div>
          </div>

          {user && !user.emailVerified && !isDemo && (
            <Button variant="secondary" onClick={resendEmail} disabled={resend.sending}>
              {resend.sending ? "Enviando…" : "Enviar un enlace nuevo"}
            </Button>
          )}
          {resend.message && <p className="text-xs text-emerald-700">{resend.message}</p>}
          {resend.error && <p className="text-xs text-red-600">{resend.error}</p>}

          <Link
            to="/login"
            className="text-sm font-semibold text-brand-500 hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      )}
    </div>
  );
}
