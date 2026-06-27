import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Hermès vs Bottega Veneta Pre-Owned 2025 | SecondLuxuryItems',
  description: 'Hermès vs Bottega Veneta: the two quiet luxury leaders compared. Pre-owned prices, value retention, and which brand holds its value better on the secondary market.',
  alternates: { canonical: `${BASE}/compare/hermes-vs-bottega-veneta` },
}

const faqItems = [
  {
    q: 'Which is better pre-owned — Hermès or Bottega Veneta?',
    a: "Hermès wins decisively on value retention. Birkin and Kelly regularly trade at or above retail, making them investment-grade. Bottega Veneta pre-owned typically sells at 40–65% of retail — solid for luxury, but not in Hermès territory. However, BV is far more accessible and offers better value per dollar for buyers who want quality without the Hermès premium.",
  },
  {
    q: 'Does Bottega Veneta hold its value?',
    a: "Moderately. The Cassette bag and Jodie hobo both hold 50–65% of retail pre-owned, which is respectable. The Daniel Lee era (2018–2021) created pieces with strong collector demand. Post-Lee pieces under Matthieu Blazy have held value well too. The risk factor for BV is creative director sensitivity — a major direction change can affect secondary prices within 12–24 months.",
  },
  {
    q: 'What makes Hermès and Bottega Veneta both quiet luxury brands?',
    a: "Neither brand relies on visible logos. Hermès communicates luxury through quality of materials and proportions — the Birkin and Kelly have no Hermès branding visible when closed. Bottega Veneta's Intrecciato woven leather is its signature, recognizable to insiders without any logo. Both appeal to buyers who prefer their luxury understated and communicated through quality rather than branding.",
  },
  {
    q: 'Is Bottega Veneta a good investment?',
    a: "For a mainstream luxury brand, BV holds value better than most. The Pouch and Cassette both have strong secondary demand. But BV is not in the investment tier — it is a quality luxury purchase with reasonable resale value, not an asset. The brand's creative director history (multiple changes since Tomas Maier) adds uncertainty that Hermès, with its consistent house style, does not have.",
  },
]

