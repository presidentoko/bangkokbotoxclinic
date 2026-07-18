import type { Metadata } from 'next'
import { getAllItems, getAllBrands, getAvgPrice, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'market-overview'

const CATEGORY_LABELS: Record<string, { en: string; th: string }> = {
  handbags: { en: 'Handbags', th: 'กระเป๋า' },
  watches: { en: 'Watches', th: 'นาฬิกา' },
  clothing: { en: 'Clothing', th: 'เสื้อผ้า' },
  scarves: { en: 'Scarves', th: 'ผ้าพันคอ' },
  'small-leather-goods': { en: 'Small Leather Goods', th: 'สินค้าหนังชิ้นเล็ก' },
  jewelry: { en: 'Jewelry', th: 'เครื่องประดับ' },
  shoes: { en: 'Shoes', th: 'รองเท้า' },
  belts: { en: 'Belts', th: 'เข็มขัด' },
}

const CAT_ORDER = ['handbags', 'watches', 'clothing', 'scarves', 'small-leather-goods', 'jewelry', 'shoes', 'belts']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  const otherLocale = isEn ? 'th' : 'en'
  return {
    title: isEn
      ? 'Pre-Owned Luxury Market Prices in Thailand 2025 | ChicPreowned'
      : 'ภาพรวมตลาด Luxury มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Thailand pre-owned luxury market overview — prices by category, best value items, and top brands. Updated weekly.'
      : 'ภาพรวมตลาด luxury มือสองในไทย — ราคาตามหมวดหมู่ รายการที่คุ้มค่าที่สุด และแบรนด์ยอดนิยม อัปเดตทุกสัปดาห์',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        [locale]: `${BASE}/${locale}/${SLUG}`,
        [otherLocale]: `${BASE}/${otherLocale}/${SLUG}`,
        'x-default': `${BASE}/en/${SLUG}`,
      },
    },
  }
}

export default async function MarketOverviewPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const allItems = getAllItems()
  const allBrands = getAllBrands()

  const catStats = CAT_ORDER
    .map(cat => {
      const catItems = allItems.filter(i => i.category === cat)
      if (catItems.length === 0) return null
      const priced = catItems.filter(i => !!(i.price_ranges.very_good ?? i.price_ranges.excellent ?? i.price_ranges.good))
      const avgPrice = priced.length > 0
        ? Math.round(
            priced.reduce((sum, i) => {
              const r = i.price_ranges.very_good ?? i.price_ranges.excellent ?? i.price_ranges.good
              return sum + getAvgPrice(r!)
            }, 0) / priced.length
          )
        : 0
      return { cat, count: catItems.length, avgPrice }
    })
    .filter((c): c is { cat: string; count: number; avgPrice: number } => c !== null)

  const bestValue = allItems
    .filter(i => i.retail_price_thb > 0)
    .flatMap(i => {
      const r = i.price_ranges.very_good ?? i.price_ranges.excellent ?? i.price_ranges.good
      if (!r) return []
      const avg = getAvgPrice(r)
      const savings = i.retail_price_thb - avg
      if (savings <= 0) return []
      return [{ ...i, avg, savings, savingsPct: Math.round((savings / i.retail_price_thb) * 100) }]
    })
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 10)

  const brandList = [...allBrands].sort((a, b) => b.count - a.count)

  return (
    <>
      <p className="text-sm text-[#9C8B7A] mb-3">
        <a href={`/${locale}`} className="hover:text-[#B8954A] transition-colors">
          {isEn ? 'Home' : 'หน้าหลัก'}
        </a>
        {' › '}
        {isEn ? 'Market Overview' : 'ภาพรวมตลาด'}
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
        {isEn ? 'Market Intelligence' : 'ข้อมูลตลาด'}
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn
          ? 'Pre-Owned Luxury Market: Thailand Price Overview 2025'
          : 'ภาพรวมตลาด Luxury มือสองในไทยปี 2025'}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">
        {isEn
          ? `${allItems.length} models tracked across ${allBrands.length} brands · Updated weekly`
          : `ติดตาม ${allItems.length} รุ่น จาก ${allBrands.length} แบรนด์ · อัปเดตทุกสัปดาห์`}
      </p>

      <section className="mb-14">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Prices by Category' : 'ราคาตามหมวดหมู่'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  {isEn ? 'Category' : 'หมวดหมู่'}
                </th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  {isEn ? 'Count' : 'จำนวน'}
                </th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  {isEn ? 'Avg Price THB' : 'ราคาเฉลี่ย THB'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {catStats.map(({ cat, count, avgPrice }) => (
                <tr key={cat}>
                  <td className="py-3 pr-4 text-[#1A1A1A]">
                    {isEn ? (CATEGORY_LABELS[cat]?.en ?? cat) : (CATEGORY_LABELS[cat]?.th ?? cat)}
                  </td>
                  <td className="py-3 pr-4 text-[#6B6052]">{count}</td>
                  <td className="py-3 font-medium text-[#1A1A1A]">
                    {avgPrice > 0 ? formatPriceTHB(avgPrice) : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Best Value Items' : 'รายการที่คุ้มค่าที่สุด'}
        </h2>
        <p className="text-[#8C7355] text-sm mb-6">
          {isEn
            ? 'Top 10 items furthest below retail — highest THB savings'
            : '10 รายการที่ราคาต่ำกว่าราคาใหม่มากที่สุด'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  {isEn ? 'Item' : 'สินค้า'}
                </th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  {isEn ? 'Pre-Owned Avg' : 'เฉลี่ยมือสอง'}
                </th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  {isEn ? 'Retail' : 'ราคาใหม่'}
                </th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  {isEn ? 'Savings' : 'ประหยัด'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {bestValue.map(item => (
                <tr key={item.id}>
                  <td className="py-3 pr-4">
                    <a href={`/${locale}/${item.slug}`} className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors">
                      <span className="text-xs text-[#9C8B7A] block">{item.brand}</span>
                      {item.model}
                    </a>
                  </td>
                  <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPriceTHB(item.avg)}</td>
                  <td className="py-3 pr-4 text-[#9C8B7A] line-through">{formatPriceTHB(item.retail_price_thb)}</td>
                  <td className="py-3 text-[#4A7A35] font-medium">
                    {formatPriceTHB(item.savings)} ({item.savingsPct}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isEn ? 'Most Searched Brands' : 'แบรนด์ยอดนิยม'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {brandList.map(b => (
            <a
              key={b.slug}
              href={`/${locale}/${b.slug}`}
              className="group flex items-center justify-between p-4 border border-[#E8E2D9] hover:border-[#B8954A] transition-all duration-200"
            >
              <span className="text-[#1A1A1A] group-hover:text-[#B8954A] transition-colors font-medium text-sm">
                {b.brand}
              </span>
              <span className="text-xs text-[#9C8B7A]">
                {b.count} {isEn ? 'models' : 'รุ่น'}
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
