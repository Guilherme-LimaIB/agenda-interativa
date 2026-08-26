import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo/Logo'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const BENEFICIOS = [
  { titulo: 'Foco real', descricao: 'Priorize o que importa hoje.' },
  { titulo: 'Tudo em um só lugar', descricao: 'Agenda, tarefas e matriz juntas.' },
  { titulo: 'Design limpo', descricao: 'Interface minimalista, sem ruído.' },
]

const FUNCIONALIDADES = [
  {
    titulo: 'Agenda inteligente',
    descricao: 'Gerencie eventos e compromissos com categorias, cores e recorrência automática.',
  },
  {
    titulo: 'Matriz Eisenhower',
    descricao: 'Classifique tarefas por urgência e importância, e foque no que realmente importa.',
  },
  {
    titulo: 'Kanban',
    descricao: 'Organize suas tarefas visualmente e acompanhe o progresso do início à conclusão.',
  },
  {
    titulo: 'Agenda compartilhada',
    descricao: 'Compartilhe compromissos com seu par sem perder sua agenda individual.',
  },
  {
    titulo: 'Lembretes automáticos',
    descricao: 'Receba um aviso por email antes de cada compromisso, sem configurar nada toda vez.',
  },
]

const CHECKLIST = [
  'Design minimalista e elegante',
  'Funciona em qualquer dispositivo',
  'Sincronização em tempo real',
  'Categorias, busca e filtros',
  'Feito pro seu fluxo do dia a dia',
]

const AGENDA_SEMANA = {
  dias: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
  eventos: [
    { dia: 0, inicio: 1, altura: 2, titulo: 'Reunião de alinhamento' },
    { dia: 1, inicio: 1, altura: 3, titulo: 'Trabalho focado' },
    { dia: 2, inicio: 2, altura: 2, titulo: 'Cliente A' },
    { dia: 3, inicio: 4, altura: 2, titulo: 'Revisão do projeto' },
    { dia: 4, inicio: 5, altura: 1, titulo: 'Jantar com a equipe' },
  ],
}

