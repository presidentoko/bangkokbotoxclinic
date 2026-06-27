import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Best Pre-Owned Luxury Watches for Beginners 2025 | SecondLuxuryItems',
  description:
    'The best luxury watches to buy pre-owned as a first watch. Omega Seamaster, Cartier Tank, Rolex Datejust — entry prices, value retention, and what to know.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/best-pre-owned-watches-for-beginners',
  },
}

const WATCH_SLUGS = [
  'tag-heuer/carrera-calibre-16',
  'omega/seamaster-300m',
  'omega/speedmaster-moonwatch',
  'cartier/tank-solo',
  'cartier/santos-medium',
  'cartier/ballon-bleu-40mm',
  'rolex/datejust-41',
]

const watchNotes: Record<string, { tier: string; intro: string; detail: string }> = {
  'tag-heuer/carrera-calibre-16': {
    tier: 'Best Entry Point',
    intro: 'The most accessible serious Swiss watch for beginners.',
    detail:
      'TAG Heuer sits just below Omega in the prestige hierarchy but offers legitimate Swiss chronograph movements at pre-owned prices accessible to first-time buyers. The Carrera is a sports-elegant design with motorsport heritage. Less value retention than Omega or Rolex, but a lower barrier to entry.',
  },
  'omega/seamaster-300m': {
    tier: 'Best All-Around Beginner Watch',
    intro: 'The James Bond watch. Versatile, robust, excellent value retention.',
    detail:
      "The Omega Seamaster 300M is the most recommended entry-level serious watch for a reason: it is a genuine tool watch (water-resistant to 300m), wears well in any setting from the office to the beach, and holds value reliably pre-owned. The co-axial movement is serviced more affordably than Rolex. Pre-owned prices $1,500-2,500 depending on condition and dial color.",
  },
  'omega/speedmaster-moonwatch': {
    tier: 'Best History',
    intro: 'The only watch worn on the Moon. An icon of exploration.',
    detail:
      'NASA-certified for the Apollo missions in 1965, the Speedmaster Professional has remained in continuous production with minimal changes. The hand-wound caliber 321 (or 1861 in modern pieces) is a legitimate horological artifact. Pre-owned values are stable because the watch carries genuine historical significance that attracts both watch enthusiasts and history collectors.',
  },
  'cartier/tank-solo': {
    tier: 'Most Elegant Entry',
    intro: 'The most elegant beginner luxury watch. 100 years of wrist history.',
    detail:
      "Designed by Louis Cartier in 1917, inspired by World War I tank treads. The rectangular case, Roman numeral dial, and blued hands define elegant dress watch design. The Tank has been worn by Jackie Kennedy, Andy Warhol, Princess Diana, and Michelle Obama. For beginners who want an elegant watch over a sports watch, the Tank Solo is the clear recommendation. Pre-owned $1,800-3,500.",
  },
  'cartier/santos-medium': {
    tier: 'Best Sports Cartier',
    intro: 'The first pilot\'s watch, designed in 1904.',
    detail:
      "Alberto Santos-Dumont commissioned Louis Cartier to design a watch he could read while flying. The exposed screws, square case, and bracelet-integrated lugs created the archetype of the modern sports watch. Pre-owned Santos Medium prices are more accessible than the Tank in many conditions, making it an underrated entry point into Cartier.",
  },
  'cartier/ballon-bleu-40mm': {
    tier: 'Most Modern Cartier',
    intro: 'Contemporary Cartier design with broad appeal.',
    detail:
      "Launched in 2007, the Ballon Bleu is Cartier's bestselling modern watch. The distinctive round crown protector and floating blue sapphire cabochon give it immediate recognizability. More casual than the Tank, more refined than the Santos. Pre-owned availability is high, making it a good entry point if you prefer Cartier's modern aesthetic over its vintage designs.",
  },
  'rolex/datejust-41': {
    tier: 'Best Value Retention',
    intro: 'The safest beginner Rolex. The most produced Swiss watch in history.',
    detail:
      "The Datejust is the first watch most people should buy if entering Rolex. Lower barrier than a Submariner or GMT, strong value retention regardless of configuration, and immediate recognizability. The date complication and Jubilee or Oyster bracelet options give buyers flexibility. Pre-owned Datejust 41 prices range $6,000-9,000, making it the most accessible current Rolex with strong secondary market.",
  },
}

