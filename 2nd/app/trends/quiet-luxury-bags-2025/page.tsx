import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Quiet Luxury Bags 2025 — Best Pre-Owned Picks | SecondLuxuryItems',
  description:
    'The quiet luxury trend defined: understated, logo-free luxury. Best pre-owned bags for quiet luxury aesthetic in 2025.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/trends/quiet-luxury-bags-2025',
  },
}

const faqItems = [
  {
    q: 'What brands are considered quiet luxury?',
    a: 'Bottega Veneta, Celine, The Row, Loro Piana, Brunello Cucinelli, and Valextra. In handbags specifically: Bottega Intrecciato weave, Celine Classic Box, and Hermès pieces without visible logos.',
  },
  {
    q: 'What are the best quiet luxury bags to buy pre-owned?',
    a: 'Bottega Veneta Jodie ($700-900 pre-owned), Celine Classic Box Flap ($1,200-1,800), and Hermès Picotin ($1,000-1,400) are top picks. All feature minimal branding, quality leather, and timeless silhouettes.',
  },
  {
    q: 'Does quiet luxury hold its value?',
    a: 'Less aggressively than Chanel or Louis Vuitton but still holds 50-70% of retail typically. The advantage: you can buy pre-owned at 40-55% off retail — a better deal than logomania pieces where demand keeps pre-owned prices closer to retail.',
  },
  {
    q: 'Is quiet luxury still trending in 2025?',
    a: 'Yes — the aesthetic has moved from trend to lifestyle shift. Understated luxury continues to gain share as consumers reject conspicuous consumption. The quiet luxury customer is becoming more the norm than the exception among high-income buyers.',
  },
]

const QUIET_SLUGS = [
  'bottega-veneta/jodie-small',
  'bottega-veneta/cassette-bag',
  'bottega-veneta/arco-tote-medium',
  'celine/classic-box',
  'celine/belt-bag-mini',
  'celine/luggage-micro',
]

export default function QuietLuxuryBags2025Page() {
  const allItems = getAllItems()
  const featuredItems = QUIET_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => {
      if (!i) return false
      const r = i.price_ranges.very_good ?? i.price_ranges.excellent ?? i.price_ranges.good
      return !!r && i.retail_price_usd > 0
    })

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

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Trend Report</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Quiet Luxury Bags: The Best Pre-Owned Picks for 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · 6 min read</p>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          What Is Quiet Luxury?
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Quiet luxury is the opposite of logomania. No visible logos, no monogram canvas, no status
          symbols that announce themselves from across a room. Instead: neutral palettes, quality
          leather, minimal branding, and silhouettes that have remained relevant for decades.
        </p>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          The aesthetic was popularized in mainstream culture by Siobhan Roy in HBO&apos;s
          Succession — expensive clothes that look understated to untrained eyes, but signal taste
          to those who recognize the craftsmanship. Think a Bottega Veneta Jodie in natural leather,
          a Celine Classic Box in black, or an Hermès Lindy without visible house logos.
        </p>
        <p className="text-[#6B6052] leading-relaxed">
          Quiet luxury thinks in decades, not seasons. The defining brands — Bottega Veneta, Celine,
          The Row, Loro Piana, Brunello Cucinelli, Valextra — make pieces that look as relevant in
          ten years as they do today. That longevity makes them ideal for the pre-owned market.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Best Quiet Luxury Bags Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6">
          Bottega Veneta and Celine are the two most accessible quiet luxury bag brands on the
          pre-owned market. Both feature distinctive designs with no visible house logos.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredItems.map(item => {
            const range =
              item.price_ranges.very_good ??
              item.price_ranges.excellent ??
              item.price_ranges.good!
            const avg = getAvgPrice(range)
            const savingsPct =
              item.retail_price_usd > 0
                ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
                : 0
            return (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="group border border-[#E8E2D9] hover:border-[#B8954A] p-5 transition-all duration-200 bg-white"
              >
                <p className="text-xs tracking-widest uppercase text-[#B8954A] mb-1">
                  {item.brand}
                </p>
                <h3
                  className="text-lg text-[#1A1A1A] mb-3 group-hover:text-[#8C7355] transition-colors"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.model}
                </h3>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                    <p className="text-xs text-[#9C8B7A]">avg. pre-owned</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#9C8B7A] line-through">
                      {formatPrice(item.retail_price_usd)}
                    </p>
                    {savingsPct > 0 && (
                      <p className="text-sm font-semibold text-[#4A7A35]">Save {savingsPct}%</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Price Advantage
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Quiet luxury brands don&apos;t hold value as aggressively as Chanel or Louis Vuitton,
          meaning bigger savings pre-owned — 40-55% off retail is common. A Bottega Veneta Jodie
          that retails at $2,200 can be found pre-owned in very good condition for $900-1,200.
        </p>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Chanel has trained buyers to expect pre-owned prices near or above retail. Quiet luxury
          brands haven&apos;t done that — so buyers get the quality at genuinely lower prices. The
          trade-off: slightly lower resale value when you eventually sell. But if you&apos;re buying
          to use and keep, that&apos;s irrelevant.
        </p>
        <div className="bg-[#F5F0E8] border border-[#E8E2D9] p-5 mt-4">
          <p className="text-sm text-[#6B6052] leading-relaxed">
            <span className="font-medium text-[#1A1A1A]">Pre-owned savings on quiet luxury:</span>{' '}
            Bottega Veneta typically 40-50% off retail. Celine 35-50% off retail. Valextra
            45-55% off retail. Compare that to Chanel pre-owned, which runs 10-30% below new retail
            at best.
          </p>
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
