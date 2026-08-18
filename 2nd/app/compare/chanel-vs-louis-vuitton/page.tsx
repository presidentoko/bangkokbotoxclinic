import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Chanel vs Louis Vuitton: Pre-Owned Value Comparison ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Which holds value better — Chanel or Louis Vuitton? Data-driven comparison of resale prices, savings, and investment potential.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/chanel-vs-louis-vuitton' },
}

const faqItems = [
  {
    q: 'Does Chanel or Louis Vuitton hold value better?',
    a: 'Chanel holds value better, typically retaining 80-95% of retail on iconic pieces. Louis Vuitton retains around 60-75%. However, LV Monogram canvas is nearly counterfeit-proof due to the heat-stamped pattern, making authentication easier and the buying process less stressful.',
  },
  {
    q: 'Which is a better investment, Chanel or LV?',
    a: 'Chanel Classic Flap has appreciated 60%+ since 2019, outpacing inflation. The LV Neverfull holds steady at 65-70% of retail. Both beat stocks in the short term on iconic pieces. For pure investment potential, Chanel wins — but LV offers more consistent liquidity when you want to sell.',
  },
  {
    q: 'Is pre-owned Chanel cheaper than new LV?',
    a: 'Surprisingly, yes in some cases. A pre-owned Chanel Wallet on Chain averages around $1,400, which is often cheaper than a new LV Pochette Metis at $1,950 retail. Pre-owned Chanel can beat new LV pricing on comparable sizes, making it an interesting option for buyers on a specific budget.',
  },
]

export default function ChanelVsLouisVuittonPage() {
  const chanelItems = getItemsByBrand('chanel').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const lvItems = getItemsByBrand('louis-vuitton').filter(
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
  const lvStats = getBrandStats(lvItems)

  const chanelTop5 = [...chanelItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  const lvTop5 = [...lvItems]
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
        Chanel vs Louis Vuitton: Which Holds Its Value Better?
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Chanel and Louis Vuitton are the two most recognizable luxury brands globally. Both offer
          strong pre-owned markets, but they serve different buyers. Chanel wins on value retention —
          iconic pieces hold 80-95% of retail, often appreciating above original purchase price.
          Louis Vuitton wins on accessibility: more color options, a wider price range, and the
          Monogram canvas is one of the easiest luxury materials to authenticate.
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
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Louis Vuitton</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{chanelStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{lvStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention</td>
                <td className="py-3 pr-6 font-semibold text-[#4A7A35]">
                  {chanelStats.avgRetentionPct}%
                </td>
                <td className="py-3 font-semibold text-[#1A1A1A]">{lvStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Most affordable entry</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {chanelStats.mostAffordable
                    ? `${chanelStats.mostAffordable.model} (${formatPrice(getAvgPrice(chanelStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {lvStats.mostAffordable
                    ? `${lvStats.mostAffordable.model} (${formatPrice(getAvgPrice(lvStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Best value retention</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {chanelStats.bestRetention?.model ?? '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">{lvStats.bestRetention?.model ?? '—'}</td>
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

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Louis Vuitton Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {lvTop5.length} most affordable Louis Vuitton models tracked.
        </p>
        <div className="space-y-3">
          {lvTop5.map(item => {
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
            href="/louis-vuitton"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Louis Vuitton models →
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
                'You want maximum value retention and investment potential',
                "You're willing to pay a premium even pre-owned",
                "You're buying an iconic piece (Classic Flap, WOC) you plan to keep",
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
              Buy LV if…
            </p>
            <ul className="space-y-2">
              {[
                'You want easier authentication and wider availability',
                'You want more color and style options to choose from',
                'Your budget is under $800 — LV Speedy, Card Holder, and wallets fit here',
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
