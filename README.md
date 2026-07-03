# Refugia

Refugia es una aplicacion web construida con Next.js para gestionar un espacio privado con autenticacion, dashboard, agentes y reuniones. El proyecto ya cuenta con una base funcional de UI, persistencia en PostgreSQL/Neon mediante Drizzle, llamadas tipadas con tRPC y flujos CRUD iniciales para los modulos principales.

## Estado actual

El repositorio incluye actualmente:

- App Router de Next.js con rutas separadas para autenticacion y dashboard.
- Autenticacion con `better-auth`.
- Registro e inicio de sesion con email y contrasena.
- Inicio de sesion social con Google y GitHub.
- Dashboard autenticado con sidebar, navbar, buscador/comando y menu de usuario.
- Proteccion de rutas del dashboard mediante sesion del lado servidor.
- Integracion de `tRPC v11` con `TanStack Query`.
- Prefetch, hidratacion, `Suspense` y `ErrorBoundary` en listados de agentes y reuniones.
- Base de datos PostgreSQL/Neon con Drizzle ORM.
- Schema de autenticacion, tabla `agents`, enum `meeting_status` y tabla `meetings`.
- Sistema de componentes UI basado en Radix UI, Tailwind CSS v4 y shadcn/ui.
- Filtros de URL con `nuqs`.
- Notificaciones con `sonner`.

## Funcionalidades

### Autenticacion

- Registro de usuarios.
- Inicio de sesion con email y contrasena.
- Login social con Google y GitHub.
- Handlers de Better Auth en `/api/auth/[...all]`.

### Agentes

- Listado de agentes del usuario autenticado.
- Busqueda por nombre.
- Paginacion.
- Vista de detalle en `/agents/[agentId]`.
- Creacion de agentes.
- Edicion de agentes.
- Eliminacion de agentes con confirmacion.
- Filtrado por usuario autenticado en los procedimientos del servidor.

### Reuniones

- Listado de reuniones del usuario autenticado.
- Busqueda por nombre.
- Filtro por estado.
- Filtro por agente.
- Paginacion.
- Creacion de reuniones desde dialog.
- Seleccion de agente con buscador.
- Opcion de crear un agente desde el formulario de reunion.
- Procedimientos de servidor para crear, actualizar, listar y obtener una reunion.

## Partes en progreso

- La ruta `/meetings/[meetingId]` existe, pero su pantalla todavia muestra un placeholder.
- El procedimiento `agents.getOne` devuelve `meetingCount` como valor fijo (`20`), no como conteo real.
- El contexto base de tRPC aun retorna `userId: "user_123"`, aunque los procedimientos protegidos usan `ctx.auth.user.id`.
- No hay procedimiento de eliminacion para reuniones.
- La vista home del dashboard sigue siendo una pantalla inicial sencilla.
- Los metadatos globales de Next siguen con los valores de `create-next-app`.
- Hay textos con problemas de codificacion en algunas vistas, especialmente acentos y signos de apertura.
- El script `npm run lint` usa `next lint`; en Next.js 15 puede requerir ajuste segun la configuracion final del proyecto.

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
- `nuqs`
- `Radix UI`
- `lucide-react`
- `react-icons`
- `sonner`
- `DiceBear`

## Estructura

