import { getAllItems, formatPriceTHB } from '@/lib/data'
import { NextResponse } from 'next/server'

export function GET() {
  const items = getAllItems()
  const lines = [
    '# chicpreowned.com',
    '# Second-hand luxury goods price guide for Thailand market — prices in Thai Baht (THB)',
    '',
    '## About',
    'chicpreowned.com provides Thai market prices for pre-owned luxury goods.',
    'Available in English (/en/) and Thai (/th/). Prices updated weekly.',
    '',
    '## Price Data (THB)',
    ...items.map(item => {
      const vg = item.price_ranges.very_good
      const price = vg ? `${formatPriceTHB(vg.min)}–${formatPriceTHB(vg.max)}` : 'see page'
      return `- Used ${item.brand} ${item.model}: Very Good condition ${price}`
    }),
    '',
    '## Pages',
    ...items.map(item => `- https://www.chicpreowned.com/en/${item.slug}`),
  ]
  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
