import { useEffect, useState } from 'react'
import { ativarPush, desativarPush, obterInscricaoAtual, suportaPush } from '../services/pushService'
import { useAuth } from './useAuth'

export const usePush = () => {
  const { user } = useAuth()
  const [ativado, setAtivado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!suportaPush()) {
      setCarregando(false)
      return
    }
    obterInscricaoAtual()
      .then((subscription) => setAtivado(!!subscription))
      .catch(() => setAtivado(false))
      .finally(() => setCarregando(false))
  }, [])

  const ativar = async () => {
    setErro('')
    try {
      await ativarPush(user.id)
      setAtivado(true)
    } catch (err) {
      setErro(err.message)
    }
  }

  const desativar = async () => {
    setErro('')
    try {
      await desativarPush()
      setAtivado(false)
    } catch (err) {
      setErro(err.message)
    }
  }

  return { suportado: suportaPush(), ativado, carregando, erro, ativar, desativar }
}
