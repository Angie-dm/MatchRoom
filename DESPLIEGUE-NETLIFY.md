# Cómo publicar MatchRoom (solo frontend) en Netlify

Esta guía deja la aplicación en la nube para obtener una URL pública y ver la
pantalla de login. Todavía no conecta la autenticación real: eso depende del
backend (ver la sección final).

## Lo que ya quedó preparado en el repositorio

- `netlify.toml` (raíz del repositorio): define la carpeta base
  `frontend/match-room`, el comando `npm run build`, la carpeta publicada `dist`,
  Node 22 y la reescritura SPA (`/* -> /index.html`) para que rutas como
  `/explorar` o `/perfil` no devuelvan 404 al recargar.
- `frontend/match-room/.env.example`: documenta `VITE_API_URL` y
  `VITE_GOOGLE_CLIENT_ID`.
- `frontend/match-room/package.json` y `package-lock.json`: declaran
  `@capacitor/core`, que el código ya importaba y faltaba en el commit. Sin eso
  el build en Netlify falla.
- `frontend/match-room/.gitignore`: ignora `.env` y `.env.*` para no subir
  credenciales.

## Paso 1. Crear el fork

1. Entra a https://github.com/Angie-dm/MatchRoom
2. Pulsa **Fork** y crea el fork en tu cuenta.
3. Asegúrate de que el fork incluya la rama `feature/test`, que es donde están
   los cambios de despliegue.

## Paso 2. Subir la rama

Desde `C:\matchroom\MatchRoom` (raíz del repositorio del frontend):

```bash
git remote add fork https://github.com/<tu-usuario>/MatchRoom.git
git push fork feature/test
```

Si prefieres no usar la terminal, también puedes subir los archivos desde la
interfaz web de GitHub sobre la rama `feature/test`.

> Importante: la rama por defecto del fork suele ser `main`. En Netlify hay que
> elegir `feature/test` como rama a desplegar, o hacer merge de `feature/test`
> hacia `main` en el fork.

## Paso 3. Conectar Netlify

1. Entra a https://app.netlify.com y elige **Add new site > Import an existing
   project**.
2. Conecta tu cuenta de GitHub y selecciona el fork.
3. Revisa la configuración detectada:
   - Branch to deploy: `feature/test`
   - Build command: `npm run build` (ya viene de `netlify.toml`)
   - Publish directory: `dist` (ya viene de `netlify.toml`)
   - Base directory: `frontend/match-room` (ya viene de `netlify.toml`)
4. Pulsa **Deploy site**.

No hace falta configurar nada más para obtener la URL. Netlify asigna un
subdominio tipo `https://nombre-aleatorio.netlify.app`, que puedes cambiar en
**Site configuration > Domain management**.

## Paso 4. Variables de entorno (opcional en esta etapa)

Sin variables, la aplicación se publica y muestra el login, pero las llamadas a
la API apuntan a `http://localhost:3000/api/v1` y fallan, y el botón de Google no
funciona porque no tiene Client ID.

Cuando exista un backend publicado, en **Site configuration > Environment
variables** agrega:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | URL del backend con el prefijo, por ejemplo `https://<backend>/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google Cloud Console |

Después de agregarlas hay que volver a desplegar (**Deploys > Trigger deploy >
Clear cache and deploy site**) porque Vite inserta las variables en tiempo de
build.

## Paso 5. Verificar

- La URL abre y redirige a `/login`.
- `/explorar` escrito directamente en el navegador carga la aplicación (no 404).
- En DevTools > Application se ven el manifiesto y el Service Worker.
- La PWA se puede instalar desde el icono de la barra de direcciones.

## Qué funciona y qué no en esta etapa

Funciona:

- Carga de la interfaz y navegación entre pantallas.
- Instalación de la PWA, manifiesto, Service Worker y precache.
- Carga sin conexión del shell y de las rutas públicas.

No funciona todavía:

- Inicio de sesión y registro: el backend de la rama `feature/test` no tiene
  endpoints `/auth` y la base de datos no tiene usuarios.
- Onboarding con datos reales y Mi Perfil: requieren API.
- Explorar, Alojamientos, Matches y Mensajes: usan datos simulados.

## Siguiente fase (backend)

Para que el login funcione de verdad hace falta:

1. Integrar `origin/develop` en la rama `feature/test` del backend (allí está el
   módulo `/auth`).
2. Declarar e instalar `bcryptjs` y `google-auth-library`, que el código importa
   pero no están en `package.json`.
3. Ejecutar migraciones y seeds para tener catálogo y usuarios.
4. Publicar el backend con HTTPS y configurar `VITE_API_URL` en Netlify.
5. Resolver el envío de la cookie de sesión (proxy `/api` en Netlify o cookie
   `SameSite=None; Secure`).

Ninguno de estos pasos se aplicó todavía.
