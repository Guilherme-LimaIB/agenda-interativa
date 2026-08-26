# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FlowDaily ("Agenda Interativa") — a personal/couple's event calendar with authentication and real-time sync. Portuguese is the working language throughout: UI copy, variable/function names (`evento`, `usuario`, `parceria`), git commit messages, and DB columns are all in Portuguese. Match this convention in new code.

## Commands

```bash
npm run dev       # start Vite dev server (port 5173)
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # oxlint
```

There is no test suite/framework configured in this repo.

## Stack

- React 19 + Vite, Tailwind CSS v4 (via `@tailwindcss/vite`, no separate config file)
- Routing: `react-router-dom`
- Server state: TanStack Query (`@tanstack/react-query`)
- Client/UI state: Zustand (`src/store/eventoStore.js`)
- Backend: Supabase (Postgres + Auth + REST + Realtime + RPC), accessed directly from the frontend via `@supabase/supabase-js` — there is no custom backend server
- `date-fns` for date arithmetic; `react-big-calendar` for the calendar grid; `@dnd-kit/core` for drag-and-drop

## Architecture

**Layering**: `pages/` (routed screens) → `hooks/` (TanStack Query wrappers, one hook family per domain) → `services/` (thin Supabase query functions, no React) → `services/supabaseClient.js` (single shared client). Components under `components/<Nome>/` are presentation, driven by props/hooks from a page.

**Auth**: `context/AuthContext.jsx` wraps the app and exposes `{ user, loading }` via `hooks/useAuth.js`, backed by `supabase.auth`. `App.jsx` gates routes with `RotaProtegida`/`RotaPublica` wrappers rather than a router-level loader.

**Routes**: `/` (Landing), `/login`, `/signup` are public. Protected: `/app` → `pages/Hoje.jsx` (dashboard, the post-login landing screen — composes Foco do Dia, Agenda de Hoje, Tarefas, Captura Rápida, Progresso), `/app/calendario` → `pages/MinhaAgenda.jsx` (the full calendar view, formerly mounted at `/app` itself — moved during the 2026 redesign), `/app/compartilhada` → `Compartilhada`, `/app/tarefas` → `Tarefas`. Don't assume `/app` is the calendar; grep before changing routing.

**Design system**: `src/index.css` defines all tokens via a Tailwind v4 `@theme` block — colors (`--color-paper/surface/ink/dark/muted/line/signal/signal-soft`), radius (`--radius-xs..3xl`, capped small on purpose), and fonts (`--font-display` = Archivo Narrow, `--font-sans` = Source Sans 3, `--font-mono` = IBM Plex Mono). Spacing uses Tailwind's default scale unchanged (it already matches the intended 4px steps). Typography beyond plain Tailwind utilities uses the `.fd-display-xl/.fd-display/.fd-heading-lg/.fd-heading/.fd-body/.fd-ui/.fd-meta` classes defined in the same file. Shared primitives live in `src/components/ui/` (`Button`, `Input`/`SearchInput`, `Badge`, `Divider`, `EmptyState`, `LoadingState`, `ErrorState`, `NavigationItem`) — prefer these over ad-hoc Tailwind classes when adding UI. The visual language is editorial/minimal (papel/preto/vermelho pontual): no gradients, no glassmorphism, no pill-shaped nav, radius kept small. `react-big-calendar`'s look is themed via `.rbc-*` overrides at the bottom of `index.css`.

**Data access pattern**: every domain (`evento`, `categoria`, `lembrete`, `parceria`, `perfil`, `tarefa`, `push`) has a matching `xService.js` (raw Supabase calls, throws on `error`) and `useX.js` hook (wraps the service in `useQuery`/`useMutation` and owns cache invalidation via `queryClient.invalidateQueries`). When adding a new data type, follow this same service+hook split rather than calling Supabase directly from components.

**Realtime**: `hooks/useRealtimeEventos.js` subscribes to Postgres changes on the `eventos` table and invalidates the `eventos` and `eventos-compartilhados` query keys — this is how the shared/partner calendar (`parcerias`) stays in sync across users without polling.

**Database (managed in Supabase directly, not migrated from this repo)**: tables `eventos`, `categorias`, `lembretes`, `parcerias`, `perfis`, `config_privada`, `push_subscriptions`, plus a `tarefas` table for the Eisenhower/Kanban view. Row Level Security scopes every table to `auth.uid()`, with `parcerias` granting visibility into a partner's data once a partnership is active. Partnership accept/end logic runs server-side via Postgres RPCs (`aceitar_convite`, `encerrar_parceria`) rather than plain table writes — see `services/parceriaService.js`. Email reminders are sent by Supabase `pg_cron`/`pg_net` + Resend, not from the frontend. There's no local schema file; check the Supabase project directly for current table/column definitions before assuming the shape described in `ARQUITETURA_AGENDA_INTERATIVA.md` (an early design doc — treat it as historical context, not a source of truth for the current schema).

**Recurring events**: stored as a single row (`recorrencia`: `diaria`/`semanal`/`mensal`/`anual`, optional `recorrencia_ate`) and expanded client-side into individual occurrences by `utils/recorrencia.js` (`expandirOcorrencias`), which synthesizes per-occurrence IDs as `${id}__${index}`. Any code that edits/deletes "an event" needs to decide whether it's operating on the base row or a synthesized occurrence.

**Natural-language event creation**: `utils/linguagemNatural.js` (`interpretarTexto`) parses free-form Portuguese text into `{ titulo, data_inicio, data_fim }` using regex, not an LLM. It's deliberately conservative — it returns `null` fields rather than guessing when a date/time expression isn't recognized (e.g. "ontem" is explicitly unsupported since this app doesn't handle past-dated interpretation). When extending recognized patterns, mirror this "don't guess" behavior and update `PADROES_REMOVER_DO_TITULO` so the matched fragment is stripped from the derived title.

**Web push**: `services/pushService.js` registers `public/sw.js` as a service worker and stores subscriptions in `push_subscriptions`; requires `VITE_VAPID_PUBLIC_KEY`.

**Env vars** (`.env.local`, see `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_VAPID_PUBLIC_KEY`.

**Deploy**: Vercel, SPA rewrite configured in `vercel.json` (all routes → `index.html`).
