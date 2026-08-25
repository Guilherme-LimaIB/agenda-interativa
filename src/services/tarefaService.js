import { supabase } from './supabaseClient'

export const listarTarefas = async (usuarioId) => {
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('criado_em', { ascending: true })
  if (error) throw error
  return data
}

export const criarTarefa = async (usuarioId, titulo) => {
  const { data, error } = await supabase
    .from('tarefas')
    .insert({ usuario_id: usuarioId, titulo })
    .select()
    .single()
  if (error) throw error
  return data
}

export const atualizarTarefa = async (id, dados) => {
  const { data, error } = await supabase.from('tarefas').update(dados).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deletarTarefa = async (id) => {
  const { error } = await supabase.from('tarefas').delete().eq('id', id)
  if (error) throw error
}
