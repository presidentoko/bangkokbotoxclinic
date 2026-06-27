import type { PriceSample } from '@/lib/data'
import { formatPriceTHB } from '@/lib/data'

interface Props {
  samples: PriceSample[]
  condition?: 'very_good' | 'excellent' | 'good'
  locale?: string
}

export function PriceHistory({ samples, condition = 'very_good', locale = 'en' }: Props) {
  const filtered = samples.filter(s => s.condition === condition)
  if (filtered.length < 3) return null

  const byMonth: Record<string, number[]> = {}
  for (const s of filtered) {
    const month = s.date.slice(0, 7)
    if (!byMonth[month]) byMonth[month] = []
    byMonth[month].push(s.price)
  }

  const months = Object.keys(byMonth).sort()
  if (months.length < 1) return null

  const avgByMonth = months.map(m => ({
    month: m,
    avg: Math.round(byMonth[m].reduce((a, b) => a + b, 0) / byMonth[m].length),
    count: byMonth[m].length,
  }))

  const prices = avgByMonth.map(m => m.avg)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const range = maxPrice - minPrice || 1

  const latestAvg = avgByMonth[avgByMonth.length - 1].avg
  const firstAvg = avgByMonth[0].avg
  const trend = latestAvg > firstAvg ? 'up' : latestAvg < firstAvg ? 'down' : 'flat'
  const trendPct = Math.round(Math.abs((latestAvg - firstAvg) / firstAvg) * 100)

  const label = locale === 'th' ? 'ประวัติราคา' : 'Price History'
  const countLabel = locale === 'th'
    ? `${filtered.length} รายการที่ติดตาม · สภาพดีมาก`
    : `${filtered.length} listings tracked · Very Good condition`

  return (
    <section className="border border-[#E8E2D9] rounded-xl p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#1A1A1A]">{label}</h2>
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-600' : 'text-[#8C7355]'}`}>
          {trend === 'up' ? `↑ ${trendPct}%` : trend === 'down' ? `↓ ${trendPct}%` : '→ Stable'}
        </span>
      </div>
      <div className="flex items-end gap-1 h-24 mb-3">
        {avgByMonth.map(({ month, avg, count }) => {
          const heightPct = range === 0 ? 60 : Math.round(((avg - minPrice) / range) * 70) + 10
          return (
            <div key={month} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div
                  className="w-full bg-[#B8954A] rounded-t opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ height: `${heightPct}%`, minHeight: '8px' }}
                  title={`${month}: ${formatPriceTHB(avg)} (${count} listings)`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-xs text-[#8C7355]">
        <span>{months[0]}</span>
        <span>{formatPriceTHB(latestAvg)} avg</span>
        <span>{months[months.length - 1]}</span>
      </div>
      <p className="text-xs text-[#8C7355] mt-2">{countLabel}</p>
    </section>
  )
}
