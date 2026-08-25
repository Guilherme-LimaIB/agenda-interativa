import { addDays, addMonths, addYears, isBefore, setHours, setMilliseconds, setMinutes, setSeconds, startOfDay } from 'date-fns'

const MESES = [
  'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

const DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']

const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

const comHora = (data, hora, minuto) =>
  setMilliseconds(setSeconds(setMinutes(setHours(startOfDay(data), hora), minuto), 0), 0)

// Sem qualificador ("segunda"): próxima ocorrência, incluindo hoje se hoje já for aquele dia.
// Com qualificador ("próxima segunda" / "segunda que vem"): sempre pula hoje.
const proximaOcorrencia = (hoje, diaAlvo, forcarPular) => {
  const diffBase = (diaAlvo - hoje.getDay() + 7) % 7
  const diff = forcarPular && diffBase === 0 ? 7 : diffBase
  return addDays(startOfDay(hoje), diff)
}

function extrairData(textoNorm, agora) {
  if (/depois de amanha/.test(textoNorm)) return addDays(startOfDay(agora), 2)
  if (/\bamanha\b/.test(textoNorm)) return addDays(startOfDay(agora), 1)
  if (/\bhoje\b/.test(textoNorm)) return startOfDay(agora)

  const daqui = textoNorm.match(/daqui a (\d+) dias?/)
  if (daqui) return addDays(startOfDay(agora), Number(daqui[1]))

  // "dia N de MES" ou "N de MES" (mês por extenso é obrigatório aqui; "dia" é opcional)
  const diaEMes = textoNorm.match(/\b(?:dia\s+)?(\d{1,2})\s+de\s+([a-z]+)\b/)
  if (diaEMes) {
    const dia = Number(diaEMes[1])
    const idxMes = MESES.indexOf(diaEMes[2])
    if (dia >= 1 && dia <= 31 && idxMes >= 0) {
      let candidato = new Date(agora.getFullYear(), idxMes, dia)
      if (isBefore(candidato, startOfDay(agora))) candidato = addYears(candidato, 1)
      return startOfDay(candidato)
    }
  }

  // "dia N" sozinho (sem mês) -- exige a palavra "dia" pra não confundir com hora solta
  const soDia = textoNorm.match(/\bdia\s+(\d{1,2})\b/)
  if (soDia) {
    const dia = Number(soDia[1])
    if (dia >= 1 && dia <= 31) {
      let candidato = new Date(agora.getFullYear(), agora.getMonth(), dia)
      if (isBefore(candidato, startOfDay(agora))) candidato = addMonths(candidato, 1)
      return startOfDay(candidato)
    }
  }

  // DD/MM
  const barra = textoNorm.match(/\b(\d{1,2})\/(\d{1,2})\b/)
  if (barra) {
    const dia = Number(barra[1])
    const mes = Number(barra[2]) - 1
    let candidato = new Date(agora.getFullYear(), mes, dia)
    if (isBefore(candidato, startOfDay(agora))) candidato = addYears(candidato, 1)
    return startOfDay(candidato)
  }

  // "fim de semana" -> convenção fixa: próximo sábado
  if (/fim de semana/.test(textoNorm)) return proximaOcorrencia(agora, 6, false)

  for (let i = 0; i < DIAS_SEMANA.length; i++) {
    const re = new RegExp(`(proxim[ao]s?\\s+)?\\b${DIAS_SEMANA[i]}(?:-feira)?\\b(\\s+que vem)?`)
    const m = textoNorm.match(re)
    if (m) return proximaOcorrencia(agora, i, Boolean(m[1] || m[2]))
  }

  return null
}

function extrairHora(textoNorm) {
  if (/meio[\s-]?dia/.test(textoNorm)) return { hora: 12, minuto: 0 }
  if (/meia[\s-]?noite/.test(textoNorm)) return { hora: 0, minuto: 0 }

  let m = textoNorm.match(/\b(\d{1,2})\s*(?:h(?:oras)?)?\s*da\s+(manha|tarde|noite)\b/)
  if (m) {
    let hora = Number(m[1])
    if (m[2] !== 'manha' && hora < 12) hora += 12
    return { hora, minuto: 0 }
  }

  m = textoNorm.match(/\b(\d{1,2}):(\d{2})\b/)
  if (m) return { hora: Number(m[1]), minuto: Number(m[2]) }

  m = textoNorm.match(/\b(\d{1,2})h(\d{2})?\b/)
  if (m) return { hora: Number(m[1]), minuto: m[2] ? Number(m[2]) : 0 }

  m = textoNorm.match(/\b(\d{1,2})\s+horas\b/)
  if (m) return { hora: Number(m[1]), minuto: 0 }

  return null
}

const PADROES_REMOVER_DO_TITULO = [
  /depois de amanh[ãa]/gi,
  /amanh[ãa]/gi,
  /\bhoje\b/gi,
  /daqui a \d+ dias?/gi,
  /\b(?:dia\s+)?\d{1,2}\s+de\s+[a-z]+\b/gi,
  /\bdia\s+\d{1,2}\b/gi,
  /\b\d{1,2}\/\d{1,2}\b/gi,
  /fim de semana/gi,
  /(pr[óo]xim[ao]s?\s+)?(domingo|segunda(?:-feira)?|ter[çc]a(?:-feira)?|quarta(?:-feira)?|quinta(?:-feira)?|sexta(?:-feira)?|s[áa]bado)(\s+que vem)?/gi,
  /\bque vem\b/gi,
  /\bpr[óo]xim[ao]s?\b/gi,
  /meio[\s-]?dia/gi,
  /meia[\s-]?noite/gi,
  // `\b` não funciona de forma confiável colado a uma letra acentuada (á/ã) --
  // o motor de regex do JS considera acentos "não-palavra" por padrão, então o
  // \b falha bem na borda. Por isso usamos lookbehind/lookahead em vez de \b
  // nos padrões abaixo, que terminam ou começam com letra acentuada.
  /\b\d{1,2}\s*(?:h(?:oras)?)?\s*da\s+(manh[ãa]|tarde|noite)(?=\s|$)/gi,
  /\b\d{1,2}:\d{2}\b/gi,
  /\b\d{1,2}h\d{0,2}\b/gi,
  /\b\d{1,2}\s+horas\b/gi,
  /\btoda[s]?\b/gi,
  /(?<=^|\s)[àa]s(?=\s|$)/gi,
]

function extrairTitulo(texto) {
  let limpo = texto
  for (const padrao of PADROES_REMOVER_DO_TITULO) {
    limpo = limpo.replace(padrao, ' ')
  }
  return limpo.replace(/\s+/g, ' ').trim().replace(/^[-,:]+|[-,:]+$/g, '').trim()
}

/**
 * Interpreta um texto livre em português e tenta extrair {titulo, data_inicio, data_fim}.
 * Nunca "chuta" data/hora ambíguas -- quando não reconhece, deixa null pro usuário preencher.
 * `agora` é injetável só pra facilitar teste determinístico.
 */
export function interpretarTexto(texto, agora = new Date()) {
  const bruto = texto.trim()
  const textoNorm = normalizar(bruto)
  if (!textoNorm) return { titulo: '', data_inicio: null, data_fim: null }

  // "ontem" indica uma referência ao passado que não suportamos -- nesse caso,
  // não tenta nem data nem hora (evita "corrigir" silenciosamente pra hoje).
  const referenciaPassadaNaoSuportada = /\bontem\b/.test(textoNorm)
  const data = referenciaPassadaNaoSuportada ? null : extrairData(textoNorm, agora)
  const horaInfo = referenciaPassadaNaoSuportada ? null : extrairHora(textoNorm)

  let data_inicio = null
  let data_fim = null
  if (horaInfo) {
    const base = data ?? startOfDay(agora)
    data_inicio = comHora(base, horaInfo.hora, horaInfo.minuto)
    data_fim = new Date(data_inicio.getTime() + 60 * 60 * 1000)
  } else if (data) {
    data_inicio = data
    data_fim = data
  }

  return {
    titulo: extrairTitulo(bruto) || bruto,
    data_inicio: data_inicio ? data_inicio.toISOString() : null,
    data_fim: data_fim ? data_fim.toISOString() : null,
  }
}
