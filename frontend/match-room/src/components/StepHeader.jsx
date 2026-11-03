export default function StepHeader({ title, subtitle }) {
  return (
    <header className="mt-7 mb-6">
      <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-2.5 text-[15px] text-muted">{subtitle}</p>
    </header>
  );
}