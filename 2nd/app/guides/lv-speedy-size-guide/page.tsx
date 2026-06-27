import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'LV Speedy Size Guide: 20 vs 25 vs 30 vs 35 — Which to Buy Pre-Owned?',
  description:
    'Louis Vuitton Speedy size comparison. Pre-owned prices, dimensions, and which Speedy size is best for everyday use.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/guides/lv-speedy-size-guide' },
}

const faqItems = [
  {
    q: 'Which LV Speedy size is most popular?',
    a: 'The Speedy 30 is the most popular size and the most widely available pre-owned. It fits more than the 25, works as a day-to-evening bag, and has the largest selection on resale platforms. The Speedy 25 is the runner-up for buyers who prefer a smaller silhouette.',
  },
  {
    q: 'What fits in a Speedy 25 vs Speedy 30?',
    a: 'The Speedy 25 fits a small wallet, phone, keys, and lipstick — a true essentials bag. The Speedy 30 fits all of the above plus a small notebook or tablet, sunglasses case, makeup pouch, and a light scarf. The 5cm difference is significant in practice.',
  },
  {
    q: 'Is Speedy 25 or 30 better pre-owned value?',
    a: 'The Speedy 30 is typically the better pre-owned value due to higher supply and demand. More Speedy 30s come to market, so you have more choice on condition and price. The Speedy 25 Bandoulière (with strap) can command slightly higher prices due to the crossbody option.',
  },
]

const sizes = [
  {
    size: '20',
    dimensions: '20 × 13 × 9 cm',
    fits: 'Phone, cards, one small wallet. Very limited — more a collector\'s piece.',
    notes: 'Rare pre-owned. Not practical for daily use.',
    available: false,
  },
  {
    size: '25',
    dimensions: '25 × 19 × 15 cm',
    fits: 'Wallet, phone, keys, lipstick, small sunglasses.',
    notes: 'Great for minimalists. Compact enough for evening use.',
    available: true,
    slug: 'louis-vuitton/speedy-25',
  },
  {
    size: '30',
    dimensions: '30 × 21 × 17 cm',
    fits: 'Everything in the 25, plus a small notebook, makeup pouch, sunglasses case.',
    notes: 'Most popular size. Best availability pre-owned. Recommended for most buyers.',
    available: true,
    slug: 'louis-vuitton/speedy-30',
  },
  {
    size: '35',
    dimensions: '35 × 24 × 17 cm',
    fits: 'Full-day bag: A4 papers, tablet, large wallet, makeup kit.',
    notes: 'Best for travel or heavy packers. Less common pre-owned than 25/30.',
    available: true,
    slug: 'louis-vuitton/speedy-35',
  },
]

export default function LvSpeedySizeGuidePage() {
  const lvItems = getItemsByBrand('louis-vuitton')

  const speedyItems = sizes
    .filter(s => s.available && s.slug)
    .map(s => {
      const item = lvItems.find(i => i.slug === s.slug)
      return { size: s.size, item }
    })
    .filter((s): s is { size: string; item: NonNullable<typeof s.item> } => !!s.item && !!s.item.price_ranges.very_good)

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

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Size Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        LV Speedy Size Guide for Pre-Owned Buyers
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Speedy 20, 25, 30 &amp; 35 compared</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          The Louis Vuitton Speedy is one of the most recognizable bags in the world, first
          introduced in 1930. It comes in four sizes — 20, 25, 30, and 35 — each serving a
          different type of buyer. The Speedy 30 is the runaway bestseller and the easiest to find
          pre-owned in good condition. This guide breaks down every size so you can choose
          the right Speedy before buying.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Size Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal text-xs uppercase tracking-wider">
                  Size
                </th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal text-xs uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal text-xs uppercase tracking-wider">
                  What fits
                </th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal text-xs uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {sizes.map(s => (
                <tr key={s.size} className={s.size === '30' ? 'bg-[#F5F0E8]' : ''}>
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-[#1A1A1A]">Speedy {s.size}</span>
                    {s.size === '30' && (
                      <span className="ml-2 text-xs text-[#B8954A] uppercase tracking-wide">
                        Most popular
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-[#6B6052] whitespace-nowrap">{s.dimensions}</td>
                  <td className="py-3 pr-4 text-[#6B6052]">{s.fits}</td>
                  <td className="py-3 text-[#9C8B7A] text-xs">{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {speedyItems.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-2xl text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Pre-Owned Prices
          </h2>
          <p className="text-[#6B6052] mb-6 text-sm">
            Current average pre-owned prices across authenticated platforms, Very Good condition.
          </p>
          <div className="space-y-3">
            {speedyItems.map(({ size, item }) => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
              const savingsPct = item.retail_price_usd > 0
                ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
                : 0
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group flex items-center justify-between border border-[#E8E2D9] hover:border-[#B8954A] px-5 py-4 transition-all duration-200 bg-white"
                >
                  <div>
                    <p className="font-medium text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors">
                      Speedy {size}
                    </p>
                    <p className="text-xs text-[#9C8B7A] mt-0.5">
                      Retail {formatPrice(item.retail_price_usd)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1A1A1A]">{formatPrice(avg)}</p>
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

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2
          className="text-xl text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Which Speedy Should You Buy?
        </h2>
        <p className="text-[#6B6052] text-sm leading-relaxed mb-4">
          For most buyers, the <strong className="text-[#1A1A1A]">Speedy 30</strong> is the right
          choice. It fits more, has the widest selection pre-owned, and works for both casual and
          dressed-up occasions. Choose the{' '}
          <strong className="text-[#1A1A1A]">Speedy 25</strong> if you prefer a compact bag or plan
          to use it primarily as an evening bag. The{' '}
          <strong className="text-[#1A1A1A]">Speedy 35</strong> is best for heavy packers or those
          who want a bag that works as a weekend overnight bag.
        </p>
        <Link
          href="/louis-vuitton"
          className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
        >
          View all Louis Vuitton models →
        </Link>
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
