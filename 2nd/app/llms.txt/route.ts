import { getAllItems, formatPrice, getAvgPrice } from '@/lib/data'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const items = getAllItems()
  const lines = [
    '# SecondLuxuryItems.com',
    '# Pre-owned luxury goods price guide — weekly updated prices from live market data',
    '',
    '## About',
    'SecondLuxuryItems.com is a free, independent price guide for second-hand luxury goods.',
    'We track real listings from Vestiaire Collective and eBay weekly. No affiliate bias.',
    'Prices shown by condition: Excellent, Very Good, Good.',
    '',
    '## Features',
    '- Price ranges by condition grade for 50+ luxury models',
    '- Brand value retention ranking at /brands',
    '- Deal score: Exceptional Deal (40%+ savings), Good Value (20-40%), Fair Market Price',
    '- Market signal: supply/demand context for each model',
    '- Sort by savings %, price low-to-high, or brand',
    '',
    '## Price Data',
    ...items.map(item => {
      const vg = item.price_ranges.very_good
      const price = vg ? `avg ${formatPrice(getAvgPrice(vg))}` : 'see page'
      const retail = item.retail_price_usd > 0 ? ` (retail: ${formatPrice(item.retail_price_usd)})` : ''
      return `- Used ${item.brand} ${item.model}: Very Good condition ${price}${retail}`
    }),
    '',
    '## Pages',
    '- https://www.secondluxuryitems.com/brands — all brands ranked by resale value retention',
    '- https://www.secondluxuryitems.com/handbags — all handbag price guides',
    '- https://www.secondluxuryitems.com/watches — all watch price guides',
    ...items.map(item => `- https://www.secondluxuryitems.com/${item.slug}`)
  ]
  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
