import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Louis Vuitton vs Gucci Pre-Owned Value ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Louis Vuitton vs Gucci: resale value comparison. LV retains 65-75%, Gucci 50-65%. Data-driven guide to buying pre-owned.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/louis-vuitton-vs-gucci' },
}

const faqItems = [
  {
    q: 'Does LV or Gucci hold value better?',
    a: 'LV holds significantly better (65-75% vs Gucci\'s 50-65%). LV Monogram canvas is essentially counterfeit-proof, making it easier to buy/sell pre-owned.',
  },
  {
    q: 'What\'s the cheapest Gucci vs LV pre-owned?',
    a: 'Gucci GG Marmont Belt starts around $200-280 pre-owned. LV Card Holder starts around $180-220. Both brands have accessible entry points under $300.',
  },
  {
    q: 'Is pre-owned Gucci a good buy?',
    a: 'Great for buyers who love the aesthetic, less so for investment. Gucci trends shift faster than LV — Dionysus and Sylvie bags have already dated, while LV Speedy/Neverfull remain timeless.',
  },
]

export default function LouisVuittonVsGucciPage() {
  const lvItems = getItemsByBrand('louis-vuitton').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const gucciItems = getItemsByBrand('gucci').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

  function getBrandStats(items: typeof lvItems) {
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

  const lvStats = getBrandStats(lvItems)
  const gucciStats = getBrandStats(gucciItems)

  const lvTop5 = [...lvItems]
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
        Louis Vuitton vs Gucci: Which Holds Its Value Better?
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Louis Vuitton and Gucci occupy different positions in the pre-owned market. LV wins on
          resale — Monogram canvas retains 65-75% of retail, and the Speedy and Neverfull have
          remained in demand for decades. Gucci wins on entry price diversity: GG Marmont belts and
          wallets start under $300 pre-owned, making Gucci the more accessible gateway into luxury.
          For pure resale potential, LV is the stronger choice; for aesthetic variety and lower
          starting prices, Gucci delivers.
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
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Louis Vuitton</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Gucci</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{lvStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{gucciStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention</td>
                <td className="py-3 pr-6 font-semibold text-[#4A7A35]">{lvStats.avgRetentionPct}%</td>
                <td className="py-3 font-semibold text-[#1A1A1A]">{gucciStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Most affordable entry</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {lvStats.mostAffordable
                    ? `${lvStats.mostAffordable.model} (${formatPrice(getAvgPrice(lvStats.mostAffordable.price_ranges.very_good!))} avg)`
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
                <td className="py-3 pr-6 text-[#1A1A1A]">{lvStats.bestRetention?.model ?? '—'}</td>
                <td className="py-3 text-[#1A1A1A]">{gucciStats.bestRetention?.model ?? '—'}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Typical retention range</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">65–75%</td>
                <td className="py-3 text-[#1A1A1A]">50–65%</td>
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
          Louis Vuitton Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {lvTop5.length} most affordable Louis Vuitton models tracked, sorted by pre-owned price.
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

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Gucci Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {gucciTop5.length} most affordable Gucci models tracked, sorted by pre-owned price.
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
              Buy Louis Vuitton if…
            </p>
            <ul className="space-y-2">
              {[
                'You want stronger resale value and easier reselling later',
                'You prefer timeless designs over fashion-forward aesthetics',
                'You want Monogram canvas — one of the easiest materials to authenticate',
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
                'You love Gucci\'s bold GG aesthetic and design variety',
                'Budget under $400 — Gucci belts and accessories fit here',
                'You\'re buying to wear, not to resell — Gucci is better enjoyed than invested',
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
