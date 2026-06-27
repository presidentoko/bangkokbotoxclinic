import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'
const TODAY = new Date().toISOString().split('T')[0]

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: TODAY, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/handbags`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/watches`,  lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/shoes`,    lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/jewelry`,  lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/belts`,    lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/scarves`,  lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/small-leather-goods`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/brands`,   lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/under-500`,  lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/under-1000`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/under-2000`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/guides/first-luxury-bag`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guides/how-to-authenticate-chanel`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guides/how-to-authenticate-louis-vuitton`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guides/luxury-condition-guide`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guides/lv-speedy-size-guide`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/compare/chanel-vs-louis-vuitton`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/compare/chanel-vs-gucci`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/compare/rolex-vs-omega`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/value-guide`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const brandRoutes: MetadataRoute.Sitemap = brands.map(b => ({
    url: `${BASE}/${b.slug}`,
    lastModified: TODAY,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const modelRoutes: MetadataRoute.Sitemap = items.map(item => ({
    url: `${BASE}/${item.slug}`,
    lastModified: TODAY,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...brandRoutes, ...modelRoutes]
}
