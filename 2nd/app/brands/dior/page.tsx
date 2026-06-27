import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Christian Dior Pre-Owned Price Guide 2025 | SecondLuxuryItems',
  description: "Current pre-owned Dior prices for Lady Dior, Saddle Bag, Book Tote and more. Compare second-hand Dior prices by condition, updated weekly.",
  alternates: { canonical: `${BASE}/brands/dior` },
}

const faqs = [
  {
    q: 'How do I authenticate a pre-owned Lady Dior?',
    a: 'The Lady Dior serial number is stamped on a small oval plate attached to the interior. The cannage quilting stitches should be perfectly uniform — uneven spacing or loose threads are red flags. The Dior charm letters should be heavy, with no flaking finish. Buy only from platforms that provide authentication certificates.',
  },
  {
    q: 'Which Dior bag holds value best pre-owned?',
    a: 'The Lady Dior in classic black lambskin or cannage leather holds value best, consistently selling at 55–75% of retail. The Saddle Bag in Oblique canvas also retains value well. Seasonal prints and limited editions can hold value but are harder to resell due to narrower buyer pools.',
  },
  {
    q: 'Are pre-owned Dior prices rising or falling?',
    a: 'Dior has raised retail prices significantly since 2020, which has widened the pre-owned discount. The pre-owned market has been stable to slightly rising on classic silhouettes (Lady Dior, Saddle). Newer styles like the Caro and Dior Cest Dior command lower resale as trends evolve.',
  },
  {
    q: 'What is the best pre-owned Dior bag to buy on a budget?',
    a: 'The 30 Montaigne is one of the most affordable pre-owned Dior entry points, with Very Good condition pieces often available under $2,000. The Book Tote Small offers great value — wide variation in print designs means some are more affordable than others. The Dway Mule is the lowest-price Dior entry point on the secondary market.',
  },
]

export default function DiorBrandPage() {
  const items = getItemsByBrand('dior').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Dior Price Guide 2025',
    url: `${BASE}/brands/dior`,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${BASE}/${item.slug}`,
      name: `Pre-Owned ${item.brand} ${item.model}`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [itemListSchema, faqSchema] }) }}
      />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Brand Price Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Pre-Owned Dior: Price Guide 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated 2025 · {items.length} models tracked</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {"Christian Dior's pre-owned market is one of the most stable in luxury. The Lady Dior holds value exceptionally well while the Saddle Bag has seen explosive resurgence. Dior has raised retail prices aggressively since 2021, making the pre-owned market increasingly attractive — buyers can access the same quality at 25–45% below current retail on most models."}
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Pre-Owned Dior Price Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Model</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Pre-Owned Avg</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retail</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {items.map(item => {
                const vg = item.price_ranges.very_good!
                const avg = getAvgPrice(vg)
                const savingsPct = Math.round((1 - avg / item.retail_price_usd) * 100)
                return (
                  <tr key={item.id}>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/${item.slug}`}
                        className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors"
                      >
                        {item.model}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPrice(avg)}</td>
                    <td className="py-3 pr-4 text-[#9C8B7A]">{formatPrice(item.retail_price_usd)}</td>
                    <td className={`py-3 font-medium text-sm ${savingsPct > 0 ? 'text-[#4A7A35]' : 'text-[#8C7355]'}`}>
                      {savingsPct > 0 ? `-${savingsPct}%` : `+${Math.abs(savingsPct)}% above retail`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 p-5 border-l-2 border-[#B8954A] bg-[#FAFAF9]">
        <h2
          className="text-lg text-[#1A1A1A] mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Key Buying Advice
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          Lady Dior in cannage lambskin is the most counterfeited Dior bag — buy only from authenticated platforms with documented provenance. Saddle Bag in Oblique canvas is the safer buy: the woven canvas is harder to fake convincingly than smooth leather, and the Saddle has proven long-term cultural staying power since its Y2K resurgence.
        </p>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm">{q}</h3>
              <p className="text-sm text-[#6B6052] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-[#E8E2D9]">
        <Link href="/dior" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          View all Dior models →
        </Link>
      </div>
    </article>
  )
}
