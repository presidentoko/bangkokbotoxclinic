import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: '10 Most Iconic Luxury Bags to Buy Pre-Owned in 2025 | SecondLuxuryItems',
  description:
    'The 10 most iconic designer bags to buy pre-owned: Chanel Classic Flap, Hermès Birkin, LV Neverfull. Pre-owned prices, savings vs retail, and why each is iconic.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/most-iconic-bags-to-buy-used',
  },
}

const ICONIC_SLUGS = [
  'chanel/classic-flap-medium',
  'hermes/birkin-30',
  'hermes/kelly-28',
  'chanel/boy-bag-medium',
  'louis-vuitton/neverfull-mm',
  'dior/lady-dior-medium',
  'louis-vuitton/pochette-metis',
  'gucci/gg-marmont-medium',
  'louis-vuitton/speedy-30',
  'chanel/wallet-on-chain',
]

const iconicNotes: Record<string, string> = {
  'chanel/classic-flap-medium':
    'The definitive status bag. Designed by Coco Chanel in 1955, relaunched by Karl Lagerfeld in 1983. The double-flap closure, quilted lambskin or caviar leather, and chain strap have never changed meaningfully in 70 years.',
  'hermes/birkin-30':
    'The most valuable handbag in the world. Born from a chance meeting between Jane Birkin and Hermès CEO Jean-Louis Dumas on an Air France flight in 1984. Retail waiting lists can stretch years. Pre-owned Birkins consistently trade above retail.',
  'hermes/kelly-28':
    "Named after Grace Kelly, who used it to shield her pregnancy from paparazzi in 1956. A structured top-handle bag with a turn-lock closure, the Kelly is Hermès's oldest production design and remains among its most coveted.",
  'chanel/boy-bag-medium':
    "Karl Lagerfeld's 2011 tribute to Boy Capel, Coco Chanel's great love. The rectangular shape, chunky chain, and push-lock closure made it the modern alternative to the Classic Flap. Now a secondary market staple.",
  'louis-vuitton/neverfull-mm':
    "The world's best-selling tote. Simple, functional, and immediately recognizable. LV Monogram or Damier canvas. The MM size fits a laptop. Nearly indestructible. One of the easiest luxury bags to resell.",
  'dior/lady-dior-medium':
    'Created in 1994 and given to Princess Diana the same year, who carried it everywhere afterward. The Cannage quilting, "D-I-O-R" letter charms, and structured shape are instantly recognizable worldwide.',
  'louis-vuitton/pochette-metis':
    "The structured semi-chain bag that became LV's most waitlisted piece from 2017-2023. Front pocket organization and crossbody wear make it one of LV's most functional designs. Pre-owned prices held near retail for years.",
  'gucci/gg-marmont-medium':
    "Alessandro Michele's 2016 design that defined Gucci's maximalist revival. The chevron quilting and oversized GG logo turn-lock became the Instagram bag of the late 2010s. A snapshot of a specific moment in luxury fashion.",
  'louis-vuitton/speedy-30':
    "The original LV bag for everyone — designed in 1930 at the request of Audrey Hepburn for an everyday handbag. The cylindrical shape, vachetta handles, and Monogram canvas remain unchanged. Lowest-priced entry point into LV bags.",
  'chanel/wallet-on-chain':
    "The entry-point Chanel piece that functions as a bag. Compact enough to wear across the body, large enough for essentials. The WOC occupies a unique position: lower-priced Chanel, but still instantly recognizable.",
}

const faqItems = [
  {
    q: 'Which iconic luxury bags hold their value best?',
    a: 'Hermès Birkin and Kelly consistently appreciate above retail. Chanel Classic Flap holds near or above retail due to Chanel\'s frequent price increases. Louis Vuitton Neverfull and Speedy hold 60-75% of retail, making them reliable value-retention pieces.',
  },
  {
    q: 'What is the most affordable iconic luxury bag to buy pre-owned?',
    a: 'The Louis Vuitton Speedy 30 is the most affordable entry point among iconic bags — pre-owned in very good condition from around $600-900. The Chanel Wallet on Chain is the most affordable Chanel piece, typically $1,400-2,000 pre-owned.',
  },
  {
    q: 'Is the Hermès Birkin worth buying pre-owned?',
    a: 'Yes, but with preparation. Birkins trade above retail on the secondary market — you will pay a premium over what original buyers paid. But buying pre-owned is often the only way to access one, given retail waiting lists. Stick to authenticated sellers like Vestiaire or specialist Hermès resellers.',
  },
  {
    q: 'Are these bags easy to authenticate pre-owned?',
    a: 'Chanel and Louis Vuitton have well-documented authentication tells covered in our separate guides. Hermès authentication is more complex — always use a specialist or authentication service for Hermès purchases. Dior and Gucci authentication is moderately straightforward from our guides.',
  },
]

export default function MostIconicBagsPage() {
  const allItems = getAllItems()
  const iconicItems = ICONIC_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => {
      if (!i) return false
      return !!(i.price_ranges.very_good ?? i.price_ranges.excellent ?? i.price_ranges.good)
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
        10 Most Iconic Luxury Bags to Buy Pre-Owned in 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · 9 min read</p>

      <p className="text-[#6B6052] leading-relaxed mb-10">
        Certain bags transcend seasons. They defined decades, carried by cultural figures who made
        them part of fashion history. These ten bags are worth buying pre-owned because they are as
        relevant today as they were when introduced — and most hold value better than the broader
        luxury market.
      </p>

      <div className="space-y-8">
        {iconicItems.map((item, idx) => {
          const range =
            item.price_ranges.very_good ??
            item.price_ranges.excellent ??
            item.price_ranges.good!
          const avg = getAvgPrice(range)
          const savingsPct =
            item.retail_price_usd > 0
              ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
              : 0
          const note = iconicNotes[item.slug]

          return (
            <div
              key={item.slug}
              className="border border-[#E8E2D9] p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">
                    {idx + 1}. {item.brand}
                  </p>
                  <h2
                    className="text-xl text-[#1A1A1A]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {item.model}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                  {item.retail_price_usd > 0 && (
                    <p className="text-xs text-[#9C8B7A] line-through">{formatPrice(item.retail_price_usd)} retail</p>
                  )}
                  {savingsPct > 0 && (
                    <p className="text-xs font-semibold text-[#4A7A35]">Save {savingsPct}%</p>
                  )}
                  {savingsPct < 0 && (
                    <p className="text-xs text-[#9C8B7A]">Trades above retail</p>
                  )}
                </div>
              </div>
              {note && <p className="text-sm text-[#6B6052] leading-relaxed mb-4">{note}</p>}
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
