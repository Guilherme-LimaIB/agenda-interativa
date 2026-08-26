const SEPARADORES = /\n|;|,\s*|\s+e\s+/i

/**
 * Separa um texto livre em títulos de tarefa usando regras simples (sem IA):
 * quebra por linha, ponto-e-vírgula, vírgula ou " e ". Não interpreta datas,
 * horários ou expande um item em vários passos -- cada fragmento vira uma tarefa.
 */
export function extrairTarefas(texto) {
  const bruto = texto.trim()
  if (!bruto) return []

  return bruto
    .split(SEPARADORES)
    .map((parte) => parte.trim().replace(/^[-–—.,;]+|[-–—.,;]+$/g, '').trim())
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .slice(0, 12)
}
