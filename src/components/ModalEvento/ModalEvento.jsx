import { FormEvento } from '../FormEvento/FormEvento'
import { Button } from '../ui/Button'

export function ModalEvento({
  isOpen,
  evento,
  categorias,
  onCriarCategoria,
  onExcluirCategoria,
  onSave,
  onDelete,
  onClose,
  readOnly,
  donoLabel,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-md border border-line bg-surface p-6 shadow-lg">
        <h2 className="fd-heading-lg mb-4">
          {readOnly ? evento.titulo : evento?.id ? 'Editar evento' : 'Novo evento'}
        </h2>

        {readOnly ? (
          <div className="fd-body flex flex-col gap-2 text-ink">
            {donoLabel && <p className="fd-meta text-muted">{donoLabel}</p>}
            {evento.descricao && <p>{evento.descricao}</p>}
            <p>
              {new Date(evento.data_inicio).toLocaleString('pt-BR')} até{' '}
              {new Date(evento.data_fim).toLocaleString('pt-BR')}
            </p>
            {evento.local && <p className="fd-meta text-muted">Local: {evento.local}</p>}
            <Button variant="ghost" onClick={onClose} className="mt-4 self-end">
              Fechar
            </Button>
          </div>
        ) : (
          <FormEvento
            evento={evento}
            categorias={categorias}
            onCriarCategoria={onCriarCategoria}
            onExcluirCategoria={onExcluirCategoria}
            onSubmit={onSave}
            onCancel={onClose}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  )
}
