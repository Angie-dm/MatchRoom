// La foto va en public/img/sala.jpg. Si no existe, se ve el degradado.
export default function RoomPhoto({ className = "", animated = false, children }) {
  return (
    <div className={`relative overflow-hidden bg-brand-100 ${className}`}>
      <div
        className={`absolute inset-0 bg-cover bg-center ${animated ? "animate-zoom" : ""}`}
        style={{
          backgroundImage: "url(/img/sala.jpg), linear-gradient(135deg, #ede9fe, #7c3aed)",
        }}
      />
      {children}
    </div>
  );
}