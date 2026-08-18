import type { Metadata } from 'next'
import { getItemsUnderBudget, toGridItems } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

export const metadata: Metadata = {
  title: 'Pre-Owned Luxury Under $500 — Bags, Shoes & Accessories | SecondLuxuryItems',
  description: 'Browse authenticated pre-owned luxury items under $500. Chanel, Louis Vuitton, Gucci and more — updated weekly from live listings.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/under-500' },
}

export default function Under500Page() {
  const items = getItemsUnderBudget(500)
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Pre-Owned Luxury Under $500</h1>
      <p className="text-[#8C7355] mb-2">
        {items.length} authenticated items · Avg. prices from live Vestiaire listings
      </p>
      <p className="text-[#1A1A1A] mb-8">
        The most accessible entry points to designer fashion — scarves, belts, wallets,
        and shoes from top luxury houses, all under $500 in very good condition.
      </p>
      <SortableItemGrid items={toGridItems(items)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can you buy real luxury items for under $500?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes — Hermès scarves, Louis Vuitton wallets, and designer belts regularly sell pre-owned under $500. Silk accessories and small leather goods are the best entry points." }
          },
          {
            "@type": "Question",
            "name": "What luxury brand has the best value under $500?",
            "acceptedAnswer": { "@type": "Answer", "text": "Hermès Twilly scarves ($150-220 pre-owned vs $195 retail) and LV Card Holders ($180-250 pre-owned) offer the best brand recognition per dollar under $500." }
          },
          {
            "@type": "Question",
            "name": "Are pre-owned luxury items under $500 authentic?",
            "acceptedAnswer": { "@type": "Answer", "text": "On authenticated platforms like Vestiaire Collective, every item goes through authentication review. Always buy from platforms with authentication guarantees." }
          }
        ]
      })}} />
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Can you buy real luxury items for under $500?", a: "Yes — Hermès scarves, Louis Vuitton wallets, and designer belts regularly sell pre-owned under $500. Silk accessories and small leather goods are the best entry points." },
            { q: "What luxury brand has the best value under $500?", a: "Hermès Twilly scarves ($150-220 pre-owned vs $195 retail) and LV Card Holders ($180-250 pre-owned) offer the best brand recognition per dollar under $500." },
            { q: "Are pre-owned luxury items under $500 authentic?", a: "On authenticated platforms like Vestiaire Collective, every item goes through authentication review. Always buy from platforms with authentication guarantees." }
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
