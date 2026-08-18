import type { Metadata } from 'next'
import { getItemsUnderBudget, toGridItems } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

export const metadata: Metadata = {
  title: 'Pre-Owned Luxury Under $2,000 — Designer Handbags & Watches | SecondLuxuryItems',
  description: 'Browse authenticated pre-owned luxury under $2,000. Chanel Classic Flap, LV Neverfull, and watch entry points — updated weekly from live listings.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/under-2000' },
}

export default function Under2000Page() {
  const items = getItemsUnderBudget(2000)
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Pre-Owned Luxury Under $2,000</h1>
      <p className="text-[#8C7355] mb-2">
        {items.length} authenticated items · Avg. prices from live Vestiaire listings
      </p>
      <p className="text-[#1A1A1A] mb-8">
        Full handbag range including Chanel Classic Flap, LV Neverfull, and watch entry points.
        At this budget, the entire pre-owned luxury market opens up — from iconic totes to entry dress watches.
      </p>
      <SortableItemGrid items={toGridItems(items)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What luxury bags can you get for under $2,000?",
            "acceptedAnswer": { "@type": "Answer", "text": "Under $2,000 pre-owned you can find Louis Vuitton Neverfull MM, Gucci Marmont Medium, entry Chanel WOC, and even some Classic Flap sizes depending on condition and colorway." }
          },
          {
            "@type": "Question",
            "name": "Is $2,000 a good budget for a first luxury bag?",
            "acceptedAnswer": { "@type": "Answer", "text": "$2,000 is an excellent budget for a first luxury bag. It unlocks iconic pieces like the LV Neverfull and allows you to choose from Chanel's smaller styles pre-owned. Focus on classic colorways (black, beige, brown) for the best resale value." }
          },
          {
            "@type": "Question",
            "name": "What holds value best under $2,000?",
            "acceptedAnswer": { "@type": "Answer", "text": "Louis Vuitton Monogram bags hold 65-80% of retail and are the safest value play under $2,000. Chanel WOC in caviar leather is also a strong choice due to consistent demand." }
          }
        ]
      })}} />
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "What luxury bags can you get for under $2,000?", a: "Under $2,000 pre-owned you can find Louis Vuitton Neverfull MM, Gucci Marmont Medium, entry Chanel WOC, and even some Classic Flap sizes depending on condition and colorway." },
            { q: "Is $2,000 a good budget for a first luxury bag?", a: "$2,000 is an excellent budget for a first luxury bag. It unlocks iconic pieces like the LV Neverfull and allows you to choose from Chanel's smaller styles pre-owned. Focus on classic colorways (black, beige, brown) for the best resale value." },
            { q: "What holds value best under $2,000?", a: "Louis Vuitton Monogram bags hold 65-80% of retail and are the safest value play under $2,000. Chanel WOC in caviar leather is also a strong choice due to consistent demand." }
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
