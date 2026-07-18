import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Cartier vs Tiffany & Co. Pre-Owned Jewelry Value 2025 | SecondLuxuryItems',
  description: 'Cartier vs Tiffany: which jewelry brand holds value better pre-owned? Cartier retains 70-85% (Love Bracelet is iconic). Tiffany retains 40-60%.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/compare/cartier-vs-tiffany' },
}

const faqItems = [
  {
    q: 'Does Cartier or Tiffany hold value better?',
    a: 'Cartier wins clearly. Love Bracelet and Juste un Clou retain 70-85% of retail. Tiffany T Wire and HardWear pieces retain 40-55%, similar to most jewelry.',
  },
  {
    q: 'Is pre-owned Cartier worth buying?',
    a: 'Yes — Love Bracelet at 70-80% of retail is still $4,800-5,500, but you avoid the boutique markup and waitlist. Cartier Love Ring pre-owned starts around $1,200-1,500.',
  },
  {
    q: 'What\'s the difference in resale between Cartier and Tiffany?',
    a: 'Cartier\'s iconic designs (Love, Juste un Clou, Trinity) have decades of recognition. Tiffany\'s designs trend more — T collection is newer and hasn\'t proven the same longevity.',
  },
]

export default function CartierVsTiffanyPage() {
  const cartierItems = getItemsByBrand('cartier').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const tiffanyItems = getItemsByBrand('tiffany--co').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

  function getBrandStats(items: typeof cartierItems) {
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

  const cartierStats = getBrandStats(cartierItems)
  const tiffanyStats = getBrandStats(tiffanyItems)

  const cartierTop5 = [...cartierItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  const tiffanyTop5 = [...tiffanyItems]
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
        Cartier vs Tiffany &amp; Co.: Pre-Owned Jewelry Value Guide
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Data-driven comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Cartier and Tiffany are the two most recognized fine jewelry brands globally, but they
          diverge significantly in resale performance. Cartier Love Bracelet and Juste un Clou have
          achieved rare iconic status — designs so recognizable they trade at 70-85% of retail
          pre-owned. Tiffany pieces retain 40-60%, closer to the jewelry industry average. The gap
          comes down to design longevity: Cartier's core collections have been in continuous demand
          for 40+ years, while Tiffany's T and HardWear lines are newer with less proven staying
          power.
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
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Cartier</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Tiffany &amp; Co.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{cartierStats.count}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{tiffanyStats.count}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention</td>
                <td className="py-3 pr-6 font-semibold text-[#4A7A35]">
                  {cartierStats.avgRetentionPct}%
                </td>
                <td className="py-3 font-semibold text-[#1A1A1A]">{tiffanyStats.avgRetentionPct}%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Most affordable entry</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {cartierStats.mostAffordable
                    ? `${cartierStats.mostAffordable.model} (${formatPrice(getAvgPrice(cartierStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">
                  {tiffanyStats.mostAffordable
                    ? `${tiffanyStats.mostAffordable.model} (${formatPrice(getAvgPrice(tiffanyStats.mostAffordable.price_ranges.very_good!))} avg)`
                    : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Best value retention</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">
                  {cartierStats.bestRetention?.model ?? '—'}
                </td>
                <td className="py-3 text-[#1A1A1A]">{tiffanyStats.bestRetention?.model ?? '—'}</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Typical retention range</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">70–85%</td>
                <td className="py-3 text-[#1A1A1A]">40–60%</td>
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
          Cartier Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          Top {cartierTop5.length} most affordable Cartier models tracked, sorted by pre-owned price.
        </p>
        <div className="space-y-3">
          {cartierTop5.map(item => {
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
            href="/cartier"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            View all Cartier models →
          </Link>
        </div>
      </section>

      {tiffanyTop5.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-2xl text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Tiffany &amp; Co. Pre-Owned
          </h2>
          <p className="text-[#6B6052] mb-6 text-sm">
            Top {tiffanyTop5.length} Tiffany models tracked, sorted by pre-owned price.
          </p>
          <div className="space-y-3">
            {tiffanyTop5.map(item => {
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
              href="/tiffany-co"
              className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
            >
              View all Tiffany &amp; Co. models →
            </Link>
          </div>
        </section>
      )}

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
              Buy Cartier if…
            </p>
            <ul className="space-y-2">
              {[
                'You want jewelry that holds value — Love Bracelet is a proven classic',
                'You plan to resell or gift the piece — Cartier resale is straightforward',
                'You want one of the most recognized jewelry brands at the global scale',
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
              Buy Tiffany if…
            </p>
            <ul className="space-y-2">
              {[
                'You love Tiffany blue and the brand aesthetic — it\'s a personal choice',
                'Engagement rings: Tiffany settings have strong recognition value',
                'You want American luxury heritage with instantly recognizable packaging',
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
