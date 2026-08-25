import { supabase } from './supabaseClient'

export const signup = async (email, senha) => {
  const { data, error } = await supabase.auth.signUp({ email, password: senha })
  if (error) throw error
  return data
}

export const login = async (email, senha) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) throw error
  return data
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}