const faqItems = [
  {
    q: 'What is the best first luxury watch to buy pre-owned?',
    a: 'The Omega Seamaster 300M is the most commonly recommended first luxury watch — strong brand prestige, genuine tool watch capability, reasonable pre-owned prices ($1,500-2,500), and reliable value retention. For a dress watch, the Cartier Tank Solo is the classic choice.',
  },
  {
    q: 'Do luxury watches hold their value when bought pre-owned?',
    a: 'Rolex holds value best, often trading at or above retail for popular models. Omega holds 60-75% of retail on average. Cartier holds 50-65%. TAG Heuer holds 40-55%. Buying pre-owned means you already purchase at secondary market price, so further depreciation is less severe than buying new.',
  },
  {
    q: 'What should a beginner look for when buying a pre-owned watch?',
    a: "Condition of the dial (no scratches, moisture, or fading), movement servicing history, bracelet stretch, and case polishing. Avoid watches with polished cases — polishing removes metal and rounded edges, reducing collector value. Original bracelet and box/papers add 10-20% to resale value.",
  },
  {
    q: 'Is Omega or TAG Heuer better for a first watch?',
    a: 'Omega is generally the better first watch for long-term value and brand prestige. TAG Heuer has a lower entry price pre-owned, which works if budget is a constraint. If you can stretch to Omega, the Seamaster or Speedmaster have better value retention and stronger collector following.',
  },
]

export default function BestPreOwnedWatchesForBeginnersPage() {
  const allItems = getAllItems()
  const watchItems = WATCH_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => {
      if (!i) return false
      return !!(i.price_ranges.very_good ?? i.price_ranges.excellent ?? i.price_ranges.good)
    })
    .sort((a, b) => {
      const aRange = a.price_ranges.very_good ?? a.price_ranges.excellent ?? a.price_ranges.good!
      const bRange = b.price_ranges.very_good ?? b.price_ranges.excellent ?? b.price_ranges.good!
      return getAvgPrice(aRange) - getAvgPrice(bRange)
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

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Buyer&apos;s Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Best Pre-Owned Luxury Watches for Beginners 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · 8 min read</p>

      <p className="text-[#6B6052] leading-relaxed mb-10">
        A first luxury watch should be one you wear daily for years, not one that sits in a drawer.
        The watches below are ranked by entry price — starting from the most accessible and moving
        toward the strongest value retention. All have robust pre-owned markets, meaning you can
        sell later without significant loss.
      </p>

      <div className="space-y-8">
        {watchItems.map(item => {
          const range =
            item.price_ranges.very_good ??
            item.price_ranges.excellent ??
            item.price_ranges.good!
          const avg = getAvgPrice(range)
          const savingsPct =
            item.retail_price_usd > 0
              ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
              : 0
          const note = watchNotes[item.slug]

          return (
            <div key={item.slug} className="border border-[#E8E2D9] p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  {note && (
                    <p className="text-xs tracking-[0.15em] uppercase text-[#B8954A] mb-1">
                      {note.tier}
                    </p>
                  )}
                  <p className="text-xs text-[#9C8B7A] uppercase tracking-wider mb-0.5">
                    {item.brand}
                  </p>
                  <h2
                    className="text-xl text-[#1A1A1A]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {item.model}
                  </h2>
                  {note && (
                    <p className="text-sm text-[#8C7355] mt-1 italic">{note.intro}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                  {item.retail_price_usd > 0 && (
                    <p className="text-xs text-[#9C8B7A] line-through">
                      {formatPrice(item.retail_price_usd)} retail
                    </p>
                  )}
                  {savingsPct > 0 && (
                    <p className="text-xs font-semibold text-[#4A7A35]">Save {savingsPct}%</p>
                  )}
                </div>
              </div>
              {note && (
                <p className="text-sm text-[#6B6052] leading-relaxed mb-4">{note.detail}</p>
              )}
              <Link
                href={`/${item.slug}`}
                className="text-xs tracking-wider uppercase text-[#B8954A] hover:text-[#8C7355] transition-colors"
              >
                View price history →
              </Link>
            </div>
          )
        })}
      </div>

      <section className="mt-12 border-t border-[#E8E2D9] pt-10">
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
