import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";

// El botón de Google solo acepta ancho en píxeles, así que se mide el contenedor.
export default function GoogleButton({ onSuccess, onError }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setWidth(Math.min(400, Math.max(200, Math.floor(el.clientWidth))));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex w-full justify-center">
      {width > 0 && (
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          text="continue_with"
          shape="rectangular"
          width={String(width)}
          locale="es"
        />
      )}
    </div>
  );
}