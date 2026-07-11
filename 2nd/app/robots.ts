import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/search' },
      { userAgent: 'GPTBot', allow: '/', disallow: '/search' },
      { userAgent: 'Claude-Web', allow: '/', disallow: '/search' },
    ],
    sitemap: 'https://www.secondluxuryitems.com/sitemap.xml',
  }
}
