import { supabase } from './supabaseClient'

export const getPerfis = async (ids) => {
  if (!ids.length) return []
  const { data, error } = await supabase.from('perfis').select('*').in('id', ids)
  if (error) throw error
  return data
}
