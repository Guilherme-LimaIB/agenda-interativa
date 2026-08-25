import { addMonths, subMonths } from 'date-fns'
import { useMemo, useState } from 'react'
import { Calendario } from '../components/Calendario/Calendario'
import { ModalEvento } from '../components/ModalEvento/ModalEvento'
import { NavBar } from '../components/NavBar/NavBar'
import { useAuth } from '../hooks/useAuth'
import { useCategorias } from '../hooks/useCategorias'
import { useEventoMutations } from '../hooks/useEventos'
import { useEventosCompartilhados } from '../hooks/useEventosCompartilhados'
import { useLembreteMutations } from '../hooks/useLembretes'
import { useModalEvento } from '../hooks/useModalEvento'
import { useParcerias } from '../hooks/useParcerias'
import { useRealtimeEventos } from '../hooks/useRealtimeEventos'
import { interpretarTexto } from '../utils/linguagemNatural'
import { expandirOcorrencias } from '../utils/recorrencia'

const CORES = { voce: '#3B82F6', parceiro: '#EC4899' }
const JANELA_INICIO = subMonths(new Date(), 3)
const JANELA_FIM = addMonths(new Date(), 18)

function PainelCompartilhamento({ parcerias, parceiros, criar, aceitar, encerrar }) {
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
      <h2 className="font-display mb-2 text-lg font-bold text-white">Compartilhar agenda</h2>
      <p className="mb-6 text-sm text-slate-400">
        Gere um código e mande pro seu par, ou digite o código que você recebeu.
      </p>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <p className="mb-2 text-sm font-medium text-slate-300">Convidar alguém</p>
        <button
          onClick={() => criar.mutate()}
          disabled={criar.isPending}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {criar.isPending ? 'Gerando...' : 'Gerar código de convite'}
        </button>

        {pendentesCriadosPorMim.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1">
            {pendentesCriadosPorMim.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                <span>
                  Código: <strong className="tracking-wider text-white">{p.codigo_convite}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400">aguardando aceite</span>
                  <button
                    onClick={() => encerrar.mutate(p.id)}
                    disabled={encerrar.isPending}
                    className="text-xs text-pink-400 hover:underline disabled:opacity-50"
                  >
                    cancelar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAceitar} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <label className="mb-2 block text-sm font-medium text-slate-300">Tenho um código</label>
        {erro && <p className="mb-2 text-sm text-pink-400">{erro}</p>}
        <div className="flex gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="ABC12345"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white uppercase tracking-wider placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={aceitar.isPending || !codigo}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Entrar
          </button>
        </div>
      </form>

      {parceiros.length > 0 && (
        <p className="mt-6 text-sm text-slate-400">
          Compartilhando com: <strong className="text-slate-200">{parceiros.map((p) => p.email).join(', ')}</strong>
        </p>
      )}
    </div>
  )
}

export function Compartilhada() {
  const { user } = useAuth()
  const { parcerias, parceriasAtivas, parceiros, criar, aceitar, encerrar } = useParcerias()
  const { data: eventos = [], isLoading } = useEventosCompartilhados()
  const { criar: criarEvento, atualizar, deletar } = useEventoMutations()
  const { salvar: salvarLembrete } = useLembreteMutations()
  const { categorias, criar: criarCategoria, deletar: deletarCategoria } = useCategorias()
  const { isOpen, evento, abrirParaCriar, abrirParaEditar, fechar } = useModalEvento()
  useRealtimeEventos()

  const eventosExpandidos = useMemo(
    () => expandirOcorrencias(eventos, JANELA_INICIO, JANELA_FIM),
    [eventos],
  )

  const temParceiroAtivo = parceriasAtivas.length > 0
  const eventoEhMeu = evento && evento.usuario_id === user?.id

  const handleClickEvento = (ocorrencia) => {
    const ehMeu = ocorrencia.usuario_id === user?.id
    abrirParaEditar(ehMeu ? (ocorrencia._original ?? ocorrencia) : ocorrencia)
  }

  const handleCriarCategoria = async (dados) => criarCategoria.mutateAsync(dados)
  const handleExcluirCategoria = async (id) => deletarCategoria.mutateAsync(id)
  const handleCriarPorTexto = (texto) => abrirParaCriar(interpretarTexto(texto))

  const handleSalvar = async (dados, lembreteMinutos) => {
    const eventoSalvo = evento?.id
      ? await atualizar.mutateAsync({ id: evento.id, dados })
      : await criarEvento.mutateAsync(dados)
    await salvarLembrete.mutateAsync({ eventoId: eventoSalvo.id, minutos: lembreteMinutos })
    fechar()
  }

  const handleDeletar = async (id) => {
    await deletar.mutateAsync(id)
    fechar()
  }

  const parceiroPorId = (id) => parceiros.find((p) => p.id === id)

  const handleDesconectar = (parceriaId, email) => {
    if (window.confirm(`Desconectar de ${email ?? 'parceiro(a)'}? Vocês deixam de ver os eventos um do outro.`)) {
      encerrar.mutate(parceriaId)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <NavBar
        onNovoEvento={temParceiroAtivo ? () => abrirParaCriar() : undefined}
        onCriarPorTexto={temParceiroAtivo ? handleCriarPorTexto : undefined}
      />

      {!temParceiroAtivo ? (
        <PainelCompartilhamento
          parcerias={parcerias}
          parceiros={parceiros}
          criar={criar}
          aceitar={aceitar}
          encerrar={encerrar}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4 border-b border-white/10 bg-white/5 px-6 py-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CORES.voce }} />
              Você
            </span>
            {parceriasAtivas.map((p) => {
              const idParceiro = p.usuario_a === user?.id ? p.usuario_b : p.usuario_a
              const email = parceiroPorId(idParceiro)?.email
              return (
                <span key={p.id} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CORES.parceiro }} />
                  {email ?? 'Parceiro(a)'}
                  <button onClick={() => handleDesconectar(p.id, email)} className="text-pink-400 hover:underline">
                    desconectar
                  </button>
                </span>
              )
            })}
          </div>

          {isLoading ? (
            <p className="p-4 text-sm text-slate-500">Carregando agenda compartilhada...</p>
          ) : (
            <Calendario
              eventos={eventosExpandidos}
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
        categorias={categorias}
        onCriarCategoria={handleCriarCategoria}
        onExcluirCategoria={handleExcluirCategoria}
        onSave={handleSalvar}
        onDelete={handleDeletar}
        onClose={fechar}
        readOnly={evento?.id && !eventoEhMeu}
        donoLabel={evento && !eventoEhMeu ? parceiroPorId(evento.usuario_id)?.email : undefined}
      />
    </div>
  )
}
