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
    entries.push({ url: `${BASE}/${locale}/under-15000`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/under-30000`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/under-60000`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/guides/first-luxury-bag`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/value-guide`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/market-overview`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/jewelry`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/belts`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/scarves`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/small-leather-goods`, lastModified: TODAY, changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/lv-vs-gucci`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/chanel-vs-lv`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/rolex-vs-omega`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/luxury-gift-guide`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/best-bags-for-travel`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/best-bags-for-work`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/trends/quiet-luxury-2025`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/dior`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/bottega-veneta`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/prada`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/dior-vs-chanel`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/prada-vs-gucci`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/bottega-vs-loewe`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/celine`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/hermes`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/brands/gucci`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/brands/louis-vuitton`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/guides/luxury-bags-as-investments`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/where-to-sell-luxury-bags`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/how-to-spot-fake-luxury-bags`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/hermes-vs-bottega`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/chanel-vs-hermes`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/chanel`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/brands/saint-laurent`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/cartier`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/rolex`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/brands/omega`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/patek-philippe`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/cartier-vs-van-cleef`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/rolex-vs-audemars-piguet`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/saint-laurent-vs-celine`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/how-to-care-for-luxury-bags`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/audemars-piguet`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/chanel-vs-dior`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/rolex-vs-patek-philippe`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/fendi`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/loewe`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/hermes-vs-louis-vuitton`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/pre-owned-watches-buying-guide`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/trends/thai-luxury-market-2025`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/chanel-vs-hermes`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/compare/prada-vs-gucci`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/bangkok-luxury-shopping-guide`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/guides/rolex-reference-guide`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/chanel-size-guide`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/fendi-vs-loewe`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/trends/best-bags-to-gift-2025`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/guides/chanel-price-history`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.9 })
    entries.push({ url: `${BASE}/${locale}/compare/cartier-vs-bulgari`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/balenciaga`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/brands/valentino`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/omega-vs-tag-heuer`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
    entries.push({ url: `${BASE}/${locale}/compare/saint-laurent-vs-dior`, lastModified: TODAY, changeFrequency: 'monthly' as const, priority: 0.8 })
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
