import { supabase } from './supabaseClient'

export const upsertLembrete = async (eventoId, tempoAntesMinutos) => {
  const { data: existente } = await supabase
    .from('lembretes')
    .select('id')
    .eq('evento_id', eventoId)
    .maybeSingle()

  if (tempoAntesMinutos == null) {
    if (existente) await supabase.from('lembretes').delete().eq('id', existente.id)
    return
  }

  if (existente) {
    const { error } = await supabase
      .from('lembretes')
      .update({ tempo_antes_minutos: tempoAntesMinutos, enviado: false })
      .eq('id', existente.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('lembretes')
      .insert({ evento_id: eventoId, tipo: 'email', tempo_antes_minutos: tempoAntesMinutos, enviado: false })
    if (error) throw error
  }
}
