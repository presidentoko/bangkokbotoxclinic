import { getItemsByBrand, headlinePrice, getAvgPrice } from '@/lib/data'

const BASE = 'https://www.chicpreowned.com'

/**
 * Structured data for the brand pages.
 *
 * The model pages carry Product, AggregateOffer, FAQPage and BreadcrumbList,
 * but both brand pages — /[brand] and /brands/[brand] — emitted none at all,
 * and those are the pages ranking for the queries that bring the most
 * impressions ("patek philippe price thailand"). A price page with no price
 * markup gives Google nothing to show.
 *
 * ItemList + AggregateOffer describe the set and its price span; the offer
 * count is the number of tracked listings, not an inventory claim — this site
 * sells nothing, it reports what others are asking.
 */
export function BrandSchema({
  brandSlug,
  locale,
  path,
  faqs = [],
}: {
  brandSlug: string
  locale: string
  /** Page path after the locale, e.g. "patek-philippe" or "brands/patek-philippe". */
  path: string
  faqs?: { q: string; a: string }[]
}) {
  const items = getItemsByBrand(brandSlug)
  if (!items.length) return null
  const brandName = items[0].brand

  const priced = items
    .map(item => ({ item, headline: headlinePrice(item.price_ranges) }))
    .filter(r => r.headline !== null) as {
      item: (typeof items)[number]
      headline: NonNullable<ReturnType<typeof headlinePrice>>
    }[]

  const url = `${BASE}/${locale}/${path}`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ChicPreowned', item: `${BASE}/${locale}` },
        { '@type': 'ListItem', position: 2, name: brandName, item: url },
      ],
    },
  ]

  if (priced.length) {
    const lows = priced.map(p => p.headline.range.min)
    const highs = priced.map(p => p.headline.range.max)
    graph.push({
      '@type': 'ItemList',
      name: `Pre-owned ${brandName} prices in Thailand`,
      url,
      numberOfItems: priced.length,
      itemListElement: priced.slice(0, 25).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${p.item.brand} ${p.item.model}`,
        url: `${BASE}/${locale}/${p.item.slug}`,
      })),
    })
    graph.push({
      '@type': 'AggregateOffer',
      priceCurrency: 'THB',
      lowPrice: Math.min(...lows),
      highPrice: Math.max(...highs),
      offerCount: items.reduce((n, i) => n + (i.price_samples?.length ?? 0), 0),
      url,
      itemOffered: { '@type': 'Brand', name: brandName },
    })
  }

  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  )
}