```text
src/
  app/
    (auth)/                 # Layout y paginas de sign-in/sign-up
    (dashboard)/            # Layout autenticado, home, agentes y reuniones
    api/auth/[...all]/      # Handler de better-auth
    api/trpc/[trpc]/        # Endpoint HTTP de tRPC
    globals.css             # Estilos globales y tokens de Tailwind
    layout.tsx              # Layout raiz, NuqsAdapter, TRPC provider y toaster
  components/
    ui/                     # Componentes UI reutilizables
    data-pagination.tsx     # Paginacion reutilizable
    empy-state.tsx          # Estado vacio reutilizable
    error-state.tsx         # Estado de error reutilizable
    loading-state.tsx       # Estado de carga reutilizable
    responsive-dialog.tsx   # Dialog/drawer responsive
  db/
    index.ts                # Cliente Drizzle
    schema.ts               # Tablas de auth, agents y meetings
  hooks/
    use-confirm.tsx         # Confirmaciones reutilizables
    use-mobile.ts           # Deteccion responsive
  lib/
    auth.ts                 # Configuracion server de better-auth
    auth-client.ts          # Cliente de better-auth
    utils.ts                # Helpers compartidos
  modules/
    agents/                 # UI, filtros, schemas, tipos y procedimientos de agentes
    auth/                   # Vistas de login y registro
    dashboard/              # Sidebar, navbar, comando y user button
    home/                   # Vista inicial del dashboard
    meetings/               # UI, filtros, schemas, tipos y procedimientos de reuniones
  trpc/
    routers/_app.ts         # Router principal
    init.ts                 # Contexto, router y protectedProcedure
    client.tsx              # Provider cliente de tRPC + React Query
    server.tsx              # Helpers server para prefetch/hidratacion
```

## Rutas

- `/sign-in`: inicio de sesion.
- `/sign-up`: registro de usuario.
- `/`: home del dashboard. Redirige a `/sign-in` si no hay sesion.
- `/agents`: listado de agentes.
- `/agents/[agentId]`: detalle de agente.
- `/meetings`: listado de reuniones.
- `/meetings/[meetingId]`: ruta creada, pantalla pendiente.
- `/api/auth/[...all]`: endpoints de `better-auth`.
- `/api/trpc/[trpc]`: endpoint del router de tRPC.

Enlaces visibles pendientes o no documentados como pagina final:

- `/upgrade`

## Base de datos

El proyecto usa Drizzle con PostgreSQL. Las tablas y enums definidos hoy son:

- `user`
- `session`
- `account`
- `verification`
- `agents`
- `meeting_status`
- `meetings`

La tabla `agents` contiene:

- `id`
- `name`
- `userId`
- `instructions`
- `createdAt`
- `updatedAt`

La tabla `meetings` contiene:

- `id`
- `name`
- `userId`
- `agentId`
- `status`
- `startedAt`
- `endedAt`
- `transcriptUrl`
- `recording_url`
- `summary`
- `createdAt`
- `updatedAt`

Estados posibles de una reunion:

- `upcoming`
- `active`
- `completed`
- `cancelled`
- `processing`

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

Los listados de agentes y reuniones siguen el mismo patron:

1. La pagina del dashboard valida la sesion con Better Auth.
2. La pagina carga filtros desde la URL con `nuqs`.
3. Se crea un query client del lado servidor.
4. Se hace prefetch del procedimiento tRPC correspondiente.
5. `HydrationBoundary` envia el estado al cliente.
6. La vista cliente consume datos con `useSuspenseQuery`.
7. Las mutaciones invalidan queries para refrescar los listados.

## Procedimientos tRPC

Router `agents`:

- `agents.getMany`
- `agents.getOne`
- `agents.create`
- `agents.update`
- `agents.remove`

Router `meetings`:

- `meetings.getMany`
- `meetings.getOne`
- `meetings.create`
- `meetings.update`

Todos estos procedimientos usan `protectedProcedure`, que valida la sesion con Better Auth y filtra los datos por `ctx.auth.user.id` cuando corresponde.

## Pendientes recomendados

1. Implementar la pantalla real de `/meetings/[meetingId]`.
2. Calcular `meetingCount` real para cada agente.
3. Quitar o reemplazar el `userId` mock del contexto base de tRPC.
4. Agregar eliminacion de reuniones si el producto la necesita.
5. Ajustar los metadatos globales en `src/app/layout.tsx`.
6. Corregir textos con problemas de codificacion.
7. Revisar el script de lint para Next.js 15.
8. Revisar nombres de columnas en `meetings` antes de consolidar migraciones, especialmente `userId`, `agent_Id` y `recording_url`.
