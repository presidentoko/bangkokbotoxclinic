import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Rolex vs Patek Philippe Pre-Owned Value 2025 | SecondLuxuryItems',
  description: 'Rolex vs Patek Philippe: which holds value better pre-owned? Rolex sports often trade at 120-200%+ of retail. Patek complications at 90-150%+.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/rolex-vs-patek-philippe' },
}

const faqItems = [
  {
    q: 'Rolex or Patek Philippe — which holds value better?',
    a: 'Both exceed retail on key models, but for different reasons. Rolex sports models (Submariner, Daytona) are in constant demand with short retail supply. Patek complications (Nautilus, Aquanaut) command 150-300% of retail on secondary market.',
  },
  {
    q: 'Which is more accessible pre-owned — Rolex or Patek?',
    a: 'Rolex is significantly more accessible. Entry Rolex (Oyster Perpetual, Datejust) starts around $4,000-8,000 pre-owned. Entry Patek (Calatrava) starts around $8,000-15,000.',
  },
  {
    q: 'Is pre-owned Rolex a good investment in 2025?',
    a: 'Rolex sports models (Submariner, GMT-Master, Daytona) have historically outperformed stock market returns. However, the premium over retail has shrunk since 2022-2023 bubble peak — current premiums are more sustainable.',
  },
]

export default function RolexVsPatekPhilippePage() {
  const rolexItems = getItemsByBrand('rolex').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const patekItems = getItemsByBrand('patek-philippe').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

  function getBrandStats(items: typeof rolexItems) {
    const count = items.length
    if (count === 0) return { count, avgRetentionPct: 0, mostAffordable: null, bestRetention: null }
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => {
        const avg = getAvgPrice(i.price_ranges.very_good!)
        return sum + (avg / i.retail_price_usd) * 100
      }, 0) / count,
    )
    const sorted = [...items].sort(
      (a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!),
    )
    const mostAffordable = sorted[0]
    const bestRetention = [...items].sort((a, b) => {
      const ra = getAvgPrice(a.price_ranges.very_good!) / a.retail_price_usd
      const rb = getAvgPrice(b.price_ranges.very_good!) / b.retail_price_usd
      return rb - ra
    })[0]
    return { count, avgRetentionPct, mostAffordable, bestRetention }
  }

  const rolexStats = getBrandStats(rolexItems)
  const patekStats = getBrandStats(patekItems)

  const rolexTop5 = [...rolexItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  const patekTop5 = [...patekItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Brand Comparison</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Rolex vs Patek Philippe: Pre-Owned Watch Value 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Rolex and Patek Philippe are best-in-class for watch investment. Both have models that
          routinely trade above retail price on the secondary market — a rare feat in any asset
          class. Rolex sports references (Submariner, GMT-Master, Daytona) are driven by retail
          scarcity and mass recognition. Patek Philippe complications command premiums for
          different reasons: unmatched movement quality, limited production, and a collector base
          willing to pay for rarity. Entry price and accessibility differ significantly: Rolex is
          the more democratic entry point.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Head-to-Head Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-6 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">
                  Metric
                </th>
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Rolex</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Patek Philippe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{rolexStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{patekStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention</td>
                <td className="py-3 pr-6 font-semibold text-[#4A7A35]">
                  {rolexStats.avgRetentionPct}%
                </td>
                <td className="py-3 font-semibold text-[#4A7A35]">{patekStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Most affordable entry</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {rolexStats.mostAffordable
                    ? `${rolexStats.mostAffordable.model} (${formatPrice(getAvgPrice(rolexStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {patekStats.mostAffordable
                    ? `${patekStats.mostAffordable.model} (${formatPrice(getAvgPrice(patekStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Best value retention</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {rolexStats.bestRetention?.model ?? '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">{patekStats.bestRetention?.model ?? '—'}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Sports model premium</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">120–200%+ of retail</td>
                <td className="py-3 text-[#1A1A1A]">150–300%+ (Nautilus, Aquanaut)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Rolex Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {rolexTop5.length} most affordable Rolex models tracked, sorted by pre-owned price.
        </p>
        <div className="space-y-3">
          {rolexTop5.map(item => {
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
                  <p className="font-medium text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors">
                    {item.model}
                  </p>
                  <p className="text-xs text-[#9C8B7A] mt-0.5">
                    Retail {formatPrice(item.retail_price_usd)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1A1A1A]">{formatPrice(avg)}</p>
                  <p className="text-xs text-[#4A7A35]">{retainPct}% of retail</p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-4">
          <Link
            href="/rolex"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Rolex models →
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Patek Philippe Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {patekTop5.length} most affordable Patek Philippe models tracked, sorted by pre-owned price.
        </p>
        <div className="space-y-3">
          {patekTop5.map(item => {
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
                  <p className="font-medium text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors">
                    {item.model}
                  </p>
                  <p className="text-xs text-[#9C8B7A] mt-0.5">
                    Retail {formatPrice(item.retail_price_usd)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1A1A1A]">{formatPrice(avg)}</p>
                  <p className="text-xs text-[#4A7A35]">{retainPct}% of retail</p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-4">
          <Link
            href="/patek-philippe"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Patek Philippe models →
          </Link>
        </div>
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2
          className="text-2xl text-[#1A1A1A] mb-5"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Which Should You Buy?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-3 font-medium">
              Buy Rolex if…
            </p>
            <ul className="space-y-2">
              {[
                'You want a watch that\'s widely recognized and easy to resell',
                'Budget is $8,000-25,000 — Datejust and Submariner fit here',
                'You want a daily wearer with strong investment characteristics',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] mb-3 font-medium">
              Buy Patek if…
            </p>
            <ul className="space-y-2">
              {[
                'You\'re a serious collector focused on horological craftsmanship',
                'Budget is $15,000+ and you want the ultimate prestige piece',
                'You plan to hold for 10+ years — Patek appreciation is long-term',
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
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map(({ q, a }) => (
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
