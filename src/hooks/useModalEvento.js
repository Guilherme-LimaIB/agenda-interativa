import { useState } from 'react'

export const useModalEvento = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [evento, setEvento] = useState(null)

  const abrirParaCriar = (slotInfo) => {
    setEvento(slotInfo ? { data_inicio: slotInfo.start, data_fim: slotInfo.end } : null)
    setIsOpen(true)
  }

  const abrirParaEditar = (eventoExistente) => {
    setEvento(eventoExistente)
    setIsOpen(true)
  }

  const fechar = () => {
    setIsOpen(false)
    setEvento(null)
  }

  return { isOpen, evento, abrirParaCriar, abrirParaEditar, fechar }
}
