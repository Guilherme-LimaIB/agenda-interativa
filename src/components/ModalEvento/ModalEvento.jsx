import { FormEvento } from '../FormEvento/FormEvento'

export function ModalEvento({
  isOpen,
  evento,
  categorias,
  onCriarCategoria,
  onSave,
  onDelete,
  onClose,
  readOnly,
  donoLabel,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <h2 className="font-display mb-4 text-lg font-bold text-white">
          {readOnly ? evento.titulo : evento?.id ? 'Editar Evento' : 'Novo Evento'}
        </h2>

        {readOnly ? (
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            {donoLabel && <p className="text-xs font-medium text-slate-500">{donoLabel}</p>}
            {evento.descricao && <p>{evento.descricao}</p>}
            <p>
              {new Date(evento.data_inicio).toLocaleString('pt-BR')} até{' '}
              {new Date(evento.data_fim).toLocaleString('pt-BR')}
            </p>
            {evento.local && <p>📍 {evento.local}</p>}
            <button
              onClick={onClose}
              className="mt-4 self-end rounded-full px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Fechar
            </button>
          </div>
        ) : (
          <FormEvento
            evento={evento}
            categorias={categorias}
            onCriarCategoria={onCriarCategoria}
            onSubmit={onSave}
            onCancel={onClose}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  )
}
