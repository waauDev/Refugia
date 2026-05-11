# Refugia

Refugia es una aplicacion web construida con Next.js para crear un espacio privado de trabajo y conversacion asistido por IA. El proyecto ya tiene una base funcional de autenticacion, dashboard protegido, capa de datos con PostgreSQL y un primer modulo de agentes conectado por tRPC.

## Estado actual

El repositorio incluye actualmente:

- App Router de Next.js con rutas separadas para autenticacion y dashboard.
- Autenticacion con `better-auth`.
- Registro e inicio de sesion con email y contrasena.
- Inicio de sesion social con Google y GitHub.
- Layout autenticado con sidebar, navbar, buscador/comando y menu de usuario.
- Proteccion de la ruta `/` mediante sesion del lado servidor.
- Integracion de `tRPC v11` con `TanStack Query`.
- Prefetch, hidratacion, `Suspense` y `ErrorBoundary` en la pantalla de agentes.
- Base de datos PostgreSQL/Neon con Drizzle ORM.
- Schema de autenticacion y tabla `agents`.
- Sistema de componentes UI basado en Radix UI, Tailwind CSS v4 y shadcn/ui.

Tambien hay partes que siguen en etapa inicial:

- La vista principal autenticada (`/`) solo muestra contenido placeholder.
- La ruta `/agents` consulta agentes desde la base de datos, pero por ahora los muestra como JSON.
- El procedimiento `agents.getMany` incluye un delay artificial de 5 segundos.
- El contexto de tRPC todavia usa un `userId` mock (`user_123`) y no la sesion real.
- El sidebar enlaza a `/meetings` y `/upgrade`, pero esas rutas aun no existen.
- Los metadatos globales de Next siguen con los valores por defecto de `create-next-app`.
- Hay textos con problemas de codificacion en algunas vistas, especialmente en palabras acentuadas y signos de apertura.

## Stack

- `Next.js 15.3`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `better-auth`
- `tRPC v11`
- `@tanstack/react-query`
- `Drizzle ORM`
- `Neon / PostgreSQL`
- `react-hook-form`
- `zod`
- `Radix UI`
- `lucide-react`
- `react-icons`
- `sonner`

## Estructura

```text
src/
  app/
    (auth)/                 # Layout y paginas de sign-in/sign-up
    (dashboard)/            # Layout autenticado, home y agentes
    api/auth/[...all]/      # Handler de better-auth
    api/trpc/[trpc]/        # Endpoint HTTP de tRPC
    globals.css             # Estilos globales y tokens de Tailwind
    layout.tsx              # Layout raiz y provider de tRPC
  components/
    ui/                     # Componentes UI reutilizables
    error-state.tsx         # Estado de error reutilizable
    loading-state.tsx       # Estado de carga reutilizable
    responsive-dialog.tsx   # Dialog/drawer responsive
  db/
    index.ts                # Cliente Drizzle
    schema.ts               # Tablas de auth y agents
  lib/
    auth.ts                 # Configuracion server de better-auth
    auth-client.ts          # Cliente de better-auth
    utils.ts                # Helpers compartidos
  modules/
    agents/                 # Procedimientos y vista de agentes
    auth/                   # Vistas de login y registro
    dashboard/              # Sidebar, navbar, comando y user button
    home/                   # Vista inicial del dashboard
  trpc/
    routers/_app.ts         # Router principal
    init.ts                 # Contexto y helpers de tRPC
    client.tsx              # Provider cliente de tRPC + React Query
    server.tsx              # Helpers server para prefetch/hidratacion
```

## Rutas

- `/sign-in`: inicio de sesion.
- `/sign-up`: registro de usuario.
- `/`: home del dashboard. Redirige a `/sign-in` si no hay sesion.
- `/agents`: listado inicial de agentes via tRPC.
- `/api/auth/[...all]`: endpoints de `better-auth`.
- `/api/trpc/[trpc]`: endpoint del router de tRPC.

Enlaces visibles pero pendientes de implementar:

- `/meetings`
- `/upgrade`

## Base de datos

El proyecto usa Drizzle con PostgreSQL. Las tablas definidas hoy son:

- `user`
- `session`
- `account`
- `verification`
- `agents`

La tabla `agents` contiene:

- `id`
- `name`
- `userId`
- `instructions`
- `createdAt`
- `updatedAt`

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

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

- `DATABASE_URL` es necesaria para Drizzle y Neon/PostgreSQL.
- `BETTER_AUTH_SECRET` es necesaria para firmar la autenticacion.
- `NEXT_PUBLIC_APP_URL` es usada por Better Auth y por el cliente tRPC en entorno servidor.
- Las credenciales de Google y GitHub son necesarias para que funcione el login social.

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La app queda disponible en:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de produccion
npm run start     # Servidor de produccion
npm run lint      # Lint configurado en package.json
npm run db:push   # Sincroniza el schema con la base de datos
npm run db:studio # Abre Drizzle Studio
```

## Flujo de datos actual

La ruta `/agents` usa el router `agents` de tRPC:

1. `src/app/(dashboard)/agents/page.tsx` crea un query client y hace prefetch de `agents.getMany`.
2. `src/trpc/server.tsx` expone helpers para prefetch e hidratacion.
3. `src/modules/agents/server/procedures.ts` consulta la tabla `agents` con Drizzle.
4. `src/modules/agents/ui/views/agents-view.tsx` consume la query con `useSuspenseQuery`.

## Pendientes recomendados

1. Conectar el contexto de tRPC con la sesion real de Better Auth.
2. Filtrar `agents.getMany` por usuario autenticado.
3. Reemplazar el JSON de `/agents` por una interfaz de listado.
4. Crear formularios para agregar, editar y eliminar agentes.
5. Quitar el delay artificial de `agents.getMany`.
6. Implementar o esconder los enlaces a `/meetings` y `/upgrade`.
7. Actualizar `metadata` en `src/app/layout.tsx`.
8. Corregir los textos con problemas de codificacion.
9. Revisar el script `npm run lint`, porque en Next.js 15 el comando `next lint` puede requerir ajuste segun la configuracion del proyecto.
