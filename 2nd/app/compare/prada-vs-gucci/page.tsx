import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Prada vs Gucci Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Prada vs Gucci pre-owned: which is worth buying used? Compare resale value, durability, and best models for ${PRICE_YEAR}.`,
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/prada-vs-gucci' },
}

const faqs = [
  {
    q: 'Does Prada or Gucci hold value better pre-owned?',
    a: 'Prada edges out Gucci on classic pieces — Saffiano leather ages exceptionally well and the brand has seen a genuine cultural renaissance since 2020. Gucci peaked resale-wise during the Alessandro Michele era (2015–2021); the current creative transition has softened resale on newer pieces. However, iconic Gucci shapes (Marmont, Dionysus, Ophidia) still have strong demand.',
  },
  {
    q: 'Which is better for a first luxury purchase — Prada or Gucci?',
    a: "Both are excellent first luxury brands. Prada offers the more durable buy — Saffiano leather is virtually indestructible, and the brand's understated aesthetic has enduring appeal. Gucci offers more style variety and stronger streetwear crossover appeal. Budget-wise, Gucci has more entry-level options in the pre-owned market.",
  },
  {
    q: 'Is GG canvas or Prada Saffiano more durable?',
    a: "Prada Saffiano leather is slightly more durable in daily use — it resists water and scratches better than GG Matelassé canvas. However, GG Supreme coated canvas (used in the Ophidia line) is very similar in durability to Prada's Re-Nylon. Both materials hold up well with proper care.",
  },
  {
    q: 'What are the best Prada and Gucci models to buy pre-owned?',
    a: 'For Prada: Re-Edition 2000, Galleria in Saffiano, and Cleo offer the best value. For Gucci: the GG Marmont Medium and Ophidia GG are the strongest resale performers. Avoid very trend-specific pieces from either brand as these can be harder to resell.',
  },
]

export default function PradaVsGucciPage() {
  const pradaItems = getItemsByBrand('prada').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
  const gucciItems = getItemsByBrand('gucci').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  function getBrandStats(items: typeof pradaItems) {
    if (!items.length) return { count: 0, avgRetentionPct: 0, mostAffordable: null, bestRetention: null }
    const count = items.length
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => sum + (getAvgPrice(i.price_ranges.very_good!) / i.retail_price_usd) * 100, 0) / count
    )
    const sorted = [...items].sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    const mostAffordable = sorted[0]
    const bestRetention = [...items].sort((a, b) => {
      return (getAvgPrice(b.price_ranges.very_good!) / b.retail_price_usd) - (getAvgPrice(a.price_ranges.very_good!) / a.retail_price_usd)
    })[0]
    return { count, avgRetentionPct, mostAffordable, bestRetention }
  }

  const pradaStats = getBrandStats(pradaItems)
  const gucciStats = getBrandStats(gucciItems)

  const pradaTop5 = [...pradaItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)
  const gucciTop5 = [...gucciItems]
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

  function renderItems(items: typeof pradaTop5, brandSlug: string) {
    return (
      <div className="space-y-3">
        {items.map(item => {
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
          <Link href={`/${brandSlug}`} className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
            View all {items[0]?.brand} models →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Brand Comparison</p>
      <h1 className="text-4xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Prada vs Gucci Pre-Owned: Which Is Worth Buying Used?
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Prada and Gucci represent different flavors of accessible luxury. Prada excels on durability — Saffiano leather is nearly indestructible and the brand has a resurgent cultural moment. Gucci offers more variety and historically stronger streetwear crossover, but the creative direction shift since 2023 has created uncertainty in the secondary market on newer pieces.
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
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Prada</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Gucci</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{pradaStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{gucciStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. value retention</td>
                <td className="py-3 pr-6 font-semibold text-[#1A1A1A]">{pradaStats.avgRetentionPct}%</td>
                <td className="py-3 font-semibold text-[#1A1A1A]">{gucciStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Signature material</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">Saffiano leather / Re-Nylon</td>
                <td className="py-3 text-[#1A1A1A]">GG canvas / Matelassé leather</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Durability</td>
                <td className="py-3 pr-6 text-[#4A7A35] font-medium">Excellent (Saffiano)</td>
                <td className="py-3 text-[#1A1A1A]">Good (canvas) / Fair (leather)</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Style</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">Minimalist, understated</td>
                <td className="py-3 text-[#1A1A1A]">Maximalist, streetwear crossover</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Prada
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">Most affordable Prada models, sorted by pre-owned price.</p>
        {renderItems(pradaTop5, 'prada')}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Gucci
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">Most affordable Gucci models, sorted by pre-owned price.</p>
        {renderItems(gucciTop5, 'gucci')}
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2 className="text-2xl text-[#1A1A1A] mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
          Verdict
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-3 font-medium">Buy Prada if…</p>
            <ul className="space-y-2">
              {[
                'Durability and long-term wear are your priority',
                'You prefer a quieter, more understated aesthetic',
                'You want strong resale on classic Saffiano pieces',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] mb-3 font-medium">Buy Gucci if…</p>
            <ul className="space-y-2">
              {[
                'You want more variety in style and price',
                'Streetwear crossover appeal matters to you',
                'You love the GG logo and maximalist aesthetic',
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
