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

  async headers() {
    return [
      {
        // Cloudflare sits in front of Vercel here, and every HTML response
        // comes back `cf-cache-status: DYNAMIC` — the edge passes it straight
        // through, so every bot hit reaches Vercel and bills against the
        // (shared, already-overrun) Hobby quota even when `x-vercel-cache` is
        // HIT. Next's default `public, max-age=0, must-revalidate` reads to a
        // shared cache as "do not store", so give it an s-maxage to store.
        //
        // `max-age=0` stays: browsers should still revalidate their own copy,
        // since prices change daily. This alone will NOT flip DYNAMIC — a
        // Cloudflare Cache Rule marking HTML eligible for cache is still
        // required; this is the half that lives in the repo.
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=604800',
          },
        ],
      },
    ]
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
