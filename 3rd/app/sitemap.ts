import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'

const BASE = 'https://www.chicpreowned.com'
const LOCALES = ['en', 'th'] as const
const TODAY = new Date().toISOString().split('T')[0]

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()
  const entries: MetadataRoute.Sitemap = []

  // Root + locale homepages
  entries.push({ url: BASE, lastModified: TODAY, changeFrequency: 'weekly', priority: 1.0 })
  for (const locale of LOCALES) {
    entries.push({ url: `${BASE}/${locale}`, lastModified: TODAY, changeFrequency: 'weekly', priority: 1.0 })
    entries.push({ url: `${BASE}/${locale}/handbags`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/watches`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/clothing`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/brands`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/shoes`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/jewelry`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/belts`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/scarves`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/small-leather-goods`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
  }

  // Brand pages
  for (const brand of brands) {
    for (const locale of LOCALES) {
      entries.push({ url: `${BASE}/${locale}/${brand.slug}`, lastModified: TODAY, changeFrequency: 'weekly' as const, priority: 0.7 })
    }
  }

  // Model pages
  for (const item of items) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/${item.slug}`,
        lastModified: TODAY,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })
    }
  }

  return entries
}
