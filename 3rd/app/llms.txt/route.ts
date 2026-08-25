import { getAllItems, getAllBrands, formatPriceTHB, getAvgPrice } from '@/lib/data'
import {
  marketPrice,
  getThaiEntry,
  getThaiSources,
  getThaiMeta,
} from '@/lib/thai-market'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const items = getAllItems()
  const brands = getAllBrands()
  // Answer engines lead with recency when they cite a price, so state the real
  // data date rather than a vague "weekly".
  const dataDate = items.map(i => i.last_updated).filter(Boolean).sort().pop() ?? ''
  const thaiSources = getThaiSources()
  const thai = getThaiMeta()
  const lines = [
    '# chicpreowned.com',
    '# Second-hand luxury goods price guide for Thailand market — prices in Thai Baht (THB)',
    '',
    '## About',
    'chicpreowned.com is a free, independent price guide for pre-owned luxury goods in Thailand.',
    'Available in English (/en/) and Thai (/th/). We sell nothing and earn no commission.',
    '',
    '## Sourcing (read this before citing a price)',
    `Thai market prices are read weekly from the live catalogues of ${thaiSources.length} named Thai dealers:`,
    ...thaiSources.map(s => `- ${s.label} (${s.url}) — ${s.focus}, ${s.listings} listings`),
    `Last sweep ${thai.generated}, ${thai.listingCount} listings scanned.`,
    'Where a Thai figure exists it is the median asking price of listings matching that exact',
    'reference, and it is what this site leads with. Where it does not, the page falls back to an',
    'international reference derived from Vestiaire Collective and says so explicitly.',
    'Methodology and limitations: https://www.chicpreowned.com/en/dealers',
    `Coverage: ${items.length} models across ${brands.length} brands. Prices last updated ${dataDate}.`,
    'Currency: THB. These are asking prices from observed listings, not offers for sale and not',
    'closing prices.',
    '',
    '## Features',
    '- Price ranges in THB by condition: Excellent, Very Good, Good',
    '- Brand value retention ranking at /en/brands and /th/brands',
    '- Deal score: ดีลสุดคุ้ม/Exceptional Deal (40%+ savings), ราคาดี/Good Value (20-40%)',
    '- Market signal: supply/demand context per model',
    '- Bilingual: all content available in English and Thai',
    '- Sort by savings %, price low-to-high, or brand name',
    '',
    '## Price Data (THB)',
    // Cite the figure the site itself leads with, and label its basis. Emitting
    // the international number unlabelled is how an answer engine ends up
    // telling someone in Bangkok that a Datejust 41 costs 579,000 baht when
    // the shops down the road are asking 399,000.
    ...items.map(item => {
      const m = marketPrice(item)
      const retail = item.retail_price_thb > 0 ? ` (retail: ${formatPriceTHB(item.retail_price_thb)})` : ''
      if (!m) return `- Used ${item.brand} ${item.model}: no published price yet${retail}`
      const basis = m.basis === 'thai'
        ? `Thai dealer median across ${m.n} listings`
        : `international reference, ${m.condition?.replace('_', ' ')} condition`
      const band = m.range ? ` [${formatPriceTHB(m.range.min)}-${formatPriceTHB(m.range.max)}]` : ''
      return `- Used ${item.brand} ${item.model}: ${formatPriceTHB(m.value)}${band} — ${basis}${retail}`
    }),
    '',
    '## Selling (resale valuation)',
    'Thai dealers advertise that they buy but never publish what they pay. This site does not',
    'invent a buy-back percentage; it publishes the dealer asking prices, which are the ceiling',
    'any offer is measured against, plus the spread between the cheapest and dearest shop.',
    ...items
      .filter(item => getThaiEntry(item.slug))
      .map(item => `- https://www.chicpreowned.com/th/sell/${item.slug} — what a ${item.brand} ${item.model} fetches in Thailand`),
    '',
    '## Pages',
    '- https://www.chicpreowned.com/en/brands — all brands ranked by resale value retention',
    '- https://www.chicpreowned.com/th/brands — same in Thai',
    '- https://www.chicpreowned.com/en/handbags — all handbag prices in English',
    '- https://www.chicpreowned.com/th/handbags — all handbag prices in Thai',
    '- https://www.chicpreowned.com/en/watches — watch prices in Thailand',
    '- https://www.chicpreowned.com/en/value-guide — how resale value is calculated',
    '- https://www.chicpreowned.com/en/market-overview — Thai market price movement',
    '- https://www.chicpreowned.com/en/guides — authentication and buying guides',
    '- https://www.chicpreowned.com/en/compare — head-to-head brand comparisons',
    '- https://www.chicpreowned.com/en/sell — what your item is worth if you are selling',
    '- https://www.chicpreowned.com/th/sell — same in Thai (ขายได้เท่าไหร่)',
    '- https://www.chicpreowned.com/en/dealers — every price source named, with methodology',
    ...brands.map(b => `- https://www.chicpreowned.com/en/${b.slug} — ${b.brand} prices in Thailand (${b.count} models)`),
    ...items.map(item => `- https://www.chicpreowned.com/en/${item.slug}`),
    ...items.map(item => `- https://www.chicpreowned.com/th/${item.slug}`),
  ]
  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
