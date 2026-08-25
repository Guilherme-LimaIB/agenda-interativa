import { addDays, addMonths, addWeeks, addYears } from 'date-fns'

const PASSOS = {
  diaria: (d) => addDays(d, 1),
  semanal: (d) => addWeeks(d, 1),
  mensal: (d) => addMonths(d, 1),
  anual: (d) => addYears(d, 1),
}

const MAX_OCORRENCIAS = 800

export const RECORRENCIA_LABELS = {
  diaria: 'Diariamente',
  semanal: 'Semanalmente',
  mensal: 'Mensalmente',
  anual: 'Anualmente',
}

export function expandirOcorrencias(eventos, janelaInicio, janelaFim) {
  const resultado = []

  for (const evento of eventos) {
    if (!evento.recorrencia || !PASSOS[evento.recorrencia]) {
      resultado.push({ ...evento, _original: evento })
      continue
    }

    const inicioBase = new Date(evento.data_inicio)
    const duracaoMs = new Date(evento.data_fim) - inicioBase
    const limite = evento.recorrencia_ate ? new Date(evento.recorrencia_ate) : janelaFim
    const passo = PASSOS[evento.recorrencia]

    let atual = inicioBase
    let i = 0
    while (atual <= limite && atual <= janelaFim && i < MAX_OCORRENCIAS) {
      if (atual >= janelaInicio) {
        resultado.push({
          ...evento,
          id: `${evento.id}__${i}`,
          data_inicio: atual.toISOString(),
          data_fim: new Date(atual.getTime() + duracaoMs).toISOString(),
          _original: evento,
        })
      }
      atual = passo(atual)
      i++
    }
  }

  return resultado
}
