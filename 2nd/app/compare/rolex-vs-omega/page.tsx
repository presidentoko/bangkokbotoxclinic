import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Rolex vs Omega Pre-Owned Price Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description:
    'Rolex vs Omega: which holds value better pre-owned? Compare resale prices, retention rates, and the best models to buy second-hand.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/rolex-vs-omega' },
}

const faqItems = [
  {
    q: 'Does Rolex or Omega hold value better?',
    a: 'Rolex wins dramatically. Sports Rolex models like the Submariner, Daytona, and GMT-Master II regularly sell above retail on the pre-owned market due to production limits and high demand. Omega retains 40-60% of retail — strong by general luxury standards, but far behind Rolex sports references.',
  },
  {
    q: 'Is pre-owned Omega a good deal?',
    a: 'Yes — you get a Swiss luxury watch at 40-60% of retail price. The Omega Planet Ocean and Speedmaster Moonwatch are the best value pre-owned picks, offering exceptional quality and heritage at a fraction of the Rolex premium. For everyday wearing, pre-owned Omega is an outstanding value.',
  },
  {
    q: 'Why does Rolex hold value so well?',
    a: "Rolex strictly limits production, creating a consistent demand surplus. Their sports models (Submariner, Daytona, GMT) have years-long waitlists at authorized dealers, pushing pre-owned prices above retail. It's a rare case where buying pre-owned can actually cost more than retail — a sign of genuine investment value.",
  },
]

export default function RolexVsOmegaPage() {
  const rolexItems = getItemsByBrand('rolex').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const omegaItems = getItemsByBrand('omega').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

  function getBrandStats(items: typeof rolexItems) {
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

  const rolexStats = getBrandStats(rolexItems)
  const omegaStats = getBrandStats(omegaItems)

  const rolexSorted = [...rolexItems].sort(
    (a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!),
  )
  const omegaSorted = [...omegaItems].sort(
    (a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!),
  )

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

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Watch Comparison</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Rolex vs Omega: Pre-Owned Price Guide {PRICE_YEAR}
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          In the pre-owned watch market, no comparison is more stark than Rolex versus Omega. Rolex
          sports references consistently sell above retail — the Daytona and GMT-Master II often
          command 200-400% of retail on the secondary market. Omega retains a respectable 40-60% of
          retail, which is strong by luxury standards, but the gap between the two brands is
          enormous. If you want investment potential, Rolex wins. If you want Swiss luxury quality at
          a fraction of the price, pre-owned Omega is one of the best deals in luxury watches.
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
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Omega</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{rolexStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{omegaStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention</td>
                <td className="py-3 pr-6 font-semibold text-[#4A7A35]">
                  {rolexStats.avgRetentionPct}%
                </td>
                <td className="py-3 font-semibold text-[#1A1A1A]">
                  {omegaStats.avgRetentionPct}%
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Most affordable entry</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {rolexStats.mostAffordable
                    ? `${rolexStats.mostAffordable.model} (${formatPrice(getAvgPrice(rolexStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {omegaStats.mostAffordable
                    ? `${omegaStats.mostAffordable.model} (${formatPrice(getAvgPrice(omegaStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Best value retention</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {rolexStats.bestRetention?.model ?? '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">{omegaStats.bestRetention?.model ?? '—'}</td>
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
          All {rolexSorted.length} Rolex models tracked, sorted by pre-owned price. Note: many Rolex
          sports references sell above retail.
        </p>
        <div className="space-y-3">
          {rolexSorted.map(item => {
            const vg = item.price_ranges.very_good!
            const avg = getAvgPrice(vg)
            const retainPct = Math.round((avg / item.retail_price_usd) * 100)
            const aboveRetail = retainPct > 100
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
                  <p
                    className={`text-xs ${aboveRetail ? 'text-[#C25B2B]' : 'text-[#4A7A35]'}`}
                  >
                    {retainPct}% of retail{aboveRetail ? ' ↑' : ''}
                  </p>
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
          Omega Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          All {omegaSorted.length} Omega models tracked — exceptional Swiss quality at 40-60% of
          retail.
        </p>
        <div className="space-y-3">
          {omegaSorted.map(item => {
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
            href="/omega"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Omega models →
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
                'You want the strongest possible value retention and investment potential',
                'You can accept paying above retail on in-demand sports references',
                'You want the ultimate status symbol in luxury watches',
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
              Buy Omega if…
            </p>
            <ul className="space-y-2">
              {[
                'You want Swiss luxury at a genuine discount — 40-60% of retail',
                'You want NASA-certified watchmaking heritage (Speedmaster)',
                'You prefer wearing a tool watch daily without the anxiety of a $20K+ Rolex',
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
