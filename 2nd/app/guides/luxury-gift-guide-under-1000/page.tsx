import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsUnderBudget, getAvgPrice, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: `Best Pre-Owned Luxury Gifts Under $1,000 (${PRICE_YEAR}) | SecondLuxuryItems`,
  description: 'The best second-hand luxury gifts under $1,000 — LV Speedy, Gucci Marmont, Hermès belts. Authenticated and updated weekly.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/guides/luxury-gift-guide-under-1000' },
}

const faqItems = [
  {
    q: 'What luxury gifts can I get under $1,000?',
    a: 'Hermès H Belt ($800-900), LV Neverfull MM ($2,000+) is over budget, but LV Sarah Wallet ($395), Gucci GG Marmont Belt ($500-550), and Louis Vuitton Bandeau Silk Scarf ($540) all sit under $1,000 pre-owned.',
  },
  {
    q: 'What\'s the best luxury gift for a girlfriend under $1,000?',
    a: 'Hermès H Belt or a Louis Vuitton wallet are consistently the most appreciated — instantly recognizable, practical for daily use, and look impressive on any occasion.',
  },
  {
    q: 'What\'s a good luxury anniversary gift under $1,000?',
    a: 'A Hermès belt or LV Bandeau silk scarf makes a meaningful anniversary gift — both have long shelf lives, hold value well, and carry the prestige of iconic French luxury houses.',
  },
  {
    q: 'Is pre-owned luxury under $1,000 worth buying as a gift?',
    a: 'Absolutely. At this price point you can gift an authentic Hermès or Louis Vuitton piece with strong resale value. Pre-owned saves 30-50% versus retail — meaning more impressive gifts for the same budget.',
  },
]

export default function LuxuryGiftGuideUnder1000Page() {
  const allItems = getItemsUnderBudget(1000)

  const handbagItems = allItems.filter(i => i.category === 'handbags').slice(0, 3)
  const scarveItems = allItems.filter(i => i.category === 'scarves').slice(0, 3)
  const beltItems = allItems.filter(i => i.category === 'belts').slice(0, 3)
  const leatherItems = allItems.filter(i => i.category === 'small-leather-goods').slice(0, 3)
  const shoeItems = allItems.filter(i => i.category === 'shoes').slice(0, 3)

  const sections = [
    { label: 'Handbags', desc: 'The ultimate luxury gift — pre-owned bags under $1,000', items: handbagItems },
    { label: 'Silk Scarves', desc: 'Hermès and LV scarves: iconic, wearable, and effortlessly impressive', items: scarveItems },
    { label: 'Belts', desc: 'Designer belts: a practical luxury gift that works for every occasion', items: beltItems },
    { label: 'Small Leather Goods', desc: 'Wallets and card holders from the world\'s top houses', items: leatherItems },
    { label: 'Shoes', desc: 'Designer heels and mules for special occasions', items: shoeItems },
  ].filter(s => s.items.length > 0)

  const allGiftItems = allItems.slice(0, 8)

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
        Best Pre-Owned Luxury Gifts Under $1,000
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · Authenticated weekly</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          At $1,000 the pre-owned luxury gift market opens significantly. You can reach Hermès
          belts, Louis Vuitton wallets and scarves, Gucci bags, and even entry watches. Every item
          below is sourced from authenticated resale platforms — indistinguishable from new, verified
          before listing, and typically 30-50% below original retail price.
        </p>
      </section>

      {sections.map(({ label, desc, items }) => (
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
                        <p className="text-sm font-semibold text-[#4A7A35]">Save {savingsPct}%</p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          All Gift Options Under $1,000
        </h2>
        <p className="text-[#6B6052] mb-6 text-sm">
          {allItems.length} authenticated items available under $1,000 in very good condition.
        </p>
        <div className="space-y-3">
          {allGiftItems.map(item => {
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
            href="/under-1000"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
          >
            Browse all pre-owned luxury under $1,000 →
          </Link>
        </div>
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Gift Buying Tips
        </h2>
        <ul className="space-y-3">
          {[
            {
              label: 'Stick to timeless pieces',
              detail:
                'LV Monogram and Hermès H Belt never go out of style. Avoid fashion-forward pieces as gifts — personal style varies.',
            },
            {
              label: 'Choose very good condition',
              detail:
                'For gifting, stick to Very Good or better. The item should look pristine to the recipient.',
            },
            {
              label: 'Check if box is included',
              detail:
                'Original box and dust bag elevate the gifting experience. Filter by listings that include original packaging.',
            },
            {
              label: 'Buy early — inventory moves fast',
              detail:
                'Pre-owned luxury inventory is single-item. If you see the right piece, move quickly — it may not be available next week.',
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
