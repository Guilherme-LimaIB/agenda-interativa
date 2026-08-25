import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createEvento, deleteEvento, getEventos, updateEvento } from '../services/eventoService'
import { useAuth } from './useAuth'

export const useEventos = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['eventos', user?.id],
    queryFn: () => getEventos(user.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

export const useEventoMutations = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['eventos', user?.id] })

  const criar = useMutation({
    mutationFn: (dados) => createEvento({ ...dados, usuario_id: user.id }),
    onSuccess: invalidate,
  })

  const atualizar = useMutation({
    mutationFn: ({ id, dados }) => updateEvento(id, dados),
    onSuccess: invalidate,
  })

  const deletar = useMutation({
    mutationFn: (id) => deleteEvento(id),
    onSuccess: invalidate,
  })

  return { criar, atualizar, deletar }
}
