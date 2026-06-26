import { getAllBrands, getAllItems, getItemsByBrand, Item } from '@/lib/data'
import { BrandCard } from '@/components/BrandCard'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SecondLuxuryItems.com',
  url: 'https://www.secondluxuryitems.com',
  description: 'Pre-owned luxury price guide for Chanel, Louis Vuitton, Rolex and more',
  sameAs: ['https://twitter.com/secondluxury'],
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Dark hero */}
      <div className="-mx-6 -mt-10 mb-20 bg-[#1A1A1A] px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#B8954A] mb-6">Weekly Updated Price Guide</p>
          <h1 className="font-serif leading-none mb-8" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#FFFFFF' }}>
            The Real Price<br />
            <span style={{ fontStyle: 'italic', color: '#E8D9C0' }}>of Pre-Owned</span><br />
            Luxury
          </h1>
          <p style={{ color: '#9C8B7A' }} className="text-lg max-w-lg leading-relaxed mb-10">
            Authentic second-hand prices for Chanel, Louis Vuitton, Rolex and more —
            tracked weekly from real listings.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/handbags" className="inline-block px-8 py-3.5 bg-[#B8954A] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#A07B38] transition-all duration-200">
              Handbags
            </a>
            <a href="/watches" className="inline-block px-8 py-3.5 border border-[#6B6052] text-[#9C8B7A] text-sm tracking-[0.15em] uppercase hover:border-[#B8954A] hover:text-[#B8954A] transition-all duration-200">
              Watches
            </a>
          </div>
        </div>
      </div>
      {/* Trust row */}
      <div className="flex flex-wrap gap-6 mb-12 text-sm text-[#9C8B7A]">
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />Updated weekly</span>
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />{totalItems}+ models tracked</span>
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B8954A] inline-block" />Verified listings only</span>
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
