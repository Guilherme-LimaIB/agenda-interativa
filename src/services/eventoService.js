import { supabase } from './supabaseClient'

export const getEventos = async (usuarioId) => {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('data_inicio', { ascending: true })
  if (error) throw error
  return data
}

export const createEvento = async (eventoData) => {
  const { data, error } = await supabase.from('eventos').insert(eventoData).select().single()
  if (error) throw error
  return data
}

export const updateEvento = async (id, dados) => {
  const { data, error } = await supabase.from('eventos').update(dados).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteEvento = async (id) => {
  const { error } = await supabase.from('eventos').delete().eq('id', id)
  if (error) throw error
}
