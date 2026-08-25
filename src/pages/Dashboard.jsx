import { Calendario } from '../components/Calendario/Calendario'
import { ListaEventos } from '../components/ListaEventos/ListaEventos'
import { ModalEvento } from '../components/ModalEvento/ModalEvento'
import { NavBar } from '../components/NavBar/NavBar'
import { useEventoMutations, useEventos } from '../hooks/useEventos'
import { useModalEvento } from '../hooks/useModalEvento'

export function Dashboard() {
  const { data: eventos = [], isLoading, error } = useEventos()
  const { criar, atualizar, deletar } = useEventoMutations()
  const { isOpen, evento, abrirParaCriar, abrirParaEditar, fechar } = useModalEvento()

  const handleSalvar = async (dados) => {
    if (evento?.id) {
      await atualizar.mutateAsync({ id: evento.id, dados })
    } else {
      await criar.mutateAsync(dados)
    }
    fechar()
  }

  const handleDeletar = async (id) => {
    await deletar.mutateAsync(id)
    fechar()
  }

  return (
    <div>
      <NavBar onNovoEvento={() => abrirParaCriar()} />

      {error && <p className="p-4 text-sm text-red-600">Erro ao carregar eventos: {error.message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
        {isLoading ? (
          <p className="p-4 text-sm text-gray-500">Carregando eventos...</p>
        ) : (
          <Calendario eventos={eventos} onSelectDate={abrirParaCriar} onClickEvento={abrirParaEditar} />
        )}
        <aside className="border-l border-gray-200">
          <ListaEventos eventos={eventos} onClickEvento={abrirParaEditar} />
        </aside>
      </div>

      <ModalEvento
        isOpen={isOpen}
        evento={evento}
        onSave={handleSalvar}
        onDelete={handleDeletar}
        onClose={fechar}
      />
    </div>
  )
}
