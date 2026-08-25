export function ListaEventos({ eventos, onClickEvento }) {
  if (!eventos.length) {
    return <p className="p-4 text-sm text-slate-500">Nenhum evento por aqui ainda.</p>
  }

  return (
    <ul className="divide-y divide-white/5">
      {eventos.map((evento) => (
        <li
          key={evento.id}
          onClick={() => onClickEvento(evento)}
          className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-white/5"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: evento.categorias?.cor || evento.cor }}
          />
          <div>
            <p className="text-sm font-medium text-slate-100">
              {evento.recorrencia && '🔁 '}
              {evento.titulo}
            </p>
            <p className="text-xs text-slate-500">
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
