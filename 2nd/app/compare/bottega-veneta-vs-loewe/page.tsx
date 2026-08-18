import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Bottega Veneta vs Loewe Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Bottega Veneta vs Loewe: comparing two quiet luxury giants pre-owned. Intrecciato vs Puzzle — which holds value better in ${PRICE_YEAR}?`,
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/bottega-veneta-vs-loewe' },
}

const faqs = [
  {
    q: 'Does Bottega Veneta or Loewe hold value better pre-owned?',
    a: "Bottega Veneta holds value more consistently on the secondary market. The Daniel Lee-era pieces (Pouch, Jodie, Cassette) command collector premiums. Loewe's Puzzle holds value well on classic colorways, but Loewe's secondary market is less liquid than BV's — pieces take longer to sell. Both brands benefit from the quiet luxury trend.",
  },
  {
    q: 'What makes Loewe Puzzle authentication unique?',
    a: "The Loewe Puzzle's jigsaw-like construction uses 16 leather pieces sewn together — the stitching at each joint should be perfectly tight with no gaps. The Anagram hardware logo (intertwined LW letters) is the primary authentication tell: it should be crisp with no blurring. The leather should have a distinctive smooth, waxy feel.",
  },
  {
    q: 'Which is better for quiet luxury — Bottega Veneta or Loewe?',
    a: "Both excel at quiet luxury, but for different reasons. BV's intrecciato weave is completely logo-free — it communicates wealth through craftsmanship alone. Loewe uses the subtle Anagram logo but maintains an understated elegance. BV's color palette (earth tones, deep greens) is slightly more conservative; Loewe experiments more with color and texture.",
  },
  {
    q: 'What are the best colorways to buy for resale?',
    a: "For Bottega Veneta: black, dark brown, and signature BV green hold value best. Avoid very bright or seasonal colors. For Loewe: tan, black, and ivory Puzzle bags are the safest resale choices. The Hammock in natural calfskin is the strongest Loewe resale performer outside the Puzzle.",
  },
]

export default function BottegaVsLoewePage() {
  const bvItems = getItemsByBrand('bottega-veneta').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
  const loeweItems = getItemsByBrand('loewe').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  function getBrandStats(items: typeof bvItems) {
    if (!items.length) return { count: 0, avgRetentionPct: 0 }
    const count = items.length
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => sum + (getAvgPrice(i.price_ranges.very_good!) / i.retail_price_usd) * 100, 0) / count
    )
    return { count, avgRetentionPct }
  }

  const bvStats = getBrandStats(bvItems)
  const loeweStats = getBrandStats(loeweItems)

  const bvTop5 = [...bvItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Brand Comparison</p>
      <h1 className="text-4xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Bottega Veneta vs Loewe Pre-Owned {PRICE_YEAR}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Quiet luxury comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Bottega Veneta and Loewe are the two defining brands of the quiet luxury era — both built on exceptional craftsmanship, understated logos, and premium materials. Pre-owned, Bottega Veneta has a more established secondary market driven by the Daniel Lee-era pieces. Loewe is gaining momentum, with the Puzzle bag emerging as one of the most versatile and well-crafted designer bags available.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          Head-to-Head Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-6 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Metric</th>
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Bottega Veneta</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Loewe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{bvStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{loeweStats.count || 'Coming soon'}</td>
              </tr>
              {bvStats.avgRetentionPct > 0 && (
                <tr>
                  <td className="py-3 pr-6 text-[#9C8B7A]">Avg. value retention</td>
                  <td className="py-3 pr-6 font-semibold text-[#1A1A1A]">{bvStats.avgRetentionPct}%</td>
                  <td className="py-3 font-semibold text-[#9C8B7A]">55–70% (est.)</td>
                </tr>
              )}
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Signature craft</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">Intrecciato leather weave</td>
                <td className="py-3 text-[#1A1A1A]">Puzzle construction (16 pieces)</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Logo visibility</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">None (logo-free)</td>
                <td className="py-3 text-[#1A1A1A]">Subtle Anagram hardware</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Secondary market liquidity</td>
                <td className="py-3 pr-6 text-[#4A7A35] font-medium">High</td>
                <td className="py-3 text-[#1A1A1A]">Medium (growing)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Bottega Veneta
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">Most affordable BV models with verified price data.</p>
        <div className="space-y-3">
          {bvTop5.map(item => {
            const vg = item.price_ranges.very_good!
            const avg = getAvgPrice(vg)
            const retainPct = Math.round((avg / item.retail_price_usd) * 100)
            return (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="group flex items-center justify-between border border-[#E8E2D9] hover:border-[#B8954A] px-5 py-4 transition-all duration-200 bg-white"
              >
                <div>
                  <p className="font-medium text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors">{item.model}</p>
                  <p className="text-xs text-[#9C8B7A] mt-0.5">Retail {formatPrice(item.retail_price_usd)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1A1A1A]">{formatPrice(avg)}</p>
                  <p className="text-xs text-[#4A7A35]">{retainPct}% of retail</p>
                </div>
              </Link>
            )
          })}
          <div className="mt-3">
            <Link href="/bottega-veneta" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
              View all Bottega Veneta models →
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Loewe
        </h2>
        <div className="p-5 bg-[#F5F0E8] border border-[#E8E2D9]">
          <p className="text-sm text-[#6B6052]">
            Loewe price data is being compiled. The Puzzle Small in tan or black typically sells for $1,200–$2,200 pre-owned (Very Good) versus a retail of $2,750+. The Hammock Small averages $900–$1,500 pre-owned.
          </p>
          <Link href="/loewe" className="inline-block mt-3 text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
            View Loewe models →
          </Link>
        </div>
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2 className="text-2xl text-[#1A1A1A] mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
          Verdict
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-3 font-medium">Buy Bottega Veneta if…</p>
            <ul className="space-y-2">
              {[
                'You want maximum logo-free quiet luxury',
                "You're drawn to the intrecciato weave craftsmanship",
                'Daniel Lee-era collectibles interest you',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] mb-3 font-medium">Buy Loewe if…</p>
            <ul className="space-y-2">
              {[
                'The Puzzle versatility (6 carry styles) appeals to you',
                'You want something more architectural and sculptural',
                'You prefer Jonathan Anderson-era craft storytelling',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8C7355] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
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
    </article>
  )
}
