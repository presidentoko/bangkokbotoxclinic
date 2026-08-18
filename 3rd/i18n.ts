import { defineRouting } from 'next-intl/routing'
import { getRequestConfig } from 'next-intl/server'

export const routing = defineRouting({
  locales: ['en', 'th'],
  defaultLocale: 'en',
  // next-intl stamps `Set-Cookie: NEXT_LOCALE` on every response, and
  // Cloudflare refuses to cache anything carrying a Set-Cookie header — so a
  // cookie nothing reads was turning the whole site into `cf-cache-status:
  // BYPASS`, sending every crawler hit through to Vercel and billing the
  // shared Hobby quota.
  //
  // Nothing here needs it: localePrefix defaults to 'always', so the locale is
  // in the URL on every page, and LocaleSwitcher is a plain <Link> to the
  // sibling path rather than a cookie write. The cookie's only real job is
  // remembering a choice for later visits to `/`, which Accept-Language
  // detection still covers.
  localeCookie: false,
})

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? routing.defaultLocale
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
