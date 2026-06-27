import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Celine vs Saint Laurent Pre-Owned 2025 | SecondLuxuryItems',
  description: 'Celine vs YSL Saint Laurent pre-owned: Philo-era Celine vs LouLou — which holds value and which offers better entry price in 2025?',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/celine-vs-saint-laurent' },
}

const faqs = [
  {
    q: 'Does Celine or Saint Laurent hold value better pre-owned?',
    a: "Phoebe Philo-era Celine is in a different investment category — those pieces (Classic Box, Luggage, Belt) trade at or above retail among collectors. Current Celine and Saint Laurent are more comparable: YSL typically retains 45–60% of retail, while Slimane-era Celine retains 40–60%. Both serve similar buyers but with very different aesthetics.",
  },
  {
    q: 'Is the YSL LouLou a better entry luxury bag than Celine Classic Box?',
    a: "The LouLou is a significantly more affordable entry point — pre-owned around $600–$1,200 versus $1,200–$2,000+ for a Classic Box. The LouLou offers more color variety and a more overtly glamorous aesthetic. The Classic Box is more architectural and minimalist, closer to the investment mindset. Both are excellent first luxury bags.",
  },
  {
    q: "What's the difference between pre-owned Celine and Saint Laurent buyers?",
    a: "Saint Laurent buyers often prioritize the brand's rock-and-roll edge and logo visibility — the YSL initials and cassandre are strong recognition signals. Celine buyers (especially Philo-era) tend to value restraint and craftsmanship over logo recognition. Pre-owned YSL is easier to find at lower prices; pre-owned Celine (especially Philo) requires more patience and higher budgets.",
  },
  {
    q: 'Should I buy Celine or YSL for daily use?',
    a: "For daily use, the YSL LouLou Small or LouLou Medium are excellent choices — the matelassé leather is durable and the chain strap distributes weight comfortably. For a work bag, the Celine Classic Box or Belt is more functional with a cleaner professional appearance. Both brands offer daily-use quality, but YSL is more accessible at lower price points.",
  },
]

export default function CelineVsSaintLaurentPage() {
  const celineItems = getItemsByBrand('celine').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
  const yslItems = getItemsByBrand('saint-laurent').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  function getBrandStats(items: typeof celineItems) {
    if (!items.length) return { count: 0, avgRetentionPct: 0, mostAffordable: null }
    const count = items.length
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => sum + (getAvgPrice(i.price_ranges.very_good!) / i.retail_price_usd) * 100, 0) / count
    )
    const sorted = [...items].sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    return { count, avgRetentionPct, mostAffordable: sorted[0] }
  }

  const celineStats = getBrandStats(celineItems)
  const yslStats = getBrandStats(yslItems)

  const celineTop5 = [...celineItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)
  const yslTop5 = [...yslItems]
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

  function renderItems(items: typeof celineTop5, brandSlug: string) {
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
        Celine vs Saint Laurent Pre-Owned 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Celine and Saint Laurent are two of the most popular brands for first-time luxury buyers. YSL offers a more accessible entry point with strong logo recognition and a rock-and-roll aesthetic. Celine offers more restraint and, in the Philo era, genuine investment value. The pre-owned market for both is well-established with strong supply on Vestiaire and The RealReal.
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
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Celine</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Saint Laurent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{celineStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{yslStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. value retention</td>
                <td className="py-3 pr-6 font-semibold text-[#1A1A1A]">{celineStats.avgRetentionPct}%</td>
                <td className="py-3 font-semibold text-[#1A1A1A]">{yslStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Entry pre-owned price</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {celineStats.mostAffordable ? formatPrice(getAvgPrice(celineStats.mostAffordable.price_ranges.very_good!)) : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {yslStats.mostAffordable ? formatPrice(getAvgPrice(yslStats.mostAffordable.price_ranges.very_good!)) : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Aesthetic</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">Minimalist, architectural</td>
                <td className="py-3 text-[#1A1A1A]">Rock-and-roll, glamorous</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Investment era</td>
                <td className="py-3 pr-6 text-[#4A7A35] font-medium">Philo era (collectible)</td>
                <td className="py-3 text-[#1A1A1A]">Classic silhouettes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Celine
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">Most affordable Celine models, sorted by pre-owned price.</p>
        {renderItems(celineTop5, 'celine')}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Saint Laurent
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">Most affordable Saint Laurent models, sorted by pre-owned price.</p>
        {renderItems(yslTop5, 'saint-laurent')}
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2 className="text-2xl text-[#1A1A1A] mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
          Verdict
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-3 font-medium">Buy Celine if…</p>
            <ul className="space-y-2">
              {[
                "You're drawn to the Philo-era minimalist aesthetic",
                'Investment value matters alongside style',
                'You prefer clean, architectural silhouettes',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] mb-3 font-medium">Buy Saint Laurent if…</p>
            <ul className="space-y-2">
              {[
                'Budget is a priority — YSL offers lower entry points',
                'You love the YSL logo and rock-and-roll aesthetic',
                'The LouLou or Kate silhouette fits your lifestyle',
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
