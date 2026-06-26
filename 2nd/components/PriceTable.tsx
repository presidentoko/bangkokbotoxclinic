import { Item, Condition, PriceRange, formatPrice, getPriceVsRetail } from '@/lib/data'

const CONDITIONS: { key: Condition; label: string }[] = [
  { key: 'excellent', label: 'Excellent' },
  { key: 'very_good', label: 'Very Good' },
  { key: 'good',      label: 'Good' },
]

export function PriceTable({ item }: { item: Item }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="p-3 border border-gray-200 font-semibold">Condition</th>
            <th className="p-3 border border-gray-200 font-semibold">Price Range</th>
            <th className="p-3 border border-gray-200 font-semibold">vs Retail ({formatPrice(item.retail_price_usd)})</th>
          </tr>
        </thead>
        <tbody>
          {CONDITIONS.map(({ key, label }) => {
            const range = item.price_ranges[key]
            if (!range) return null
            const diff = getPriceVsRetail(range, item.retail_price_usd)
            const isAboveRetail = diff.startsWith('+')
            return (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200 font-medium">{label}</td>
                <td className="p-3 border border-gray-200">
                  {formatPrice(range.min)} – {formatPrice(range.max)}
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
        Last updated: {item.last_updated} · Prices vary by seller and provenance
      </p>
    </div>
  )
}
