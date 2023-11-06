const rawLocales = import.meta.glob('../locales/**/*.json', {
  import: 'default',
  eager: true
})

export const languages = {
  en: 'English',
  'pt-BR': 'Português Brasil'
} as const

export type Language = keyof typeof languages

const countryLanguage: Record<string, Language> = {
  US: 'en',
  BR: 'pt-BR'
}

interface TranslationNamespace {
  [key: string]: Record<string, string>
}
interface Translation {
  [key: string]: TranslationNamespace
}

export const locales: Translation = Object.keys(rawLocales).reduce<Translation>(
  (accum, path) => {
    const newPath = path
      .replace('../locales/', '')
      .replace('.json', '')
      .split('/')

    const lang = newPath[0] as Language
    newPath.splice(0, 1)
    const namespace = newPath.join('.')

    accum[lang] = accum[lang] ?? {}
    accum[lang][namespace] = rawLocales[path]

    return accum
  },
  {}
)

export const defaultLanguage: Language = 'en'

export function getLanguage(url: URL): Language {
  const lang = url.searchParams.get('lang')

  if (lang && lang in languages) {
    return lang as Language
  }

  return defaultLanguage
}

export async function getLanguageByIp(ip: string): Promise<Language> {
  try {
    const resp = await fetch('https://ip2c.org/' + ip)
    const data = await resp.text()

    if (data.startsWith('0;')) {
      return defaultLanguage
    }

    const [, country_cd] = data.split(';')

    if (country_cd && country_cd in countryLanguage) {
      return countryLanguage[country_cd] as Language
    }

    return defaultLanguage
  } catch (error) {
    console.error(error)
    return defaultLanguage
  }
}

export function useLocale(lang: Language) {
  const translation = locales[lang]

  return function t(key: string, namespace?: string) {
    namespace = namespace ?? 'common'
    const namespaceTranslation = translation[namespace]

    return namespaceTranslation?.[key] ?? key
  }
}