export default function HermesVsBottegaVenetaPage() {
  const hermesItems = getItemsByBrand('hermes').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const bvItems = getItemsByBrand('bottega-veneta').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

  const hermesTop5 = [...hermesItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  const bvTop5 = [...bvItems]
    .sort((a, b) => getAvgPrice(a.price_ranges.very_good!) - getAvgPrice(b.price_ranges.very_good!))
    .slice(0, 5)

  function avgRetention(items: typeof hermesItems) {
    if (!items.length) return 0
    return Math.round(
      items.reduce((sum, i) => {
        const avg = getAvgPrice(i.price_ranges.very_good!)
        return sum + (avg / i.retail_price_usd) * 100
      }, 0) / items.length,
    )
  }

  const hermesRetention = avgRetention(hermesItems)
  const bvRetention = avgRetention(bvItems)

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
        Hermès vs Bottega Veneta Pre-Owned 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Quiet luxury compared</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Both Hermès and Bottega Veneta occupy the quiet luxury tier — no visible logos, communicating exclusivity through material quality and craft. But they occupy very different positions on the secondary market. Hermès is investment-grade; BV is quality luxury with reasonable resale. Here is how they compare.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Side-by-Side Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-6 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Metric</th>
                <th className="text-left py-3 pr-6 text-[#B8954A] font-semibold">Hermès</th>
                <th className="text-left py-3 text-[#1A1A1A] font-semibold">Bottega Veneta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Models tracked</td>
                <td className="py-3 pr-6 font-medium text-[#1A1A1A]">{hermesItems.length}</td>
                <td className="py-3 font-medium text-[#1A1A1A]">{bvItems.length}</td>
              </tr>
              {(hermesRetention > 0 || bvRetention > 0) && (
                <tr>
                  <td className="py-3 pr-6 text-[#9C8B7A]">Avg. retention (priced items)</td>
                  <td className="py-3 pr-6 font-semibold text-[#B8954A]">{hermesRetention}%</td>
                  <td className="py-3 font-semibold text-[#4A7A35]">{bvRetention}%</td>
                </tr>
              )}
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Quota bags above retail</td>
                <td className="py-3 pr-6 text-[#B8954A] font-medium">Yes (Birkin, Kelly, Constance)</td>
                <td className="py-3 text-[#6B6052]">No</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Typical retention range</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">60–200%+ (quota bags above 100%)</td>
                <td className="py-3 text-[#1A1A1A]">40–65%</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Logo visibility</td>
                <td className="py-3 pr-6 text-[#1A1A1A]">None (no visible branding)</td>
                <td className="py-3 text-[#1A1A1A]">None (Intrecciato is the signature)</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 text-[#9C8B7A]">Creative director risk</td>
                <td className="py-3 pr-6 text-[#6B6052]">Low — house style unchanged for decades</td>
                <td className="py-3 text-[#6B6052]">Higher — multiple director changes since 2000</td>
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
        <p className="text-sm text-[#6B6052] mb-6">
          {hermesItems.length > 0
            ? `${hermesItems.length} Hermès models tracked. Quota bags (Birkin, Kelly, Constance) typically trade above retail.`
            : 'Hermès pre-owned data — quota bags regularly trade above retail on the secondary market.'}
        </p>
        {hermesTop5.length > 0 ? (
          <div className="space-y-3">
            {hermesTop5.map(item => {
              const avg = getAvgPrice(item.price_ranges.very_good!)
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
                    <p className={`text-xs ${retainPct >= 100 ? 'text-[#B8954A]' : 'text-[#4A7A35]'}`}>{retainPct}% of retail</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="border border-[#E8E2D9] p-5 bg-[#FAFAF9]">
            <p className="text-sm text-[#6B6052]">Hermès Birkin and Kelly routinely trade at 100–200%+ of retail pre-owned. The Picotin and Garden Party trade below retail — better entry points for new Hermès buyers.</p>
          </div>
        )}
        <div className="mt-4">
          <Link href="/hermes" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
            View all Hermès models →
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Bottega Veneta Pre-Owned
        </h2>
        <p className="text-sm text-[#6B6052] mb-6">
          {bvItems.length > 0
            ? `${bvItems.length} Bottega Veneta models tracked. Pre-owned BV typically sells at 40–65% of retail.`
            : 'Bottega Veneta pre-owned typically sells at 40–65% of retail.'}
        </p>
        {bvTop5.length > 0 ? (
          <div className="space-y-3">
            {bvTop5.map(item => {
              const avg = getAvgPrice(item.price_ranges.very_good!)
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
          </div>
        ) : (
          <div className="border border-[#E8E2D9] p-5 bg-[#FAFAF9]">
            <p className="text-sm text-[#6B6052]">The BV Cassette and Jodie hobo are the strongest resale performers. Daniel Lee-era pieces (2018–2021) command premiums on the secondary market. Post-Lee pieces under Matthieu Blazy hold value at 50–65% of retail.</p>
          </div>
        )}
        <div className="mt-4">
          <Link href="/bottega-veneta" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
            View all Bottega Veneta models →
          </Link>
        </div>
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2
          className="text-xl text-[#1A1A1A] mb-5"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Which Should You Buy?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-3 font-medium">Buy Hermès if…</p>
            <ul className="space-y-2">
              {[
                'Investment return is a priority — quota bags beat most asset classes',
                'You have a $5,000+ budget and can be patient finding the right piece',
                'You want the ultimate stealth luxury with proven 20-year track record',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] mb-3 font-medium">Buy Bottega Veneta if…</p>
            <ul className="space-y-2">
              {[
                'You want quiet luxury at a significantly lower price point',
                'You love the Intrecciato weave — genuinely distinctive without any logo',
                'You want a beautiful everyday bag with reasonable resale without the Hermès waitlist',
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
