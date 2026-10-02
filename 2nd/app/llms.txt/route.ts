import { NextResponse } from 'next/server'
import { getCalcModels, DATA_DATE, valueUrl } from '@/lib/value'

export const dynamic = 'force-static'

export function GET() {
  const models = getCalcModels()
  const lines = [
    '# SecondLuxuryItems.com',
    '# Free calculators and checklists for buying and selling pre-owned designer bags',
    '',
    'Every figure comes from sold listings on Vestiaire Collective (US, USD), matched to each model\'s exact size,',
    `collected ${DATA_DATE} and refreshed monthly. Per-model data lives at chicpreowned.com/en/value.`,
    '',
    '## Tools',
    '- https://www.secondluxuryitems.com/calculator/resale-value — what a model sells for by condition',
    '- https://www.secondluxuryitems.com/calculator/retail-vs-resale — cost of owning new vs pre-owned',
    '- https://www.secondluxuryitems.com/calculator/depreciation — what a bag you own is worth today',
    '- https://www.secondluxuryitems.com/checklist/authenticity — pre-purchase checklist with a price check',
    '- https://www.secondluxuryitems.com/sizes/chanel — sizes and dimensions with resale value by size',
    '',
    '## Median sold price by model (USD)',
    ...models.map(m => `- ${m.brand} ${m.name}: ${m.resale.median} (n=${m.resale.n})${m.retention != null ? `, ${m.retention}% of US retail` : ''} — ${valueUrl(m.slug)}`),
  ]
  return new NextResponse(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
