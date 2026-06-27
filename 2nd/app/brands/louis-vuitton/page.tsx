import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Louis Vuitton Pre-Owned Price Guide 2025 | SecondLuxuryItems',
  description: 'Current pre-owned Louis Vuitton prices for Neverfull, Speedy, Alma and more. LV holds 60-80% of retail. Compare second-hand LV prices by condition.',
  alternates: { canonical: `${BASE}/brands/louis-vuitton` },
}

const faqs = [
  {
    q: 'How do I authenticate a pre-owned Louis Vuitton bag?',
    a: "Check the date code — LV embosses a production code inside every bag (format varies by era: SD1234 = factory code + week/year for modern pieces). The Monogram canvas should have symmetrically aligned LV motifs and a consistent brown color with no bleeding. Stitching is mustard-yellow, tight, and even. The font on any text (made in France/Spain/USA) should be light and precise. Vachetta leather (natural handles and trim) starts cream-white and darkens with use — new pieces have cream vachetta; heavily used pieces have dark honey-brown.",
  },
  {
    q: 'What is Vachetta leather and why does it matter for pre-owned LV?',
    a: "Vachetta is the untreated, undyed natural leather used on LV Monogram and Damier Azur handles, trim, and straps. It is extremely sensitive to water and oils and darkens from cream to honey to dark brown over time. When buying pre-owned, heavily darkened vachetta is a sign of heavy use. Cracked, stiff, or very dark vachetta may need replacement — factor in the $200–500 cost. Damier Ebène and Graphite have coated leather trims that avoid this issue entirely.",
  },
  {
    q: 'Which Louis Vuitton canvas is best to buy pre-owned?',
    a: "Monogram canvas is the most iconic and holds value best, but Damier Ebène is often the smarter buy pre-owned — same durability, no vachetta to worry about, more understated. Damier Azur looks fresh but shows dirt on the light canvas. Epi leather (embossed calf) is elegant and durable but less widely sought for resale. Avoid pre-owned Vernis (patent leather) — the color can fade and transfer to other surfaces.",
  },
  {
    q: 'Does Louis Vuitton hold its value pre-owned?',
    a: "LV Monogram consistently holds 60–80% of retail pre-owned, making it one of the better value-retention brands outside Hermès and Chanel. The Neverfull MM is the most liquid pre-owned LV piece — it is the world's best-selling handbag and there is always a buyer market. The Speedy 30 and Alma BB also have strong resale. Limited edition and collaboration pieces can spike and then correct — stick to core Monogram or Damier for predictable resale.",
  },
]

export default function LouisVuittonBrandPage() {
  const items = getItemsByBrand('louis-vuitton').filter(i => i.retail_price_usd > 0)
  const pricedItems = items.filter(i => i.price_ranges.very_good)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Louis Vuitton Price Guide 2025',
    url: `${BASE}/brands/louis-vuitton`,
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
        Pre-Owned Louis Vuitton: Price Guide 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated 2025 · {items.length} models tracked</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {"Louis Vuitton's Monogram canvas is the most resilient material in luxury. Pre-owned LV holds 60–80% of retail value consistently — better than most luxury brands. The secondary market is wide, deep, and liquid: you can find any classic LV piece pre-owned, and reselling is straightforward."}
        </p>
      </section>

      {pricedItems.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-2xl text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Pre-Owned Louis Vuitton Price Table
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
                {pricedItems.map(item => {
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
      )}

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2
          className="text-lg text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Key Buying Advice
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          Avoid LV pieces with worn Vachetta leather — the untreated natural leather on handles and trim — replacement is expensive ($200–500 per set of handles). Look for Damier Ebène or Graphite for lower maintenance. Inspect date codes carefully: the format changed multiple times. Pre-2006 bags use a different date code format than post-2021 microchip-equipped pieces. Mismatched codes are a major counterfeit tell.
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
        <Link href="/louis-vuitton" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          View all Louis Vuitton models →
        </Link>
      </div>
    </article>
  )
}
