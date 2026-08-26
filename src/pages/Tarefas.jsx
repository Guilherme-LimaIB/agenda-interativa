import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import { NavBar } from '../components/NavBar/NavBar'
import { Button } from '../components/ui/Button'
import { useTarefas } from '../hooks/useTarefas'

const QUADRANTES = [
  { id: 'fazer', urgente: true, importante: true, titulo: 'Fazer primeiro', dica: 'Urgente e importante' },
  { id: 'agendar', urgente: false, importante: true, titulo: 'Agendar', dica: 'Importante, não urgente' },
  { id: 'delegar', urgente: true, importante: false, titulo: 'Delegar', dica: 'Urgente, não importante' },
  { id: 'eliminar', urgente: false, importante: false, titulo: 'Eliminar', dica: 'Nem urgente, nem importante' },
]

const COLUNAS = [
  { id: 'a_fazer', titulo: 'A fazer' },
  { id: 'em_progresso', titulo: 'Em progresso' },
  { id: 'concluido', titulo: 'Concluído' },
]

function TarefaLinha({ tarefa, onExcluir }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: tarefa.id })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between gap-2 border-b border-line py-2 fd-ui text-ink ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <span {...listeners} {...attributes} className="flex-1 cursor-grab">
        {tarefa.titulo}
      </span>
      <button
        onClick={() => onExcluir(tarefa.id)}
        className="text-muted opacity-0 hover:text-signal group-hover:opacity-100"
        aria-label="Excluir tarefa"
      >
        ✕
      </button>
    </div>
  )
}

function Zona({ id, titulo, dica, tarefas, onExcluir, className = '' }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[180px] flex-col gap-1 p-4 transition ${isOver ? 'bg-signal-soft/40' : ''} ${className}`}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <p className="fd-heading text-ink">{titulo}</p>
        {dica && <p className="fd-meta text-muted">{dica}</p>}
      </div>
      {tarefas.length === 0 ? (
        <p className="fd-meta text-muted">Nenhuma tarefa aqui.</p>
      ) : (
        tarefas.map((t) => <TarefaLinha key={t.id} tarefa={t} onExcluir={onExcluir} />)
      )}
    </div>
  )
}

function ToggleVista({ vista, setVista }) {
  const opcoes = [
    { id: 'matriz', label: 'Matriz' },
    { id: 'kanban', label: 'Kanban' },
  ]
  return (
    <div className="flex gap-5">
      {opcoes.map((o) => (
        <button
          key={o.id}
          onClick={() => setVista(o.id)}
          className={`fd-ui border-b-2 pb-1 ${
            vista === o.id ? 'border-signal text-ink' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Tarefas() {
  const { tarefas, criar, atualizar, deletar } = useTarefas()
  const [vista, setVista] = useState('matriz')
  const [novoTitulo, setNovoTitulo] = useState('')

  const handleCriar = (e) => {
    e.preventDefault()
    if (!novoTitulo.trim()) return
    criar.mutate(novoTitulo)
    setNovoTitulo('')
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over) return
    const tarefa = tarefas.find((t) => t.id === active.id)
    if (!tarefa) return

    if (vista === 'matriz') {
      const quadrante = QUADRANTES.find((q) => q.id === over.id)
      if (!quadrante) return
      if (tarefa.urgente === quadrante.urgente && tarefa.importante === quadrante.importante) return
      atualizar.mutate({ id: tarefa.id, dados: { urgente: quadrante.urgente, importante: quadrante.importante } })
    } else {
      if (tarefa.status === over.id) return
      atualizar.mutate({ id: tarefa.id, dados: { status: over.id } })
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <NavBar />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-6 py-3">
        <form onSubmit={handleCriar} className="flex min-w-0 flex-1 gap-2 sm:flex-none">
          <input
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            placeholder="Nova tarefa..."
            className="fd-ui min-w-0 flex-1 border-b border-line bg-transparent px-1 py-1.5 text-ink placeholder:text-muted focus:border-signal focus:outline-none sm:w-64 sm:flex-none"
          />
          <Button type="submit" variant="secondary" disabled={!novoTitulo.trim()}>
            Adicionar
          </Button>
        </form>

        <ToggleVista vista={vista} setVista={setVista} />
      </div>

      <div className="p-6">
        <DndContext onDragEnd={handleDragEnd}>
          {vista === 'matriz' ? (
            <div className="grid grid-cols-1 divide-y divide-line border border-line sm:grid-cols-2 sm:divide-x">
              {QUADRANTES.map((q) => (
                <Zona
                  key={q.id}
                  id={q.id}
                  titulo={q.titulo}
                  dica={q.dica}
                  tarefas={tarefas.filter((t) => t.urgente === q.urgente && t.importante === q.importante)}
                  onExcluir={(id) => deletar.mutate(id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 divide-y divide-line border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {COLUNAS.map((c) => (
                <Zona
                  key={c.id}
                  id={c.id}
                  titulo={`${c.titulo} · ${tarefas.filter((t) => t.status === c.id).length}`}
                  tarefas={tarefas.filter((t) => t.status === c.id)}
                  onExcluir={(id) => deletar.mutate(id)}
                />
              ))}
            </div>
          )}
        </DndContext>
      </div>
    </div>
  )
}
