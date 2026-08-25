import { useState } from 'react'

const toLocalInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const toDateInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

const inputClasses =
  'rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none'

export function FormEvento({
  evento,
  categorias,
  onCriarCategoria,
  onExcluirCategoria,
  onSubmit,
  onCancel,
  onDelete,
}) {
  const [titulo, setTitulo] = useState(evento?.titulo ?? '')
  const [descricao, setDescricao] = useState(evento?.descricao ?? '')
  const [dataInicio, setDataInicio] = useState(toLocalInput(evento?.data_inicio))
  const [dataFim, setDataFim] = useState(toLocalInput(evento?.data_fim))
  const [local, setLocal] = useState(evento?.local ?? '')
  const [cor, setCor] = useState(evento?.cor ?? '#3B82F6')
  const [categoriaId, setCategoriaId] = useState(evento?.categoria_id ?? '')
  const [novaCategoria, setNovaCategoria] = useState(null)
  const [repetir, setRepetir] = useState(evento?.recorrencia ?? '')
  const [repetirAte, setRepetirAte] = useState(toDateInput(evento?.recorrencia_ate))
  const [lembrete, setLembrete] = useState(
    evento?.lembretes?.[0]?.tempo_antes_minutos != null
      ? String(evento.lembretes[0].tempo_antes_minutos)
      : '',
  )
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const handleSelecionarCategoria = (valor) => {
    if (valor === '__nova__') {
      setNovaCategoria({ nome: '', cor: '#3B82F6' })
    } else {
      setCategoriaId(valor)
    }
  }

  const handleCriarCategoria = async () => {
    if (!novaCategoria.nome.trim()) return
    setErro('')
    try {
      const criada = await onCriarCategoria(novaCategoria)
      setCategoriaId(criada.id)
      setNovaCategoria(null)
    } catch (err) {
      setErro(err.message || 'Não foi possível criar a categoria. Tente novamente.')
    }
  }

  const handleExcluirCategoria = async () => {
    const categoria = categorias?.find((c) => c.id === categoriaId)
    if (
      !window.confirm(
        `Excluir a categoria "${categoria?.nome ?? ''}"? Isso remove a categoria de todos os eventos que a usam (os eventos não são apagados).`,
      )
    ) {
      return
    }
    setErro('')
    try {
      await onExcluirCategoria(categoriaId)
      setCategoriaId('')
    } catch (err) {
      setErro(err.message || 'Não foi possível excluir a categoria. Tente novamente.')
    }
  }

  const handleExcluirEvento = async () => {
    setErro('')
    setExcluindo(true)
    try {
      await onDelete(evento.id)
    } catch (err) {
      setErro(err.message || 'Não foi possível excluir o evento. Tente novamente.')
      setExcluindo(false)
    }
  }

  const handleSubmit = async (e) => {
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
    setSalvando(true)
    try {
      await onSubmit(
        {
          titulo,
          descricao,
          data_inicio: new Date(dataInicio).toISOString(),
          data_fim: new Date(dataFim).toISOString(),
          local,
          cor,
          categoria_id: categoriaId || null,
          recorrencia: repetir || null,
          recorrencia_ate: repetir && repetirAte ? new Date(`${repetirAte}T23:59:59`).toISOString() : null,
        },
        repetir ? null : lembrete === '' ? null : Number(lembrete),
      )
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar o evento. Tente novamente.')
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {erro && <p className="text-sm text-pink-400">{erro}</p>}
      {evento?.recorrencia && (
        <p className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300">
          🔁 Evento recorrente — alterar ou excluir afeta todas as ocorrências.
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Título
        <input className={inputClasses} value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Descrição
        <textarea
          className={inputClasses}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={2}
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
          Início
          <input
            type="datetime-local"
            className={`${inputClasses} [color-scheme:dark]`}
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
          Fim
          <input
            type="datetime-local"
            className={`${inputClasses} [color-scheme:dark]`}
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
          Repetir
          <select className={inputClasses} value={repetir} onChange={(e) => setRepetir(e.target.value)}>
            <option value="">Não se repete</option>
            <option value="diaria">Diariamente</option>
            <option value="semanal">Semanalmente</option>
            <option value="mensal">Mensalmente</option>
            <option value="anual">Anualmente</option>
          </select>
        </label>
        {repetir && (
          <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
            Repetir até (opcional)
            <input
              type="date"
              className={`${inputClasses} [color-scheme:dark]`}
              value={repetirAte}
              onChange={(e) => setRepetirAte(e.target.value)}
            />
          </label>
        )}
      </div>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Local
        <input className={inputClasses} value={local} onChange={(e) => setLocal(e.target.value)} />
      </label>

      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
          Categoria
          <select
            className={inputClasses}
            value={categoriaId}
            onChange={(e) => handleSelecionarCategoria(e.target.value)}
          >
            <option value="">Sem categoria</option>
            {categorias?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
            <option value="__nova__">+ Nova categoria...</option>
          </select>
        </label>
        {categoriaId && (
          <button
            type="button"
            onClick={handleExcluirCategoria}
            title="Excluir categoria"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-pink-400 hover:bg-pink-500/10"
          >
            🗑
          </button>
        )}
      </div>

      {novaCategoria && (
        <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
          <label className="flex flex-1 flex-col gap-1 text-xs text-slate-400">
            Nome da categoria
            <input
              autoFocus
              className={`${inputClasses} py-1.5 text-sm`}
              value={novaCategoria.nome}
              onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Cor
            <input
              type="color"
              className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent"
              value={novaCategoria.cor}
              onChange={(e) => setNovaCategoria({ ...novaCategoria, cor: e.target.value })}
            />
          </label>
          <button
            type="button"
            onClick={handleCriarCategoria}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1.5 text-sm font-medium text-white"
          >
            Criar
          </button>
          <button type="button" onClick={() => setNovaCategoria(null)} className="px-2 py-1.5 text-sm text-slate-400">
            Cancelar
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          Cor
          <input
            type="color"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
        </label>

        {repetir ? (
          <p className="flex-1 text-xs text-slate-500">
            Lembrete por email ainda não funciona para eventos recorrentes.
          </p>
        ) : (
          <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
            Lembrete por email
            <select className={inputClasses} value={lembrete} onChange={(e) => setLembrete(e.target.value)}>
              <option value="">Nenhum</option>
              <option value="15">15 min antes</option>
              <option value="30">30 min antes</option>
              <option value="60">1 hora antes</option>
              <option value="180">3 horas antes</option>
              <option value="1440">1 dia antes</option>
            </select>
          </label>
        )}
      </div>

      <div className="mt-2 flex justify-between">
        <div>
          {evento?.id && (
            <button
              type="button"
              onClick={handleExcluirEvento}
              disabled={excluindo}
              className="rounded-full px-3 py-2 text-sm text-pink-400 hover:bg-pink-500/10 disabled:opacity-50"
            >
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={salvando}
            className="rounded-full px-3 py-2 text-sm text-slate-400 hover:bg-white/5 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </form>
  )
}
