import type { Metadata } from 'next'
import { getItemsByCategory, toGridItems } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Luxury Jewelry Prices — Cartier, Van Cleef, Tiffany | SecondLuxuryItems',
  description: 'Pre-owned Cartier Love, Van Cleef Alhambra, and Tiffany prices. Updated weekly from authenticated listings.',
  alternates: { canonical: `${BASE}/jewelry` },
}

export default function JewelryPage() {
  const items = getItemsByCategory('jewelry')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Luxury Jewelry Prices',
    url: `${BASE}/jewelry`,
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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Used Luxury Jewelry — Price Guide</h1>
      <p className="text-[#6B6052] mb-4">Fine jewelry retains value exceptionally well. Cartier and Van Cleef pieces often sell above retail.</p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} jewelry pieces</p>
      <SortableItemGrid items={toGridItems(items)} />
      {/* FAQ Section */}
      {(() => {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Does used luxury jewelry hold its value?',
              acceptedAnswer: { '@type': 'Answer', text: 'Cartier and Van Cleef pieces often sell above retail on the secondary market due to strong demand and limited supply. Gold weight provides a natural price floor — even worn pieces carry intrinsic metal value. Iconic pieces like the Cartier Love bracelet and Van Cleef Alhambra necklace are especially resilient.' }
            },
            {
              '@type': 'Question',
              name: 'How do I authenticate pre-owned Cartier jewelry?',
              acceptedAnswer: { '@type': 'Answer', text: 'Genuine Cartier pieces have a laser-engraved reference number inside the clasp or on the inner band, along with a serial number. The finish should be perfectly smooth with no casting marks. Always purchase from authenticated platforms that verify serial numbers against Cartier\'s records.' }
            },
            {
              '@type': 'Question',
              name: 'Is buying pre-owned luxury jewelry risky?',
              acceptedAnswer: { '@type': 'Answer', text: 'Less risky than fashion items — the underlying materials (gold, diamonds, gems) do not change with age or fashion cycles. Authentication is the primary concern. Use platforms with professional gemological authentication, and always ask for accompanying certificates or original receipts when available.' }
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
