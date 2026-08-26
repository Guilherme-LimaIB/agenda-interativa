import { addMonths, subMonths } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { Calendario } from '../components/Calendario/Calendario'
import { ListaEventos } from '../components/ListaEventos/ListaEventos'
import { ModalEvento } from '../components/ModalEvento/ModalEvento'
import { NavBar } from '../components/NavBar/NavBar'
import { Button } from '../components/ui/Button'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { SearchInput } from '../components/ui/Input'
import { useCategorias } from '../hooks/useCategorias'
import { useEventoMutations, useEventos } from '../hooks/useEventos'
import { useLembreteMutations } from '../hooks/useLembretes'
import { useModalEvento } from '../hooks/useModalEvento'
import { useRealtimeEventos } from '../hooks/useRealtimeEventos'
import { eventosRestantesHoje, useReorganizarDia } from '../hooks/useReorganizarDia'
import { interpretarTexto } from '../utils/linguagemNatural'
import { expandirOcorrencias } from '../utils/recorrencia'

const JANELA_INICIO = subMonths(new Date(), 3)
const JANELA_FIM = addMonths(new Date(), 18)

export function MinhaAgenda() {
  const { data: eventos = [], isLoading, error } = useEventos()
  const { criar, atualizar, deletar } = useEventoMutations()
  const { salvar: salvarLembrete } = useLembreteMutations()
  const { categorias, criar: criarCategoria, deletar: deletarCategoria } = useCategorias()
  const { isOpen, evento, abrirParaCriar, abrirParaEditar, fechar } = useModalEvento()
  const { reorganizar } = useReorganizarDia(eventos)
  useRealtimeEventos()

  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  useEffect(() => {
    if (categoriaFiltro && !categorias.some((c) => c.id === categoriaFiltro)) {
      setCategoriaFiltro('')
    }
  }, [categorias, categoriaFiltro])

  const eventosFiltrados = useMemo(() => {
    const filtrados = eventos.filter((e) => {
      const combinaBusca = !busca || e.titulo.toLowerCase().includes(busca.toLowerCase())
      const combinaCategoria = !categoriaFiltro || e.categoria_id === categoriaFiltro
      return combinaBusca && combinaCategoria
    })
    return expandirOcorrencias(filtrados, JANELA_INICIO, JANELA_FIM)
  }, [eventos, busca, categoriaFiltro])

  const handleClickEvento = (ocorrencia) => abrirParaEditar(ocorrencia._original ?? ocorrencia)

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

  const handleCriarCategoria = async (dados) => criarCategoria.mutateAsync(dados)
  const handleExcluirCategoria = async (id) => deletarCategoria.mutateAsync(id)
  const handleCriarPorTexto = (texto) => abrirParaCriar(interpretarTexto(texto))

  const temEventosRestantesHoje = eventosRestantesHoje(eventos).length > 0

  const handleAtrasei = async () => {
    const resposta = window.prompt(
      'Quantos minutos de atraso? Isso empurra os compromissos restantes de hoje (eventos recorrentes não são afetados).',
    )
    if (resposta === null) return
    const minutos = Number(resposta)
    if (!Number.isFinite(minutos) || minutos <= 0) {
      window.alert('Digite um número de minutos maior que zero.')
      return
    }
    try {
      const quantidade = await reorganizar.mutateAsync(minutos)
      window.alert(
        quantidade > 0
          ? `${quantidade} evento(s) de hoje foram empurrados em ${minutos} min.`
          : 'Nenhum evento restante hoje pra ajustar.',
      )
    } catch (err) {
      window.alert(err.message || 'Não foi possível ajustar os eventos. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <NavBar onNovoEvento={() => abrirParaCriar()} onCriarPorTexto={handleCriarPorTexto} />

      {error && <ErrorState message={`Erro ao carregar eventos: ${error.message}`} className="p-4" />}

      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-6 py-2">
        <SearchInput
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título..."
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="fd-ui rounded-sm border border-line bg-surface px-3 py-2 text-ink focus:border-signal focus:outline-none"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        {(busca || categoriaFiltro) && (
          <button
            onClick={() => {
              setBusca('')
              setCategoriaFiltro('')
            }}
            className="fd-ui text-muted hover:text-ink"
          >
            Limpar filtros
          </button>
        )}
        {temEventosRestantesHoje && (
          <Button
            variant="secondary"
            onClick={handleAtrasei}
            disabled={reorganizar.isPending}
            className="ml-auto"
          >
            {reorganizar.isPending ? 'Ajustando...' : 'Atrasei'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
        {isLoading ? (
          <LoadingState message="Carregando eventos..." className="p-4" />
        ) : (
          <Calendario
            eventos={eventosFiltrados}
            onSelectDate={abrirParaCriar}
            onClickEvento={handleClickEvento}
            getCor={(e) => e.categorias?.cor || e.cor}
          />
        )}
        <aside className="border-l border-line bg-paper">
          <ListaEventos eventos={eventosFiltrados} onClickEvento={handleClickEvento} />
        </aside>
      </div>

      <ModalEvento
        isOpen={isOpen}
        evento={evento}
        categorias={categorias}
        onCriarCategoria={handleCriarCategoria}
        onExcluirCategoria={handleExcluirCategoria}
        onSave={handleSalvar}
        onDelete={handleDeletar}
        onClose={fechar}
      />
    </div>
  )
}
