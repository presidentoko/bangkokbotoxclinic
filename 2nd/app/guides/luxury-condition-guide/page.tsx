import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pre-Owned Luxury Condition Guide: Excellent vs Very Good vs Good | SecondLuxuryItems',
  description:
    'What do luxury resale condition grades mean? Understand Excellent, Very Good, and Good conditions before buying pre-owned designer.',
  alternates: { canonical: 'https://www.secondluxuryitems.com/guides/luxury-condition-guide' },
}

const faqItems = [
  {
    q: "What is 'Very Good' condition on Vestiaire?",
    a: 'Very Good means the item shows light signs of use but no major flaws — slight hardware wear or light marks in the interior are acceptable. It is the most popular condition grade because it offers the best balance of price and appearance.',
  },
  {
    q: 'Should I buy Excellent or Very Good condition?',
    a: 'Very Good is usually the better value. You save an extra 10-20% compared to Excellent for differences that are difficult to notice during everyday use. Unless the item is a gift or you plan to resell immediately, Very Good is the practical choice.',
  },
  {
    q: 'What condition should a luxury bag be in to resell?',
    a: 'Very Good or better for smooth, fast resale. Excellent condition bags command premium prices and sell quickly on all platforms. Good condition bags can sell but attract lower offers and may sit longer — price them 15-25% below similar Very Good listings.',
  },
  {
    q: 'How do I know if a pre-owned bag condition matches the listing?',
    a: 'Buy from platforms with authentication and condition guarantees, like Vestiaire Collective or The RealReal. Review all provided photos carefully — especially hardware corners, strap attachment points, and interior shots. Both platforms offer returns if condition is misrepresented.',
  },
]

const grades = [
  {
    grade: 'Excellent',
    label: 'Grade A',
    color: '#4A7A35',
    priceRange: '85–95% of retail',
    description:
      'Barely worn with no visible flaws. Hardware is bright with no scratches or tarnish. Exterior shows no wear marks or scuffing. Interior is pristine — clean lining, no pen marks or staining. Original tags, dust bag, or authenticity cards may still be present.',
    bestFor: 'Gifts, investment pieces you plan to resell, pieces you want to keep long-term.',
    details: [
      'No hardware scratches or tarnish',
      'Exterior shows no scuffing or color transfer',
      'Interior clean and unmarked',
      'Corners intact with no wear',
    ],
  },
  {
    grade: 'Very Good',
    label: 'Grade B — The Sweet Spot',
    color: '#B8954A',
    priceRange: '60–80% of retail',
    description:
      'Light wear consistent with normal use. Hardware may show minor wear around edges or clasps — not flaking, just light use marks. Interior may have light surface marks (faint pen lines, light lipstick trace). Overall appearance is strong; the bag looks great in use.',
    bestFor: 'Everyday use, first luxury purchase, best value for your money.',
    details: [
      'Hardware may show light edge wear',
      'Corners may have slight softening',
      'Interior: light marks acceptable',
      'No tears, stains, or structural issues',
    ],
  },
  {
    grade: 'Good',
    label: 'Grade C',
    color: '#8C7355',
    priceRange: '40–60% of retail',
    description:
      'Visible wear that is consistent with regular use over time. May include scratched hardware, corner wear, fading on handles or straps, or marks in the interior. The bag is still fully functional with no structural damage. A Good condition piece is ideal for buyers who prioritize price over appearance.',
    bestFor: 'Budget-conscious buyers, daily use where cosmetic wear is acceptable.',
    details: [
      'Visible hardware scratches or oxidation',
      'Corner wear visible on exterior',
      'Interior may have stains or marks',
      'Still structurally sound — no tears or damage',
    ],
  },
]

