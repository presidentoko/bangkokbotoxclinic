import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Gucci Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Current pre-owned Gucci prices for GG Marmont, Dionysus, Horsebit 1955 and more. Compare second-hand Gucci prices by condition, updated weekly.',
  alternates: { canonical: `${BASE}/brands/gucci` },
}

const faqs = [
  {
    q: 'How do I authenticate a pre-owned Gucci bag?',
    a: "Check the serial tag inside the bag — authentic Gucci serial tags have two lines: the top line is a 6-digit model code, the bottom line is a 10-digit serial number. The font is fine and precise. Also inspect the GG hardware: real Gucci hardware is weighty and uniform, with the G motifs symmetrically interlocked. Stitching on Gucci leather bags should be tight and even, typically in a contrasting tan thread on classic styles.",
  },
  {
    q: 'Which Gucci bag holds value best pre-owned?',
    a: "The GG Marmont in matelassé leather is Gucci's strongest resale performer, consistently retaining 55–70% of retail. The Dionysus with suede and tiger buckle is also strong. Vintage Tom Ford-era Gucci (late 1990s–early 2000s) with GG motifs has appreciated dramatically and holds value exceptionally well on the secondary market.",
  },
  {
    q: 'What is the difference between Alessandro Michele and Tom Ford-era Gucci?',
    a: "Tom Ford led Gucci from 1994–2004, reviving the brand with provocative, minimalist, sex-forward designs. His era is now considered vintage and holds strong resale value. Alessandro Michele (2015–2022) introduced maximalist, eclectic designs — the GG Marmont, Dionysus, and Horsebit 1955 are from this era. Michele-era pieces drove huge resale premiums at peak, but prices have corrected as fashion moved on. Sabato De Sarno's current minimal direction is too new for established resale data.",
  },
  {
    q: 'Which Gucci materials age best?',
    a: "GG canvas (the coated monogram canvas) is the most durable Gucci material — it resists scratches and fading, cleans easily, and looks presentable even after heavy use. Supreme canvas is similar. Avoid smooth calf leather from Michele-era bags — it scratches easily and shows age quickly. GG Marmont in matelassé lambskin is beautiful but delicate; inspect carefully for corner wear when buying pre-owned.",
  },
]

export default function GucciBrandPage() {
  const items = getItemsByBrand('gucci').filter(i => i.retail_price_usd > 0)
  const pricedItems = items.filter(i => i.price_ranges.very_good)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Pre-Owned Gucci Buying Guide ${PRICE_YEAR}`,
    url: `${BASE}/brands/gucci`,
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
        Pre-Owned Gucci: Buying Guide {PRICE_YEAR}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated {PRICE_YEAR} · {items.length} models tracked</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {"Gucci's resale market is the most dynamic in luxury — Alessandro Michele's tenure created viral pieces that spiked and corrected. Tom Ford-era Gucci and vintage pieces hold surprisingly well. The GG Marmont remains the top-performing modern Gucci style on the secondary market."}
        </p>
      </section>

      {pricedItems.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-2xl text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Pre-Owned Gucci Price Table
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
          GG Marmont in matelassé leather is the top resale performer. Avoid early Gucci Horsebit 1955 editions — the quality complaints hurt resale. GG Canvas ages well; smooth leather ages inconsistently. Tom Ford-era Gucci (1994–2004) from authenticated vintage sellers is currently undervalued relative to where it is heading.
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
        <Link href="/gucci" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          View all Gucci models →
        </Link>
      </div>
    </article>
  )
}
