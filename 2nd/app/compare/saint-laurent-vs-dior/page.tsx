import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Saint Laurent vs Dior: Pre-Owned Bags 2025 | SecondLuxuryItems',
  description: 'Saint Laurent vs Dior compared — Sac de Jour vs Lady Dior, Loulou vs Saddle. Which Parisian house holds value better pre-owned in 2025.',
  alternates: { canonical: `${BASE}/compare/saint-laurent-vs-dior` },
}

const rows = [
  { aspect: 'Founded', ysl: '1961, Paris (Yves Saint Laurent)', dior: '1946, Paris (Christian Dior)' },
  { aspect: 'Iconic bags', ysl: 'Sac de Jour, Loulou, Lou Camera Bag', dior: 'Lady Dior, Saddle, Book Tote' },
  { aspect: 'Entry pre-owned', ysl: '$650 (Lou Camera Bag)', dior: '$700 (small charm/pouch)' },
  { aspect: 'Mid-range pre-owned', ysl: '$1,500–2,500 (Sac de Jour Small)', dior: '$2,000–3,500 (Lady Dior Small)' },
  { aspect: 'Value retention', ysl: '55–70% (Sac de Jour: 60–75%)', dior: '60–80% (Lady Dior: 70–85%)' },
  { aspect: 'Design director', ysl: 'Anthony Vaccarello (2016–)', dior: 'Maria Grazia Chiuri (2016–)' },
  { aspect: 'Aesthetic', ysl: 'Rock, edge, Parisian cool', dior: 'Romantic, feminine, Parisian elegance' },
  { aspect: 'Best pre-owned buy', ysl: 'Sac de Jour (classic structured tote)', dior: 'Lady Dior Small (lambskin, neutral)' },
]

export default function SaintLaurentVsDiorPage() {
  const yslItems = getItemsByBrand('saint laurent').filter(i => i.price_ranges?.very_good).slice(0, 3)
  const diorItems = getItemsByBrand('dior').filter(i => i.price_ranges?.very_good).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Saint Laurent vs Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Saint Laurent vs Dior: Pre-Owned 2025</h1>
      <p className="text-gray-500 mb-10">Two iconic Parisian houses — very different aesthetics, similar price points. Which is the smarter pre-owned buy?</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Saint Laurent</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Sac de Jour: structured workhorse — understated and professional</li>
            <li>✓ Vaccarello's rock-chic aesthetic has strong followthrough</li>
            <li>✓ Lower entry pre-owned than Dior equivalent</li>
            <li>✓ Cross-gender appeal on some styles (Niki, Lou)</li>
            <li>✗ Lower value retention than Dior overall</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dior</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Lady Dior: ultimate Parisian classic, holds value better</li>
            <li>✓ Higher brand awareness in Asia/Middle East</li>
            <li>✓ Saddle Bag: genuinely iconic silhouette</li>
            <li>✓ Better value retention overall (60–80%)</li>
            <li>✗ Lambskin scratches — condition premium is steep</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Saint Laurent</th>
                <th className="text-left py-3 px-4 font-semibold">Dior</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.ysl}</td>
                  <td className="py-3 px-4 text-gray-600">{row.dior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(yslItems.length > 0 || diorItems.length > 0) && (
        <section className="mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            {yslItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Saint Laurent Pre-Owned</h3>
                {yslItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                    <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                  </div>
                ))}
                <Link href="/brands/saint-laurent" className="text-sm text-blue-600 hover:underline mt-3 block">All YSL →</Link>
              </div>
            )}
            {diorItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dior Pre-Owned</h3>
                {diorItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                    <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                  </div>
                ))}
                <Link href="/brands/dior" className="text-sm text-blue-600 hover:underline mt-3 block">All Dior →</Link>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/saint-laurent-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Céline →</Link>
        <Link href="/compare/dior-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Chanel →</Link>
        <Link href="/brands/saint-laurent" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent Guide →</Link>
      </div>
    </div>
  )
}
