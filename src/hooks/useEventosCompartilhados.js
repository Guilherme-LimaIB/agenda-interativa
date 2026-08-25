import { useQuery } from '@tanstack/react-query'
import { getEventosVisiveis } from '../services/eventoService'
import { useAuth } from './useAuth'

export const useEventosCompartilhados = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['eventos-compartilhados'],
    queryFn: getEventosVisiveis,
    enabled: !!user,
    staleTime: 60 * 1000,
  })
}
