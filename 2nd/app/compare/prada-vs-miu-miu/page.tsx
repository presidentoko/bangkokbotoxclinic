import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Prada vs Miu Miu: Which Pre-Owned Bag 2025 | SecondLuxuryItems',
  description: 'Prada vs Miu Miu — sister brands from the same group but very different pre-owned markets. Re Nylon vs Wander Bag, value retention, which to buy.',
  alternates: { canonical: `${BASE}/compare/prada-vs-miu-miu` },
}

const rows = [
  { aspect: 'Relationship', prada: 'Parent brand (founded 1913)', miumiu: 'Younger sister brand (founded 1993)' },
  { aspect: 'Designer', prada: 'Miuccia Prada + Raf Simons (2024–)', miumiu: 'Miuccia Prada solo' },
  { aspect: 'Aesthetic', prada: 'Intellectual, minimal, provocative', miumiu: 'Girly, playful, youthful' },
  { aspect: 'Iconic bags', prada: 'Galleria, Re-Nylon, Cleo, Arqué', miumiu: 'Wander, Arqué, Matelassé Clutch' },
  { aspect: 'Entry pre-owned', prada: '$450 (Re-Nylon mini)', miumiu: '$450 (mini Matelassé)' },
  { aspect: 'Mid-range', prada: '$950–2,200 (Galleria Small)', miumiu: '$1,400–2,800 (Wander Bag medium)' },
  { aspect: 'Value retention', prada: '50–65% (Re-Nylon: 55–70%)', miumiu: '55–75% (Wander: 70–75%)' },
  { aspect: 'Trending', prada: 'Stable — perennial professional choice', miumiu: 'Very hot — peak 2024–25 resale demand' },
  { aspect: 'Best pre-owned buy', prada: 'Re-Nylon Tote (practical, holds well)', miumiu: 'Wander Bag (peak demand now)' },
]

export default function PradaVsMiuMiuPage() {
  const pradaItems = getItemsByBrand('prada').filter(i => i.price_ranges?.very_good).slice(0, 3)
  const miuItems = getItemsByBrand('miu miu').filter(i => i.price_ranges?.very_good).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Prada vs Miu Miu</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Prada vs Miu Miu: Pre-Owned 2025</h1>
      <p className="text-gray-500 mb-10">Same designer, same group — but very different identities. Intellectual minimalism vs playful excess. Which is the better pre-owned buy right now?</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Aspect</th>
              <th className="text-left py-3 px-4 font-semibold">Prada</th>
              <th className="text-left py-3 px-4 font-semibold">Miu Miu</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.prada}</td>
                <td className="py-3 px-4 text-gray-600">{row.miumiu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(pradaItems.length > 0 || miuItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {pradaItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Prada Pre-Owned</h3>
              {pradaItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
              <Link href="/brands/prada" className="text-sm text-blue-600 hover:underline mt-3 block">All Prada →</Link>
            </div>
          )}
          {miuItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Miu Miu Pre-Owned</h3>
              {miuItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
              <Link href="/brands/miu-miu" className="text-sm text-blue-600 hover:underline mt-3 block">All Miu Miu →</Link>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 mb-8">
        <strong>Buy Miu Miu now, Prada long-term:</strong> Miu Miu is having its hottest resale moment. Buy Wander Bag now while demand peaks. For long-term investments, Prada Galleria and Re-Nylon are more defensible classics.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/prada" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada Guide →</Link>
        <Link href="/brands/miu-miu" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu Guide →</Link>
        <Link href="/compare/balenciaga-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga vs Valentino →</Link>
      </div>
    </div>
  )
}
