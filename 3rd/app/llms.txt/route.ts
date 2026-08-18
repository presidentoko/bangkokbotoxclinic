import { getAllItems, getAllBrands, formatPriceTHB, getAvgPrice } from '@/lib/data'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const items = getAllItems()
  const brands = getAllBrands()
  // Answer engines lead with recency when they cite a price, so state the real
  // data date rather than a vague "weekly".
  const dataDate = items.map(i => i.last_updated).filter(Boolean).sort().pop() ?? ''
  const lines = [
    '# chicpreowned.com',
    '# Second-hand luxury goods price guide for Thailand market — prices in Thai Baht (THB)',
    '',
    '## About',
    'chicpreowned.com is a free, independent price guide for pre-owned luxury goods in Thailand.',
    'Available in English (/en/) and Thai (/th/). Prices tracked weekly from Vestiaire Collective',
    'and Thai resale platforms. No affiliate bias. Prices shown by condition grade.',
    `Coverage: ${items.length} models across ${brands.length} brands. Prices last updated ${dataDate}.`,
    'Currency: THB. Prices are market estimates from observed listings, not offers for sale.',
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
    ...items.map(item => {
      const vg = item.price_ranges.very_good
      const price = vg ? `avg ${formatPriceTHB(getAvgPrice(vg))}` : 'see page'
      const retail = item.retail_price_thb > 0 ? ` (retail: ${formatPriceTHB(item.retail_price_thb)})` : ''
      return `- Used ${item.brand} ${item.model}: Very Good condition ${price}${retail}`
    }),
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
    ...brands.map(b => `- https://www.chicpreowned.com/en/${b.slug} — ${b.brand} prices in Thailand (${b.count} models)`),
    ...items.map(item => `- https://www.chicpreowned.com/en/${item.slug}`),
    ...items.map(item => `- https://www.chicpreowned.com/th/${item.slug}`),
  ]
  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
