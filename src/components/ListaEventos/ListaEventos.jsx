import { EmptyState } from '../ui/EmptyState'

export function ListaEventos({ eventos, onClickEvento }) {
  if (!eventos.length) {
    return <EmptyState message="Nenhum evento por aqui ainda." className="px-4" />
  }

  return (
    <ul className="divide-y divide-line">
      {eventos.map((evento) => (
        <li
          key={evento.id}
          onClick={() => onClickEvento(evento)}
          className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-line/20"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: evento.categorias?.cor || evento.cor }}
          />
          <div>
            <p className="fd-ui text-ink">
              {evento.recorrencia && '↻ '}
              {evento.titulo}
            </p>
            <p className="fd-meta text-muted">
              {new Date(evento.data_inicio).toLocaleString('pt-BR')}
              {evento.local ? ` · ${evento.local}` : ''}
              {evento.categorias ? ` · ${evento.categorias.nome}` : ''}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
