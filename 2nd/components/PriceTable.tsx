import { Item, Condition, formatPrice, getPriceVsRetail } from '@/lib/data'

const CONDITIONS: { key: Condition; label: string }[] = [
  { key: 'excellent', label: 'Excellent' },
  { key: 'very_good', label: 'Very Good' },
  { key: 'good',      label: 'Good' },
]

export function PriceTable({ item }: { item: Item }) {
  return (
    <div className="overflow-x-auto my-6 rounded-sm">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#F5F0E8] text-left">
            <th className="p-3 border border-[#E8E2D9] font-semibold text-[#1A1A1A]">Condition</th>
            <th className="p-3 border border-[#E8E2D9] font-semibold text-[#1A1A1A]">Price Range</th>
            <th className="p-3 border border-[#E8E2D9] font-semibold text-[#1A1A1A]">vs Retail ({formatPrice(item.retail_price_usd)})</th>
          </tr>
        </thead>
        <tbody>
          {CONDITIONS.map(({ key, label }) => {
            const range = item.price_ranges[key]
            if (!range) return null
            const diff = getPriceVsRetail(range, item.retail_price_usd)
            const isAboveRetail = diff.startsWith('+')
            return (
              <tr key={key} className="hover:bg-[#FAFAF9]">
                <td className="p-3 border border-[#E8E2D9] font-medium text-[#1A1A1A]">{label}</td>
                <td className="p-3 border border-[#E8E2D9] text-[#1A1A1A]">
                  {formatPrice(range.min)} – {formatPrice(range.max)}
                </td>
                <td className={`p-3 border border-[#E8E2D9] font-medium ${isAboveRetail ? 'text-[#C25B2B]' : 'text-[#B8954A]'}`}>
                  {diff}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-[#9C8B7A] mt-2">
        Based on {item.price_samples.length} listings · Last updated: {item.last_updated} · Prices vary by seller and provenance
      </p>
    </div>
  )
}
