import { initials } from "../utils/initials";

export default function Avatar({ name, size = "size-10", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-fuchsia-400 text-sm font-semibold text-white ${size} ${className}`}
    >
      {initials(name)}
    </span>
  );
}