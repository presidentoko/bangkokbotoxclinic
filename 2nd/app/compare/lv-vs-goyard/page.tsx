import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Louis Vuitton vs Goyard Pre-Owned 2025 | SecondLuxuryItems',
  description: 'LV vs Goyard pre-owned: which holds value better? Monogram canvas vs Goyardine coated canvas. Resale prices, market depth, and which to buy second-hand.',
  alternates: { canonical: `${BASE}/compare/lv-vs-goyard` },
}

const faqItems = [
  {
    q: 'Is Goyard more exclusive than Louis Vuitton?',
    a: "In terms of availability, yes. Goyard has no e-commerce presence — bags can only be purchased in-store at a small number of boutiques worldwide. This creates artificial scarcity that supports pre-owned resale prices. Louis Vuitton is globally available and far more widely distributed, but its Monogram canvas is instantly recognizable and has stronger cultural staying power.",
  },
  {
    q: 'Which holds value better pre-owned — LV or Goyard?',
    a: "Goyard's St. Louis tote holds value surprisingly well (often 80–100%+ of retail) due to its scarcity and no-logo-heavy design. LV Monogram pieces typically retain 60–80% of retail. The lack of Goyard inventory online means the pre-owned premium can be significant for sought-after colors. However, LV has a far deeper buyer market — liquidity is much higher.",
  },
  {
    q: 'Where can I find pre-owned Goyard bags?',
    a: "Goyard rarely appears on mainstream platforms because the original buyer pool is smaller. Look on Vestiaire Collective, Fashionphile, and specialist vintage luxury dealers. Private sale platforms (Chrono24 for watches works similarly for Goyard in luxury Facebook groups and forums). Be prepared to pay a significant premium over retail for rare colors.",
  },
  {
    q: 'Is the Goyard St. Louis tote worth buying pre-owned?',
    a: "Yes, particularly for classic colors (black, tan/natural). The Goyardine canvas is extremely durable, lightweight, and ages well. Pre-owned St. Louis totes often have decades of use remaining. The bag is practical, quiet-luxury positioned, and holds value well. Avoid rare or seasonal colors pre-owned — reselling them later is more difficult.",
  },
]

export default function LvVsGoyardPage() {
  const lvItems = getItemsByBrand('louis-vuitton').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )
  const goyardItems = getItemsByBrand('goyard').filter(
    i => i.price_ranges.very_good && i.retail_price_usd > 0,
  )

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
        Louis Vuitton vs Goyard Pre-Owned 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Market data comparison</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Louis Vuitton and Goyard share a century-old French heritage and coated-canvas signature material, but occupy very different positions on the pre-owned market. LV is the world&apos;s most liquid luxury resale brand — you can always find a buyer. Goyard is the opposite: scarce, low-supply, high-premium for the right piece.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Head-to-Head
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-6 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Factor</th>
                <th className="text-left py-3 pr-6 text-[#1A1A1A] font-semibold">Louis Vuitton</th>
                <th className="text-left py-3 text-[#B8954A] font-semibold">Goyard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {[
                ['Pre-owned availability', 'Extremely high — deepest market of any brand', 'Low — few listings, boutique-only at retail'],
                ['Value retention (typical)', '60–80% of retail', '80–100%+ for classic colors'],
                ['Most iconic piece', 'Neverfull MM, Speedy 30', 'Saint Louis PM/GM tote'],
                ['Material', 'Monogram / Damier coated canvas + Vachetta leather', 'Goyardine coated canvas + leather trim'],
                ['Resale liquidity', 'Very high — fast to sell', 'Lower — fewer buyers but less competition'],
                ['Price transparency', 'Fully public retail prices', 'No published price list — varies by store'],
                ['Best buyer type', 'First-time buyers, value seekers', 'Quiet luxury buyers, collectors'],
              ].map(([factor, lv, goyard]) => (
                <tr key={factor}>
                  <td className="py-3 pr-6 text-[#9C8B7A]">{factor}</td>
                  <td className="py-3 pr-6 text-[#1A1A1A]">{lv}</td>
                  <td className="py-3 text-[#1A1A1A]">{goyard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Louis Vuitton Pre-Owned Prices
        </h2>
        <p className="text-sm text-[#6B6052] mb-6">{lvItems.length} LV models tracked. Top 5 by price shown below.</p>
        <div className="space-y-3">
          {lvTop5.map(item => {
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
        <div className="mt-4">
          <Link href="/louis-vuitton" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
            View all Louis Vuitton models →
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Goyard Pre-Owned: Sourcing Notes
        </h2>
        {goyardItems.length > 0 ? (
          <div className="space-y-3">
            {goyardItems.map(item => {
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
            <p className="text-sm text-[#6B6052] leading-relaxed">
              Goyard does not publish retail prices and has no official e-commerce presence, making standardized price tracking difficult. Pre-owned Goyard listings are sparse — the Saint Louis tote (most common style) trades at 80–120% of estimated retail on platforms like Vestiaire. Caviar or special-order colors command premiums of 40–80% above standard pricing.
            </p>
            <p className="text-sm text-[#6B6052] mt-3">
              Best sourcing for pre-owned Goyard: Vestiaire Collective, Fashionphile, and specialist vintage luxury dealers in major cities.
            </p>
          </div>
        )}
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
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] mb-3 font-medium">Buy Louis Vuitton if…</p>
            <ul className="space-y-2">
              {[
                'You want the widest resale market and easiest future selling',
                'You prefer transparent pricing and wide pre-owned availability',
                'You want the classic Monogram look with global brand recognition',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8C7355] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-3 font-medium">Buy Goyard if…</p>
            <ul className="space-y-2">
              {[
                'You want quiet luxury without visible logos or wide recognition',
                'You value scarcity and exclusivity — Goyard is much harder to find',
                'You are buying the St. Louis tote as a practical everyday bag with strong resale upside',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
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
