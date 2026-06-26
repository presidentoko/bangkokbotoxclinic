import { getAllBrands, getAllItems, getItemsByBrand, Item } from '@/lib/data'
import { BrandCard } from '@/components/BrandCard'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SecondLuxuryItems.com',
  url: 'https://www.secondluxuryitems.com',
  description: 'Real pre-owned luxury prices updated weekly',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.secondluxuryitems.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

function avgSavingsPct(items: Item[]): number | null {
  const valid = items.filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
  if (!valid.length) return null
  const total = valid.reduce((sum, item) => {
    const vg = item.price_ranges.very_good!
    const avg = (vg.min + vg.max) / 2
    return sum + ((item.retail_price_usd - avg) / item.retail_price_usd * 100)
  }, 0)
  return Math.round(total / valid.length)
}

export default function HomePage() {
  const allItems = getAllItems()
  const brands = getAllBrands()
  const handbagBrands = brands.filter(b => b.category === 'handbags')
  const watchBrands   = brands.filter(b => b.category === 'watches')
  const totalItems    = allItems.length

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero */}
      <div className="mb-16 pt-4">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-4">Weekly Updated Price Guide</p>
        <h1 className="font-serif text-5xl sm:text-6xl text-[#1A1A1A] leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          The Real Price of<br/>Pre-Owned Luxury
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          Authentic second-hand prices for Chanel, Louis Vuitton, Rolex and more —
          tracked weekly from real listings so you always know fair market value.
        </p>
        {/* Trust row */}
        <div className="flex flex-wrap gap-6 mt-8 text-sm text-[#9C8B7A]">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />Updated weekly</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{totalItems}+ models tracked</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />Verified listings only</span>
        </div>
      </div>

      {/* Handbags */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">
            <a href="/handbags" className="hover:text-[#1A1A1A] transition-colors">Handbags</a>
          </span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {handbagBrands.map(b => {
            const brandItems = getItemsByBrand(b.slug)
            const savings = avgSavingsPct(brandItems)
            return (
              <BrandCard
                key={b.slug}
                brand={b.brand}
                slug={b.slug}
                count={b.count}
                category={b.category}
                savingsPct={savings !== null ? savings : undefined}
              />
            )
          })}
        </div>
      </section>

      {/* Watches */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">
            <a href="/watches" className="hover:text-[#1A1A1A] transition-colors">Watches</a>
          </span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {watchBrands.map(b => {
            const brandItems = getItemsByBrand(b.slug)
            const savings = avgSavingsPct(brandItems)
            return (
              <BrandCard
                key={b.slug}
                brand={b.brand}
                slug={b.slug}
                count={b.count}
                category={b.category}
                savingsPct={savings !== null ? savings : undefined}
              />
            )
          })}
        </div>
      </section>
    </>
  )
}
