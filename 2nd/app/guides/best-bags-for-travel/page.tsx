import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Best Pre-Owned Luxury Bags for Travel ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Which luxury bags survive travel? Pre-owned picks for carry-on, weekender, and everyday travel — with real price data.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/guides/best-bags-for-travel' },
}

const CARRY_ON_SLUGS = [
  'louis-vuitton/neverfull-mm',
  'louis-vuitton/speedy-30',
  'louis-vuitton/neverfull-gm',
]

const CROSSBODY_SLUGS = [
  'chanel/wallet-on-chain',
  'gucci/gg-marmont-small',
  'louis-vuitton/pochette-metis',
]

const avoidItems = [
  { label: 'Lambskin leather', detail: 'Scratches from seatbelts, overhead bins, and cab doors. Even light contact leaves marks that are expensive to repair.' },
  { label: 'White or light canvas', detail: 'Shows dirt, transfer dye from denim, and scuffs from every surface it touches. Save it for local use only.' },
  { label: 'Suede', detail: 'Absorbs moisture and stains permanently. Rain, spills, or even humidity in checked luggage will damage it.' },
]

const travelTips = [
  { label: 'Stuff before packing', detail: 'Fill your bag with tissue paper or a small packing cube to hold its shape in luggage. Avoid folding or flattening structured bags.' },
  { label: 'Use the dust bag', detail: 'Always pack your bag in its original dust bag inside your luggage. It protects against transfer and abrasion from other items.' },
  { label: 'Never check a luxury bag', detail: 'Checked baggage is thrown, stacked, and compressed. Always carry your luxury bag in the cabin — most fit under the seat or in overhead bins.' },
  { label: 'Wipe after travel', detail: 'Canvas and treated leather can be wiped clean with a dry microfiber cloth. Do it immediately after travel before dirt sets.' },
]

const faqItems = [
  {
    q: 'Which luxury bag is best for travel?',
    a: 'The LV Neverfull MM is the top travel pick: coated canvas wipes clean, holds its shape, and fits an entire weekend\'s essentials. The LV Speedy 30 is ideal for shorter trips — classic, durable, and ages beautifully. For leather, Chanel\'s caviar GST handles bumps and weather without showing wear. Avoid lambskin on planes.',
  },
  {
    q: 'Can I take a luxury bag as a carry-on?',
    a: 'Yes — most luxury bags fit under the seat or in overhead bins. The LV Neverfull, Chanel GST, and Gucci totes all meet standard airline carry-on dimensions. Never check a luxury bag: checked bags are thrown and stacked, which can permanently damage hardware and structure.',
  },
  {
    q: 'How do I protect a luxury bag while traveling?',
    a: 'Stuff the bag with tissue paper to maintain its shape during packing. Keep it inside its dust bag inside your luggage. Wipe canvas and treated leather with a dry cloth immediately after travel. Avoid direct contact with sunscreen, cosmetics, or perfume.',
  },
  {
    q: 'Are pre-owned luxury bags good for travel?',
    a: 'Pre-owned is ideal for travel — you won\'t stress about minor scuffs the way you would with a brand-new bag. Caviar leather and coated canvas are especially resilient; they clean up easily and improve with age. A very-good-condition Neverfull at $2,400 makes a far more relaxed travel companion than a $2,800 new one.',
  },
]

export default function BestBagsForTravelPage() {
  const allItems = getAllItems()

  const carryOnItems = CARRY_ON_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => !!i && !!i.price_ranges.very_good)

  const crossbodyItems = CROSSBODY_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => !!i && !!i.price_ranges.very_good)

  const allFeatured = [...carryOnItems, ...crossbodyItems]

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
        Best Pre-Owned Luxury Bags for Travel ({PRICE_YEAR})
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated {PRICE_YEAR} · 7 min read</p>

      <p className="text-[#6B6052] leading-relaxed mb-10">
        Not all luxury bags are built for travel. The best travel companions are durable, easy to clean,
        and won&apos;t break your heart if they get scuffed. Canvas and caviar leather survive planes, taxis,
        and cobblestones; lambskin and suede do not.
      </p>

      <section className="mb-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Best Carry-On Bags
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-6">
          The ideal carry-on is structured enough to hold its shape on a full flight, spacious enough for
          essentials, and made from materials that tolerate handling. Coated canvas and caviar leather
          are the two gold standards for travel durability.
        </p>
        {carryOnItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            {carryOnItems.map(item => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
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
                  <p className="text-xs text-[#9C8B7A]">avg. very good</p>
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
          Best Everyday Travel Crossbody
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-6">
          A crossbody keeps your hands free for boarding passes, phones, and coffee. The best travel
          crossbodies have secure zippers (no open-top flaps), compact silhouettes, and adjustable straps.
          These three are consistently the most practical on the secondary market.
        </p>
        {crossbodyItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            {crossbodyItems.map(item => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
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
                  <p className="text-xs text-[#9C8B7A]">avg. very good</p>
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
          What to Avoid
        </h2>
        <ul className="space-y-3">
          {avoidItems.map(({ label, detail }) => (
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

      <section className="mb-12">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Travel Tips
        </h2>
        <ul className="space-y-3">
          {travelTips.map(({ label, detail }) => (
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

      {allFeatured.length > 0 && (
        <section className="mb-12 border border-[#E8E2D9] p-6 bg-white">
          <h2
            className="font-serif text-xl text-[#1A1A1A] mb-5"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            All 6 Travel Picks — Current Prices
          </h2>
          <div className="divide-y divide-[#E8E2D9]">
            {allFeatured.map(item => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
              const savingsPct = item.retail_price_usd > 0
                ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
                : 0
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group flex items-center justify-between py-4 hover:bg-[#FAFAF9] transition-colors px-2 -mx-2"
                >
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#B8954A] mb-0.5">{item.brand}</p>
                    <p className="font-medium text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors">
                      {item.model}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                    {savingsPct > 0 && (
                      <p className="text-xs text-[#4A7A35]">Save {savingsPct}% vs retail</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

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
