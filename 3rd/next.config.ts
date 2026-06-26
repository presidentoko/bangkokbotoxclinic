import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const config: NextConfig = {
  // next-intl plugin uses experimental.turbo (Next.js ≤15 API), but Next.js 16
  // moved Turbopack config to the top-level `turbopack` key. Explicitly set the
  // alias here so static generation can resolve next-intl/config → i18n.ts.
  turbopack: {
    resolveAlias: {
      'next-intl/config': './i18n.ts',
    },
  },
}

export default withNextIntl(config)