export default function LuxuryConditionGuidePage() {
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
        Pre-Owned Luxury Condition Guide: What the Grades Actually Mean
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · 5 min read</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Condition grades are the single biggest factor in pre-owned luxury pricing — after brand
          and model. A Chanel Classic Flap in Excellent condition might sell for $7,500; the same
          bag in Good condition might list at $4,500. Understanding what each grade actually means
          in practice helps you buy confidently and avoid overpaying or being surprised when your
          purchase arrives.
        </p>
      </section>

      <section className="mb-12 space-y-6">
        {grades.map(g => (
          <div key={g.grade} className="border border-[#E8E2D9] bg-white">
            <div className="border-l-4 px-6 py-5" style={{ borderColor: g.color }}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-xl font-semibold text-[#1A1A1A]">{g.grade} Condition</h2>
                <span className="text-xs uppercase tracking-wider text-[#9C8B7A]">{g.label}</span>
              </div>
              <p className="text-[#6B6052] leading-relaxed mb-4">{g.description}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-2">What to expect</p>
                  <ul className="space-y-1">
                    {g.details.map(d => (
                      <li key={d} className="flex gap-2 text-sm text-[#6B6052]">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-2">Price vs retail</p>
                  <p className="text-lg font-semibold text-[#1A1A1A] mb-2">{g.priceRange}</p>
                  <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-1">Best for</p>
                  <p className="text-sm text-[#6B6052]">{g.bestFor}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-12">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Condition at a Glance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal text-xs uppercase tracking-wider w-32">
                  Detail
                </th>
                <th className="text-left py-3 pr-4 text-[#4A7A35] font-semibold">Excellent</th>
                <th className="text-left py-3 pr-4 text-[#B8954A] font-semibold">Very Good</th>
                <th className="text-left py-3 text-[#8C7355] font-semibold">Good</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {[
                {
                  label: 'Hardware',
                  ex: 'No scratches',
                  vg: 'Light wear',
                  g: 'Visible wear',
                },
                {
                  label: 'Corners',
                  ex: 'Perfect',
                  vg: 'May have slight wear',
                  g: 'Corner wear visible',
                },
                {
                  label: 'Interior',
                  ex: 'Pristine',
                  vg: 'Light marks OK',
                  g: 'Stains or marks',
                },
                {
                  label: 'Price vs retail',
                  ex: '−10 to −20%',
                  vg: '−25 to −45%',
                  g: '−50 to −65%',
                },
              ].map(row => (
                <tr key={row.label}>
                  <td className="py-3 pr-4 text-[#9C8B7A] text-xs uppercase tracking-wider">
                    {row.label}
                  </td>
                  <td className="py-3 pr-4 text-[#1A1A1A]">{row.ex}</td>
                  <td className="py-3 pr-4 text-[#1A1A1A]">{row.vg}</td>
                  <td className="py-3 text-[#1A1A1A]">{row.g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12 bg-[#F5F0E8] border border-[#E8E2D9] p-6">
        <h2
          className="text-xl text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Our Recommendation
        </h2>
        <p className="text-[#6B6052] text-sm leading-relaxed mb-4">
          For most buyers, <strong className="text-[#1A1A1A]">Very Good</strong> is the sweet spot.
          The price saving over Excellent is typically 10-20%, and the visible difference in real
          use is minimal. Only go Excellent if you are buying as a gift, plan to resell soon, or
          want an investment-grade piece. Only consider Good if budget is the primary driver and
          you are comfortable with visible wear.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/value-guide"
            className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors border border-[#B8954A] px-4 py-2"
          >
            Value Guide →
          </Link>
          <Link
            href="/guides/first-luxury-bag"
            className="text-sm text-[#8C7355] hover:text-[#B8954A] transition-colors border border-[#E8E2D9] px-4 py-2"
          >
            First Luxury Bag Guide →
          </Link>
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

      <nav className="mt-10 pt-6 border-t border-[#E8E2D9]">
        <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-3">Related Guides</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/value-guide" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Value Guide →</Link>
          <Link href="/under-500" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Under $500 →</Link>
          <Link href="/under-1000" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Under $1,000 →</Link>
          <Link href="/guides/how-to-authenticate-chanel" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Authentication Guide →</Link>
        </div>
      </nav>
    </article>
  )
}
