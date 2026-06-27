import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Prada Pre-Owned Price Guide 2025 | SecondLuxuryItems',
  description: 'Pre-owned Prada prices for Galleria, Re-Edition 2000, Cleo and more. Compare second-hand Prada prices by condition, updated weekly.',
  alternates: { canonical: `${BASE}/brands/prada` },
}

const faqs = [
  {
    q: 'Is Prada Saffiano leather worth buying pre-owned?',
    a: "Absolutely. Saffiano leather's cross-hatch texture is scratch-resistant and ages exceptionally well. Pre-owned Saffiano pieces in Good condition often look near-new because the leather resists everyday scuffs. It's one of the most durable luxury materials available, making pre-owned Prada one of the safest buys in the market.",
  },
  {
    q: 'Which Prada bag has the best resale value?',
    a: "The Re-Edition 2005 Shoulder Bag and Re-Edition 2000 Mini Bag have the strongest resale momentum. The Galleria in Saffiano holds value consistently at 40–60% of retail. The Cleo is the current standout — clean lines, Saffiano construction, and growing cultural cachet make it a strong hold.",
  },
  {
    q: 'Are pre-owned Prada nylon bags worth buying?',
    a: 'Pre-owned Prada nylon bags offer the best value per dollar in the luxury market — they are virtually indestructible, age without visible wear, and are available at 50–70% below retail. The Re-Nylon pieces using recycled ocean plastic are the current sweet spot. Authentication is easier than leather as the nylon weave pattern is consistent.',
  },
  {
    q: 'How do I authenticate a pre-owned Prada bag?',
    a: "Check the triangle logo plate — authentic Prada plates are solid metal, stamped with 'PRADA MILANO DAL 1913', with consistent font weight. The stitching should be even and tight. Post-2019 bags include an authenticity card with QR code. The interior lining should have a Prada logo jacquard pattern, not plain fabric.",
  },
]

export default function PradaBrandPage() {
  const items = getItemsByBrand('prada').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Prada Price Guide 2025',
    url: `${BASE}/brands/prada`,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${BASE}/${item.slug}`,
      name: `Pre-Owned ${item.brand} ${item.model}`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [itemListSchema, faqSchema] }) }}
      />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Brand Price Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Pre-Owned Prada: Price Guide 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated 2025 · {items.length} models tracked</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {"Prada's Saffiano leather and nylon pieces are among the most durable in luxury — they survive decades of daily use. The Re-Edition 2005 is the standout resale hit of 2023–24, while the Galleria remains the reliable backbone of the brand. Pre-owned Prada trades at 40–55% off retail — one of the best value propositions in accessible luxury."}
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Pre-Owned Prada Price Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Model</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Pre-Owned Avg</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retail</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {items.map(item => {
                const vg = item.price_ranges.very_good!
                const avg = getAvgPrice(vg)
                const savingsPct = Math.round((1 - avg / item.retail_price_usd) * 100)
                return (
                  <tr key={item.id}>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/${item.slug}`}
                        className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors"
                      >
                        {item.model}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPrice(avg)}</td>
                    <td className="py-3 pr-4 text-[#9C8B7A]">{formatPrice(item.retail_price_usd)}</td>
                    <td className={`py-3 font-medium text-sm ${savingsPct > 0 ? 'text-[#4A7A35]' : 'text-[#8C7355]'}`}>
                      {savingsPct > 0 ? `-${savingsPct}%` : `+${Math.abs(savingsPct)}% above retail`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2
          className="text-lg text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Key Buying Advice
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          Saffiano leather is Prada's signature — the cross-hatch embossed pattern makes it naturally scratch-resistant and easy to clean. When buying pre-owned, a Good condition Saffiano piece can look nearly new. Prioritize classic black or camel for resale flexibility. The Re-Edition 2000 in nylon is the best value entry into the Prada ecosystem.
        </p>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm">{q}</h3>
              <p className="text-sm text-[#6B6052] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-[#E8E2D9]">
        <Link href="/prada" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          View all Prada models →
        </Link>
      </div>
    </article>
  )
}
