import Link from 'next/link'
import { getAllBrands, getAllItems, getItemsByBrand, Item } from '@/lib/data'

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
  const categories    = [...new Set(allItems.map(i => i.category))].length

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 leading-tight">
          The Real Price of Pre-Owned Luxury
        </h1>
        <p className="text-gray-600 text-lg mb-5">
          Track 50+ items across Chanel, LV, Rolex and more — updated weekly from real listings
        </p>
        <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-500">
          <span>&#10003; Updated Weekly</span>
          <span>&#10003; 50+ Models</span>
          <span>&#10003; Verified Listings</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-12 p-5 bg-gray-50 rounded-xl text-center">
        <div>
          <div className="text-3xl font-bold">{allItems.length}</div>
          <div className="text-sm text-gray-500 mt-1">Models tracked</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{brands.length}</div>
          <div className="text-sm text-gray-500 mt-1">Brands covered</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{categories}</div>
          <div className="text-sm text-gray-500 mt-1">Categories</div>
        </div>
      </div>

      {/* Handbags */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href="/handbags" className="hover:underline">Handbags</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {handbagBrands.map(b => {
            const brandItems = getItemsByBrand(b.slug)
            const savings = avgSavingsPct(brandItems)
            return (
              <Link
                key={b.slug}
                href={`/${b.slug}`}
                className="block p-5 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-lg">{b.brand}</h3>
                <p className="text-sm text-gray-500 mt-1">{b.count} model{b.count !== 1 ? 's' : ''} tracked</p>
                {savings !== null && savings > 0 && (
                  <p className="text-sm text-green-600 mt-1 font-medium">Avg save: {savings}%</p>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Watches */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href="/watches" className="hover:underline">Watches</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {watchBrands.map(b => {
            const brandItems = getItemsByBrand(b.slug)
            const savings = avgSavingsPct(brandItems)
            return (
              <Link
                key={b.slug}
                href={`/${b.slug}`}
                className="block p-5 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-lg">{b.brand}</h3>
                <p className="text-sm text-gray-500 mt-1">{b.count} model{b.count !== 1 ? 's' : ''} tracked</p>
                {savings !== null && savings > 0 && (
                  <p className="text-sm text-green-600 mt-1 font-medium">Avg save: {savings}%</p>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="p-6 bg-gray-50 rounded-xl">
        <h2 className="text-xl font-semibold mb-6 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-200 mb-2">1</div>
            <div className="font-medium">Pick a brand</div>
            <p className="text-sm text-gray-500 mt-1">Browse Chanel, LV, Rolex and more</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-200 mb-2">2</div>
            <div className="font-medium">Compare prices by condition</div>
            <p className="text-sm text-gray-500 mt-1">Excellent, very good, and good grades</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-200 mb-2">3</div>
            <div className="font-medium">Shop with confidence</div>
            <p className="text-sm text-gray-500 mt-1">Know fair market value before buying</p>
          </div>
        </div>
      </section>
    </>
  )
}
