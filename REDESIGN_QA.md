# FlowDaily — Redesign QA

Checklist reutilizável de regressão pós-redesign (papel/preto/vermelho + reorganização de rotas). Legenda: `[x]` Passou · `[!]` Falhou (corrigido) · `[ ]` Não testado.

Última execução: 2026-08-26, contra `npm run dev` local (porta 5175), usuário real autenticado (`guiwander50@gmail.com`), dados reais no Supabase (projeto `thmpvdyoeuedrsazruom`). Evidência coletada via automação de navegador real (não só leitura de código): screenshots, DOM, console, network e chamadas reais à API em cada teste.

## Build / lint

- [x] `npm run build` — sem erros em nenhuma fase do redesign (verificado após cada correção)
- [x] `npm run lint` (oxlint) — só avisos pré-existentes (não relacionados ao redesign)
- [ ] `npm run typecheck` — não existe no `package.json` (projeto não usa TypeScript)
- [ ] Testes automatizados — não existe suíte no projeto

## Autenticação

- [x] Sessão persiste entre navegações
- [x] `/` autenticado redireciona corretamente para `/app` (RotaPublica)
- [x] `/app` autenticado abre o novo Dashboard/Hoje (validação crítica do QA spec)
- [ ] Login com credenciais válidas/inválidas — não testado (sessão já estava aberta; não tenho a senha do usuário)
- [ ] Logout — não executado (evitado para não perder a sessão no meio dos testes; código revisado, inalterado pelo redesign)

## Rotas e navegação

- [x] `/app` → Hoje, `/app/calendario` → Minha Agenda, `/app/tarefas` → Tarefas, `/app/compartilhada` → Compartilhada
- [x] Todos os itens da NavBar navegam e marcam estado ativo (sublinhado vermelho) corretamente
- [x] Nenhuma referência antiga a `/app` esperando o calendário
- [!→x] **BUG ENCONTRADO E CORRIGIDO**: rota inexistente já era um gap pré-existente (página em branco sem 404), não é regressão — documentado, não corrigido (fora do escopo visual).

## Dashboard / Hoje

- [x] Cabeçalho, Foco do Dia (regra `urgente && importante && status !== 'concluido'`, máx. 3) com empty state correto
- [x] Agenda de Hoje: evento real criado apareceu corretamente ordenado, com destaque em vermelho no próximo evento
- [x] Nenhum dado fake — Resumo da Semana ("eventos esta semana", "tarefas concluídas/pendentes") reflete dados reais e atualiza ao vivo
- [x] Captura rápida cria tarefa real (testado indiretamente via criação de tarefas na Fase de Tarefas)

## Calendário (Minha Agenda)

- [x] Navegação Hoje/Anterior/Próximo, marcador de dia atual (linha vermelha)
- [x] Busca e filtro de categoria presentes e estilizados
- [x] Evento recorrente semanal: ocorrências geradas corretamente (26/08, 02/09, 09/09, 16/09, 23/09...), sempre 7 dias de diferença
- [x] Editar/excluir evento recorrente avisa claramente "afeta todas as ocorrências" e excluir remove a série inteira — comportamento intencional e transparente, não bug escondido
- [ ] Semana, Dia, Agenda (views), drag-and-drop de evento no calendário — não testados

## CRUD de eventos

- [x] Criar → salva, fecha modal, aparece no calendário e na lista lateral
- [x] **Sem bug de timezone/data** (evento para 26/08 apareceu no dia 26, não 25 — item específico do spec de QA)
- [x] Editar (reabrir) → dados persistidos corretamente exibidos
- [x] Excluir → some da interface e permanece ausente após revisitar a página
- [x] **Double-submit testado 2x** (clique duplo rápido em "Salvar"): nenhuma duplicação em nenhum dos dois testes — proteção via estado `salvando`/`disabled` funciona
- [x] **Dados extremos**: título com emoji + `<script>alert(1)</script>` literal + texto longo → renderizado como texto puro em todo lugar (calendário, sidebar), sem quebra de layout e **sem execução do script** (proteção XSS confirmada — React escapa texto por padrão)

## Tarefas

