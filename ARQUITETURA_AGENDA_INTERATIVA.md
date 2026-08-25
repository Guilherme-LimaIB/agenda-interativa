# 📅 Arquitetura - Agenda Interativa

**Versão**: 1.0  
**Data**: 2026  
**Stack**: React + Vercel + Supabase  
**Status**: Pronto para desenvolvimento

---

## 1. Visão Geral

Sistema de agenda interativa que permite usuários criar, editar, visualizar e deletar eventos. Funciona como um calendário com suporte a múltiplos usuários, sincronização em tempo real e interface responsiva.

```
┌─────────────────────────────────────────────────────────────┐
│                      USUÁRIO (Browser)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
    ┌─────────────┐            ┌──────────────────┐
    │   Vercel    │            │   Supabase       │
    │  (Frontend) │◄──────────►│  (Backend+DB)    │
    │   React     │   HTTPS    │  PostgreSQL      │
    └─────────────┘            └──────────────────┘
         │                              │
         │ GET/POST/PUT/DELETE          │ Auth + CRUD
         └──────────────────────────────┘
```

---

## 2. Stack Tecnológico

### Frontend
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query) + Zustand
- **Calendário**: `react-big-calendar` ou `fullcalendar`
- **HTTP Client**: Axios
- **Deploy**: Vercel (GitHub integration)
- **Hospedagem**: Grátis até 100K requests/mês

### Backend
- **Plataforma**: Supabase (PostgreSQL + REST API)
- **Autenticação**: Supabase Auth (email/senha)
- **API**: REST auto-gerada pelo Supabase
- **Custo**: Grátis (500MB DB, 2GB bandwidth/mês)

### Banco de Dados
- **SGBD**: PostgreSQL (Supabase hosted)
- **Acesso**: Supabase Client SDK
- **Backup**: Automático

---

## 3. Arquitetura de Banco de Dados

```sql
-- Tabela de Usuários (gerenciada pelo Supabase Auth)
-- Automaticamente criada pelo Supabase

-- Tabela de Eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  local VARCHAR(255),
  cor VARCHAR(7) DEFAULT '#3B82F6',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_eventos_usuario_id ON eventos(usuario_id);
CREATE INDEX idx_eventos_data_inicio ON eventos(data_inicio);

-- Tabela de Categorias (opcional, para organizar eventos)
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  cor VARCHAR(7),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Lembretes (opcional)
CREATE TABLE lembretes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  tipo VARCHAR(50), -- 'email', 'notificacao'
  tempo_antes_minutos INTEGER, -- ex: 15, 30, 60
  enviado BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Estrutura de Diretórios (Frontend)

```
agenda-interativa/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Calendario/
│   │   │   ├── Calendario.jsx
│   │   │   └── Calendario.module.css
│   │   ├── ModalEvento/
│   │   │   ├── ModalEvento.jsx
│   │   │   └── ModalEvento.module.css
│   │   ├── ListaEventos/
│   │   │   ├── ListaEventos.jsx
│   │   │   └── ListaEventos.module.css
│   │   ├── NavBar/
│   │   │   └── NavBar.jsx
│   │   └── FormEvento/
│   │       ├── FormEvento.jsx
│   │       └── FormEvento.module.css
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── services/
│   │   ├── supabaseClient.js (configuração Supabase)
│   │   ├── eventoService.js (CRUD de eventos)
│   │   └── authService.js (autenticação)
│   ├── hooks/
│   │   ├── useEventos.js (fetch com React Query)
│   │   ├── useAuth.js (contexto de auth)
│   │   └── useModalEvento.js (estado do modal)
│   ├── store/
│   │   └── eventoStore.js (Zustand state)
│   ├── context/
│   │   └── AuthContext.jsx (contexto de usuário logado)
│   ├── App.jsx
│   └── index.css (Tailwind imports)
├── .env.local (variáveis sensíveis)
├── package.json
├── vite.config.js (ou next.config.js)
└── README.md
```

---

## 5. Fluxo de Dados

### Criar Evento
```
Usuário digita evento
        ↓
FormEvento valida dados
        ↓
eventoService.create() chamada
        ↓
Axios POST → Supabase REST API
        ↓
PostgreSQL INSERT
        ↓
Response com evento criado
        ↓
React Query invalida cache
        ↓
