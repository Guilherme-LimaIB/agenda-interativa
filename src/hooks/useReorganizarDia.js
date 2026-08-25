import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAfter, isToday } from 'date-fns'
import { updateEvento } from '../services/eventoService'

// Eventos de hoje que ainda não começaram e não são recorrentes (mexer na
// série de um evento recorrente mudaria todas as ocorrências futuras, não
// só a de hoje -- por isso ficam de fora do ajuste automático).
export const eventosRestantesHoje = (eventos) => {
  const agora = new Date()
  return eventos.filter(
    (e) => !e.recorrencia && isToday(new Date(e.data_inicio)) && isAfter(new Date(e.data_inicio), agora),
  )
}

export const useReorganizarDia = (eventos) => {
  const queryClient = useQueryClient()

  const reorganizar = useMutation({
    mutationFn: async (minutos) => {
      const afetados = eventosRestantesHoje(eventos)
      await Promise.all(
        afetados.map((e) => {
          const novoInicio = new Date(new Date(e.data_inicio).getTime() + minutos * 60000).toISOString()
          const novoFim = new Date(new Date(e.data_fim).getTime() + minutos * 60000).toISOString()
          return updateEvento(e.id, { data_inicio: novoInicio, data_fim: novoFim })
        }),
      )
      return afetados.length
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
    },
  })

  return { reorganizar }
}
