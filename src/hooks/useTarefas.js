import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { atualizarTarefa, criarTarefa, deletarTarefa, listarTarefas } from '../services/tarefaService'
import { useAuth } from './useAuth'

export const useTarefas = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['tarefas', user?.id],
    queryFn: () => listarTarefas(user.id),
    enabled: !!user,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tarefas', user?.id] })

  const criar = useMutation({
    mutationFn: (titulo) => criarTarefa(user.id, titulo),
    onSuccess: invalidate,
  })

  const atualizar = useMutation({
    mutationFn: ({ id, dados }) => atualizarTarefa(id, dados),
    onSuccess: invalidate,
  })

  const deletar = useMutation({
    mutationFn: (id) => deletarTarefa(id),
    onSuccess: invalidate,
  })

  return { tarefas: query.data ?? [], isLoading: query.isLoading, criar, atualizar, deletar }
}
