import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useRealtimeEventos = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('eventos-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eventos' }, () => {
        queryClient.invalidateQueries({ queryKey: ['eventos'] })
        queryClient.invalidateQueries({ queryKey: ['eventos-compartilhados'] })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
