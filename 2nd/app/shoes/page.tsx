import type { Metadata } from 'next'
import { getItemsByCategory } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Designer Shoe Prices — Louboutin, Chanel, Gucci | SecondLuxuryItems',
  description: 'Compare pre-owned prices for Christian Louboutin, Chanel, Gucci, Dior shoes. Updated weekly from authenticated listings.',
  alternates: { canonical: `${BASE}/shoes` },
}

export default function ShoesPage() {
  const items = getItemsByCategory('shoes')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Designer Shoe Prices',
    url: `${BASE}/shoes`,
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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Used Designer Shoes — Price Guide</h1>
      <p className="text-[#6B6052] mb-4">Pre-owned designer shoes up to 50% off retail. All prices from authenticated listings, updated weekly.</p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} shoe models</p>
      <SortableItemGrid items={items} />
      {/* FAQ Section */}
      {(() => {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is buying pre-owned designer shoes worth it?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes — pre-owned designer shoes typically offer 30–50% savings over retail. Look for minimal heel wear and intact soles when evaluating condition. Authenticated listings on platforms like Vestiaire Collective and The RealReal ensure you get the real thing.' }
            },
            {
              '@type': 'Question',
              name: 'How do pre-owned luxury shoes hold their value?',
              acceptedAnswer: { '@type': 'Answer', text: 'Resale value depends heavily on wear — soles are the main indicator buyers check. Lightly worn pairs with intact heels and minimal sole wear retain 50–70% of retail. Heavily worn pairs drop significantly. Classic styles from Louboutin and Chanel depreciate less than seasonal designs.' }
            },
            {
              '@type': 'Question',
              name: 'Which designer shoes are easiest to resell?',
              acceptedAnswer: { '@type': 'Answer', text: 'The easiest to resell are iconic, size-flexible styles: Christian Louboutin So Kate heels, Chanel Ballet Flats, and YSL Tribute heels. These have consistent demand and recognizable silhouettes that command strong resale prices across all conditions.' }
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
