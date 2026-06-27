import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
    ],
    sitemap: 'https://www.chicpreowned.com/sitemap.xml',
  }
}
