import { MetadataRoute } from 'next'
import { DATA_DATE } from '@/lib/value'
import { CHECKLIST_BRANDS } from '@/lib/checklists'
import { SIZE_BRANDS } from '@/lib/sizes'

const BASE = 'https://www.secondluxuryitems.com'

/**
 * Tools only. Every catalogue URL this domain used to list now redirects to
 * chicpreowned.com (see data/legacy_redirects.json); listing a redirect here
 * would ask Google to crawl a page that isn't one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const at = DATA_DATE
  return [
    { url: BASE, lastModified: at, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/calculator/resale-value`, lastModified: at, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/calculator/retail-vs-resale`, lastModified: at, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/calculator/depreciation`, lastModified: at, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/checklist/authenticity`, lastModified: at, changeFrequency: 'monthly', priority: 0.8 },
    ...CHECKLIST_BRANDS.map(b => ({ url: `${BASE}/checklist/authenticity/${b}`, lastModified: at, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...SIZE_BRANDS.map(b => ({ url: `${BASE}/sizes/${b}`, lastModified: at, changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