Calendario re-renderiza
```

### Visualizar Eventos
```
Usuário abre Dashboard
        ↓
useEventos() hook dispara
        ↓
React Query faz GET → Supabase
        ↓
Supabase executa SELECT * FROM eventos
        ↓
Retorna JSON com eventos
        ↓
Calendario renderiza eventos
```

### Editar Evento
```
Usuário clica em evento
        ↓
Modal abre com dados preenchidos
        ↓
Usuário edita e salva
        ↓
eventoService.update(id, dados)
        ↓
Axios PUT → Supabase
        ↓
PostgreSQL UPDATE
        ↓
Cache invalidado
        ↓
UI atualiza
```

### Deletar Evento
```
Usuário clica X no evento
        ↓
Confirmação de exclusão
        ↓
eventoService.delete(id)
        ↓
Axios DELETE → Supabase
        ↓
PostgreSQL DELETE
        ↓
Cache invalidado
        ↓
Evento desaparece do calendário
```

---

## 6. Componentes Principais

### 1. **Calendario.jsx**
Exibe o calendário do mês com eventos plotados
- Props: `eventos`, `onSelectDate`, `onClickEvento`
- Usa: `react-big-calendar`
- Funções: Renderizar grid de dias, destacar datas com eventos

### 2. **ModalEvento.jsx**
Modal que abre para criar/editar evento
- Props: `isOpen`, `evento`, `onSave`, `onClose`
- State: Formulário com validação
- Funções: Gerenciar abertura/fechamento, submissão

### 3. **FormEvento.jsx**
Formulário de criação/edição
- Campos: Título, descrição, data/hora, local, cor
- Validações: Campos obrigatórios, data válida, horário de fim > início
- Submit: Chama `eventoService.create()` ou `.update()`

### 4. **ListaEventos.jsx**
Lista de eventos do dia/semana/mês selecionado
- Filtragem: Por data, categoria, busca por título
- Ações: Edit, Delete, View Details
- Responsividade: Mobile-friendly

### 5. **NavBar.jsx**
Navegação principal
- Logo, botão "Novo Evento", usuário logado, logout
- Navegação entre vistas (Mês, Semana, Dia)

---

## 7. Serviços (Backend Integration)

### eventoService.js
```javascript
// Exemplo de estrutura
const getEventos = async (usuarioId) => {
  // GET /rest/v1/eventos?usuario_id=eq.{usuarioId}
}

const createEvento = async (eventoData) => {
  // POST /rest/v1/eventos
}

const updateEvento = async (id, dados) => {
  // PATCH /rest/v1/eventos?id=eq.{id}
}

const deleteEvento = async (id) => {
  // DELETE /rest/v1/eventos?id=eq.{id}
}
```

### authService.js
```javascript
// Autenticação via Supabase Auth
const signup = async (email, senha) => {}
const login = async (email, senha) => {}
const logout = async () => {}
const getCurrentUser = async () => {}
```

---

## 8. Hooks Customizados

### useEventos.js
```javascript
export const useEventos = (dataInicio, dataFim) => {
  const { data, isLoading, error } = useQuery(
    ['eventos', dataInicio, dataFim],
    () => fetchEventos(dataInicio, dataFim),
    { staleTime: 5 * 60 * 1000 } // Cache 5 minutos
  );
  
  return { eventos: data, isLoading, error };
}
```

### useAuth.js
Fornece usuário logado, loading, função logout

---

## 9. Fluxo de Autenticação

```
┌─ Signup ─────────────────────┐
│  Email + Senha              │
│  ↓                          │
│  Supabase Auth              │
│  ↓                          │
│  JWT Token armazenado       │
└────────────────────────────┘

┌─ Login ──────────────────────┐
│  Email + Senha              │
│  ↓                          │
│  Supabase retorna JWT       │
│  ↓                          │
│  Token salvo em localStorage│
│  (ou Cookie seguro)         │
│  ↓                          │
│  Requests futuros incluem   │
│  Authorization: Bearer JWT  │
└────────────────────────────┘

