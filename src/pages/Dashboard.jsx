import { addMonths, subMonths } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { Calendario } from '../components/Calendario/Calendario'
import { ListaEventos } from '../components/ListaEventos/ListaEventos'
import { ModalEvento } from '../components/ModalEvento/ModalEvento'
import { NavBar } from '../components/NavBar/NavBar'
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

export function Dashboard() {
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
    <div className="min-h-screen bg-slate-950">
      <NavBar onNovoEvento={() => abrirParaCriar()} onCriarPorTexto={handleCriarPorTexto} />

      {error && <p className="p-4 text-sm text-pink-400">Erro ao carregar eventos: {error.message}</p>}

      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-white/5 px-6 py-2">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título..."
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-indigo-400 focus:outline-none"
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
            className="text-sm text-slate-400 hover:text-white"
          >
            Limpar filtros
          </button>
        )}
        {temEventosRestantesHoje && (
          <button
            onClick={handleAtrasei}
            disabled={reorganizar.isPending}
            className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-50"
          >
            {reorganizar.isPending ? 'Ajustando...' : '⏰ Atrasei'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Carregando eventos...</p>
        ) : (
          <Calendario
            eventos={eventosFiltrados}
            onSelectDate={abrirParaCriar}
            onClickEvento={handleClickEvento}
            getCor={(e) => e.categorias?.cor || e.cor}
          />
        )}
        <aside className="border-l border-white/10 bg-slate-950">
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
