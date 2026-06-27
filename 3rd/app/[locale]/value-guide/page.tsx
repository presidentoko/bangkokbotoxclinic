import type { Metadata } from 'next'
import { getAllItems, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'value-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Luxury Resale Value Guide Thailand 2025 | ChicPreowned'
      : 'คู่มือมูลค่าการขายต่อ Luxury ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Which luxury items retain value best in Thailand? See resale retention rankings and biggest savings vs retail for Chanel, LV, Hermès, Gucci and more.'
      : 'สินค้า Luxury ชิ้นไหนรักษามูลค่าได้ดีที่สุดในไทย? ดูอันดับการรักษามูลค่าและส่วนลดสูงสุดจากราคาใหม่',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        en: `${BASE}/en/${SLUG}`,
        th: `${BASE}/th/${SLUG}`,
      },
    },
  }
}

interface ValueEntry {
  brand: string
  model: string
  slug: string
  avgPrice: number
  retail: number
  retainPct: number
  savingsPct: number
}

function buildValueData(): ValueEntry[] {
  const items = getAllItems()
  const entries: ValueEntry[] = []
  for (const item of items) {
    const vg = item.price_ranges?.very_good
    if (!vg || item.retail_price_thb <= 0) continue
    const avgPrice = getAvgPrice(vg)
    const retainPct = Math.round((avgPrice / item.retail_price_thb) * 100)
    const savingsPct = 100 - retainPct
    entries.push({
      brand: item.brand,
      model: item.model,
      slug: item.slug,
      avgPrice,
      retail: item.retail_price_thb,
      retainPct,
      savingsPct,
    })
  }
  return entries
}

