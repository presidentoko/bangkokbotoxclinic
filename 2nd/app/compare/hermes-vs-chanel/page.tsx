import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Hermès vs Chanel Pre-Owned Value 2025 | SecondLuxuryItems',
  description: 'Hermès vs Chanel: the two top-tier resale brands compared. Birkin/Kelly often exceed retail; Chanel Classic Flap retains 80-95%. Data-driven guide.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/hermes-vs-chanel' },
}

const faqItems = [
  {
    q: 'Hermès or Chanel — which is the better investment?',
    a: 'Hermès wins on investment. Birkin/Kelly regularly trade at 150-200%+ of retail on the secondary market. Chanel Classic Flap has also appreciated 60%+ since 2019. Both beat traditional investments on iconic pieces.',
  },
  {
    q: 'Which is easier to buy pre-owned — Hermès or Chanel?',
    a: 'Chanel is far more accessible pre-owned. Hermès Birkin/Kelly have waitlists even on resale platforms. Chanel WOC, Flap, and Boy bags are widely available.',
  },
  {
    q: 'Is Hermès more expensive than Chanel pre-owned?',
    a: 'Yes, significantly. Hermès Birkin starts at $8,000-$12,000 pre-owned. Chanel Classic Flap runs $3,500-$6,000. Hermès scarves ($150-400) offer a more accessible entry.',
  },
]

export default function HermesVsChanelPage() {
  const hermesItems = getItemsByBrand('hermes').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const chanelItems = getItemsByBrand('chanel').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

  function getBrandStats(items: typeof hermesItems) {
    const count = items.length
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

  const hermesStats = getBrandStats(hermesItems)
  const chanelStats = getBrandStats(chanelItems)

  const hermesTop5 = [...hermesItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  const chanelTop5 = [...chanelItems]
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
        Hermès vs Chanel: The Ultimate Pre-Owned Value Comparison
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Hermès and Chanel are the undisputed leaders of luxury resale value. Hermès Birkin and
          Kelly bags regularly trade above retail — 100-200%+ is common for sought-after sizes and
          leathers. Chanel Classic Flap has appreciated over 60% since 2019 and retains 80-95% of
          retail even in very good condition. Both are exceptional investments, but they serve
          different buyers: Hermès is harder to acquire and commands significantly higher prices,
          while Chanel is more widely available pre-owned and accessible at lower price points.
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
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Hermès</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Chanel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{hermesStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{chanelStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention</td>
                <td className="py-3 pr-6 font-semibold text-[#4A7A35]">
                  {hermesStats.avgRetentionPct}%
                </td>
                <td className="py-3 font-semibold text-[#4A7A35]">{chanelStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Most affordable entry</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {hermesStats.mostAffordable
                    ? `${hermesStats.mostAffordable.model} (${formatPrice(getAvgPrice(hermesStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {chanelStats.mostAffordable
                    ? `${chanelStats.mostAffordable.model} (${formatPrice(getAvgPrice(chanelStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Best value retention</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {hermesStats.bestRetention?.model ?? '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">{chanelStats.bestRetention?.model ?? '—'}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Typical retention range</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">100–200%+ (iconic bags)</td>
                <td className="py-3 text-[#1A1A1A]">80–95%</td>
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
          Hermès Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {hermesTop5.length} most affordable Hermès models tracked, sorted by pre-owned price.
        </p>
        <div className="space-y-3">
          {hermesTop5.map(item => {
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
            href="/hermes"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Hermès models →
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Chanel Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {chanelTop5.length} most affordable Chanel models tracked, sorted by pre-owned price.
        </p>
        <div className="space-y-3">
          {chanelTop5.map(item => {
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
            href="/chanel"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Chanel models →
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
              Buy Hermès if…
            </p>
            <ul className="space-y-2">
              {[
                'Investment return is your primary goal — Birkin/Kelly beat nearly every asset class',
                'You have a $10,000+ budget and patience to find the right piece',
                'You want the ultimate status symbol with a proven 20-year track record',
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
              Buy Chanel if…
            </p>
            <ul className="space-y-2">
              {[
                'You want top-tier value retention at a more accessible price point',
                'You prefer wider availability — Chanel is easier to find pre-owned',
                'You love the Classic Flap or WOC — among the best buy-and-hold luxury pieces',
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
