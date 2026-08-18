import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBrands, getItemsByBrand } from '@/lib/data'
import { hasBrandGuide, BRAND_GUIDES } from '@/lib/brand-guides'

const BASE = 'https://www.chicpreowned.com'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isTh = locale === 'th'
  return {
    title: isTh
      ? 'แบรนด์หรูยี่ห้อไหนรักษามูลค่าได้ดีที่สุด? — ตลาดไทย | ChicPreOwned'
      : 'Which Luxury Brands Hold Their Value? — Thailand Market | ChicPreOwned',
    description: isTh
      ? 'จัดอันดับแบรนด์หรูตามราคาขายต่อเฉลี่ยเทียบกับราคาใหม่ Chanel, Hermès, Rolex เปรียบเทียบในตลาดไทย'
      : 'Which luxury bags and watches hold their value best in Thailand? Chanel, Hermès, Rolex compared by average resale price vs retail.',
    alternates: { canonical: `${BASE}/${locale}/brands` },
  }
}

function computeBrandData(category: 'handbags' | 'watches') {
  const brands = getAllBrands()
  return brands
    .filter(b => b.categories.includes(category))
    .map(b => {
      const items = getItemsByBrand(b.slug).filter(
        i => i.category === category && i.price_ranges.very_good && i.retail_price_thb > 0
      )
      if (!items.length) return null
      const avgSavings = Math.round(
        items.reduce((sum, i) => {
          const vg = i.price_ranges.very_good!
          const avg = (vg.min + vg.max) / 2
          return sum + ((i.retail_price_thb - avg) / i.retail_price_thb) * 100
        }, 0) / items.length
      )
      const retention = 100 - avgSavings
      return { ...b, avgSavings, retention, itemCount: items.length }
    })
    .filter(Boolean)
    .sort((a, b) => b!.retention - a!.retention) as Array<{
      brand: string; slug: string; categories: string[]; count: number;
      avgSavings: number; retention: number; itemCount: number
    }>
}

export default async function BrandsPage({ params }: Props) {
  const { locale } = await params
  const isTh = locale === 'th'

  const handbags = computeBrandData('handbags')
  const watches = computeBrandData('watches')

  const modelsLabel = isTh ? 'โมเดลที่ติดตาม' : 'models tracked'
  const valueRetainedLabel = isTh ? 'รักษามูลค่า' : 'value retained'

  function RankList({ items, label }: { items: typeof handbags; label: string }) {
    return (
      <section className="mb-14">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>{label}</h2>
        <div className="space-y-3">
          {items.map((b, i) => (
            <div key={b.slug} className="bg-white border border-[#E8E2D9] hover:border-[#B8954A] transition-all duration-200">
            <Link href={`/${locale}/${b.slug}`}
              className="group flex items-center gap-4 p-4"
            >
              <span className="font-serif text-2xl text-[#E8E2D9] w-8 shrink-0 text-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {b.brand}
                    </p>
                    <p className="text-xs text-[#9C8B7A] mt-0.5">{b.itemCount} {modelsLabel}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-lg ${b.retention >= 80 ? 'text-[#4A7A35]' : b.retention >= 60 ? 'text-[#B8954A]' : 'text-[#6B6052]'}`}>
                      {b.retention}%
                    </p>
                    <p className="text-xs text-[#9C8B7A]">{valueRetainedLabel}</p>
                  </div>
                </div>
                {/* Retention bar */}
                <div className="mt-3 h-1.5 bg-[#F0EAE0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, b.retention)}%`,
                      background: b.retention >= 80 ? '#4A7A35' : b.retention >= 60 ? '#B8954A' : '#9C8B7A'
                    }}
                  />
                </div>
              </div>
            </Link>
            {hasBrandGuide(b.slug) && (
              <Link
                href={`/${locale}/brands/${b.slug}`}
                className="block px-4 pb-3 -mt-1 text-xs text-[#B8954A] hover:text-[#8C7355] transition-colors"
              >
                {locale === 'th'
                  ? `คู่มือซื้อ ${b.brand} มือสอง — วิธีเช็กของแท้ →`
                  : `${b.brand} buying guide — authentication & what to look for →`}
              </Link>
            )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
          {isTh ? 'คู่มือมูลค่าสินค้า' : 'Resale Value Guide'}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          {isTh ? (
            <>แบรนด์หรูยี่ห้อไหน<br />รักษามูลค่าได้ดีที่สุด?</>
          ) : (
            <>Which Luxury Brands<br />Hold Their Value?</>
          )}
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          {isTh
            ? 'จัดอันดับตามราคาขายต่อเฉลี่ยเทียบกับราคาใหม่ในตลาดไทย อัปเดตทุกสัปดาห์'
            : 'Ranked by average resale price as a percentage of retail. Higher score = better value retention. Updated weekly.'}
        </p>
      </div>
      <RankList items={handbags} label={isTh ? 'กระเป๋าหรู' : 'Handbags'} />
      <RankList items={watches} label={isTh ? 'นาฬิกาหรู' : 'Watches'} />
      {/* The ranked lists only cover handbags and watches, so jewellery brands'
          buying guides would still have no link from this hub. Catch the rest. */}
      {(() => {
        const ranked = new Set([...handbags, ...watches].map(b => b.slug))
        const rest = BRAND_GUIDES.filter(g => !ranked.has(g.slug))
        if (!rest.length) return null
        return (
          <section className="mb-14">
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isTh ? 'คู่มือซื้อเพิ่มเติม' : 'More Buying Guides'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {rest.map(b => (
                <Link
                  key={b.slug}
                  href={`/${locale}/brands/${b.slug}`}
                  className="text-sm bg-white border border-[#E8E2D9] px-4 py-2 text-[#6B6052] hover:border-[#B8954A] hover:text-[#B8954A] transition-colors"
                >
                  {isTh ? `คู่มือซื้อ ${b.name} →` : `${b.name} buying guide →`}
                </Link>
              ))}
            </div>
          </section>
        )
      })()}
      <div className="mt-4 p-4 bg-[#F5F0E8] border border-[#E8E2D9] text-xs text-[#6B6052] leading-relaxed">
        {isTh
          ? 'คำนวณจาก: ราคาขายต่อเฉลี่ย (สภาพดีมาก) ÷ ราคาใหม่ × 100 อัปเดตทุกสัปดาห์จากข้อมูลตลาดจริง'
          : 'Value retention calculated as: average resale price (Very Good condition) ÷ retail price × 100. Updated weekly from real market listings.'}
      </div>
    </>
  )
}
