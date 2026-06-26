import type { Metadata } from 'next'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Luxury Handbag Prices — Chanel, LV, Hermès | SecondLuxuryItems',
  description: 'Compare pre-owned prices for Chanel, Louis Vuitton, Hermès, Gucci and more. Updated weekly from real listings.',
  alternates: { canonical: `${BASE}/handbags` },
}

export default function HandbagsPage() {
  const items = getItemsByCategory('handbags')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Luxury Handbag Prices',
    url: `${BASE}/handbags`,
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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Pre-Owned Handbag Prices</h1>
      <p className="text-[#6B6052] mb-4">Current second-hand price ranges for top luxury handbag brands.</p>
      <p className="text-[#6B6052] mb-6">
        Compare authentic pre-owned handbag prices from Chanel, Louis Vuitton, Hermès, Gucci and more.
        Our weekly-updated price index tracks real Vestiaire Collective listings so you always know
        fair market value before buying.
      </p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} handbag models</p>
      <SortableItemGrid items={items} />
      {/* FAQ Section */}
      {(() => {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is a fair price for a pre-owned Chanel bag?',
              acceptedAnswer: { '@type': 'Answer', text: 'A used Chanel Classic Flap in Very Good condition typically sells for $3,800–$7,500 depending on size and hardware. Mini flaps start around $2,200. Prices have increased 40%+ over the past 5 years due to Chanel\'s regular retail price increases.' }
            },
            {
              '@type': 'Question',
              name: 'Which luxury handbag holds its value best?',
              acceptedAnswer: { '@type': 'Answer', text: 'Chanel and Hermès consistently have the highest resale value retention, often exceeding 80-100% of retail for popular styles. Louis Vuitton monogram pieces also hold well at 60-80%. Gucci and Prada typically retain 40-60%.' }
            },
            {
              '@type': 'Question',
              name: 'Is buying pre-owned luxury worth it?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes — buying pre-owned luxury can save 20-50% vs buying new, especially for styles that are readily available. Authentication services like Vestiaire Collective and The RealReal verify authenticity, making it safe to buy second-hand luxury.' }
            },
          ]
        }
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="mt-14 border-t border-[#E8E2D9] pt-10">
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqSchema.mainEntity.map((q, i) => (
                  <div key={i}>
                    <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm">{q.name}</h3>
                    <p className="text-sm text-[#6B6052] leading-relaxed">{q.acceptedAnswer.text}</p>
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
