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

  async redirects() {
    return [
      // The apex served the whole site alongside www — two hosts, identical
      // content, one canonical. Google reported the split as "Page with
      // redirect" / "Alternate page with canonical" rather than picking a
      // winner, so send the apex to www at the routing layer.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'chicpreowned.com' }],
        destination: 'https://www.chicpreowned.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(config)
