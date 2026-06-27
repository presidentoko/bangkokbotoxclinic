import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Celine Pre-Owned Price Guide 2025 | SecondLuxuryItems',
  description: 'Pre-owned Celine prices for the Classic Box, Luggage, Belt Bag and more. Philo-era vs Slimane-era resale comparison, updated weekly.',
  alternates: { canonical: `${BASE}/brands/celine` },
}

const faqs = [
  {
    q: 'Do Phoebe Philo-era Celine bags hold more value than Hedi Slimane-era?',
    a: "Yes, significantly. Philo-era pieces (2008–2018) — especially the Luggage Tote, Belt Bag, and Classic Box Flap — trade at or above their original retail among collectors. The Philo era is now considered a design landmark. Slimane-era pieces are strong in their own right but serve a different aesthetic and have not yet reached the same collector status.",
  },
  {
    q: 'What is the most valuable pre-owned Celine bag?',
    a: 'The Phoebe Philo-era Luggage Tote in rare leathers (python, suede) commands the highest prices. The Classic Box Flap in black box calf is the most consistently valuable everyday piece. Among current-era bags, the Triomphe canvas pieces have built a strong following.',
  },
  {
    q: 'How do I tell Philo-era Celine from Slimane-era?',
    a: "Philo-era bags (pre-2019) use the 'céline' logo with lowercase letters and an accent over the first 'e'. Slimane changed to 'CELINE' in uppercase without an accent. The hardware style also changed — Philo pieces tend to have cleaner, more minimalist closures. The interior serial numbers can be dated by authentication experts.",
  },
  {
    q: 'Is pre-owned Celine a good investment?',
    a: 'Philo-era Celine is a genuine collectible investment — supply is fixed and demand grows as the era recedes. Slimane-era Celine holds value moderately well (40–60% retention) but is not expected to appreciate in the same way. The safest investment pieces are the Classic Box and Luggage in black, white, or camel.',
  },
]

export default function CelineBrandPage() {
  const items = getItemsByBrand('celine').filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pre-Owned Celine Price Guide 2025',
    url: `${BASE}/brands/celine`,
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
        Pre-Owned Celine: Price Guide 2025
      </h1>
      <p className="text-[#8C7355] text-sm mb-6">Updated 2025 · {items.length} models tracked</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          {"Hedi Slimane's Celine and Phoebe Philo's Celine have very different resale profiles. Pre-Philo pieces (Luggage, Phantom, Classic Box) hold better long-term value — the Philo era is now considered one of fashion's great design periods, and these bags have crossed into collectible territory. Slimane-era pieces are well-made and stylish, but serve a different buyer."}
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Pre-Owned Celine Price Table
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
          Philo Era vs Slimane Era
        </h2>
        <p className="text-sm text-[#6B6052] leading-relaxed">
          {"If you're buying as an investment or collector, prioritize Philo-era pieces with original receipts or authentication documentation. The logo difference is the fastest tell: 'céline' (lowercase, accented) is Philo; 'CELINE' (uppercase, no accent) is Slimane. Both eras produce quality goods, but the markets are distinct."}
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
        <Link href="/celine" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          View all Celine models →
        </Link>
      </div>
    </article>
  )
}
