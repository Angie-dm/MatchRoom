import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt", // avisa antes de actualizar
      includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "logo.svg"],
      manifest: {
        id: "/",
        name: "Match Room",
        short_name: "Match Room",
        description: "Encuentra tu próximo hogar y a la persona ideal para compartirlo.",
        lang: "es",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#7c3aed",
        background_color: "#faf9ff",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
          { name: "Explorar", url: "/explorar" },
          { name: "Mensajes", url: "/mensajes" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,woff,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html", // las rutas de React abren sin conexión
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        // A propósito NO se cachean respuestas de la API: son datos autenticados.
      },
    }),
  ],
  resolve: { dedupe: ["react", "react-dom"] },
});