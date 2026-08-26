import { useState } from 'react'
import { useTarefas } from '../../hooks/useTarefas'
import { extrairTarefas } from '../../utils/planejarTarefas'
import { Button } from '../ui/Button'

export function PlanejarComIA() {
  const { criar } = useTarefas()
  const [texto, setTexto] = useState('')
  const [estado, setEstado] = useState('idle') // idle | sugestoes | erro
  const [sugestoes, setSugestoes] = useState([])
  const [salvando, setSalvando] = useState(false)

  const handleGerar = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    const extraidas = extrairTarefas(texto)
    if (extraidas.length === 0) {
      setEstado('erro')
      return
    }
    setSugestoes(extraidas.map((titulo, i) => ({ id: i, titulo, selecionada: true })))
    setEstado('sugestoes')
  }

  const handleToggle = (id) => {
    setSugestoes((atual) => atual.map((s) => (s.id === id ? { ...s, selecionada: !s.selecionada } : s)))
  }

  const handleAdicionar = async () => {
    const selecionadas = sugestoes.filter((s) => s.selecionada)
    if (selecionadas.length === 0) return
    setSalvando(true)
    try {
      await Promise.all(selecionadas.map((s) => criar.mutateAsync(s.titulo)))
      setTexto('')
      setSugestoes([])
      setEstado('idle')
    } catch {
      setEstado('erro')
    } finally {
      setSalvando(false)
    }
  }

  const handleTentarNovamente = () => {
    setEstado('idle')
    setSugestoes([])
  }

  return (
    <div className="border border-line bg-surface p-6">
      <h2 className="fd-heading uppercase">Planejar com IA</h2>
      <p className="fd-body mt-1 text-muted">
        Descreva o que você precisa organizar. O FlowDaily transforma isso em tarefas para você revisar.
      </p>

      {estado !== 'sugestoes' && (
        <form onSubmit={handleGerar} className="mt-4">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ex.: preciso preparar uma apresentação para sexta, estudar 2 capítulos e comprar os materiais"
            rows={3}
            className="fd-body w-full resize-none border border-line bg-transparent p-3 text-ink placeholder:text-muted focus:border-signal focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="fd-meta text-muted">Você revisa as sugestões antes de adicioná-las.</p>
            <Button type="submit" variant="primary" disabled={!texto.trim()}>
              Gerar tarefas →
            </Button>
          </div>
          {estado === 'erro' && (
            <p className="fd-ui mt-3 text-signal">Não foi possível gerar as tarefas. Tente novamente.</p>
          )}
        </form>
      )}

      {estado === 'sugestoes' && (
        <div className="mt-4">
          <p className="fd-meta text-muted uppercase">Sugestões · {sugestoes.length}</p>
          <ul className="mt-2 flex flex-col divide-y divide-line">
            {sugestoes.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-2.5">
                <input
                  type="checkbox"
                  checked={s.selecionada}
                  onChange={() => handleToggle(s.id)}
                  className="h-4 w-4 accent-ink"
                />
                <span className="fd-ui">{s.titulo}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={handleTentarNovamente} className="fd-ui text-muted hover:text-ink">
              Tentar novamente
            </button>
            <Button variant="primary" onClick={handleAdicionar} disabled={salvando}>
              {salvando ? 'Adicionando...' : 'Adicionar selecionadas'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
