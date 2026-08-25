import { supabase } from './supabaseClient'

const gerarCodigo = () => Math.random().toString(36).slice(2, 10).toUpperCase()

export const criarConvite = async (usuarioId) => {
  const { data, error } = await supabase
    .from('parcerias')
    .insert({ usuario_a: usuarioId, codigo_convite: gerarCodigo() })
    .select()
    .single()
  if (error) throw error
  return data
}

export const aceitarConvite = async (codigo) => {
  const { data, error } = await supabase.rpc('aceitar_convite', { p_codigo: codigo.trim().toUpperCase() })
  if (error) throw error
  return data
}

export const listarParcerias = async (usuarioId) => {
  const { data, error } = await supabase
    .from('parcerias')
    .select('*')
    .or(`usuario_a.eq.${usuarioId},usuario_b.eq.${usuarioId}`)
    .order('criado_em', { ascending: false })
  if (error) throw error
  return data
}
