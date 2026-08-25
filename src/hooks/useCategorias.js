import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarCategoria, deletarCategoria, listarCategorias } from '../services/categoriaService'
import { useAuth } from './useAuth'

export const useCategorias = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['categorias', user?.id],
    queryFn: () => listarCategorias(user.id),
    enabled: !!user,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categorias', user?.id] })

  const criar = useMutation({
    mutationFn: ({ nome, cor }) => criarCategoria(user.id, nome, cor),
    onSuccess: invalidate,
  })

  const deletar = useMutation({
    mutationFn: (id) => deletarCategoria(id),
    onSuccess: invalidate,
  })

  return { categorias: query.data ?? [], isLoading: query.isLoading, criar, deletar }
}
