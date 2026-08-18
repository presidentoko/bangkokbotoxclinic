import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Dior vs Chanel Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Dior vs Chanel: which pre-owned bag holds value better? Side-by-side price comparison, resale retention, and verdict for ${PRICE_YEAR}.`,
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/dior-vs-chanel' },
}

const faqs = [
  {
    q: 'Does Chanel or Dior hold value better pre-owned?',
    a: "Chanel holds value significantly better. The Classic Flap and Boy Bag retain 80–95% of retail and often trade above retail in popular colorways. Dior typically retains 50–70% of retail on classic models like the Lady Dior. Chanel's deliberate retail price increases create a self-reinforcing secondary market appreciation cycle that Dior has not yet matched.",
  },
  {
    q: 'Is pre-owned Dior a better value than Chanel?',
    a: "Yes, for buyers focused on value. Pre-owned Dior gives you access to comparable craftsmanship and brand prestige at 30–50% below Chanel's pre-owned prices. The Lady Dior averages around $2,500 pre-owned versus a Chanel Classic Flap at $5,000+. For a first luxury bag, Dior offers more bag for money.",
  },
  {
    q: 'Lady Dior vs Chanel Classic Flap — which is harder to authenticate?',
    a: "Both require expertise. The Lady Dior's cannage quilting precision and hardware weight are key tells — fakes have inconsistent stitch depth. The Chanel Classic Flap's CC turn-lock alignment and hologram sticker date code are the primary authentication points. Both are among the most counterfeited bags in the market; use only authenticated platforms.",
  },
  {
    q: 'Which brand is better for a first luxury bag purchase?',
    a: "Dior is the better choice for a first luxury bag on a budget. You can access a pre-owned Lady Dior or Saddle Bag for $2,000–$3,000, significantly less than entry Chanel. The style recognition is strong globally. If budget allows Chanel, the Wallet on Chain is the best entry point with strong resale.",
  },
]

export default function DiorVsChanelPage() {
  const diorItems = getItemsByBrand('dior').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
  const chanelItems = getItemsByBrand('chanel').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  function getBrandStats(items: typeof diorItems) {
    if (!items.length) return { count: 0, avgRetentionPct: 0, mostAffordable: null, bestRetention: null }
    const count = items.length
    const avgRetentionPct = Math.round(
      items.reduce((sum, i) => sum + (getAvgPrice(i.price_ranges.very_good!) / i.retail_price_usd) * 100, 0) / count
    )
    const sorted = [...items].sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    const mostAffordable = sorted[0]
    const bestRetention = [...items].sort((a, b) => {
      const ra = getAvgPrice(a.price_ranges.very_good!) / a.retail_price_usd
      const rb = getAvgPrice(b.price_ranges.very_good!) / b.retail_price_usd
      return rb - ra
    })[0]
    return { count, avgRetentionPct, mostAffordable, bestRetention }
  }

  const diorStats = getBrandStats(diorItems)
  const chanelStats = getBrandStats(chanelItems)

  const diorTop5 = [...diorItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)
  const chanelTop5 = [...chanelItems]
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

  function renderItems(items: typeof diorTop5, brandSlug: string) {
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
        Dior vs Chanel: Which Pre-Owned Bag Holds Value Better?
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Chanel and Dior represent two different propositions in the pre-owned luxury market. Chanel holds value exceptionally well — often 80–95% of retail — and iconic pieces appreciate over time. Dior offers stronger value for money, with pre-owned Lady Dior and Saddle bags available at meaningful discounts to retail while maintaining comparable prestige. The right choice depends on your goals: investment or access.
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
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Dior</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Chanel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{diorStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{chanelStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. value retention</td>
                <td className="py-3 pr-6 font-semibold text-[#1A1A1A]">{diorStats.avgRetentionPct}%</td>
                <td className="py-3 font-semibold text-[#4A7A35]">{chanelStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Entry price (pre-owned)</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {diorStats.mostAffordable ? `${diorStats.mostAffordable.model} (${formatPrice(getAvgPrice(diorStats.mostAffordable.price_ranges.very_good!))})` : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {chanelStats.mostAffordable ? `${chanelStats.mostAffordable.model} (${formatPrice(getAvgPrice(chanelStats.mostAffordable.price_ranges.very_good!))})` : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Authentication difficulty</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">High (cannage fakes common)</td>
                <td className="py-3 text-[#1A1A1A]">Very high (most counterfeited)</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Best for</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">Value, first luxury bag</td>
                <td className="py-3 text-[#1A1A1A]">Investment, appreciation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Dior
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">Most affordable Dior models, sorted by pre-owned price.</p>
        {renderItems(diorTop5, 'dior')}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Pre-Owned Chanel
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">Most affordable Chanel models, sorted by pre-owned price.</p>
        {renderItems(chanelTop5, 'chanel')}
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2 className="text-2xl text-[#1A1A1A] mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
          Verdict
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-3 font-medium">Buy Dior if…</p>
            <ul className="space-y-2">
              {[
                "It's your first luxury bag and budget matters",
                'You want iconic design with more affordable entry',
                'The Saddle or Lady Dior fits your style',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] mb-3 font-medium">Buy Chanel if…</p>
            <ul className="space-y-2">
              {[
                'Investment and value retention are the priority',
                'You want a piece that holds or beats retail value',
                "You're committed to the Classic Flap or Boy Bag long-term",
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
