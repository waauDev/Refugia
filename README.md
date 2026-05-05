# Refugia

Refugia es una plataforma enfocada en crear espacios privados y tranquilos para conversar, organizar ideas y, a futuro, sostener encuentros asistidos por IA. El proyecto esta construido con Next.js y ya cuenta con una base funcional de autenticacion, dashboard protegido, capa de datos y consumo inicial de tRPC.

## Estado actual del proyecto

Hoy el repositorio ya incluye:

- App Router con separacion entre flujo publico y flujo autenticado.
- Autenticacion con `better-auth`.
- Inicio de sesion y registro por email/contrasena.
- Inicio de sesion social con Google y GitHub.
- Dashboard protegido por sesion.
- Sidebar, navbar y menu de usuario para la experiencia autenticada.
- Integracion inicial de `tRPC` con `TanStack Query`.
- Configuracion de base de datos con `Drizzle ORM` y Neon/PostgreSQL.
- Libreria amplia de componentes UI basada en Radix + Tailwind CSS v4.

Tambien hay piezas que todavia se ven en etapa temprana o base:

- El `router` de tRPC solo expone un procedimiento de ejemplo (`hello`).
- La vista principal autenticada hoy muestra una prueba simple del consumo de tRPC.
- Existen accesos del sidebar como `/meetings`, `/agents` y `/upgrade`, pero esas secciones aun no aparecen implementadas en este repo.
- Los metadatos globales de Next siguen con valores genericos en `src/app/layout.tsx`.

## Stack

- `Next.js 15` + `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `better-auth`
- `tRPC v11`
- `@tanstack/react-query`
- `Drizzle ORM`
- `Neon / PostgreSQL`
- `react-hook-form` + `zod`
- Componentes UI con `Radix UI`

## Estructura principal

```text
src/
  app/
    (auth)/           # Rutas publicas: sign-in y sign-up
    (dashboard)/      # Layout protegido y home autenticado
    api/auth/         # Handler de better-auth
    api/trpc/         # Endpoint de tRPC
  components/ui/      # Sistema de componentes reutilizables
  db/                 # Cliente y schema de Drizzle
  lib/                # Auth server/client y utilidades
  modules/
    auth/             # Vistas de autenticacion
    dashboard/        # Navbar, sidebar y user menu
    home/             # Vista principal autenticada
  trpc/               # Init, cliente, servidor y router
```

## Rutas actuales

- `/sign-in`: inicio de sesion.
- `/sign-up`: registro de usuario.
- `/`: home autenticado. Si no hay sesion, redirige a `/sign-in`.
- `/api/auth/[...all]`: endpoints de autenticacion.
- `/api/trpc/[trpc]`: endpoint del router de tRPC.

## Variables de entorno

Crea un archivo `.env` con al menos estas variables:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Notas:

- `DATABASE_URL` es obligatoria para la conexion con Drizzle/Neon.
- `BETTER_AUTH_SECRET` es obligatoria para `better-auth`.
- `NEXT_PUBLIC_APP_URL` tambien es necesaria porque el cliente tRPC la usa en entorno servidor.
- Si no vas a usar login social, las credenciales de Google y GitHub pueden dejarse pendientes, pero el flujo social no funcionara.

## Instalacion y desarrollo

```bash
npm install
npm run dev
```

La app quedara disponible en:

```text
http://localhost:3000
```

## Base de datos

El proyecto ya tiene configuracion de Drizzle y schema para autenticacion:

- `user`
- `session`
- `account`
- `verification`

Comandos disponibles:

```bash
npm run db:push
npm run db:studio
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:push
npm run db:studio
```

## Revision rapida del estado actual

Durante la revision de este repo se confirmo lo siguiente:

- El flujo de autenticacion esta conectado tanto del lado cliente como del lado servidor.
- El dashboard principal ya protege la ruta `/` con validacion de sesion.
- El `README` anterior seguia siendo casi el de `create-next-app`, asi que no representaba el proyecto real.
- `npm run lint` paso correctamente.
- Hay una advertencia de ESLint indicando que no se detecto el plugin de Next en la configuracion actual.
- Se observan varios textos con problemas de codificacion en algunos archivos (`Contrasena`, `Sesion`, etc.), algo que convendria corregir pronto.

## Proximos pasos recomendados

1. Actualizar `metadata` en `src/app/layout.tsx` para reflejar la marca Refugia.
2. Corregir los problemas de codificacion en las vistas de autenticacion y dashboard.
3. Reemplazar el contexto mock de tRPC (`userId: 'user_123'`) por contexto real de sesion.
4. Implementar las rutas enlazadas desde el sidebar o esconderlas hasta que existan.
5. Expandir el router de tRPC con casos reales del dominio de Refugia.
