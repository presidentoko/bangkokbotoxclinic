import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'
const TODAY = new Date().toISOString().split('T')[0]

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: TODAY, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/handbags`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/watches`,  lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 },
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
