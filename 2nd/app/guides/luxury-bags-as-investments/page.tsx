import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Are Luxury Bags Good Investments? 2025 Data | SecondLuxuryItems',
  description: 'Do luxury bags appreciate in value? 2025 data on Hermès Birkin, Chanel Classic Flap, and Rolex resale returns vs retail. Honest analysis.',
  alternates: { canonical: `${BASE}/guides/luxury-bags-as-investments` },
}

const faqs = [
  {
    q: 'Do luxury bags go up in value?',
    a: "A small number of iconic pieces do appreciate: Hermès Birkin and Kelly regularly trade 50–200% above retail, and Chanel Classic Flap has risen faster than the S&P 500 since 2014. But the vast majority of luxury bags depreciate. Most non-iconic styles sell for 40–60% of retail pre-owned. Treating a handbag purchase as an investment is only reasonable for a handful of pieces from Hermès, Chanel, and Rolex.",
  },
  {
    q: 'Which luxury bags have the best resale value?',
    a: "In order: Hermès Birkin (often 100–200%+ of retail), Hermès Kelly (80–150%), Chanel Classic Flap (80–95%), Rolex GMT-Master II (80–200%), Rolex Daytona (100%+). After these, Chanel Boy Bag, Louis Vuitton Neverfull, and Bottega Veneta Cassette hold value reasonably at 55–75% of retail.",
  },
  {
    q: 'What makes a luxury bag appreciate in value?',
    a: "Three factors drive appreciation: rarity (Hermès quota system limits supply), brand price increases (Chanel has raised prices 100%+ since 2014, pulling pre-owned prices up), and cultural moments (a celebrity wearing a specific bag creates a lasting demand spike). Pieces that combine all three — like the Hermès Birkin or Chanel Classic Flap — become investment-grade assets.",
  },
  {
    q: 'Should I buy a luxury bag as an investment?',
    a: "Only if you are buying one of the proven pieces (Hermès Birkin/Kelly, Chanel Classic Flap in black caviar or lambskin, Rolex sports models). For everything else, buy because you love it and will use it — not as a financial bet. The transaction costs (platform fees of 15–30%, authentication, shipping, storage) eat into any gains. You need 2–3 years minimum holding time to see meaningful appreciation on even the best pieces.",
  },
]

export default function LuxuryBagsAsInvestmentsPage() {
  const allItems = getAllItems()
  const pricedItems = allItems.filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  const top10 = [...pricedItems]
    .map(item => {
      const avg = getAvgPrice(item.price_ranges.very_good!)
      const retainPct = Math.round((avg / item.retail_price_usd) * 100)
      return { item, avg, retainPct }
    })
    .sort((a, b) => b.retainPct - a.retainPct)
    .slice(0, 10)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Investment Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Are Pre-Owned Luxury Bags Good Investments? (2025 Data)
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Based on live market data</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          The short answer: most luxury bags are not good financial investments. The long answer: a very small set of iconic pieces from Hermès, Chanel, and Rolex have outperformed most asset classes over the past decade. Here is what the data actually shows.
        </p>
      </section>

      {top10.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-2xl text-[#1A1A1A] mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Top 10 Value Retention Rankings
          </h2>
          <p className="text-sm text-[#6B6052] mb-6">
            Ranked by pre-owned average price as a percentage of current retail. Items above 100% trade above retail on the secondary market.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  <th className="text-left py-3 pr-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs w-8">Rank</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Brand / Model</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retail</th>
                  <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Avg Resale</th>
                  <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retain %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9]">
                {top10.map(({ item, avg, retainPct }, i) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-3 text-[#9C8B7A] text-xs">{i + 1}</td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/${item.slug}`}
                        className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors"
                      >
                        <span className="block text-xs text-[#9C8B7A]">{item.brand}</span>
                        {item.model}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-[#9C8B7A]">{formatPrice(item.retail_price_usd)}</td>
                    <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPrice(avg)}</td>
                    <td className={`py-3 font-semibold text-sm ${retainPct >= 100 ? 'text-[#B8954A]' : retainPct >= 75 ? 'text-[#4A7A35]' : 'text-[#8C7355]'}`}>
                      {retainPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-5"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          What Appreciates (and What Doesn&apos;t)
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="p-5 border border-[#E8E2D9] bg-white">
            <p className="text-xs tracking-[0.15em] uppercase text-[#4A7A35] mb-3 font-medium">Appreciates</p>
            <ul className="space-y-2">
              {[
                'Hermès Birkin (+30–150%) — supply restriction + waitlist system',
                'Chanel Classic Flap (+20–50% post-2021 retail price increases)',
                'Rolex GMT-Master II (+80–200%) — discontinued colorways drive premiums',
                'Hermès Kelly in exotic leathers (+50–200%)',
              ].map(point => (
                <li key={point} className="flex gap-2 text-sm text-[#6B6052]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#4A7A35] shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 border border-[#E8E2D9] bg-white">
            <p className="text-xs tracking-[0.15em] uppercase text-[#8C7355] mb-3 font-medium">Depreciates</p>
            <ul className="space-y-2">
              {[
                'Seasonal colors — discontinued colorways drop 40–60% off retail',
                'Collaboration pieces — hype fades within 12–18 months',
                'Non-iconic models from any brand — even Hermès non-quota bags drop',
                'Fast-fashion luxury: Balenciaga, Versace trend pieces',
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

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2
          className="text-lg text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Verdict
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          Luxury bags are not a reliable investment strategy. But iconic pieces from Hermès, Chanel, and Rolex have outperformed most traditional assets in down markets. If you are buying purely as investment, stick to Hermès Birkin or Kelly in classic leathers, black Chanel Classic Flap, or a Rolex sports reference. For everything else, buy because you love it.
        </p>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
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

      <div className="mt-10 pt-6 border-t border-[#E8E2D9] flex gap-6">
        <Link href="/guides/where-to-sell-luxury-bags" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          Where to sell luxury bags →
        </Link>
        <Link href="/value-guide" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          Full value guide →
        </Link>
      </div>
    </article>
  )
}