function DashboardMockup() {
  const foco = ['Preparar apresentação', 'Revisar contrato', 'Treino']
  const agenda = [
    { hora: '09:00', titulo: 'Reunião de alinhamento' },
    { hora: '10:30', titulo: 'Trabalho focado' },
    { hora: '14:00', titulo: 'Cliente A' },
  ]
  const tarefas = ['Responder e-mails', 'Analisar métricas', 'Atualizar proposta']

  return (
    <div className="relative mx-auto w-full max-w-lg pb-14">
      <div className="border border-line bg-surface shadow-[0_30px_70px_-30px_rgba(17,17,17,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="fd-meta ml-2 text-muted">flowdaily.app</span>
        </div>
        <div className="p-4">
          <p className="fd-heading">Hoje</p>
          <div className="mt-3 grid grid-cols-2 gap-px bg-line">
            <div className="col-span-2 bg-dark p-3 text-paper">
              <p className="fd-meta text-paper/50 uppercase">Foco do dia</p>
              <ul className="fd-ui mt-2 flex flex-col gap-1.5">
                {foco.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-paper/40" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-paper p-3">
              <p className="fd-meta text-muted uppercase">Agenda de hoje</p>
              <ul className="fd-ui mt-2 flex flex-col gap-1.5">
                {agenda.map((e) => (
                  <li key={e.hora} className="flex gap-2">
                    <span className="fd-meta shrink-0 text-muted">{e.hora}</span>
                    <span className="truncate">{e.titulo}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-paper p-3">
              <p className="fd-meta text-muted uppercase">Tarefas</p>
              <ul className="fd-ui mt-2 flex flex-col gap-1.5">
                {tarefas.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-line" />
                    <span className="truncate">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-px bg-paper p-3">
            <p className="fd-meta text-muted uppercase">Progresso do dia</p>
            <p className="fd-display mt-1 text-3xl">
              65<span className="text-muted text-xl">%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-10 left-0 w-32 border border-line bg-surface shadow-[0_25px_50px_-20px_rgba(17,17,17,0.4)] sm:w-36">
        <div className="border-b border-line px-3 py-2">
          <p className="fd-ui font-semibold">Hoje</p>
        </div>
        <div className="bg-dark p-2.5 text-paper">
          <p className="fd-meta text-paper/50 uppercase">Foco do dia</p>
          <ul className="fd-meta mt-1.5 flex flex-col gap-1">
            {foco.slice(0, 2).map((t) => (
              <li key={t} className="truncate">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-2.5">
          <p className="fd-meta text-muted uppercase">Agenda</p>
          <ul className="fd-meta mt-1.5 flex flex-col gap-1">
            {agenda.slice(0, 2).map((e) => (
              <li key={e.hora} className="flex gap-1.5">
                <span className="text-muted">{e.hora}</span>
                <span className="truncate">{e.titulo}</span>
              </li>
            ))}
          </ul>
        </div>
        <span className="absolute -right-3 -bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-signal text-paper shadow-lg">
          +
        </span>
      </div>
    </div>
  )
}

function CalendarioMockup() {
  return (
    <div className="border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="fd-heading">Calendário</span>
        <div className="fd-meta flex gap-3 text-muted uppercase">
          <span className="text-ink">Semana</span>
          <span>Mês</span>
          <span>Dia</span>
          <span>Agenda</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="fd-meta text-muted">24 – 28 DE AGO</span>
        <div className="fd-ui flex items-center gap-3 text-muted">
          <span>‹</span>
          <span className="text-ink">Hoje</span>
          <span>›</span>
        </div>
      </div>
      <div className="grid grid-cols-5 border-t border-line">
        {AGENDA_SEMANA.dias.map((dia, i) => (
          <div key={dia} className="fd-meta border-l border-line py-2 text-center text-muted first:border-l-0">
            {dia} <span className="text-ink">{24 + i}</span>
          </div>
        ))}
      </div>
      <div className="relative grid grid-cols-5 border-t border-line" style={{ height: '180px' }}>
        {AGENDA_SEMANA.dias.map((dia, i) => (
          <div key={dia} className="relative border-l border-line first:border-l-0">
            {AGENDA_SEMANA.eventos
              .filter((e) => e.dia === i)
              .map((e) => (
                <div
                  key={e.titulo}
                  className="fd-meta absolute right-1 left-1 overflow-hidden border-l-2 border-signal bg-signal-soft/60 px-1.5 py-1 text-ink"
                  style={{ top: `${e.inicio * 28}px`, height: `${e.altura * 28 - 2}px` }}
                >
                  {e.titulo}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function MatrizKanbanMockup() {
  const quadrantes = [
    { titulo: 'Fazer primeiro', tarefas: ['Enviar proposta'] },
    { titulo: 'Agendar', tarefas: ['Planejar sprint'] },
    { titulo: 'Delegar', tarefas: ['Revisar textos'] },
    { titulo: 'Eliminar', tarefas: [] },
  ]
  const colunas = [
    { titulo: 'A fazer', tarefas: ['Responder e-mails', 'Revisar contrato'] },
    { titulo: 'Em progresso', tarefas: ['Preparar apresentação'] },
    { titulo: 'Concluído', tarefas: ['Planejar semana'] },
  ]

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <p className="fd-meta text-muted mb-2 uppercase">Matriz Eisenhower</p>
        <div className="grid grid-cols-2 divide-x divide-y divide-line border border-line">
          {quadrantes.map((q) => (
            <div key={q.titulo} className="p-3">
              <p className="fd-ui font-semibold">{q.titulo}</p>
              <ul className="fd-meta mt-1.5 flex flex-col gap-1 text-muted">
                {q.tarefas.length === 0 ? <li>—</li> : q.tarefas.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="fd-meta text-muted mb-2 uppercase">Kanban</p>
        <div className="grid grid-cols-3 divide-x divide-line border border-line">
          {colunas.map((c) => (
            <div key={c.titulo} className="p-3">
              <p className="fd-ui font-semibold">{c.titulo}</p>
              <ul className="fd-meta mt-1.5 flex flex-col gap-1.5 text-muted">
                {c.tarefas.map((t) => (
                  <li key={t} className="border-b border-line pb-1.5">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CompartilhadaMockup() {
  const eventos = [
    { titulo: 'Consulta médica', hora: '15:00', quem: 'voce' },
    { titulo: 'Jantar a dois', hora: '20:00', quem: 'parceiro' },
    { titulo: 'Academia', hora: '07:00', quem: 'voce' },
  ]

  return (
    <div className="border border-line bg-surface p-5">
      <div className="fd-meta mb-4 flex items-center gap-4 border-b border-line pb-3 text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink" /> Você
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-signal" /> Parceiro(a)
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-line">
        {eventos.map((e) => (
          <li key={e.titulo} className="flex items-center gap-3 py-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: e.quem === 'voce' ? '#111111' : '#e53935' }}
            />
            <span className="fd-ui flex-1">{e.titulo}</span>
            <span className="fd-meta text-muted">{e.hora}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#recursos" className="fd-ui text-muted hover:text-ink">
            Recursos
          </a>
          <a href="#produto" className="fd-ui text-muted hover:text-ink">
            Como funciona
          </a>
          <a href="#compartilhada" className="fd-ui text-muted hover:text-ink">
            Compartilhada
          </a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/app">
              <Button variant="primary">Acessar app</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="fd-ui hidden text-muted hover:text-ink sm:inline">
                Entrar
              </Link>
              <Link to="/signup">
                <Button variant="primary">Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-16 border-t border-line px-6 pt-14 pb-16 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:pt-20">
        <div>
          <h1 className="fd-display uppercase">
            Organize seu dia.
            <br />
            <span className="text-signal">Flua a dois.</span>
          </h1>
          <p className="fd-body mt-6 max-w-md text-muted">
            FlowDaily é o seu sistema para organizar tarefas, eventos e prioridades — sozinho ou a dois, com
            clareza e foco total.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link to="/app">
                <Button variant="primary">Acessar app</Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="primary">Criar conta grátis</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Já tenho conta</Button>
                </Link>
              </>
            )}
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo}>
                <p className="fd-ui font-semibold uppercase">{b.titulo}</p>
                <p className="fd-meta mt-1 text-muted">{b.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        <DashboardMockup />
      </main>

      <section id="recursos" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <h2 className="fd-heading-lg text-center uppercase">Tudo que você precisa pra ser mais produtivo</h2>
        <div className="mx-auto mt-2 h-0.5 w-10 bg-signal" />
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {FUNCIONALIDADES.map((f, i) => (
            <div key={f.titulo}>
              <span className="fd-meta text-signal">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="fd-heading mt-2">{f.titulo}</h3>
              <p className="fd-body mt-1.5 text-muted">{f.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="produto" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="fd-heading-lg uppercase">
              Criado para quem
              <br />
              busca clareza e foco
            </h2>
            <div className="mt-2 h-0.5 w-10 bg-signal" />
            <p className="fd-body mt-5 max-w-md text-muted">
              FlowDaily combina design minimalista com recursos poderosos pra te ajudar a ter mais controle do
              seu tempo e energia.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {CHECKLIST.map((item) => (
                <li key={item} className="fd-ui flex items-center gap-2.5">
                  <span className="text-signal">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <CalendarioMockup />
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <h2 className="fd-heading-lg uppercase">Decida o que importa. Acompanhe até concluir.</h2>
        <div className="mt-2 h-0.5 w-10 bg-signal" />
        <p className="fd-body mt-5 max-w-lg text-muted">
          A Matriz Eisenhower ajuda a classificar tarefas por urgência e importância. O Kanban mostra o
          progresso de cada uma, do início à conclusão.
        </p>
        <div className="mt-10">
          <MatrizKanbanMockup />
        </div>
      </section>

      <section id="compartilhada" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <CompartilhadaMockup />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="fd-heading-lg uppercase">
              Sua agenda,
              <br />
              também a dois
            </h2>
            <div className="mt-2 h-0.5 w-10 bg-signal" />
            <p className="fd-body mt-5 max-w-md text-muted">
              Compartilhe compromissos com seu par em tempo real, sem perder sua agenda individual. Cada um
              mantém o que é privado — e vê junto o que é de vocês dois.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-dark px-6 py-20 text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
          <h2 className="fd-display uppercase">
            Pronto para
            <br />
            colocar seu dia
            <br />
            <span className="text-signal">em movimento?</span>
          </h2>
          <div>
            {user ? (
              <>
                <p className="fd-body text-paper/70 max-w-sm">
                  Volte pra sua agenda, suas tarefas e suas prioridades de hoje.
                </p>
                <div className="mt-6">
                  <Link to="/app">
                    <Button variant="signal">Acessar app</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="fd-body text-paper/70 max-w-sm">
                  Crie sua conta e comece a organizar sua agenda, suas tarefas e suas prioridades hoje mesmo.
                </p>
                <div className="mt-6">
                  <Link to="/signup">
                    <Button variant="signal">Começar gratuitamente</Button>
                  </Link>
                </div>
                <p className="fd-meta text-paper/50 mt-3">Não é necessário cartão de crédito.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-dark border-t border-paper/10 px-6 py-8 text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Logo textClassName="text-paper" />
          <div className="fd-meta flex items-center gap-5 text-paper/60">
            <a href="#recursos" className="hover:text-paper">
              Recursos
            </a>
            <Link to={user ? '/app' : '/login'} className="hover:text-paper">
              {user ? 'Acessar app' : 'Entrar'}
            </Link>
            <span>© 2026 FlowDaily</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
