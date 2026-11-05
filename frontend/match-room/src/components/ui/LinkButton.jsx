import { Link } from "react-router-dom";

const variants = {
  primary:
    "text-white bg-[linear-gradient(90deg,var(--color-brand-500),var(--color-brand-700))] shadow-md shadow-brand-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/35",
  secondary:
    "bg-white text-brand-700 border border-line hover:-translate-y-0.5 hover:bg-brand-50 hover:border-brand-500/40",
};

export default function LinkButton({ to, variant = "primary", icon: Icon, className = "", children, ...props }) {
  return (
    <Link
      to={to}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-[15px] font-semibold transition duration-200 active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </Link>
  );
}