import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice, toBrandSlug } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Luxury Resale Value Guide 2025 — Which Bags Hold Value? | SecondLuxuryItems',
  description: 'Data-driven ranking of pre-owned luxury resale values. See which designer bags, watches and accessories retain the most value.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/value-guide' },
}

const faqItems = [
  {
    q: "Which luxury brand holds its value best?",
    a: "Hermès (Birkin/Kelly) often sell above retail on the secondary market, making them the strongest value-retention brand. Chanel follows closely, having raised prices 60%+ since 2019 so pre-owned often exceeds older retail. Rolex watches also frequently exceed retail on secondary markets."
  },
  {
    q: "Do luxury bags lose value over time?",
    a: "It depends on brand and model. Chanel has raised prices dramatically since 2019, so pre-owned Chanel bags bought at older retail prices often fetch more than their original cost. Louis Vuitton Monogram typically retains 60-70% of retail. Lesser-known models or fast-fashion-adjacent luxury depreciates like normal goods."
  },
  {
    q: "Is buying pre-owned luxury a good investment?",
    a: "Iconic pieces — Chanel Classic Flap, Hermès Birkin, Rolex Submariner — have historically outperformed inflation and some traditional asset classes. However, most luxury goods should be bought for enjoyment first. Less iconic pieces depreciate like normal consumer goods and should not be treated as investments."
  }
]

function computeValueData() {
  const items = getAllItems()
  return items
    .filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
    .map(i => {
      const vg = i.price_ranges.very_good!
      const avgPrice = getAvgPrice(vg)
      const retainPct = Math.round((avgPrice / i.retail_price_usd) * 100)
      const savingsPct = 100 - retainPct
      return { item: i, avgPrice, retainPct, savingsPct }
    })
}

function RetainsBadge({ pct }: { pct: number }) {
  const color = pct >= 80 ? '#4A7A35' : pct >= 60 ? '#B8954A' : '#6B6052'
  return (
    <span className="font-bold text-base" style={{ color }}>
      {pct}%
    </span>
  )
}

export default function ValueGuidePage() {
  const data = computeValueData()
  const byRetention = [...data].sort((a, b) => b.retainPct - a.retainPct).slice(0, 10)
  const bySavings = [...data].sort((a, b) => b.savingsPct - a.savingsPct).slice(0, 10)

  function ValueTable({ rows, highlightCol }: {
    rows: typeof data
    highlightCol: 'retain' | 'savings'
  }) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E8E2D9] text-left">
              <th className="py-3 pr-4 text-xs uppercase tracking-widest text-[#9C8B7A] w-8">#</th>
              <th className="py-3 pr-4 text-xs uppercase tracking-widest text-[#9C8B7A]">Brand &amp; Model</th>
              <th className="py-3 pr-4 text-xs uppercase tracking-widest text-[#9C8B7A] text-right">Avg Used</th>
              <th className="py-3 pr-4 text-xs uppercase tracking-widest text-[#9C8B7A] text-right">Retail</th>
              <th className="py-3 text-xs uppercase tracking-widest text-[#9C8B7A] text-right">
                {highlightCol === 'retain' ? 'Retains' : 'Saves'}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ item, avgPrice, retainPct, savingsPct }, i) => (
              <tr key={item.slug} className="border-b border-[#F0EAE0] hover:bg-[#F5F0E8] transition-colors">
                <td className="py-3 pr-4 text-[#C8B89A] font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {i + 1}
                </td>
                <td className="py-3 pr-4">
                  <Link href={`/${item.slug}`} className="hover:text-[#B8954A] transition-colors">
                    <span className="text-xs uppercase tracking-widest text-[#9C8B7A] block">{item.brand}</span>
                    <span className="text-[#1A1A1A] font-medium">{item.model}</span>
                  </Link>
                </td>
                <td className="py-3 pr-4 text-right text-[#1A1A1A]">{formatPrice(avgPrice)}</td>
                <td className="py-3 pr-4 text-right text-[#9C8B7A]">{formatPrice(item.retail_price_usd)}</td>
                <td className="py-3 text-right">
                  {highlightCol === 'retain'
                    ? <RetainsBadge pct={retainPct} />
                    : <span className="font-bold text-base text-[#4A7A35]">{savingsPct}%</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a }
        }))
      })}} />

      <div className="mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Value Guide</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Luxury Resale Value Guide {PRICE_YEAR}
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          Which pre-owned luxury items hold their value — and which give you the biggest discount vs retail?
          Rankings based on live Vestiaire Collective market data.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Best Value Retention
        </h2>
        <p className="text-[#6B6052] text-sm mb-6">These hold their value best — buy them knowing the resale market is strong.</p>
        <ValueTable rows={byRetention} highlightCol="retain" />
      </section>

      <section className="mb-14">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          Biggest Savings vs Retail
        </h2>
        <p className="text-[#6B6052] text-sm mb-6">Buy these for maximum discount — highest gap between new and pre-owned pricing.</p>
        <ValueTable rows={bySavings} highlightCol="savings" />
      </section>

      <div className="p-4 bg-[#F5F0E8] border border-[#E8E2D9] text-xs text-[#6B6052] leading-relaxed mb-12">
        Value retention = average pre-owned price (Very Good condition) ÷ retail price × 100.
        Updated weekly from real market listings. Past resale performance does not guarantee future results.
      </div>

      <div className="mb-12 grid gap-3 sm:grid-cols-3">
        {[
          { href: '/under-500', label: 'Under $500', desc: 'Accessible luxury entry points' },
          { href: '/under-1000', label: 'Under $1,000', desc: 'Designer bags & accessories' },
          { href: '/under-2000', label: 'Under $2,000', desc: 'Full handbag range' },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href}
            className="border border-[#E8E2D9] hover:border-[#B8954A] p-4 text-center transition-all duration-200 group"
          >
            <p className="font-semibold text-[#1A1A1A] group-hover:text-[#B8954A] transition-colors">{label}</p>
            <p className="text-xs text-[#9C8B7A] mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
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

      <nav className="mt-10 pt-6 border-t border-[#E8E2D9]">
        <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-3">Compare Categories</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/handbags" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">All Handbags →</Link>
          <Link href="/watches" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">All Watches →</Link>
          <Link href="/chanel" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Chanel Prices →</Link>
          <Link href="/louis-vuitton" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Louis Vuitton Prices →</Link>
          <Link href="/guides/luxury-condition-guide" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Condition Guide →</Link>
        </div>
      </nav>
    </>
  )
}
