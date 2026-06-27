import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Best First Luxury Bag to Buy Pre-Owned in 2025 | SecondLuxuryItems',
  description: 'The definitive guide to buying your first designer bag second-hand. Resale value, price data, and which bags hold their value best.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/guides/first-luxury-bag' },
}

const TARGET_SLUGS = [
  'louis-vuitton/neverfull-mm',
  'gucci/gg-marmont-small',
  'louis-vuitton/speedy-30',
  'chanel/wallet-on-chain',
]

const faqItems = [
  {
    q: "What is the best first luxury bag to buy used?",
    a: "The LV Neverfull MM or Speedy 30 are the top picks for first-time buyers. Both hold value well (60-80% of retail), are widely available pre-owned, and easy to authenticate. They also work across casual and formal settings."
  },
  {
    q: "Is it worth buying a designer bag pre-owned?",
    a: "Yes — pre-owned luxury saves 20-40% on average versus retail. Chanel in particular has raised prices 60%+ since 2019, meaning pre-owned Chanel often costs less than what buyers paid retail just a few years ago. Buying used can even function as a mild investment for iconic styles."
  },
  {
    q: "Which luxury bags hold their value best?",
    a: "Chanel Classic Flap and Hermès Birkin/Kelly consistently outperform all other handbags in resale retention, often exceeding retail price. Louis Vuitton Monogram typically holds 60-70% of retail, making it reliable for buyers who may resell later."
  },
  {
    q: "What condition should my first pre-owned luxury bag be in?",
    a: "Very Good is the sweet spot for first-time buyers — it means minimal wear (light surface marks on hardware, no structural damage), looks great in use, and costs significantly less than Excellent condition. Avoid 'Good' for your first purchase until you know what to look for."
  },
  {
    q: "How do I know if a pre-owned luxury bag is authentic?",
    a: "Buy from authenticated platforms (Vestiaire Collective, The RealReal) which authenticate every item before listing. For private purchases, use a professional authentication service like Entrupy or LegitGrails. Check date codes, stitching consistency, and hardware weight."
  }
]

export default function FirstLuxuryBagPage() {
  const allItems = getAllItems()
  const featuredItems = TARGET_SLUGS
    .map(slug => allItems.find(i => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => !!i && !!i.price_ranges.very_good && i.retail_price_usd > 0)

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a }
        }))
      })}} />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Buyer&apos;s Guide</p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Your First Pre-Owned Luxury Bag: The Complete Guide (2025)
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated June 2025 · 8 min read</p>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Why Pre-Owned?</h2>
        <p className="text-[#6B6052] leading-relaxed">
          New luxury prices have risen 30–60% since 2019. A Chanel Classic Flap that retailed for $5,200 in 2018 now costs $10,800 new.
          Buying pre-owned saves 20–50% while getting the same item — often with full authentication and a return window.
          The secondary market has also matured significantly: platforms like Vestiaire Collective and The RealReal authenticate
          every listing, making it safer than ever to buy second-hand designer goods.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>The 4 Best First Bags (Data-Driven)</h2>
        <p className="text-[#6B6052] mb-6">
          These picks are chosen for availability, authentication ease, and strong resale value — ideal for first-time buyers.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredItems.map(item => {
            const vg = item.price_ranges.very_good!
            const avg = getAvgPrice(vg)
            const savingsPct = item.retail_price_usd > 0
              ? Math.round(((item.retail_price_usd - avg) / item.retail_price_usd) * 100)
              : 0
            return (
              <Link key={item.slug} href={`/${item.slug}`}
                className="group border border-[#E8E2D9] hover:border-[#B8954A] p-5 transition-all duration-200 bg-white"
              >
                <p className="text-xs tracking-widest uppercase text-[#B8954A] mb-1">{item.brand}</p>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-3 group-hover:text-[#8C7355] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {item.model}
                </h3>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#1A1A1A]">{formatPrice(avg)}</p>
                    <p className="text-xs text-[#9C8B7A]">avg. very good</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#9C8B7A] line-through">{formatPrice(item.retail_price_usd)}</p>
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
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>What to Look For</h2>
        <ul className="space-y-3">
          {[
            { label: "Condition grading", detail: "Stick to Very Good or better for your first purchase. It means minimal wear, no tears, and clean interiors. Good condition is fine once you know what defects are acceptable." },
            { label: "Authentication platform", detail: "Use platforms that authenticate in-house: Vestiaire Collective, The RealReal, or Rebag. Avoid unverified private sellers for your first buy." },
            { label: "Hardware wear", detail: "Gold-tone hardware shows wear around edges and clasps. Some tarnish is expected in Very Good; significant peeling indicates a lower actual condition than listed." },
            { label: "Interior condition", detail: "Check for pen marks, stains, or lipstick residue in the interior photo. A clean interior with minor corner scuffing is ideal." },
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

      <section className="mb-12">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Shop by Budget</h2>
        <p className="text-[#6B6052] mb-5">Not sure where to start? Browse by price range to see every authenticated model available in your budget.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: '/under-500', label: 'Under $500', desc: 'Scarves, belts, wallets' },
            { href: '/under-1000', label: 'Under $1,000', desc: 'Entry bags & accessories' },
            { href: '/under-2000', label: 'Under $2,000', desc: 'Full handbag range' },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href}
              className="border border-[#E8E2D9] hover:border-[#B8954A] p-4 text-center transition-all duration-200 group"
            >
              <p className="font-semibold text-[#1A1A1A] group-hover:text-[#B8954A] transition-colors">{label}</p>
              <p className="text-xs text-[#9C8B7A] mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2 className="font-serif text-2xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
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