┌─ Logout ─────────────────────┐
│  Clique em Logout           │
│  ↓                          │
│  Token removido do storage  │
│  ↓                          │
│  Redirect para Login        │
└────────────────────────────┘
```

---

## 10. Segurança - RLS (Row Level Security)

No Supabase, ativa RLS na tabela `eventos`:

```sql
-- Apenas o dono consegue ver seus eventos
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
  ON eventos
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert their own events"
  ON eventos
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own events"
  ON eventos
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete their own events"
  ON eventos
  FOR DELETE
  USING (auth.uid() = usuario_id);
```

---

## 11. Deploy

### Passo 1: Preparar Vercel
1. Criar conta gratuita em `vercel.com`
2. Conectar GitHub
3. Clonar template React (ou seu repo)
4. Vercel detecta automaticamente React
5. Variáveis de ambiente (SUPABASE_URL, SUPABASE_KEY)

### Passo 2: Configurar Supabase
1. Criar conta em `supabase.com`
2. Criar projeto
3. Copiar `SUPABASE_URL` e `SUPABASE_ANON_KEY`
4. Adicionar tabelas (criar eventos, usuários)
5. Ativar Supabase Auth

### Passo 3: Variáveis de Ambiente
**.env.local** (local)
```
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJxxx...
```

**Vercel Dashboard** (produção)
- Ir em Settings → Environment Variables
- Adicionar as mesmas variáveis

### Passo 4: Deploy
```bash
# Fazer push para GitHub
git push origin main

# Vercel detecta automaticamente e deploy acontece
# Site live em: seu-projeto.vercel.app
```

---

## 12. Funcionalidades (MVP)

### ✅ Essenciais (Sprint 1)
- [x] Autenticação (signup/login)
- [x] Visualizar eventos em calendário
- [x] Criar novo evento
- [x] Editar evento
- [x] Deletar evento
- [x] Responsividade mobile

### 🔄 Intermediárias (Sprint 2)
- [ ] Filtro por categoria/cor
- [ ] Busca por título
- [ ] Vistas: Mês, Semana, Dia
- [ ] Lembretes por email
- [ ] Compartilhar evento

### 🚀 Avançadas (Sprint 3)
- [ ] Eventos recorrentes
- [ ] Calendário compartilhado
- [ ] Notificações push
- [ ] Sincronização offline
- [ ] Integração com Google Calendar

---

## 13. Timeline de Desenvolvimento

| Fase | Duração | O quê |
|------|---------|-------|
| **Setup** | 1-2h | Criar projeto React, Supabase, GitHub |
| **Backend** | 2-3h | Tabelas, auth, RLS policies |
| **Frontend Básico** | 4-6h | Componentes, pages, navegação |
| **CRUD** | 3-4h | Criar, ler, atualizar, deletar eventos |
| **UI/UX** | 2-3h | Tailwind, responsividade, polimento |
| **Deploy** | 30min | Vercel + Supabase config |
| **Total** | **13-19h** | **Projeto pronto ao ar** |

---

## 14. Custos (Totalmente Grátis!)

| Serviço | Limite Grátis | Custo |
|---------|---------------|-------|
| Vercel | 100K requests/mês | **R$ 0** |
| Supabase | 500MB DB, 2GB bandwidth | **R$ 0** |
| GitHub | Repositório ilimitado | **R$ 0** |
| Domínio | - | `projeto.vercel.app` grátis |
| **TOTAL** | - | **R$ 0** |

---

## 15. Próximos Passos

1. **Criar repositório GitHub**
   ```bash
   npx create-vite@latest agenda-interativa --template react
   cd agenda-interativa
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Instalar dependências**
   ```bash
   npm install
   npm install @supabase/supabase-js
   npm install axios
   npm install @tanstack/react-query
   npm install zustand
   npm install react-big-calendar
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Configurar Supabase**
   - Criar conta
   - Criar projeto
   - Executar migration SQL das tabelas
   - Copiar credenciais

4. **Começar desenvolvimento**
   - Criar contexto de auth
   - Montar componentes
   - Implementar CRUD
   - Testar localmente

5. **Deploy**
   - Push para GitHub
   - Conectar Vercel
   - Configurar env vars
   - ✨ Live!

---

## 16. Referências Úteis

- **React**: https://react.dev
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **React Big Calendar**: https://jquense.github.io/react-big-calendar/
- **Tailwind CSS**: https://tailwindcss.com
- **TanStack Query**: https://tanstack.com/query/latest

---

**Pronto para começar! 🚀**
