import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Chanel vs Gucci Pre-Owned Value ${PRICE_YEAR} | SecondLuxuryItems`,
  description:
    'Chanel vs Gucci: which holds value better pre-owned? Compare resale prices, retention rates, and entry points for both brands.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/chanel-vs-gucci' },
}

const faqItems = [
  {
    q: 'Does Chanel or Gucci hold better value?',
    a: 'Chanel wins significantly. Chanel typically retains 80-95% of retail on iconic pieces, while Gucci retains around 50-65%. However, Gucci is much more accessible for first-time buyers, with handbags and belts available pre-owned from $200-$400.',
  },
  {
    q: 'Is pre-owned Gucci worth buying?',
    a: "Yes, if you love the aesthetic. Gucci offers strong design variety and lower entry prices than Chanel or LV. Just don't expect strong resale if you want to sell later — Gucci trends shift more than the timeless styles of Chanel or LV Monogram.",
  },
  {
    q: "What's the cheapest Chanel vs cheapest Gucci pre-owned?",
    a: 'Gucci belts and wallets start around $200-400 pre-owned, and the Princetown mule often falls under $500. Chanel accessories start around $400-600 for smaller items. Both are accessible at different price points depending on the category.',
  },
]

export default function ChanelVsGucciPage() {
  const chanelItems = getItemsByBrand('chanel').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const gucciItems = getItemsByBrand('gucci').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

  function getBrandStats(items: typeof chanelItems) {
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

  const chanelStats = getBrandStats(chanelItems)
  const gucciStats = getBrandStats(gucciItems)

  const chanelTop5 = [...chanelItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  const gucciTop5 = [...gucciItems]
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
        Chanel vs Gucci: Pre-Owned Value Guide {PRICE_YEAR}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Chanel and Gucci appeal to very different buyers in the pre-owned market. Chanel is the
          undisputed leader in value retention — classic pieces consistently hold 80-95% of retail,
          and the Classic Flap has actually appreciated since 2019. Gucci retains 50-65%, which is
          lower, but the entry price is significantly more accessible: the Gucci Marmont starts at
          $400 pre-owned versus Chanel WOC at $1,100+. The right choice depends on whether you
          prioritize investment value or design variety.
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
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Chanel</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Gucci</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{chanelStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{gucciStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention</td>
                <td className="py-3 pr-6 font-semibold text-[#4A7A35]">
                  {chanelStats.avgRetentionPct}%
                </td>
                <td className="py-3 font-semibold text-[#1A1A1A]">{gucciStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Most affordable entry</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {chanelStats.mostAffordable
                    ? `${chanelStats.mostAffordable.model} (${formatPrice(getAvgPrice(chanelStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {gucciStats.mostAffordable
                    ? `${gucciStats.mostAffordable.model} (${formatPrice(getAvgPrice(gucciStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Best value retention</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {chanelStats.bestRetention?.model ?? '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">{gucciStats.bestRetention?.model ?? '—'}</td>
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
          Chanel Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Most affordable Chanel models, sorted by pre-owned price.
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

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Gucci Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Most affordable Gucci models, sorted by pre-owned price.
        </p>
        <div className="space-y-3">
          {gucciTop5.map(item => {
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
            href="/gucci"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Gucci models →
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
              Buy Chanel if…
            </p>
            <ul className="space-y-2">
              {[
                'You want maximum value retention on a classic piece',
                'You plan to keep the bag long-term or resell later',
                "You're comfortable with a higher starting price ($400+ for accessories)",
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
              Buy Gucci if…
            </p>
            <ul className="space-y-2">
              {[
                'You love Gucci aesthetics and want accessible entry pricing',
                'You want a fashion-forward bag rather than a timeless classic',
                'Budget is under $600 — Gucci belts and mules fit here comfortably',
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
