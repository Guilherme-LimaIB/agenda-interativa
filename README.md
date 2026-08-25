# 📅 FlowDaily

Agenda de eventos para uso pessoal (e do casal 💜), com calendário, autenticação e sincronização em tempo real.

Baseado na arquitetura em `ARQUITETURA_AGENDA_INTERATIVA.md`.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Estado**: TanStack Query + Zustand
- **Calendário**: react-big-calendar
- **Backend**: Supabase (PostgreSQL + Auth + REST)

## Rodando localmente

```bash
npm install
npm run dev
```

Crie um `.env.local` (veja `.env.example`) com as credenciais do seu projeto Supabase:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Estrutura

```
src/
├── components/   # Calendario, ModalEvento, FormEvento, ListaEventos, NavBar, Logo
├── pages/        # Landing, Login, Signup, Dashboard, Compartilhada
├── services/     # supabaseClient, eventoService, authService, categoriaService, lembreteService, parceriaService, perfilService
├── hooks/        # useEventos, useAuth, useModalEvento, useCategorias, useLembretes, useParcerias, useRealtimeEventos
└── utils/        # recorrencia (expansão de eventos recorrentes)
```

## Rotas

- `/` — Landing page (pública)
- `/login`, `/signup` — Autenticação (públicas)
- `/app` — Minha Agenda (protegida)
- `/app/compartilhada` — Agenda Compartilhada (protegida)

## Banco de dados

Tabelas `eventos`, `categorias`, `lembretes`, `parcerias`, `perfis` e `config_privada`, com Row Level Security (cada usuário só vê os próprios dados, ou os do parceiro em parceria ativa).

## Roadmap

- [x] Setup do projeto + Supabase + schema com RLS
- [x] Autenticação (login/signup)
- [x] CRUD de eventos no calendário
- [x] Agenda compartilhada (convite por código, tempo real, desconectar)
- [x] Lembretes por email (Resend + pg_cron + pg_net)
- [x] Filtro por categoria/cor, busca por título
- [x] Eventos recorrentes (diária/semanal/mensal/anual)
- [x] Identidade visual (dark glassmorphism) + landing page
- [ ] Deploy (Vercel)
