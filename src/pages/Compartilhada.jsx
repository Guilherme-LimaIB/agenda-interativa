import { useState } from 'react'
import { Calendario } from '../components/Calendario/Calendario'
import { ModalEvento } from '../components/ModalEvento/ModalEvento'
import { NavBar } from '../components/NavBar/NavBar'
import { useAuth } from '../hooks/useAuth'
import { useEventoMutations } from '../hooks/useEventos'
import { useEventosCompartilhados } from '../hooks/useEventosCompartilhados'
import { useModalEvento } from '../hooks/useModalEvento'
import { useParcerias } from '../hooks/useParcerias'
import { useRealtimeEventos } from '../hooks/useRealtimeEventos'

const CORES = { voce: '#3B82F6', parceiro: '#EC4899' }

function PainelCompartilhamento({ parcerias, parceiros, criar, aceitar }) {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')

  const pendentesCriadosPorMim = parcerias.filter((p) => p.status === 'pendente')

  const handleAceitar = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      await aceitar.mutateAsync(codigo)
      setCodigo('')
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Compartilhar agenda</h2>
      <p className="mb-6 text-sm text-gray-500">
        Gere um código e mande pro seu par, ou digite o código que você recebeu.
      </p>

      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Convidar alguém</p>
        <button
          onClick={() => criar.mutate()}
          disabled={criar.isPending}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {criar.isPending ? 'Gerando...' : 'Gerar código de convite'}
        </button>

        {pendentesCriadosPorMim.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1">
            {pendentesCriadosPorMim.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm">
                <span>
                  Código: <strong className="tracking-wider">{p.codigo_convite}</strong>
                </span>
                <span className="text-xs text-amber-600">aguardando aceite</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAceitar} className="rounded-lg border border-gray-200 p-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Tenho um código</label>
        {erro && <p className="mb-2 text-sm text-red-600">{erro}</p>}
        <div className="flex gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="ABC12345"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 uppercase tracking-wider"
          />
          <button
            type="submit"
            disabled={aceitar.isPending || !codigo}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Entrar
          </button>
        </div>
      </form>

      {parceiros.length > 0 && (
        <p className="mt-6 text-sm text-gray-500">
          Compartilhando com: <strong>{parceiros.map((p) => p.email).join(', ')}</strong>
        </p>
      )}
    </div>
  )
}

export function Compartilhada() {
  const { user } = useAuth()
  const { parcerias, parceriasAtivas, parceiros, criar, aceitar } = useParcerias()
  const { data: eventos = [], isLoading } = useEventosCompartilhados()
  const { criar: criarEvento, atualizar, deletar } = useEventoMutations()
  const { isOpen, evento, abrirParaCriar, abrirParaEditar, fechar } = useModalEvento()
  useRealtimeEventos()

  const temParceiroAtivo = parceriasAtivas.length > 0
  const eventoEhMeu = evento && evento.usuario_id === user?.id

  const handleClickEvento = (eventoClicado) => {
    abrirParaEditar(eventoClicado)
  }

  const handleSalvar = async (dados) => {
    if (evento?.id) {
      await atualizar.mutateAsync({ id: evento.id, dados })
    } else {
      await criarEvento.mutateAsync(dados)
    }
    fechar()
  }

  const handleDeletar = async (id) => {
    await deletar.mutateAsync(id)
    fechar()
  }

  const parceiroPorId = (id) => parceiros.find((p) => p.id === id)

  return (
    <div>
      <NavBar onNovoEvento={temParceiroAtivo ? () => abrirParaCriar() : undefined} />

      {!temParceiroAtivo ? (
        <PainelCompartilhamento parcerias={parcerias} parceiros={parceiros} criar={criar} aceitar={aceitar} />
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CORES.voce }} />
              Você
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CORES.parceiro }} />
              {parceiros.map((p) => p.email).join(', ') || 'Parceiro(a)'}
            </span>
          </div>

          {isLoading ? (
            <p className="p-4 text-sm text-gray-500">Carregando agenda compartilhada...</p>
          ) : (
            <Calendario
              eventos={eventos}
              onSelectDate={abrirParaCriar}
              onClickEvento={handleClickEvento}
              getCor={(e) => (e.usuario_id === user?.id ? CORES.voce : CORES.parceiro)}
            />
          )}
        </>
      )}

      <ModalEvento
        isOpen={isOpen}
        evento={evento}
        onSave={handleSalvar}
        onDelete={handleDeletar}
        onClose={fechar}
        readOnly={evento?.id && !eventoEhMeu}
        donoLabel={evento && !eventoEhMeu ? parceiroPorId(evento.usuario_id)?.email : undefined}
      />
    </div>
  )
}
