import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès Pre-Owned Price Guide 2025 | SecondLuxuryItems',
  description: 'Current pre-owned Hermès prices for Birkin, Kelly, Constance and more. Birkins trade above retail. Compare second-hand Hermès prices by model, updated weekly.',
  alternates: { canonical: `${BASE}/brands/hermes` },
}

const faqs = [
  {
    q: 'Why is Hermès more expensive pre-owned?',
    a: "Hermès restricts supply through a quota system and long waitlists at boutiques. Birkin and Kelly bags can require years of purchase history before being offered. This artificial scarcity drives secondary market premiums of 20–100% above retail for the most in-demand sizes and leathers. Pre-owned Hermès is often the only realistic path to acquiring these bags.",
  },
  {
    q: 'What is the best Hermès bag to buy pre-owned?',
    a: "The Picotin 18 and Garden Party 36 both sell below retail pre-owned — the best entry points for buyers who want genuine Hermès without the waitlist premium. If budget allows, the Birkin 25 or 30 in Togo or Clemence leather has the strongest long-term value track record.",
  },
  {
    q: 'How do I authenticate a Hermès bag?',
    a: "Three key checks: hardware weight (Hermès uses genuine palladium or gold plating — it is noticeably heavier than fakes), stitching count (authentic Hermès craftspeople stitch 8–9 stitches per centimetre; fakes are looser and uneven), and the blind stamp year code (a letter stamped inside, indicating production year). Always buy from authenticated platforms or request an Entrupy certificate for private purchases.",
  },
  {
    q: 'What is the Hermès bag quota system?',
    a: "Hermès limits each customer to two 'quota bags' (Birkin and Kelly) per year per store. This cap, combined with the requirement to build a purchase history in the store first, means most customers wait years for their first allocation. The restriction directly inflates secondary prices — buyers who cannot wait pay a 30–150% premium on the resale market.",
  },
]

const ABOVE_RETAIL_IDS = ['hermes-birkin-25', 'hermes-birkin-30', 'hermes-birkin-35', 'hermes-kelly-25', 'hermes-kelly-28', 'hermes-kelly-32', 'hermes-mini-kelly', 'hermes-constance-24']

export default function HermesBrandPage() {
  const items = getItemsByBrand('hermes').filter(i => i.retail_price_usd > 0)
  const pricedItems = items.filter(i => i.price_ranges.very_good)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Hermès Price Guide 2025',
    url: `${BASE}/brands/hermes`,
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
        Pre-Owned Hermès: Price Guide 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated 2025 · {items.length} models tracked</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Hermès is the only luxury brand where pre-owned prices routinely exceed retail. Birkins and Kellys are investments, not just bags. Here&apos;s what you&apos;ll actually pay on the secondary market.
        </p>
      </section>

      {pricedItems.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-2xl text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Pre-Owned Hermès Price Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Model</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Pre-Owned Avg</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retail</th>
                  <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">vs Retail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {pricedItems.map(item => {
                  const vg = item.price_ranges.very_good!
                  const avg = getAvgPrice(vg)
                  const vsRetailPct = Math.round((avg / item.retail_price_usd - 1) * 100)
                  const isAbove = vsRetailPct > 0
                  return (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${item.slug}`}
                            className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors"
                          >
                            {item.model}
                          </Link>
                          {ABOVE_RETAIL_IDS.includes(item.id) && (
                            <span className="text-xs px-1.5 py-0.5 bg-[#F5F0E8] text-[#B8954A] rounded">above retail</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPrice(avg)}</td>
                      <td className="py-3 pr-4 text-[#9C8B7A]">{formatPrice(item.retail_price_usd)}</td>
                      <td className={`py-3 font-medium text-sm ${isAbove ? 'text-[#B8954A]' : 'text-[#4A7A35]'}`}>
                        {isAbove ? `+${vsRetailPct}%` : `${vsRetailPct}%`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2
          className="text-lg text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Key Buying Advice
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          The Picotin and Garden Party sell below retail — best entry points for new Hermès buyers. Never buy Hermès from unauthorized dealers; the counterfeit market for Hermès is the most sophisticated in luxury. Super-fakes exist that fool inexperienced eyes. Always use authenticated platforms or commission an independent expert authentication for any Hermès purchase.
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
        <Link href="/hermes" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          View all Hermès models →
        </Link>
      </div>
    </article>
  )
}
