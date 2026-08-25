import { useState } from 'react'

const toLocalInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function FormEvento({ evento, onSubmit, onCancel, onDelete }) {
  const [titulo, setTitulo] = useState(evento?.titulo ?? '')
  const [descricao, setDescricao] = useState(evento?.descricao ?? '')
  const [dataInicio, setDataInicio] = useState(toLocalInput(evento?.data_inicio))
  const [dataFim, setDataFim] = useState(toLocalInput(evento?.data_fim))
  const [local, setLocal] = useState(evento?.local ?? '')
  const [cor, setCor] = useState(evento?.cor ?? '#3B82F6')
  const [lembrete, setLembrete] = useState(
    evento?.lembretes?.[0]?.tempo_antes_minutos != null
      ? String(evento.lembretes[0].tempo_antes_minutos)
      : '',
  )
  const [erro, setErro] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!titulo || !dataInicio || !dataFim) {
      setErro('Preencha título, início e fim.')
      return
    }
    if (new Date(dataFim) < new Date(dataInicio)) {
      setErro('O fim precisa ser depois do início.')
      return
    }
    setErro('')
    onSubmit(
      {
        titulo,
        descricao,
        data_inicio: new Date(dataInicio).toISOString(),
        data_fim: new Date(dataFim).toISOString(),
        local,
        cor,
      },
      lembrete === '' ? null : Number(lembrete),
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Título
        <input
          className="rounded-md border border-gray-300 px-3 py-2"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Descrição
        <textarea
          className="rounded-md border border-gray-300 px-3 py-2"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={2}
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-gray-700">
          Início
          <input
            type="datetime-local"
            className="rounded-md border border-gray-300 px-3 py-2"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm text-gray-700">
          Fim
          <input
            type="datetime-local"
            className="rounded-md border border-gray-300 px-3 py-2"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Local
        <input
          className="rounded-md border border-gray-300 px-3 py-2"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />
      </label>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Cor
          <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-gray-700">
          Lembrete por email
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={lembrete}
            onChange={(e) => setLembrete(e.target.value)}
          >
            <option value="">Nenhum</option>
            <option value="15">15 min antes</option>
            <option value="30">30 min antes</option>
            <option value="60">1 hora antes</option>
            <option value="180">3 horas antes</option>
            <option value="1440">1 dia antes</option>
          </select>
        </label>
      </div>

      <div className="mt-2 flex justify-between">
        <div>
          {evento?.id && (
            <button
              type="button"
              onClick={() => onDelete(evento.id)}
              className="rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Excluir
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="rounded-md px-3 py-2 text-sm text-gray-600">
            Cancelar
          </button>
          <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">
            Salvar
          </button>
        </div>
      </div>
    </form>
  )
}
