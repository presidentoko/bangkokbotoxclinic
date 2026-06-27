import type { Metadata } from 'next'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Designer Belt Prices — Hermès, Gucci, LV | SecondLuxuryItems',
  description: 'Pre-owned designer belt prices for Hermès H Belt, Gucci GG Marmont, Louis Vuitton. Updated weekly.',
  alternates: { canonical: `${BASE}/belts` },
}

export default function BeltsPage() {
  const items = getItemsByCategory('belts')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Designer Belt Prices',
    url: `${BASE}/belts`,
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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Used Designer Belts — Price Guide</h1>
      <p className="text-[#6B6052] mb-4">Designer belts are the most accessible entry point to luxury fashion, with pre-owned prices 30–50% below retail.</p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} belt models</p>
      <SortableItemGrid items={items} />
      {/* FAQ Section */}
      {(() => {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Which designer belt holds value best?',
              acceptedAnswer: { '@type': 'Answer', text: 'The Hermès H Belt consistently holds the strongest resale value, often retaining 70–85% of retail, especially in reversible styles with gold hardware. Louis Vuitton Monogram belts come second, holding 60–75%. Gucci and other brands typically retain 40–60% depending on the style and condition.' }
            },
            {
              '@type': 'Question',
              name: 'How do I check a pre-owned Hermès belt?',
              acceptedAnswer: { '@type': 'Answer', text: 'Authentic Hermès belts are stamped "Hermès Paris Made in France" on the back of the leather. The buckle should be solid metal — gold-plated or palladium-plated — with no discoloration at edges. Stitching is even and tight. Check the blind stamp (a letter indicating the year of manufacture) inside the belt loop.' }
            },
            {
              '@type': 'Question',
              name: 'What size belt should I buy pre-owned?',
              acceptedAnswer: { '@type': 'Answer', text: 'For Hermès belts, the size roughly equals your waist measurement in centimeters divided by about 2.5 — but Hermès sizing varies. Measure your current belt from the buckle pin to the hole you use, then match to Hermès size charts. For other brands, check whether sizing is by waist (cm) or pant size before purchasing.' }
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
