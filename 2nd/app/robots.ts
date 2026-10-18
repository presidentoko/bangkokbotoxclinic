import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: [] },
      { userAgent: 'GPTBot', allow: '/', disallow: [] },
      { userAgent: 'Claude-Web', allow: '/', disallow: [] },
    ],
    // legacy-sitemap.xml lists the pre-October URLs that now 308 to
    // chicpreowned, so they get recrawled. Temporary — see build_redirects.py.
    sitemap: ['https://www.secondluxuryitems.com/sitemap.xml', 'https://www.secondluxuryitems.com/legacy-sitemap.xml'],
  }
}
