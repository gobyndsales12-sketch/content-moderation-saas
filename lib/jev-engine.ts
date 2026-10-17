export type Platform = 'Instagram' | 'LinkedIn' | 'Blog'
export type ItemStatus = 'doubt' | 'approved' | 'rejected'
export type RuleStatus = 'pass' | 'fail'

export type RuleResult = {
  name: string
  status: RuleStatus
  note?: string
}

export type ContentItem = {
  id: number
  platform: Platform
  type: string
  content: string
  confidence: number
  status: ItemStatus
  rules: RuleResult[]
  edited?: boolean
}

export type RuleSettings = {
  threshold: number
  absolutePromises: boolean
  emojiFormat: boolean
  requireCta: boolean
  maxEmojis: number
  bannedWords: string[]
}

export const DEFAULT_SETTINGS: RuleSettings = {
  threshold: 80,
  absolutePromises: true,
  emojiFormat: true,
  requireCta: true,
  maxEmojis: 3,
  bannedWords: [
    'garantizado',
    'sin riesgo',
    'millonario',
    'sin esfuerzo',
    'devolvemos el dinero',
    'hazte rico',
    'bots mágicos',
  ],
}

const CTA_PATTERN =
  /(escr[ií]be|cont[aá]ct|descubre|agenda|comenta|aqu[ií]|link|reserva|[uú]nete|suscr[ií]bete|te cuento|lee m[aá]s|inscr[ií]bete)/i
const EMOJI_PATTERN = /\p{Extended_Pictographic}/gu
const CLICKBAIT_PATTERN = /(hoy mismo|ya mismo|nada de esfuerzo|m[aá]gic|secreto que nadie)/i

export function evaluateContent(content: string, settings: RuleSettings) {
  const text = content.toLowerCase()
  const rules: RuleResult[] = []
  let confidence = 98

  const clickbait = CLICKBAIT_PATTERN.test(content)
  rules.push(
    clickbait
      ? { name: 'Tono de marca (Cercano y profesional)', status: 'fail', note: 'Tono engañoso o clickbait detectado' }
      : { name: 'Tono de marca (Cercano y profesional)', status: 'pass' },
  )
  if (clickbait) confidence -= 18

  if (settings.absolutePromises) {
    const hits = settings.bannedWords.filter((word) => text.includes(word.toLowerCase()))
    if (hits.length > 0) {
      rules.push({
        name: `Palabras prohibidas (${hits.map((h) => `"${h}"`).join(', ')})`,
        status: 'fail',
        note: 'Promesa comercial absoluta detectada',
      })
      confidence -= 22 + (hits.length - 1) * 10
    } else {
      rules.push({ name: 'Uso de palabras prohibidas', status: 'pass' })
    }
  }

  if (settings.emojiFormat) {
    const emojiCount = content.match(EMOJI_PATTERN)?.length ?? 0
    if (emojiCount > settings.maxEmojis) {
      rules.push({
        name: `Límite de emojis (Max ${settings.maxEmojis})`,
        status: 'fail',
        note: `${emojiCount} emojis encontrados`,
      })
      confidence -= 10
    } else {
      rules.push({ name: `Límite de emojis (Max ${settings.maxEmojis})`, status: 'pass' })
    }
  }

  if (settings.requireCta) {
    const hasCta = CTA_PATTERN.test(content)
    rules.push(
      hasCta
        ? { name: 'Llamado a la acción claro', status: 'pass' }
        : { name: 'Llamado a la acción claro', status: 'fail', note: 'No se detectó un CTA explícito' },
    )
    if (!hasCta) confidence -= 8
  }

  const tooShort = content.trim().length < 40
  rules.push(
    tooShort
      ? { name: 'Longitud óptima', status: 'fail', note: 'Texto demasiado corto para la plataforma' }
      : { name: 'Longitud óptima', status: 'pass' },
  )
  if (tooShort) confidence -= 8

  confidence = Math.max(5, Math.min(99, confidence))
  const status: ItemStatus = confidence >= settings.threshold ? 'approved' : 'doubt'

  return { rules, confidence, status }
}

const SEED: Array<Pick<ContentItem, 'id' | 'platform' | 'type' | 'content'>> = [
  {
    id: 1,
    platform: 'Instagram',
    type: 'Carrusel',
    content:
      '¡Deja de perder dinero con automatizaciones mal hechas! Con LeanSync duplicas tus ventas en 30 días o te devolvemos el dinero 🚀 Escríbenos YA.',
  },
  {
    id: 2,
    platform: 'LinkedIn',
    type: 'Artículo / Post',
    content:
      'La inteligencia artificial no va a reemplazar a los consultores, pero los consultores que usan IA reemplazarán a los que no. Aquí te cuento 3 claves...',
  },
  {
    id: 3,
    platform: 'Instagram',
    type: 'Reel Script',
    content:
      'Hazte millonario hoy mismo con criptomonedas y bots mágicos sin hacer nada de esfuerzo financiero...',
  },
  {
    id: 4,
    platform: 'Blog',
    type: 'Newsletter',
    content:
      'Cómo redujimos un 40% el tiempo de onboarding de clientes con flujos automatizados. Descubre el caso completo en el link de nuestra bio.',
  },
]

export function buildInitialItems(settings: RuleSettings): ContentItem[] {
  return SEED.map((seed) => ({ ...seed, ...evaluateContent(seed.content, settings) }))
}
