import { supabase } from './supabaseClient'

export const listarCategorias = async (usuarioId) => {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('nome', { ascending: true })
  if (error) throw error
  return data
}

export const criarCategoria = async (usuarioId, nome, cor) => {
  const { data, error } = await supabase
    .from('categorias')
    .insert({ usuario_id: usuarioId, nome, cor })
    .select()
    .single()
  if (error) throw error
  return data
}

export const deletarCategoria = async (id) => {
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  if (error) throw error
}
