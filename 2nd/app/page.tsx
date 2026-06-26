import { getAllBrands } from '@/lib/data'
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

export default function HomePage() {
  const handbagBrands = getAllBrands().filter(b => b.category === 'handbags')
  const watchBrands   = getAllBrands().filter(b => b.category === 'watches')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Pre-Owned Luxury Price Guide</h1>
        <p className="text-gray-600 text-lg">
          Real second-hand prices for Chanel, Louis Vuitton, Rolex and more — updated weekly from live listings.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          <a href="/handbags" className="hover:underline">Handbags</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {handbagBrands.map(b => <BrandCard key={b.slug} {...b} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          <a href="/watches" className="hover:underline">Watches</a>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {watchBrands.map(b => <BrandCard key={b.slug} {...b} />)}
        </div>
      </section>
    </>
  )
}
