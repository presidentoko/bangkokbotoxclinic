import type { Metadata } from 'next'
import { getItemsUnderBudget, toGridItems } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

export const metadata: Metadata = {
  title: 'Pre-Owned Luxury Under $1,000 — Designer Bags & Accessories | SecondLuxuryItems',
  description: 'Browse authenticated pre-owned luxury items under $1,000. Entry Chanel, LV, and Gucci pieces — updated weekly from live Vestiaire listings.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/under-1000' },
}

export default function Under1000Page() {
  const items = getItemsUnderBudget(1000)
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Pre-Owned Luxury Under $1,000</h1>
      <p className="text-[#8C7355] mb-2">
        {items.length} authenticated items · Avg. prices from live Vestiaire listings
      </p>
      <p className="text-[#1A1A1A] mb-8">
        The sweet spot for pre-owned designer bags — entry Chanel, LV, and Gucci pieces.
        From structured mini bags to iconic monogram accessories, all under $1,000 in very good condition.
      </p>
      <SortableItemGrid items={toGridItems(items)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What designer bags can you buy for under $1,000?",
            "acceptedAnswer": { "@type": "Answer", "text": "Pre-owned Louis Vuitton Speedy 25, Gucci Soho Disco, and entry Chanel accessories are all regularly available under $1,000 in very good condition on authenticated resale platforms." }
          },
          {
            "@type": "Question",
            "name": "Is $1,000 enough for a pre-owned luxury bag?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes — $1,000 opens up a wide range of pre-owned designer bags including Louis Vuitton, Gucci, and entry-level Chanel pieces. It's the most popular budget range for first-time luxury buyers." }
          },
          {
            "@type": "Question",
            "name": "Which luxury bags are under $1,000 used?",
            "acceptedAnswer": { "@type": "Answer", "text": "Louis Vuitton Speedy 30 ($400-600 pre-owned), Gucci Marmont Small ($500-800), and Chanel card holders ($350-500) are popular choices under $1,000." }
          }
        ]
      })}} />
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "What designer bags can you buy for under $1,000?", a: "Pre-owned Louis Vuitton Speedy 25, Gucci Soho Disco, and entry Chanel accessories are all regularly available under $1,000 in very good condition on authenticated resale platforms." },
            { q: "Is $1,000 enough for a pre-owned luxury bag?", a: "Yes — $1,000 opens up a wide range of pre-owned designer bags including Louis Vuitton, Gucci, and entry-level Chanel pieces. It's the most popular budget range for first-time luxury buyers." },
            { q: "Which luxury bags are under $1,000 used?", a: "Louis Vuitton Speedy 30 ($400-600 pre-owned), Gucci Marmont Small ($500-800), and Chanel card holders ($350-500) are popular choices under $1,000." }
          ].map(({ q, a }) => (
            <div key={q} className="border border-[#E8E2D9] rounded-lg p-5">
              <h3 className="font-medium text-[#1A1A1A] mb-2">{q}</h3>
              <p className="text-[#8C7355] text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
