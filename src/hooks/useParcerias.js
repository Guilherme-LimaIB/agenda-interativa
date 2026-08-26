import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { aceitarConvite, criarConvite, encerrarParceria, listarParcerias } from '../services/parceriaService'
import { getPerfis } from '../services/perfilService'
import { supabase } from '../services/supabaseClient'
import { useAuth } from './useAuth'

export const useParcerias = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const parceriasQuery = useQuery({
    queryKey: ['parcerias', user?.id],
    queryFn: () => listarParcerias(user.id),
    enabled: !!user,
  })

  const parceriasAtivas = (parceriasQuery.data ?? []).filter((p) => p.status === 'ativo')
  const idsParceiros = parceriasAtivas.map((p) => (p.usuario_a === user?.id ? p.usuario_b : p.usuario_a))

  const perfisQuery = useQuery({
    queryKey: ['perfis-parceiros', idsParceiros],
    queryFn: () => getPerfis(idsParceiros),
    enabled: idsParceiros.length > 0,
  })

  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('parcerias-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parcerias' }, () => {
        queryClient.invalidateQueries({ queryKey: ['parcerias', user.id] })
        queryClient.invalidateQueries({ queryKey: ['eventos-compartilhados'] })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, queryClient])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['parcerias', user?.id] })
    queryClient.invalidateQueries({ queryKey: ['eventos-compartilhados'] })
  }

  const criar = useMutation({
    mutationFn: () => criarConvite(user.id),
    onSuccess: invalidate,
  })

  const aceitar = useMutation({
    mutationFn: (codigo) => aceitarConvite(codigo),
    onSuccess: invalidate,
  })

  const encerrar = useMutation({
    mutationFn: (id) => encerrarParceria(id),
    onSuccess: invalidate,
  })

  return {
    parcerias: parceriasQuery.data ?? [],
    parceriasAtivas,
    parceiros: perfisQuery.data ?? [],
    isLoading: parceriasQuery.isLoading,
    criar,
    aceitar,
    encerrar,
  }
}
