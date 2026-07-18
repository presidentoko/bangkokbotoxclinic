import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands } from '@/lib/data'
import { STATIC_PAGES } from '@/lib/site-pages'

const BASE = 'https://www.chicpreowned.com'
const TODAY = new Date().toISOString().split('T')[0]

function localizedEntry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number
): MetadataRoute.Sitemap[number] {
  const enUrl = `${BASE}/en${path}`
  const thUrl = `${BASE}/th${path}`
  return {
    url: enUrl,
    lastModified: TODAY,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: enUrl,
        th: thUrl,
        'x-default': enUrl,
      },
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()
  const entries: MetadataRoute.Sitemap = []

  // Root (/) just redirects to /en (see app/page.tsx), so it is intentionally not
  // listed separately here — the /en entry below (with x-default) is the effective
  // highest-priority entry for the site.
  for (const page of STATIC_PAGES) {
    entries.push(localizedEntry(page.path, page.changeFrequency, page.priority))
  }

  // Brand pages
  for (const brand of brands) {
    entries.push(localizedEntry(`/${brand.slug}`, 'weekly', 0.7))
  }

  // Model pages
  for (const item of items) {
    entries.push(localizedEntry(`/${item.slug}`, 'weekly', 0.9))
  }

  return entries
}
