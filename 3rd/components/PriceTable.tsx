import { Item, Condition, formatPriceTHB, getAvgPrice, getPriceVsRetail } from '@/lib/data'

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
          <tr className="bg-[#F5F0E8] text-left">
            <th className="p-3 border border-[#E8E2D9] font-semibold">{labels.condition}</th>
            <th className="p-3 border border-[#E8E2D9] font-semibold">{labels.priceRange}</th>
            <th className="p-3 border border-[#E8E2D9] font-semibold">
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
              <tr key={key} className="hover:bg-[#FAFAF9]">
                <td className="p-3 border border-[#E8E2D9] font-medium">{condLabel(key)}</td>
                <td className="p-3 border border-[#E8E2D9]">
                  {formatPriceTHB(getAvgPrice(range))}
                </td>
                <td className={`p-3 border border-[#E8E2D9] font-medium ${isAboveRetail ? 'text-[#C25B2B]' : 'text-[#4A7A35]'}`}>
                  {diff}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-[#9C8B7A] mt-2">
        {sampleCount ? `Based on ${sampleCount} listings · ` : ''}
        {labels.lastUpdated.replace('{date}', item.last_updated)}
      </p>
    </div>
  )
}
