import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBrands, getItemsByBrand } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Luxury Brands Ranked by Resale Value — Best & Worst Retention | SecondLuxuryItems',
  description: 'Which luxury bags and watches hold their value best? Chanel, Hermès, Rolex compared by average resale price vs retail.',
  alternates: { canonical: `${BASE}/brands` },
}

function computeBrandData() {
  const brands = getAllBrands()
  return brands
    .map(b => {
      const items = getItemsByBrand(b.slug).filter(
        i => i.price_ranges.very_good && i.retail_price_usd > 0
      )
      if (!items.length) return null
      const avgSavings = Math.round(
        items.reduce((sum, i) => {
          const vg = i.price_ranges.very_good!
          const avg = (vg.min + vg.max) / 2
          return sum + ((i.retail_price_usd - avg) / i.retail_price_usd) * 100
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

export default function BrandsPage() {
  const brandData = computeBrandData()
  const handbags = brandData.filter(b => b.categories.includes('handbags'))
  const watches = brandData.filter(b => b.categories.includes('watches'))

  function RankList({ items, label }: { items: typeof handbags; label: string }) {
    return (
      <section className="mb-14">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>{label}</h2>
        <div className="space-y-3">
          {items.map((b, i) => (
            <Link key={b.slug} href={`/${b.slug}`}
              className="group flex items-center gap-4 p-4 bg-white border border-[#E8E2D9] hover:border-[#B8954A] transition-all duration-200"
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
                    <p className="text-xs text-[#9C8B7A] mt-0.5">{b.itemCount} models tracked</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-lg ${b.retention >= 80 ? 'text-[#4A7A35]' : b.retention >= 60 ? 'text-[#B8954A]' : 'text-[#6B6052]'}`}>
                      {b.retention}%
                    </p>
                    <p className="text-xs text-[#9C8B7A]">value retained</p>
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
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Resale Value Guide</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Which Luxury Brands<br />Hold Their Value?
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          Ranked by average resale price as a percentage of retail. Higher score = better value retention.
          Based on current Vestiaire Collective and eBay market data.
        </p>
      </div>
      <RankList items={handbags} label="Handbags" />
      <RankList items={watches} label="Watches" />
      <div className="mt-4 p-4 bg-[#F5F0E8] border border-[#E8E2D9] text-xs text-[#6B6052] leading-relaxed">
        Value retention calculated as: average resale price (Very Good condition) ÷ retail price × 100.
        Updated weekly from real market listings.
      </div>
    </>
  )
}
