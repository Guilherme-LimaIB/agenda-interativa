import { FormEvento } from '../FormEvento/FormEvento'

export function ModalEvento({ isOpen, evento, onSave, onDelete, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {evento?.id ? 'Editar Evento' : 'Novo Evento'}
        </h2>
        <FormEvento evento={evento} onSubmit={onSave} onCancel={onClose} onDelete={onDelete} />
      </div>
    </div>
  )
}
