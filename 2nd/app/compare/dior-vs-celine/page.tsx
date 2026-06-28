import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Dior vs Céline: Pre-Owned Comparison 2025 | SecondLuxuryItems',
  description: 'Dior vs Céline — Lady Dior vs Luggage/16, value retention, resale. Two leading Parisian houses compared for pre-owned buyers in 2025.',
  alternates: { canonical: `${BASE}/compare/dior-vs-celine` },
}

const rows = [
  { aspect: 'Founded', dior: '1946, Paris', celine: '1945, Paris (relaunched under Philo, then Slimane)' },
  { aspect: 'Iconic bag (current)', dior: 'Lady Dior, Book Tote, Saddle Bag', celine: 'Luggage Tote, 16, Triomphe chain' },
  { aspect: 'Design aesthetic', dior: 'Romantic, embellished, logo-heavy options', celine: 'Minimalist (Philo era) or sleek rock (Slimane era)' },
  { aspect: 'Pre-owned entry', dior: '$450 (Dior Signature belt, accessories)', celine: '$350 (small leather goods, Triomphe wallets)' },
  { aspect: 'Bag pre-owned range', dior: '$900–8,000+ (Lady Dior nano to medium)', celine: '$600–2,500 (Luggage nano to medium)' },
  { aspect: 'Value retention', dior: '55–75% (Lady Dior); Saddle varies by era', celine: '45–65% (Luggage); Philo-era pieces premium' },
  { aspect: 'Most sought piece', dior: 'Lady Dior Medium (lambskin, classic colors)', celine: 'Luggage Tote (Philo era) — commands premiums' },
  { aspect: 'Best for resale', dior: 'Lady Dior in black/tan/navy lambskin', celine: 'Philo-era pieces (2010–2018) — niche but strong' },
]

export default function DiorVsCelinePage() {
  const diorItems = getItemsByBrand('dior').filter(i => i.price_ranges?.very_good).slice(0, 2)
  const celineItems = getItemsByBrand('celine').filter(i => i.price_ranges?.very_good).slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Céline</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dior vs Céline Pre-Owned: 2025 Comparison</h1>
      <p className="text-gray-500 mb-10">Two Parisian giants with very different aesthetics. Dior is romantic and embellished; Céline (under Phoebe Philo) built a cult following for minimalism. Here's how they compare pre-owned.</p>

      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Aspect</th>
              <th className="text-left py-3 px-4 font-semibold">Dior</th>
              <th className="text-left py-3 px-4 font-semibold">Céline</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.dior}</td>
                <td className="py-3 px-4 text-gray-600">{row.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>The Philo factor:</strong> Phoebe Philo's era at Céline (2008–2018) created some of the most sought pre-owned pieces — Luggage, Belt, and Trapeze bags from those years trade at premiums well above later pieces. When buying Céline pre-owned, "Philo era" is a specific and meaningful designation.
      </div>

      {(diorItems.length > 0 || celineItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {diorItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Dior Pre-Owned</h3>
              {diorItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
          {celineItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Céline Pre-Owned</h3>
              {celineItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Pre-Owned →</Link>
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Céline Pre-Owned →</Link>
        <Link href="/compare/saint-laurent-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent vs Céline →</Link>
        <Link href="/compare/dior-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Chanel →</Link>
      </div>
    </div>
  )
}
