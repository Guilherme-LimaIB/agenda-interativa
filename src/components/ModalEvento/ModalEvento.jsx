import { FormEvento } from '../FormEvento/FormEvento'

export function ModalEvento({ isOpen, evento, onSave, onDelete, onClose, readOnly, donoLabel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {readOnly ? evento.titulo : evento?.id ? 'Editar Evento' : 'Novo Evento'}
        </h2>

        {readOnly ? (
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {donoLabel && <p className="text-xs font-medium text-gray-400">{donoLabel}</p>}
            {evento.descricao && <p>{evento.descricao}</p>}
            <p>
              {new Date(evento.data_inicio).toLocaleString('pt-BR')} até{' '}
              {new Date(evento.data_fim).toLocaleString('pt-BR')}
            </p>
            {evento.local && <p>📍 {evento.local}</p>}
            <button
              onClick={onClose}
              className="mt-4 self-end rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Fechar
            </button>
          </div>
        ) : (
          <FormEvento evento={evento} onSubmit={onSave} onCancel={onClose} onDelete={onDelete} />
        )}
      </div>
    </div>
  )
}
