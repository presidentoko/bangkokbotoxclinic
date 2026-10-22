import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://www.thailandpethub.com/sitemap.xml',
      // The moved clinic URLs, so Google revisits them and sees the 308 — see
      // app/sitemap-legacy.xml/route.ts for why, and for when to remove it.
      'https://www.thailandpethub.com/sitemap-legacy.xml',
    ],
  }
}
