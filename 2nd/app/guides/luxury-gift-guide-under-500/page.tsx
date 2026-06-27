import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsUnderBudget, getAvgPrice, formatPrice } from '@/lib/data'
import type { Category } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Best Pre-Owned Luxury Gifts Under $500 (2025) | SecondLuxuryItems',
  description: 'The best second-hand luxury gifts under $500 — Hermès scarves, designer belts, LV wallets. Authenticated and updated weekly.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/guides/luxury-gift-guide-under-500' },
}

const faqItems = [
  {
    q: 'What luxury gifts can I get under $500?',
    a: 'Hermès Twilly silk scarf ($150-220), LV Card Holder ($180-250), Gucci GG Marmont Belt ($200-300), and Cartier Love Ring small model pre-owned around $400-500.',
  },
  {
    q: 'Is it OK to gift a pre-owned luxury item?',
    a: 'Absolutely — on authenticated platforms, items are professionally cleaned and verified. Many recipients prefer the value: same item, 30-50% less.',
  },
  {
    q: 'What\'s the most recognizable luxury gift under $500?',
    a: 'Hermès Twilly ($150-220 pre-owned) — universally recognized orange box, instantly impressive, wraps beautifully around bag handles.',
  },
  {
    q: 'Do pre-owned luxury gifts come in boxes?',
    a: 'Most authenticated resale platforms ship with original dust bags and boxes when available. Check the listing details — "comes with box" is usually noted.',
  },
]

const GIFT_CATEGORIES: { label: string; desc: string; categories: Category[] }[] = [
  {
    label: 'For Her',
    desc: 'Scarves, jewelry & small leather goods',
    categories: ['scarves', 'jewelry', 'small-leather-goods'],
  },
  {
    label: 'For Him',
    desc: 'Belts, wallets & accessories',
    categories: ['belts', 'small-leather-goods'],
  },
  {
    label: 'Universal',
    desc: 'Scarves, card holders & accessories',
    categories: ['scarves', 'small-leather-goods', 'belts'],
  },
]

export default function LuxuryGiftGuideUnder500Page() {
  const allItems = getItemsUnderBudget(500)

  const giftItems = allItems.slice(0, 8)

  const herItems = allItems
    .filter(i => ['scarves', 'jewelry', 'small-leather-goods'].includes(i.category))
    .slice(0, 3)

  const himItems = allItems
    .filter(i => ['belts', 'small-leather-goods'].includes(i.category))
    .slice(0, 3)

  const universalItems = allItems
    .filter(i => ['scarves', 'small-leather-goods', 'belts'].includes(i.category))
    .slice(0, 3)

  const sections = [
    { label: 'For Her', desc: 'Scarves, jewelry & small leather goods', items: herItems },
    { label: 'For Him', desc: 'Belts, wallets & accessories', items: himItems },
    { label: 'Universal', desc: 'Scarves, card holders & accessories', items: universalItems },
  ]

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

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Gift Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Best Pre-Owned Luxury Gifts Under $500
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Authenticated weekly</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Gift-giving made luxurious — these authenticated pre-owned pieces from Hermès, Louis
          Vuitton, and Cartier all come in under $500 and look indistinguishable from new. Buying
          pre-owned saves 30-50% on average, meaning you can afford a genuinely impressive gift
          without overspending. Every item below is sourced from platforms that authenticate each
          piece before listing.
        </p>
      </section>

      {sections.map(({ label, desc, items }) =>
        items.length > 0 ? (
          <section key={label} className="mb-10">
            <h2
              className="text-2xl text-[#1A1A1A] mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {label}
            </h2>
            <p className="text-[#8C7355] text-sm mb-5">{desc}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map(item => {
                const vg = item.price_ranges.very_good!
                const avg = getAvgPrice(vg)
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
                        <p className="text-xs text-[#9C8B7A]">avg. very good</p>
                      </div>
                      <div className="text-right">
                        {item.retail_price_usd > 0 && (
                          <p className="text-sm text-[#9C8B7A] line-through">
                            {formatPrice(item.retail_price_usd)}
                          </p>
                        )}
                        {savingsPct > 0 && (
                          <p className="text-sm font-semibold text-[#4A7A35]">
                            Save {savingsPct}%
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : null,
      )}

      {giftItems.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-2xl text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            All Gifts Under $500
          </h2>
          <p className="text-[#6B6052] mb-6 text-sm">
            {allItems.length} authenticated items available under $500.
          </p>
          <div className="space-y-3">
            {giftItems.map(item => {
              const vg = item.price_ranges.very_good!
              const avg = getAvgPrice(vg)
              const retainPct =
                item.retail_price_usd > 0
                  ? Math.round((avg / item.retail_price_usd) * 100)
                  : null
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group flex items-center justify-between border border-[#E8E2D9] hover:border-[#B8954A] px-5 py-4 transition-all duration-200 bg-white"
                >
                  <div>
                    <p className="font-medium text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors">
                      {item.brand} {item.model}
                    </p>
                    <p className="text-xs text-[#9C8B7A] mt-0.5 capitalize">
                      {item.category.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1A1A1A]">{formatPrice(avg)}</p>
                    {retainPct !== null && (
                      <p className="text-xs text-[#4A7A35]">{retainPct}% of retail</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="mt-4">
            <Link
              href="/under-500"
              className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
            >
              Browse all pre-owned luxury under $500 →
            </Link>
          </div>
        </section>
      )}

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Why Pre-Owned Luxury Makes a Perfect Gift
        </h2>
        <ul className="space-y-3">
          {[
            {
              label: 'Same item, less cost',
              detail:
                'Authenticated pre-owned luxury is identical to new. The only difference is 30-50% savings.',
            },
            {
              label: 'Professionally authenticated',
              detail:
                'Platforms like Vestiaire Collective and The RealReal verify every item. No risk of counterfeits.',
            },
            {
              label: 'Sustainable choice',
              detail:
                'Pre-owned luxury extends the life of goods already produced — a meaningful consideration for eco-conscious recipients.',
            },
          ].map(({ label, detail }) => (
            <li key={label} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#B8954A] shrink-0" />
              <div>
                <span className="font-medium text-[#1A1A1A]">{label}: </span>
                <span className="text-[#6B6052] text-sm">{detail}</span>
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
