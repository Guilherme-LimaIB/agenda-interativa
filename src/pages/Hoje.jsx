import { endOfToday, endOfWeek, format, startOfToday, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../components/NavBar/NavBar'
import { ModalEvento } from '../components/ModalEvento/ModalEvento'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { useCategorias } from '../hooks/useCategorias'
import { useEventoMutations, useEventos } from '../hooks/useEventos'
import { useLembreteMutations } from '../hooks/useLembretes'
import { useModalEvento } from '../hooks/useModalEvento'
import { useTarefas } from '../hooks/useTarefas'
import { interpretarTexto } from '../utils/linguagemNatural'
import { expandirOcorrencias } from '../utils/recorrencia'

const HOJE_INICIO = startOfToday()
const HOJE_FIM = endOfToday()

function Painel({ titulo, acao, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 bg-paper p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="fd-meta text-muted uppercase">{titulo}</h2>
        {acao}
      </div>
      {children}
    </div>
  )
}

function FocoDoDia({ tarefas, isLoading, onConcluir }) {
  const foco = useMemo(
    () => tarefas.filter((t) => t.urgente && t.importante && t.status !== 'concluido').slice(0, 3),
    [tarefas],
  )

  return (
    <div className="flex flex-col gap-5 bg-dark p-6 text-paper lg:row-span-2">
      <div>
        <h2 className="fd-meta text-paper/50 uppercase">Foco do dia</h2>
        <p className="fd-heading-lg mt-1">
          {foco.length} {foco.length === 1 ? 'prioridade' : 'prioridades'}
        </p>
        <p className="fd-ui text-paper/60">1 direção clara</p>
      </div>

      {isLoading ? (
        <LoadingState message="Carregando..." className="text-paper/50" />
      ) : foco.length === 0 ? (
        <EmptyState
          message="Nenhuma tarefa urgente e importante agora. Aproveite pra planejar o dia."
          className="text-paper/60"
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {foco.map((tarefa, i) => (
            <li key={tarefa.id} className="flex items-start gap-3">
              <span className="fd-meta text-paper/40">{String(i + 1).padStart(2, '0')}</span>
              <button
                onClick={() => onConcluir(tarefa.id)}
                className="fd-body flex-1 text-left hover:text-signal"
                title="Marcar como concluída"
              >
                {tarefa.titulo}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function AgendaDeHoje({ eventos, isLoading, onClickEvento }) {
  const { eventosHoje, proximoId } = useMemo(() => {
    const expandidos = expandirOcorrencias(eventos, HOJE_INICIO, HOJE_FIM)
    const doDia = expandidos
      .filter((e) => new Date(e.data_inicio) >= HOJE_INICIO && new Date(e.data_inicio) <= HOJE_FIM)
      .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio))
    const agora = Date.now()
    return { eventosHoje: doDia, proximoId: doDia.find((e) => new Date(e.data_fim).getTime() >= agora)?.id }
  }, [eventos])

  return (
    <Painel titulo="Agenda de hoje" acao={<Link to="/app/calendario" className="fd-ui text-muted hover:text-ink">ver calendário</Link>}>
      {isLoading ? (
        <LoadingState />
      ) : eventosHoje.length === 0 ? (
        <EmptyState message="Nenhum evento hoje. Que tal aproveitar o tempo livre?" />
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {eventosHoje.map((evento) => (
            <li key={evento.id}>
              <button
                onClick={() => onClickEvento(evento._original ?? evento)}
                className={`flex w-full items-center gap-3 py-2.5 text-left ${
                  evento.id === proximoId ? 'text-signal' : 'text-ink'
                }`}
              >
                <span className="fd-meta w-14 shrink-0">{format(new Date(evento.data_inicio), 'HH:mm')}</span>
                <span className="fd-body flex-1">{evento.titulo}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Painel>
  )
}

function TarefasResumo({ tarefas, isLoading, onConcluir }) {
  const pendentes = useMemo(() => tarefas.filter((t) => t.status !== 'concluido').slice(0, 5), [tarefas])

  return (
    <Painel titulo="Tarefas" acao={<Link to="/app/tarefas" className="fd-ui text-muted hover:text-ink">ver tudo</Link>}>
      {isLoading ? (
        <LoadingState />
      ) : pendentes.length === 0 ? (
        <EmptyState message="Nenhuma tarefa pendente." />
      ) : (
        <ul className="flex flex-col gap-2">
          {pendentes.map((tarefa) => (
            <li key={tarefa.id}>
              <button
                onClick={() => onConcluir(tarefa.id)}
                className="fd-ui flex w-full items-center gap-2.5 text-left text-ink hover:text-signal"
              >
                <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-line" aria-hidden="true" />
                {tarefa.titulo}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Painel>
  )
}

function CapturaRapida({ onCapturar, pendente }) {
  const [texto, setTexto] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    onCapturar(texto.trim())
    setTexto('')
  }

  return (
    <Painel titulo="Captura rápida">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Uma ideia, tarefa ou lembrete..."
          className="fd-body border-b border-line bg-transparent py-2 text-ink placeholder:text-muted/70 focus:border-signal focus:outline-none"
        />
        <Button type="submit" variant="secondary" disabled={!texto.trim() || pendente} className="self-start">
          Adicionar
        </Button>
      </form>
    </Painel>
  )
}

function Progresso({ tarefas }) {
  const foco = tarefas.filter((t) => t.urgente && t.importante)
  const concluidas = foco.filter((t) => t.status === 'concluido').length

  return (
    <Painel titulo="Progresso do dia">
      <p className="fd-display text-ink">
        {concluidas}
        <span className="text-muted">/{foco.length || 0}</span>
      </p>
      <p className="fd-ui text-muted">prioridades concluídas</p>
    </Painel>
  )
}

function ResumoDaSemana({ eventos, tarefas }) {
  const inicioSemana = startOfWeek(new Date(), { locale: ptBR })
  const fimSemana = endOfWeek(new Date(), { locale: ptBR })

  const eventosSemana = useMemo(() => {
    const expandidos = expandirOcorrencias(eventos, inicioSemana, fimSemana)
    return expandidos.filter(
      (e) => new Date(e.data_inicio) >= inicioSemana && new Date(e.data_inicio) <= fimSemana,
    ).length
  }, [eventos, inicioSemana, fimSemana])

  const concluidas = tarefas.filter((t) => t.status === 'concluido').length
  const pendentes = tarefas.filter((t) => t.status !== 'concluido').length

  return (
    <div className="flex flex-wrap gap-8 bg-paper p-5">
      <div>
        <p className="fd-heading-lg">{eventosSemana}</p>
        <p className="fd-meta text-muted uppercase">eventos esta semana</p>
      </div>
      <div>
        <p className="fd-heading-lg">{concluidas}</p>
        <p className="fd-meta text-muted uppercase">tarefas concluídas</p>
      </div>
      <div>
        <p className="fd-heading-lg">{pendentes}</p>
        <p className="fd-meta text-muted uppercase">tarefas pendentes</p>
      </div>
    </div>
  )
}

export function Hoje() {
  const { data: eventos = [], isLoading: carregandoEventos } = useEventos()
  const { criar, atualizar, deletar } = useEventoMutations()
  const { salvar: salvarLembrete } = useLembreteMutations()
  const { categorias, criar: criarCategoria, deletar: deletarCategoria } = useCategorias()
  const { isOpen, evento, abrirParaCriar, abrirParaEditar, fechar } = useModalEvento()

  const { tarefas, isLoading: carregandoTarefas, criar: criarTarefa, atualizar: atualizarTarefa } = useTarefas()

  const handleSalvar = async (dados, lembreteMinutos) => {
    const eventoSalvo = evento?.id
      ? await atualizar.mutateAsync({ id: evento.id, dados })
      : await criar.mutateAsync(dados)
    await salvarLembrete.mutateAsync({ eventoId: eventoSalvo.id, minutos: lembreteMinutos })
    fechar()
  }

  const handleDeletar = async (id) => {
    await deletar.mutateAsync(id)
    fechar()
  }

  const handleConcluirTarefa = (id) => atualizarTarefa.mutate({ id, dados: { status: 'concluido' } })
  const handleCriarPorTexto = (texto) => abrirParaCriar(interpretarTexto(texto))
  const handleCapturar = (titulo) => criarTarefa.mutate(titulo)

  const hoje = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })

  return (
    <div className="min-h-screen bg-paper">
      <NavBar onCriarPorTexto={handleCriarPorTexto} />

      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-6 py-8">
        <div>
          <h1 className="fd-display">Hoje</h1>
          <p className="fd-meta text-muted mt-1 uppercase">{hoje}</p>
        </div>
        <Button variant="primary" onClick={() => abrirParaCriar()}>
          + Novo
        </Button>
      </header>

      {/* Ordem no DOM = ordem mobile (Foco > Agenda > Tarefas > Captura > Progresso).
          No desktop, o row-span-2 do Foco reorganiza a grade em 2 linhas x 3 colunas. */}
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-3">
        <FocoDoDia tarefas={tarefas} isLoading={carregandoTarefas} onConcluir={handleConcluirTarefa} />
        <AgendaDeHoje eventos={eventos} isLoading={carregandoEventos} onClickEvento={abrirParaEditar} />
        <TarefasResumo
          tarefas={tarefas}
          isLoading={carregandoTarefas}
          onConcluir={handleConcluirTarefa}
        />
        <CapturaRapida onCapturar={handleCapturar} pendente={criarTarefa.isPending} />
        <Progresso tarefas={tarefas} />
      </div>

      <div className="border-t border-line">
        <ResumoDaSemana eventos={eventos} tarefas={tarefas} />
      </div>

      <ModalEvento
        isOpen={isOpen}
        evento={evento}
        categorias={categorias}
        onCriarCategoria={(dados) => criarCategoria.mutateAsync(dados)}
        onExcluirCategoria={(id) => deletarCategoria.mutateAsync(id)}
        onSave={handleSalvar}
        onDelete={handleDeletar}
        onClose={fechar}
      />
    </div>
  )
}
