import { MetadataRoute } from 'next'
import { getAllItems, getAllBrands, toBrandSlug } from '@/lib/data'
import { STATIC_PAGES } from '@/lib/site-pages'
import { getThaiEntry, getThaiMeta } from '@/lib/thai-market'

const BASE = 'https://www.chicpreowned.com'

/** Newest price date in the dataset. Used as `lastmod` instead of the build
 * date: stamping every URL with "now" on each deploy makes lastmod noise, and
 * crawlers learn to ignore it. This changes only when the prices actually do. */
const DATA_DATE = getAllItems()
  .map(i => i.last_updated)
  .filter(Boolean)
  .sort()
  .pop() ?? new Date().toISOString().split('T')[0]

/**
 * One sitemap entry per locale, each carrying the full hreflang cluster.
 *
 * Previously only the /en URL was listed and /th existed solely as an
 * `alternates` link. Google will follow those, but an unlisted URL is never
 * *submitted* — and Thai queries are the whole point of this site, so the
 * Thai half was competing without the crawl priority a sitemap entry buys.
 */
function localizedEntries(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
  lastModified: string
): MetadataRoute.Sitemap {
  const enUrl = `${BASE}/en${path}`
  const thUrl = `${BASE}/th${path}`
  const languages = { en: enUrl, th: thUrl, 'x-default': enUrl }
  return [
    { url: enUrl, lastModified, changeFrequency, priority, alternates: { languages } },
    { url: thUrl, lastModified, changeFrequency, priority, alternates: { languages } },
  ]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getAllItems()
  const brands = getAllBrands()
  const entries: MetadataRoute.Sitemap = []

  // Root (/) just redirects to /en (see app/page.tsx), so it is intentionally not
  // listed separately here — the /en entry below (with x-default) is the effective
  // highest-priority entry for the site.
  for (const page of STATIC_PAGES) {
    entries.push(...localizedEntries(page.path, page.changeFrequency, page.priority, DATA_DATE))
  }

  // Brand pages — dated by the freshest price under that brand.
  for (const brand of brands) {
    const brandDate =
      items
        .filter(i => i.slug.startsWith(`${brand.slug}/`))
        .map(i => i.last_updated)
        .filter(Boolean)
        .sort()
        .pop() ?? DATA_DATE
    entries.push(...localizedEntries(`/${brand.slug}`, 'weekly', 0.7, brandDate))
  }

  // Model pages
  for (const item of items) {
    entries.push(...localizedEntries(`/${item.slug}`, 'weekly', 0.9, item.last_updated || DATA_DATE))
  }

  // Sell pages exist only where there is Thai dealer data to answer with,
  // so they are listed from the same source that decides whether the page
  // gets built at all — a sitemap entry for a 404 is worse than no entry.
  const { generated } = getThaiMeta()
  const sellBrands = new Set<string>()
  for (const item of items) {
    if (!getThaiEntry(item.slug)) continue
    sellBrands.add(toBrandSlug(item.brand))
    entries.push(...localizedEntries(`/sell/${item.slug}`, 'weekly', 0.8, generated))
  }
  for (const brand of sellBrands) {
    entries.push(...localizedEntries(`/sell/${brand}`, 'weekly', 0.7, generated))
  }

  const seen = new Set<string>()
  return entries.filter(entry => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
