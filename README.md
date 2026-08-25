# 📅 Agenda Interativa

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
├── components/   # Calendario, ModalEvento, FormEvento, ListaEventos, NavBar
├── pages/        # Dashboard, Login, Signup
├── services/     # supabaseClient, eventoService, authService
├── hooks/        # useEventos, useAuth, useModalEvento
├── store/        # eventoStore (Zustand)
└── context/      # AuthContext
```

## Banco de dados

Tabelas `eventos`, `categorias` e `lembretes`, com Row Level Security (cada usuário só vê os próprios dados).

## Roadmap

- [x] Setup do projeto + Supabase + schema com RLS
- [x] Autenticação (login/signup)
- [x] CRUD de eventos no calendário
- [ ] Filtro por categoria/cor, busca por título
- [ ] Lembretes por email
- [ ] Compartilhar agenda entre os dois usuários
- [ ] Deploy (Vercel)
