import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'

const locales = ['pt', 'en']

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(locales, requested) ? requested : 'pt'
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
