import { defineRouting } from 'next-intl/routing'
import { getRequestConfig } from 'next-intl/server'

export const routing = defineRouting({
  locales: ['en', 'th'],
  defaultLocale: 'en',
})

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? routing.defaultLocale
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
