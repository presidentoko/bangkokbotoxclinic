import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Best Pre-Owned Luxury Work Bags 2025 | SecondLuxuryItems',
  description: 'The best pre-owned luxury bags for work — structured totes, professional crossbodies, and materials that last. Real price data for every pick.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/guides/best-bags-for-work' },
}

const TOTE_SLUGS = [
  'louis-vuitton/neverfull-gm',
  'prada/galleria-medium',
  'louis-vuitton/onthego-mm',
]

const CROSSBODY_SLUGS = [
  'chanel/boy-bag-medium',
  'gucci/dionysus-gg-supreme',
  'celine/classic-box',
]

const materialsData = [
  {
    label: 'Caviar leather (Chanel)',
    detail: 'The most durable Chanel leather — pebbled texture resists scratches and scuffs. Ideal for daily commuting. Holds shape perfectly in a briefcase or tote bag.',
  },
  {
    label: 'Saffiano leather (Prada)',
    detail: 'Cross-hatch treatment makes it nearly indestructible. Resists water, stains, and scratches. The Prada Galleria in Saffiano is the benchmark for professional bags.',
  },
  {
    label: 'Coated canvas (Louis Vuitton)',
    detail: 'Wipes clean with a damp cloth, maintains structure through daily use, and ages beautifully. The Neverfull GM has been a corporate staple for decades.',
  },
  {
    label: 'Avoid: Lambskin for daily use',
    detail: 'Lambskin is too delicate for commuting — chair backs, desk edges, and overcrowded trains will mark it. Reserve it for evenings or special occasions.',
  },
]

const faqItems = [
  {
    q: 'What is the best luxury bag for work?',
    a: 'For structure and capacity, the LV Neverfull GM fits a 13" laptop, folders, and daily essentials without losing shape. The Prada Galleria in Saffiano is the gold standard for professional polish — it survives years of daily use with minimal care. For something sleeker, the Chanel Boy Bag in caviar leather works for client-facing roles where a smaller silhouette is appropriate.',
  },
  {
    q: 'Does a luxury work bag fit a laptop?',
    a: 'The LV Neverfull GM and OnTheGo MM both comfortably fit a 13–14" laptop sleeve. The Prada Galleria Medium fits most 13" laptops. Crossbodies like the Chanel Boy or Celine Classic Box are too small for laptops but work well alongside a tote for commuting.',
  },
  {
    q: 'Which luxury bag material is best for daily use?',
    a: 'Saffiano leather (Prada) and caviar leather (Chanel) are the two most resilient materials for everyday wear. Both resist scratches and maintain their appearance through years of daily commuting. LV coated canvas is equally durable and the easiest to clean. Avoid smooth calfskin and lambskin for daily use — they mark easily.',
  },
  {
    q: 'Is a pre-owned luxury work bag worth it?',
    a: 'Pre-owned makes especially strong sense for a work bag — you won\'t hesitate to use it every day. A very-good-condition Prada Galleria at $900–$1,200 will last 5–10 years with basic care, making the cost-per-use competitive with any contemporary bag. Saffiano leather in particular is nearly maintenance-free.',
  },
]

export default function BestBagsForWorkPage() {
  const allItems = getAllItems()

  const toteItems = TOTE_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => !!i && !!i.price_ranges.very_good)

  const crossbodyItems = CROSSBODY_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => !!i && !!i.price_ranges.very_good)

  const allFeatured = [...toteItems, ...crossbodyItems]

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
        className="font-serif text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Best Pre-Owned Luxury Bags for Work (2025)
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated June 2025 · 7 min read</p>

      <p className="text-[#6B6052] leading-relaxed mb-10">
        A luxury work bag makes every commute feel intentional. The best combine structure, capacity,
        and polish — fitting a laptop or documents without losing shape, and looking as sharp at a
        Friday meeting as on Monday morning.
      </p>

      <section className="mb-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Best Structured Totes
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-6">
          A work tote needs to fit more than a handbag but look more refined than a backpack. These
          three consistently top the list for capacity, structure, and pre-owned availability. All
          can carry a laptop sleeve, documents, and daily essentials without bulging.
        </p>
        {toteItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            {toteItems.map(item => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
              const savingsPct = item.retail_price_usd > 0
                ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
                : 0
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group border border-[#E8E2D9] hover:border-[#B8954A] p-5 transition-all duration-200 bg-white"
                >
                  <p className="text-xs tracking-widest uppercase text-[#B8954A] mb-1">{item.brand}</p>
                  <h3
                    className="font-serif text-base text-[#1A1A1A] mb-3 group-hover:text-[#8C7355] transition-colors"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {item.model}
                  </h3>
                  <p className="text-xl font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                  {savingsPct > 0 && (
                    <p className="text-xs text-[#4A7A35] mt-0.5">Save {savingsPct}% vs retail</p>
                  )}
                  <p className="text-xs text-[#9C8B7A] mt-0.5">avg. very good</p>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Best Work Crossbodies
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-6">
          A work crossbody pairs with a tote on crowded commutes or stands alone for lighter days and
          client meetings. The best are compact enough to not overwhelm a professional look but
          structured enough to hold shape all day. All three picks below are hands-free and secure.
        </p>
        {crossbodyItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            {crossbodyItems.map(item => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
              const savingsPct = item.retail_price_usd > 0
                ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
                : 0
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group border border-[#E8E2D9] hover:border-[#B8954A] p-5 transition-all duration-200 bg-white"
                >
                  <p className="text-xs tracking-widest uppercase text-[#B8954A] mb-1">{item.brand}</p>
                  <h3
                    className="font-serif text-base text-[#1A1A1A] mb-3 group-hover:text-[#8C7355] transition-colors"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {item.model}
                  </h3>
                  <p className="text-xl font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                  {savingsPct > 0 && (
                    <p className="text-xs text-[#4A7A35] mt-0.5">Save {savingsPct}% vs retail</p>
                  )}
                  <p className="text-xs text-[#9C8B7A] mt-0.5">avg. very good</p>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Materials for Daily Use
        </h2>
        <ul className="space-y-3">
          {materialsData.map(({ label, detail }) => (
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

      <section className="mb-12 border border-[#E8E2D9] p-6 bg-white">
        <h2
          className="font-serif text-xl text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Price vs Value
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          A pre-owned work bag at $500–1,500 will last 5–10 years with basic care — making the
          cost-per-use far lower than most contemporary alternatives. Saffiano and caviar leather
          require almost no maintenance beyond occasional conditioning. Canvas wipes clean with a
          damp cloth.
        </p>
        {allFeatured.length > 0 && (
          <div className="divide-y divide-[#E8E2D9] mt-4">
            {allFeatured.map(item => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group flex items-center justify-between py-3 hover:bg-[#FAFAF9] transition-colors px-2 -mx-2"
                >
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#B8954A] mb-0.5">{item.brand}</p>
                    <p className="font-medium text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors text-sm">
                      {item.model}
                    </p>
                  </div>
                  <p className="font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-6"
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
