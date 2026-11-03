import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "./ui/Button";

export default function StepFooter({ onBack, nextLabel = "Continuar", loading = false }) {
  return (
    <div className="mt-6">
      {/* En móvil se apilan: el botón principal arriba */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button variant="secondary" icon={ArrowLeft} onClick={onBack}>
          Regresar
        </Button>
        <Button type="submit" icon={ArrowRight} className="sm:flex-1" disabled={loading}>
          {nextLabel}
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Tu progreso se guarda automáticamente.</p>
    </div>
  );
}