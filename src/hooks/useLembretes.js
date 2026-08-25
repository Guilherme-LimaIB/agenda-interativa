import { useMutation, useQueryClient } from '@tanstack/react-query'
import { upsertLembrete } from '../services/lembreteService'

export const useLembreteMutations = () => {
  const queryClient = useQueryClient()

  const salvar = useMutation({
    mutationFn: ({ eventoId, minutos }) => upsertLembrete(eventoId, minutos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
      queryClient.invalidateQueries({ queryKey: ['eventos-compartilhados'] })
    },
  })

  return { salvar }
}
