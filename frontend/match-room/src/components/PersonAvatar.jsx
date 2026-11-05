import { initials } from "../utils/initials";

export default function PersonAvatar({ perfil, size = "size-12", className = "" }) {
  const { nombre, foto, tono } = perfil;
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br text-sm font-semibold text-white ${tono} ${size} ${className}`}
      style={foto ? { backgroundImage: `url(${foto})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {!foto && initials(nombre)}
    </span>
  );
}