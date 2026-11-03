export default function Backdrop({ children }) {
  return (
    <div className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#ede9fe_0%,#e0e7ff_45%,#fce7f3_100%)] px-3 py-4 sm:px-4 sm:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Manchas de color que se mueven */}
        <span className="absolute -top-24 -left-24 size-72 animate-float-a rounded-full bg-violet-400/50 blur-2xl sm:-top-32 sm:-left-32 sm:size-[34rem] sm:blur-3xl" />
        <span className="absolute top-1/4 -right-28 size-80 animate-float-b rounded-full bg-indigo-300/60 blur-2xl sm:-right-40 sm:size-[38rem] sm:blur-3xl" />
        <span className="absolute -bottom-28 left-1/4 size-72 animate-float-c rounded-full bg-pink-300/50 blur-2xl sm:-bottom-40 sm:left-1/3 sm:size-[34rem] sm:blur-3xl" />

        {/* Formas flotantes (las grandes solo en pantallas medianas hacia arriba) */}
        <span className="absolute top-[12%] right-[14%] hidden size-24 animate-bob rounded-full border-[10px] border-white/70 sm:block" />
        <span className="absolute bottom-[14%] left-[8%] hidden size-20 animate-spin-slow rounded-2xl border-4 border-brand-500/40 sm:block" />
        <span className="absolute top-[18%] left-[10%] size-20 animate-bob opacity-50 [animation-delay:-2s] [background-image:radial-gradient(#7c3aed_2px,transparent_2px)] [background-size:14px_14px] sm:size-28" />
        <span className="absolute right-[10%] bottom-[20%] size-6 animate-bob rounded-full bg-brand-500/60 [animation-delay:-3s] sm:size-8" />
      </div>
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </div>
  );
}