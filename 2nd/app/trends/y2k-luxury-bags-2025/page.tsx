import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Y2K Luxury Bags Making a Comeback in 2025 | SecondLuxuryItems',
  description:
    'Y2K designer bags are back. Fendi Baguette, Dior Saddle, Gucci Bamboo — pre-owned prices for the most coveted Y2K luxury pieces.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/trends/y2k-luxury-bags-2025',
  },
}

const faqItems = [
  {
    q: 'Which Y2K bags are most popular in 2025?',
    a: 'Fendi Baguette, Dior Saddle, Gucci Bamboo, LV Monogram Mini, and the Prada nylon mini backpack. The Fendi Baguette in particular saw a 300%+ price increase pre-owned since 2020 as Gen Z rediscovered it through Sex and the City reruns and Y2K fashion nostalgia.',
  },
  {
    q: 'Are Y2K bags worth buying pre-owned?',
    a: 'Yes, especially if buying vintage originals from the early 2000s. Fendi Baguette originals (pre-2005) hold value better than modern reissues because they carry the actual vintage provenance. Look for serial numbers that confirm production year — they are usually on a leather tab inside.',
  },
  {
    q: 'Where can I find Y2K luxury bags?',
    a: 'Vestiaire Collective has the strongest selection — you can filter by year of production to find actual vintage pieces rather than reissues. Prices for original Fendi Baguettes run $400-1,200 pre-owned depending on condition and rarity of colorway.',
  },
]

const Y2K_SLUGS = [
  'fendi/baguette-medium',
  'fendi/peekaboo-mini',
  'dior/saddle-bag',
  'dior/lady-dior-medium',
]

export default function Y2KLuxuryBags2025Page() {
  const allItems = getAllItems()
  const featuredItems = Y2K_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => {
      if (!i) return false
      const r = i.price_ranges.very_good ?? i.price_ranges.excellent ?? i.price_ranges.good
      return !!r
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
        Y2K Luxury Bags: 2025&apos;s Biggest Pre-Owned Trend
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · 5 min read</p>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          The Y2K Revival
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Gen Z is rediscovering early 2000s fashion in a big way — and luxury bags are at the
          center of the revival. The Fendi Baguette, made famous by Carrie Bradshaw in Sex and the
          City, has seen pre-owned prices triple since 2020. The Dior Saddle, discontinued and then
          reissued, commands strong premiums for the original 2000 version.
        </p>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          The appeal is partly nostalgia, partly the recognition that these bags were genuinely
          innovative for their time — the Fendi Baguette introduced the under-arm silhouette that
          still dominates runway shows. The Louis Vuitton Multicolor in white or black canvas,
          designed by Takashi Murakami in 2002, remains one of the most recognizable luxury
          collaborations ever produced.
        </p>
        <p className="text-[#6B6052] leading-relaxed">
          Key Y2K bags to know: Fendi Baguette, Dior Saddle, Gucci Horsebit, Gucci Bamboo, LV
          Monogram Mini, Prada nylon mini backpack. Each defines a specific moment in early 2000s
          luxury culture.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Best Y2K Bags Pre-Owned
        </h2>
        <p className="text-[#6B6052] mb-6">
          Fendi and Dior represent the two most iconic Y2K bag houses currently available on the
          pre-owned market with strong authentication histories.
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
                    {item.retail_price_usd > 0 && (
                      <p className="text-sm text-[#9C8B7A] line-through">
                        {formatPrice(item.retail_price_usd)}
                      </p>
                    )}
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
          Why Buy Y2K Pre-Owned?
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Vintage pieces from the early 2000s are often the originals from that era, not reissues.
          This matters because originals carry genuine provenance — they are the actual bags worn
          during the cultural moment that made them famous. A 2001 Fendi Baguette is different from
          a 2019 reissue in ways that collectors recognize and price accordingly.
        </p>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Vintage originals are also frequently priced lower than new reissues. Fendi reissued the
          Baguette at retail prices of $3,200-4,500. An original in good condition from 2000-2004
          can be found pre-owned for $400-900. The vintage piece is more authentic and more
          affordable — a rare combination.
        </p>
        <ul className="space-y-3 mt-4">
          {[
            {
              label: 'Authentic provenance',
              detail:
                'Original early-2000s pieces carry vintage status that reissues cannot replicate.',
            },
            {
              label: 'Lower price than reissues',
              detail:
                'Vintage originals often cost less than brand-new reissues of the same bag.',
            },
            {
              label: 'Stronger value trajectory',
              detail:
                'Originals tend to appreciate better than reissues as Y2K nostalgia deepens.',
            },
          ].map(({ label, detail }) => (
            <li key={label} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#B8954A] shrink-0" />
              <div>
                <span className="font-medium text-[#1A1A1A]">{label}: </span>
                <span className="text-[#6B6052]">{detail}</span>
              </div>
            </li>
          ))}
        </ul>
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
