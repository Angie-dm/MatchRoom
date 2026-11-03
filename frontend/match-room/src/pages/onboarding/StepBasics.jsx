import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFooter from "../../components/StepFooter";
import StepHeader from "../../components/StepHeader";
import Checkbox from "../../components/ui/Checkbox";
import Input from "../../components/ui/Input";
import { useOnboarding } from "../../hooks/useOnboarding";

export default function StepBasics() {
  const navigate = useNavigate();
  const { data, update } = useOnboarding();
  const [errors, setErrors] = useState({});
  const esGoogle = data.proveedor === "google";
  const bind = (field) => ({ value: data[field], onChange: (e) => update({ [field]: e.target.value }) });

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!data.nombre.trim()) next.nombre = "Escribe tu nombre completo.";
    if (!(Number(data.edad) >= 18)) next.edad = "Debes tener al menos 18 años.";
    if (!data.ocupacion.trim()) next.ocupacion = "Cuéntanos a qué te dedicas.";
    if (!/^\S+@\S+\.\S+$/.test(data.correo)) next.correo = "Escribe un correo válido.";
    if (!esGoogle && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(data.password))
      next.password = "Mínimo 8 caracteres, una letra y un número.";
    if (!data.terminos) next.terminos = "Debes aceptar los términos para continuar.";
    setErrors(next);
    if (!Object.keys(next).length) navigate("/registro/2");
  };

  return (
       <div className="stagger flex flex-col gap-4">
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader title="Empecemos por conocerte." subtitle="Cuéntanos un poco de ti. Lo demás lo construimos juntos." />
      <div className="flex flex-col gap-4">
        <Input label="Nombre completo" name="nombre" autoComplete="name" error={errors.nombre} {...bind("nombre")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Edad" name="edad" type="number" min="18" max="99" error={errors.edad} {...bind("edad")} />
          <Input label="Ocupación" name="ocupacion" error={errors.ocupacion} {...bind("ocupacion")} />
        </div>
        <Input label="Correo electrónico" name="correo" type="email" icon={Mail} autoComplete="email"
          readOnly={esGoogle} error={errors.correo} {...bind("correo")} />
        {!esGoogle && (
          <Input label="Crea una contraseña" name="password" type="password" icon={Lock} autoComplete="new-password"
            hint="Al menos 8 caracteres, una letra y un número." error={errors.password} {...bind("password")} />
        )}
        <Checkbox checked={data.terminos} onChange={(e) => update({ terminos: e.target.checked })} error={errors.terminos}>
          Acepto los términos de uso y el aviso de privacidad. Tengo al menos 18 años.
        </Checkbox>
      </div>
      <StepFooter onBack={() => navigate("/login")} />
    </form>
    </div>
  );
}