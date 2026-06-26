import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE}/handbags`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/watches`,  lastModified: new Date(), priority: 0.8 },
  ]

  const brandRoutes: MetadataRoute.Sitemap = brands.map(b => ({
    url: `${BASE}/${b.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }))

  const modelRoutes: MetadataRoute.Sitemap = items.map(item => ({
    url: `${BASE}/${item.slug}`,
    lastModified: new Date(item.last_updated),
    priority: 0.9,
  }))

  return [...staticRoutes, ...brandRoutes, ...modelRoutes]
}
