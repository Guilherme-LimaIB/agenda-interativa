import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import { NavBar } from '../components/NavBar/NavBar'
import { useTarefas } from '../hooks/useTarefas'

const QUADRANTES = [
  { id: 'fazer', urgente: true, importante: true, titulo: '🔥 Fazer Primeiro', dica: 'Urgente e importante' },
  { id: 'agendar', urgente: false, importante: true, titulo: '🗓️ Agendar', dica: 'Importante, não urgente' },
  { id: 'delegar', urgente: true, importante: false, titulo: '🤝 Delegar', dica: 'Urgente, não importante' },
  { id: 'eliminar', urgente: false, importante: false, titulo: '🗑️ Eliminar', dica: 'Nem urgente, nem importante' },
]

const COLUNAS = [
  { id: 'a_fazer', titulo: 'A Fazer' },
  { id: 'em_progresso', titulo: 'Em Progresso' },
  { id: 'concluido', titulo: 'Concluído' },
]

function TarefaCard({ tarefa, onExcluir }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: tarefa.id })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <span {...listeners} {...attributes} className="flex-1 cursor-grab">
        {tarefa.titulo}
      </span>
      <button
        onClick={() => onExcluir(tarefa.id)}
        className="text-slate-500 opacity-0 hover:text-pink-400 group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}

function Zona({ id, titulo, dica, tarefas, onExcluir }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[160px] flex-col gap-2 rounded-2xl border p-3 backdrop-blur-xl transition ${
        isOver ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <div>
        <p className="font-display text-sm font-bold text-white">{titulo}</p>
        {dica && <p className="text-xs text-slate-500">{dica}</p>}
      </div>
      {tarefas.map((t) => (
        <TarefaCard key={t.id} tarefa={t} onExcluir={onExcluir} />
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
    <div className="min-h-screen bg-slate-950">
      <NavBar />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-6 py-2">
        <form onSubmit={handleCriar} className="flex gap-2">
          <input
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            placeholder="Nova tarefa..."
            className="w-64 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!novoTitulo.trim()}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Adicionar
          </button>
        </form>

        <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-sm">
          <button
            onClick={() => setVista('matriz')}
            className={`rounded-full px-3 py-1 ${vista === 'matriz' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
          >
            Matriz
          </button>
          <button
            onClick={() => setVista('kanban')}
            className={`rounded-full px-3 py-1 ${vista === 'kanban' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
          >
            Kanban
          </button>
        </div>
      </div>

      <div className="p-6">
        <DndContext onDragEnd={handleDragEnd}>
          {vista === 'matriz' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {COLUNAS.map((c) => (
                <Zona
                  key={c.id}
                  id={c.id}
                  titulo={c.titulo}
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
