import { Item, Condition, formatPriceTHB, getPriceVsRetail } from '@/lib/data'

interface ConditionLabels {
  condition: string
  priceRange: string
  excellent: string
  very_good: string
  good: string
  vsRetail: string
  lastUpdated: string
}

const CONDITIONS: { key: Condition }[] = [
  { key: 'excellent' },
  { key: 'very_good' },
  { key: 'good' },
]

export function PriceTable({ item, labels, sampleCount }: { item: Item; labels: ConditionLabels; sampleCount?: number }) {
  const condLabel = (key: Condition) => ({
    excellent: labels.excellent,
    very_good: labels.very_good,
    good: labels.good,
  }[key])

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-3 border border-gray-200 font-semibold">{labels.condition}</th>
            <th className="p-3 border border-gray-200 font-semibold">{labels.priceRange}</th>
            <th className="p-3 border border-gray-200 font-semibold">
              {labels.vsRetail.replace('{retail}', formatPriceTHB(item.retail_price_thb))}
            </th>
          </tr>
        </thead>
        <tbody>
          {CONDITIONS.map(({ key }) => {
            const range = item.price_ranges[key]
            if (!range) return null
            const diff = getPriceVsRetail(range, item.retail_price_thb)
            const isAboveRetail = diff.startsWith('+')
            return (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200 font-medium">{condLabel(key)}</td>
                <td className="p-3 border border-gray-200">
                  {formatPriceTHB(range.min)} – {formatPriceTHB(range.max)}
                </td>
                <td className={`p-3 border border-gray-200 font-medium ${isAboveRetail ? 'text-orange-600' : 'text-green-700'}`}>
                  {diff}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">
        {sampleCount ? `Based on ${sampleCount} listings · ` : ''}
        {labels.lastUpdated.replace('{date}', item.last_updated)}
      </p>
    </div>
  )
}
