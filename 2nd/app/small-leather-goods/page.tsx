import type { Metadata } from 'next'
import { getItemsByCategory, toGridItems } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Used Luxury Wallet & SLG Prices — LV, Chanel, Hermès | SecondLuxuryItems',
  description: 'Pre-owned luxury wallets, card holders, and small leather goods prices. Updated weekly.',
  alternates: { canonical: `${BASE}/small-leather-goods` },
}

export default function SmallLeatherGoodsPage() {
  const items = getItemsByCategory('small-leather-goods')

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Luxury Small Leather Goods Prices',
    url: `${BASE}/small-leather-goods`,
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
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Used Luxury Small Leather Goods — Price Guide</h1>
      <p className="text-[#6B6052] mb-4">Small leather goods offer a gateway into luxury fashion at a fraction of handbag prices. Chanel and LV wallets especially hold value.</p>
      <p className="text-sm text-[#9C8B7A] mb-8">Tracking {items.length} SLG models</p>
      <SortableItemGrid items={toGridItems(items)} />
      {/* FAQ Section */}
      {(() => {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Do luxury wallets hold their value?',
              acceptedAnswer: { '@type': 'Answer', text: 'Less than handbags, but still respectably well. Pre-owned LV and Chanel small leather goods typically sell at 50–65% of current retail in good condition. Items with monogram canvas hold better than smooth leather, as the canvas is more resistant to wear and easier to authenticate.' }
            },
            {
              '@type': 'Question',
              name: 'What to check when buying a pre-owned luxury wallet?',
              acceptedAnswer: { '@type': 'Answer', text: 'Inspect the interior card slots for excessive stretching or cracking, the zipper for smooth function and intact pulls, and the monogram or logo for consistent alignment and print quality. Check the corners and edges for fraying. Smell test for off-putting odors that indicate improper storage.' }
            },
            {
              '@type': 'Question',
              name: 'Is a pre-owned luxury card holder worth it?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes — card holders are among the safest pre-owned luxury purchases. They are easy to authenticate (fewer moving parts), wear very durably, and typically sell at 30–50% below retail. LV and Gucci card holders are especially popular and liquid on the resale market.' }
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
