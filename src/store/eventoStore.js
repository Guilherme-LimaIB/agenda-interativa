import { create } from 'zustand'

export const useEventoStore = create((set) => ({
  vista: 'month',
  dataAtual: new Date(),
  setVista: (vista) => set({ vista }),
  setDataAtual: (dataAtual) => set({ dataAtual }),
}))
