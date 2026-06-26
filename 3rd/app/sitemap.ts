import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'

const BASE = 'https://www.chicpreowned.com'
const LOCALES = ['en', 'th'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()
  const entries: MetadataRoute.Sitemap = []

  // Root + locale homepages
  entries.push({ url: BASE, lastModified: new Date(), priority: 1.0 })
  for (const locale of LOCALES) {
    entries.push({ url: `${BASE}/${locale}`, lastModified: new Date(), priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/handbags`, lastModified: new Date(), priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/watches`, lastModified: new Date(), priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/clothing`, lastModified: new Date(), priority: 0.8 })
  }

  // Brand pages
  for (const brand of brands) {
    for (const locale of LOCALES) {
      entries.push({ url: `${BASE}/${locale}/${brand.slug}`, lastModified: new Date(), priority: 0.7 })
    }
  }

  // Model pages
  for (const item of items) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/${item.slug}`,
        lastModified: new Date(item.last_updated),
        priority: 0.9,
      })
    }
  }

  return entries
}
