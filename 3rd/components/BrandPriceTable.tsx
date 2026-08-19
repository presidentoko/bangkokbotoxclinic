import Link from 'next/link'
import {
  getItemsByBrand,
  headlinePrice,
  formatPriceTHB,
  isWideSpread,
  type Condition,
} from '@/lib/data'

/**
 * Brand price table, rendered from the tracked data.
 *
 * The five brand guides that carried a price table had it hardcoded, and the
 * numbers had drifted away from the dataset the rest of the site serves — the
 * same page could tell you a Nautilus 5711 costs ฿3.5-5.5M while the model
 * page said ฿9.08-9.46M. The Omega table was worse: its "retail" column held
 * USD figures with a ฿ sign in front, so a Speedmaster read ฿7,400 against a
 * real ฿248,000.
 *
 * Reading from `getItemsByBrand` means the guide cannot contradict the model
 * pages, it re-prices itself on every scrape, and each row becomes an internal
 * link into the model page rather than inert text. Models we do not track drop
 * out rather than being quoted from memory.
 */

const LABELS = {
  en: {
    model: 'Model',
    retail: 'Retail (new)',
    preowned: 'Pre-owned',
    condition: 'Grade',
    above: 'Above retail',
    wide: 'Wide range — reference covers several variants',
    empty: 'No tracked models for this brand yet.',
    note: (n: number, date: string) =>
      `${n} models tracked · prices from live listings, updated ${date}`,
    grades: { excellent: 'Excellent', very_good: 'Very Good', good: 'Good' },
  },
  th: {
    model: 'รุ่น',
    retail: 'ราคาใหม่',
    preowned: 'ราคามือสอง',
    condition: 'สภาพ',
    above: 'สูงกว่าราคาใหม่',
    wide: 'ช่วงราคากว้าง — รหัสรุ่นครอบคลุมหลายเวอร์ชัน',
    empty: 'ยังไม่มีข้อมูลรุ่นของแบรนด์นี้',
    note: (n: number, date: string) =>
      `ติดตาม ${n} รุ่น · ราคาจากประกาศขายจริง อัปเดต ${date}`,
    grades: { excellent: 'สภาพดีเยี่ยม', very_good: 'สภาพดีมาก', good: 'สภาพดี' },
  },
} as const

export function BrandPriceTable({
  brandSlug,
  locale,
}: {
  brandSlug: string
  locale: string
}) {
  const t = LABELS[locale === 'th' ? 'th' : 'en']
  const rows = getItemsByBrand(brandSlug)
    .map(item => ({ item, headline: headlinePrice(item.price_ranges) }))
    .filter((r): r is { item: (typeof r)['item']; headline: NonNullable<(typeof r)['headline']> } =>
      r.headline !== null
    )
    .sort((a, b) => b.headline.range.min - a.headline.range.min)

  if (!rows.length) {
    return <p className="text-sm text-gray-500">{t.empty}</p>
  }

  const updated = rows
    .map(r => r.item.last_updated)
    .filter(Boolean)
    .sort()
    .pop()

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{t.model}</th>
              <th className="text-right py-3 px-4 font-semibold">{t.retail}</th>
              <th className="text-right py-3 px-4 font-semibold">{t.preowned}</th>
              <th className="text-right py-3 px-4 font-semibold">{t.condition}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ item, headline }) => {
              const aboveRetail =
                item.retail_price_thb > 0 && headline.range.min > item.retail_price_thb
              return (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <Link
                      href={`/${locale}/${item.slug}`}
                      className="font-medium text-gray-900 hover:text-[#B8954A] transition-colors"
                    >
                      {item.model}
                    </Link>
                    {aboveRetail && (
                      <span className="inline-block mt-1 ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                        {t.above}
                      </span>
                    )}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-500">
                    {item.retail_price_thb > 0 ? formatPriceTHB(item.retail_price_thb) : '—'}
                  </td>
                  <td
                    className={`text-right py-3 px-4 font-medium ${aboveRetail ? 'text-amber-600' : ''}`}
                  >
                    {formatPriceTHB(headline.range.min)}–{formatPriceTHB(headline.range.max)}
                    {isWideSpread(headline.range) && (
                      <span className="block font-normal text-xs text-gray-400 mt-0.5">
                        {t.wide}
                      </span>
                    )}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-500 whitespace-nowrap">
                    {t.grades[headline.condition as Condition]}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400">{t.note(rows.length, updated ?? '')}</p>
    </div>
  )
}
