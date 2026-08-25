import { useState } from 'react'

export const useModalEvento = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [evento, setEvento] = useState(null)

  const abrirParaCriar = (inicial) => {
    if (!inicial) {
      setEvento(null)
    } else if (inicial.start || inicial.end) {
      // vindo do calendário (slotInfo do react-big-calendar: {start, end})
      setEvento({ data_inicio: inicial.start, data_fim: inicial.end })
    } else {
      // partial evento já pronto (ex: vindo do "criar por texto")
      setEvento(inicial)
    }
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