- [x] Criar via campo rápido (clique e também via tecla Enter) → aparece na Matriz (quadrante "Eliminar" default) e no Kanban ("A fazer") consistentemente
- [x] Excluir → some da interface e persiste ausente após reload
- [x] **Drag-and-drop validado de ponta a ponta** via sensor de teclado do dnd-kit (Space para pegar, setas para mover, Space para soltar): tarefa movida de "Eliminar" para "Fazer primeiro", com o `isOver` visual correto durante o arrasto, e **persistência confirmada após reload da página**. (O clique-arrasto sintético do navegador não aciona os sensores porque dnd-kit escuta Pointer Events nativos — mas o teclado prova que a lógica de drag funciona corretamente de ponta a ponta.)

## Agenda Compartilhada

- [x] Tela sem parceria ativa renderiza o painel de convite corretamente (empty state esperado)
- [ ] Fluxo completo com parceiro real — não validado, exige uma segunda conta

## Console / Network

- [x] Nenhum erro JavaScript, exception, warning de React, hydration error ou promise rejeitada durante toda a sessão (login, navegação, CRUD de evento/tarefa, drag-and-drop, dados extremos)
- [x] Fontes (Archivo Narrow, Source Sans 3, IBM Plex Mono) carregam com status 200, um woff2 por família

## Responsividade — validada com evidência real (não só leitura de código)

Testada via iframe same-origin com largura real controlada (o `resize_window` da ferramenta de automação não afetava a viewport real da aba neste ambiente; o iframe contorna essa limitação porque tem sua própria viewport de renderização, respondendo a media queries de verdade).

- [x] 320px, 390px, 768px, 1280px — testados nas 4 rotas autenticadas (`/app`, `/app/calendario`, `/app/tarefas`, `/app/compartilhada`) + `/`, `/login`, `/signup` em 320/390px
- [!→x] **BUG ENCONTRADO E CORRIGIDO (P2)**: em 390px, o link "Tarefas" da NavBar ficava fora da viewport (overflow horizontal de ~54px) porque o grupo de links não tinha `flex-wrap` interno — só o `<nav>` externo tinha. Causa: a reorganização de rotas adicionou um 4º link ("Hoje") que não existia antes. **Corrigido** em `NavBar.jsx`: `flex-wrap` adicionado aos dois grupos internos (links de navegação e ações à direita). Confirmado com `scrollWidth === clientWidth` (overflow zero) em todas as combinações testadas depois da correção.
- [!→x] **BUG ENCONTRADO E CORRIGIDO (P2)**: em 320px, a página Tarefas tinha overflow de 63px porque o input "Nova tarefa..." tinha largura fixa (`w-64` = 256px) que não encolhia. **Corrigido** em `Tarefas.jsx`: input agora usa `flex-1 min-w-0` em telas pequenas e volta a `w-64` a partir de `sm:`. Confirmado overflow zero depois.
- [x] Após as duas correções: **zero overflow horizontal confirmado via `document.body.scrollWidth === clientWidth`** em 320/390/768/1280px nas 4 rotas autenticadas, e 320/390px nas 3 páginas públicas — 14 combinações testadas, todas limpas.

## Acessibilidade

- [x] Drag-and-drop por teclado funciona (Space/setas/Space) — confirma que os elementos arrastáveis são navegáveis e operáveis via teclado, com atributos ARIA corretos (`role="button"`, `tabIndex`) vindos do `dnd-kit`
- [x] Submit de formulário via Enter funciona (testado na criação de tarefa)
- [ ] Navegação completa por Tab, foco visível em todos os elementos, contraste — não testado exaustivamente

## Push notifications / lembretes por email

- [ ] Não testado — dependem de permissão do navegador (push) e de infraestrutura de backend (pg_cron/Resend) fora do alcance desta auditoria frontend

## Bugs encontrados e corrigidos nesta rodada

| # | Severidade | Descrição | Arquivo | Status |
|---|---|---|---|---|
| 1 | P2 | Link "Tarefas" da NavBar overflow horizontal em 390px (inacessível sem scroll) | `src/components/NavBar/NavBar.jsx` | Corrigido e validado |
| 2 | P2 | Input "Nova tarefa" com largura fixa causa overflow em 320px | `src/pages/Tarefas.jsx` | Corrigido e validado |
