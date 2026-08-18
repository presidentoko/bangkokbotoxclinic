import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Bottega Veneta Pre-Owned Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Pre-owned Bottega Veneta prices for the Jodie, Cassette, Arco and more. Compare second-hand BV prices by condition, updated weekly.',
  alternates: { canonical: `${BASE}/brands/bottega-veneta` },
}

const faqs = [
  {
    q: 'How do I authenticate Bottega Veneta intrecciato weave?',
    a: 'Authentic Bottega Veneta intrecciato has perfectly consistent weave spacing with no gaps or loose strands. The leather strips are woven through each other, not glued. Turn the bag inside out if possible — authentic pieces show clean, tight weave on the interior. The leather should feel substantial, not papery.',
  },
  {
    q: 'Which Bottega Veneta bag has the best resale value?',
    a: 'The Daniel Lee-era Pouch (2019–2021) commands the strongest collector premium. The Jodie and Cassette from the same period are the most liquid — they sell quickly on Vestiaire. The Arco Tote is a practical choice with good resale. Avoid very trend-driven pieces from later creative directors.',
  },
  {
    q: 'Is pre-owned Bottega Veneta close to retail price?',
    a: 'Recent styles (2019 onwards) hold 40–65% of retail in Very Good condition. The original Lee-era pieces can trade above retail among collectors. Older styles from the pre-2019 era trade at deeper discounts, typically 30–50% below current retail.',
  },
  {
    q: 'What colorways hold value best for Bottega Veneta?',
    a: 'Classic colorways — black, espresso brown, and the signature BV parakeet green — hold value best. Bold seasonal colors are harder to resell. The original Pouch in Fondant (off-white) and Mist (grey) remain highly sought after. For the Jodie, black and dark olive are the safest choices.',
  },
]

export default function BottegaVenetaBrandPage() {
  const items = getItemsByBrand('bottega-veneta').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Pre-Owned Bottega Veneta Buying Guide ${PRICE_YEAR}`,
    url: `${BASE}/brands/bottega-veneta`,
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
        Pre-Owned Bottega Veneta: Buying Guide {PRICE_YEAR}
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated {PRICE_YEAR} · {items.length} models tracked</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {"Daniel Lee's tenure created the Pouch, Cassette, and Jodie — three pieces that define the stealth luxury era. Pre-owned prices remain close to retail on recent styles, with Lee-era pieces commanding collector premiums. Matthieu Blazy has continued the brand's elevation with refined new silhouettes that are beginning to find their footing on the secondary market."}
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Pre-Owned Bottega Veneta Price Table
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
          The intrecciato weave quality is the primary authentication tell. Run your finger along the woven strips — authentic Bottega uses full-grain nappa that feels buttery and substantial. Loose strands or inconsistent spacing indicate either a fake or significant wear. The Cassette bag body plates should be perfectly aligned with no gap at the clasp.
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
        <Link href="/bottega-veneta" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          View all Bottega Veneta models →
        </Link>
      </div>
    </article>
  )
}