export default async function ValueGuidePage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const allEntries = buildValueData()
  const topRetains = [...allEntries].sort((a, b) => b.retainPct - a.retainPct).slice(0, 10)
  const topSavings = [...allEntries].sort((a, b) => b.savingsPct - a.savingsPct).slice(0, 10)

  const TableHead = () => (
    <thead>
      <tr className="border-b border-[#E8E2D9]">
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A] w-8">
          {isEn ? '#' : '#'}
        </th>
        <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A]">
          {isEn ? 'Brand & Model' : 'แบรนด์ & รุ่น'}
        </th>
        <th className="text-right py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A] hidden sm:table-cell">
          {isEn ? 'Avg Used' : 'ราคามือสอง'}
        </th>
        <th className="text-right py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A] hidden sm:table-cell">
          {isEn ? 'Retail' : 'ราคาใหม่'}
        </th>
        <th className="text-right py-2 text-xs uppercase tracking-wider text-[#9C8B7A]">
          {isEn ? 'Retains %' : 'รักษา %'}
        </th>
      </tr>
    </thead>
  )

  return (
    <>
      <h1
        className="font-serif text-4xl text-[#1A1A1A] mb-3"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {isEn
          ? 'Luxury Resale Value Guide Thailand 2025'
          : 'คู่มือมูลค่าการขายต่อ Luxury ในไทย 2025'}
      </h1>
      <p className="text-[#6B6052] mb-2 leading-relaxed">
        {isEn
          ? 'Comparing average pre-owned prices (Very Good condition) against original retail for every tracked item.'
          : 'เปรียบเทียบราคามือสองเฉลี่ย (สภาพดีมาก) กับราคาใหม่สำหรับทุกรายการที่ติดตาม'}
      </p>
      <p className="text-sm text-[#9C8B7A] mb-12">
        {isEn
          ? `Based on ${allEntries.length} items with both retail and secondary market data.`
          : `อ้างอิงจาก ${allEntries.length} รายการที่มีข้อมูลทั้งราคาใหม่และตลาดมือสอง`}
      </p>

      {/* Table 1: Best value retention */}
      <section className="mb-14">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Best Value Retention' : 'รักษามูลค่าได้ดีที่สุด'}
        </h2>
        <p className="text-sm text-[#8C7355] mb-6">
          {isEn
            ? 'Items that hold their price closest to retail — ideal for buyers who want to resell later.'
            : 'ไอเทมที่รักษาราคาใกล้เคียงราคาใหม่มากที่สุด — เหมาะสำหรับผู้ที่ต้องการขายต่อในอนาคต'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHead />
            <tbody>
              {topRetains.map((entry, i) => (
                <tr key={entry.slug} className="border-b border-[#E8E2D9] hover:bg-[#F5F0EB] transition-colors">
                  <td className="py-3 pr-4 text-[#9C8B7A] font-mono text-xs">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <a href={`/${locale}/${entry.slug}`} className="hover:text-[#B8954A] transition-colors">
                      <span className="text-xs text-[#9C8B7A] block">{entry.brand}</span>
                      <span className="text-[#1A1A1A] font-medium">{entry.model}</span>
                    </a>
                  </td>
                  <td className="py-3 pr-4 text-right text-[#1A1A1A] hidden sm:table-cell">
                    {formatPriceTHB(entry.avgPrice)}
                  </td>
                  <td className="py-3 pr-4 text-right text-[#9C8B7A] hidden sm:table-cell">
                    {formatPriceTHB(entry.retail)}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`font-medium ${
                        entry.retainPct >= 100
                          ? 'text-[#B8954A]'
                          : entry.retainPct >= 70
                          ? 'text-[#4A7A35]'
                          : 'text-[#6B6052]'
                      }`}
                    >
                      {entry.retainPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Table 2: Biggest savings */}
      <section className="mb-14">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Biggest Savings vs Retail' : 'ประหยัดจากราคาใหม่มากที่สุด'}
        </h2>
        <p className="text-sm text-[#8C7355] mb-6">
          {isEn
            ? 'Items with the biggest discount versus their original retail price — best deals for buyers.'
            : 'ไอเทมที่มีส่วนลดสูงสุดจากราคาใหม่ — ดีลที่ดีที่สุดสำหรับผู้ซื้อ'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A] w-8">#</th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A]">
                  {isEn ? 'Brand & Model' : 'แบรนด์ & รุ่น'}
                </th>
                <th className="text-right py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A] hidden sm:table-cell">
                  {isEn ? 'Avg Used' : 'ราคามือสอง'}
                </th>
                <th className="text-right py-2 pr-4 text-xs uppercase tracking-wider text-[#9C8B7A] hidden sm:table-cell">
                  {isEn ? 'Retail' : 'ราคาใหม่'}
                </th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-[#9C8B7A]">
                  {isEn ? 'Saves %' : 'ประหยัด %'}
                </th>
              </tr>
            </thead>
            <tbody>
              {topSavings.map((entry, i) => (
                <tr key={entry.slug} className="border-b border-[#E8E2D9] hover:bg-[#F5F0EB] transition-colors">
                  <td className="py-3 pr-4 text-[#9C8B7A] font-mono text-xs">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <a href={`/${locale}/${entry.slug}`} className="hover:text-[#B8954A] transition-colors">
                      <span className="text-xs text-[#9C8B7A] block">{entry.brand}</span>
                      <span className="text-[#1A1A1A] font-medium">{entry.model}</span>
                    </a>
                  </td>
                  <td className="py-3 pr-4 text-right text-[#1A1A1A] hidden sm:table-cell">
                    {formatPriceTHB(entry.avgPrice)}
                  </td>
                  <td className="py-3 pr-4 text-right text-[#9C8B7A] hidden sm:table-cell">
                    {formatPriceTHB(entry.retail)}
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-medium text-[#4A7A35]">{entry.savingsPct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology note */}
      <div className="border border-[#E8E2D9] p-5 text-sm text-[#9C8B7A]">
        <p className="font-medium text-[#6B6052] mb-1">
          {isEn ? 'Methodology' : 'วิธีการคำนวณ'}
        </p>
        <p>
          {isEn
            ? 'Average pre-owned price is the midpoint of observed Very Good condition price ranges on Vestiaire Collective Thailand. Retail prices are Bangkok boutique prices. Data updated weekly.'
            : 'ราคามือสองเฉลี่ยคือค่ากึ่งกลางของช่วงราคาสภาพดีมากที่พบใน Vestiaire Collective ไทย ราคาใหม่อ้างอิงจากบูติคในกรุงเทพฯ อัปเดตข้อมูลทุกสัปดาห์'}
        </p>
      </div>
    </>
  )
}
