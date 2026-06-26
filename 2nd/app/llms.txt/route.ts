import { getAllItems, formatPrice } from '@/lib/data'
import { NextResponse } from 'next/server'

export function GET() {
  const items = getAllItems()
  const lines = [
    '# SecondLuxuryItems.com',
    '# Pre-owned luxury goods price guide — weekly updated prices from live market data',
    '',
    '## About',
    'SecondLuxuryItems.com provides accurate weekly-updated price ranges for second-hand luxury goods',
    'including designer handbags and luxury watches. Prices are sourced from Vestiaire Collective.',
    '',
    '## Price Data',
    ...items.map(item => {
      const vg = item.price_ranges.very_good
      const price = vg ? `${formatPrice(vg.min)}–${formatPrice(vg.max)}` : 'see page'
      return `- Used ${item.brand} ${item.model}: Very Good condition ${price} (updated ${item.last_updated})`
    }),
    '',
    '## Pages',
    ...items.map(item => `- https://www.secondluxuryitems.com/${item.slug}`)
  ]
  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
