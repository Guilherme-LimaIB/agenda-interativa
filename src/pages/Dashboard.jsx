import { useMemo, useState } from 'react'
import { Calendario } from '../components/Calendario/Calendario'
import { ListaEventos } from '../components/ListaEventos/ListaEventos'
import { ModalEvento } from '../components/ModalEvento/ModalEvento'
import { NavBar } from '../components/NavBar/NavBar'
import { useCategorias } from '../hooks/useCategorias'
import { useEventoMutations, useEventos } from '../hooks/useEventos'
import { useLembreteMutations } from '../hooks/useLembretes'
import { useModalEvento } from '../hooks/useModalEvento'
import { useRealtimeEventos } from '../hooks/useRealtimeEventos'

export function Dashboard() {
  const { data: eventos = [], isLoading, error } = useEventos()
  const { criar, atualizar, deletar } = useEventoMutations()
  const { salvar: salvarLembrete } = useLembreteMutations()
  const { categorias, criar: criarCategoria } = useCategorias()
  const { isOpen, evento, abrirParaCriar, abrirParaEditar, fechar } = useModalEvento()
  useRealtimeEventos()

  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((e) => {
      const combinaBusca = !busca || e.titulo.toLowerCase().includes(busca.toLowerCase())
      const combinaCategoria = !categoriaFiltro || e.categoria_id === categoriaFiltro
      return combinaBusca && combinaCategoria
    })
  }, [eventos, busca, categoriaFiltro])

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

  return (
    <div>
      <NavBar onNovoEvento={() => abrirParaCriar()} />

      {error && <p className="p-4 text-sm text-red-600">Erro ao carregar eventos: {error.message}</p>}

      <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-6 py-2">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título..."
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
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
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
        {isLoading ? (
          <p className="p-4 text-sm text-gray-500">Carregando eventos...</p>
        ) : (
          <Calendario
            eventos={eventosFiltrados}
            onSelectDate={abrirParaCriar}
            onClickEvento={abrirParaEditar}
            getCor={(e) => e.categorias?.cor || e.cor}
          />
        )}
        <aside className="border-l border-gray-200">
          <ListaEventos eventos={eventosFiltrados} onClickEvento={abrirParaEditar} />
        </aside>
      </div>

      <ModalEvento
        isOpen={isOpen}
        evento={evento}
        categorias={categorias}
        onCriarCategoria={handleCriarCategoria}
        onSave={handleSalvar}
        onDelete={handleDeletar}
        onClose={fechar}
      />
    </div>
  )
}
