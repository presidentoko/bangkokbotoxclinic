import type { Metadata } from 'next'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Hermès Scarf Prices — Carré 90, Twilly | SecondLuxuryItems',
  description: 'Pre-owned Hermès scarf prices — Carré 90, Carré 140, Twilly silk. Updated weekly from live listings.',
  alternates: { canonical: `${BASE}/scarves` },
}

export default function ScarvesPage() {
  const items = getItemsByCategory('scarves')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Hermès Scarf Prices',
    url: `${BASE}/scarves`,
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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Used Hermès Scarves — Price Guide</h1>
      <p className="text-[#6B6052] mb-4">Hermès silk scarves are collectible luxury items. Limited editions appreciate in value; classic prints hold steady at 60–80% of retail.</p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} scarf styles</p>
      <SortableItemGrid items={items} />
      {/* FAQ Section */}
      {(() => {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Do Hermès scarves hold their value?',
              acceptedAnswer: { '@type': 'Answer', text: 'Classic Hermès prints in excellent condition typically sell at 60–80% of current retail. Rare prints, artist collaborations, and discontinued colorways can exceed retail — especially when accompanied by the original box. Condition is everything: stains or fading significantly reduce value.' }
            },
            {
              '@type': 'Question',
              name: 'How do I authenticate a pre-owned Hermès scarf?',
              acceptedAnswer: { '@type': 'Answer', text: 'Genuine Hermès scarves have a hand-rolled and hand-stitched hem — look for slightly uneven stitching under the edge, which is the mark of handwork, not machine finishing. "Hermès Paris" is woven (not printed) into the selvage edge. The silk has a distinctive weight and sheen; feel the hand before buying if possible.' }
            },
            {
              '@type': 'Question',
              name: 'What\'s the difference between Carré 90 and Twilly?',
              acceptedAnswer: { '@type': 'Answer', text: 'The Carré 90 is the classic Hermès scarf — a 90×90cm silk square with a full illustrated design. The Twilly is a narrow 5×86cm silk ribbon, originally designed to tie around bag handles but equally popular worn around the neck or wrist. Twillys are more affordable entry points to the Hermès universe.' }
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
