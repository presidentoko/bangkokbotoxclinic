import type { Metadata } from 'next'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Luxury Watch Prices — Rolex, Patek, AP | SecondLuxuryItems',
  description: 'Compare pre-owned prices for Rolex, Patek Philippe, Audemars Piguet and Cartier. Updated weekly from real listings.',
  alternates: { canonical: `${BASE}/watches` },
}

export default function WatchesPage() {
  const items = getItemsByCategory('watches')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Luxury Watch Prices',
    url: `${BASE}/watches`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/${item.slug}`,
      name: `Used ${item.brand} ${item.model}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Pre-Owned Watch Prices</h1>
      <p className="text-[#6B6052] mb-4">Current second-hand price ranges for top luxury watch brands.</p>
      <p className="text-[#6B6052] mb-6">
        Real pre-owned watch prices for Rolex, Patek Philippe, Audemars Piguet and Cartier.
        Updated weekly from authenticated marketplace listings.
      </p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} watch models</p>
      <SortableItemGrid items={items} />
      {/* FAQ Section */}
      {(() => {
        const watchFAQ = [
          {
            name: 'What is a fair price for a pre-owned Rolex?',
            answer: 'Pre-owned Rolex prices vary widely by model. A used Rolex Submariner in Very Good condition typically sells for $10,000–$15,000. The Datejust ranges from $5,000–$12,000 depending on configuration. Sports models like the GMT-Master II command premiums above retail.'
          },
          {
            name: 'Do luxury watches hold their value?',
            answer: 'Rolex, Patek Philippe, and Audemars Piguet consistently maintain or exceed retail value. Rolex sports models often trade above retail due to demand. Entry-level luxury watches from TAG Heuer or Longines typically retain 40-60% of retail value.'
          },
          {
            name: 'Where is the best place to buy a pre-owned watch?',
            answer: 'Reputable platforms include Chrono24, Watchfinder, and Bob\'s Watches for certified pre-owned. For peer-to-peer, Vestiaire Collective and eBay offer buyer protections. Always verify authentication documentation and service history.'
          },
        ]
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: watchFAQ.map(q => ({
            '@type': 'Question',
            name: q.name,
            acceptedAnswer: { '@type': 'Answer', text: q.answer }
          }))
        }
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="mt-14 border-t border-[#E8E2D9] pt-10">
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {watchFAQ.map((q, i) => (
                  <div key={i}>
                    <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm">{q.name}</h3>
                    <p className="text-sm text-[#6B6052] leading-relaxed">{q.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      })()}
    </>
  )
}
