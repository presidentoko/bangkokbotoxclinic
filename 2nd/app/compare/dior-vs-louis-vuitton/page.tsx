import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Dior vs Louis Vuitton: Pre-Owned Bags 2025 | SecondLuxuryItems',
  description: 'Dior vs Louis Vuitton compared for pre-owned buyers — Lady Dior vs Neverfull, Saddle vs Speedy, value retention, and which LVMH brand to buy in 2025.',
  alternates: { canonical: `${BASE}/compare/dior-vs-louis-vuitton` },
}

const rows = [
  { aspect: 'Founded', dior: '1946, Paris (Christian Dior)', lv: '1854, Paris (Louis Vuitton)' },
  { aspect: 'Iconic bags', dior: 'Lady Dior, Saddle, Book Tote', lv: 'Neverfull, Speedy, Onthego' },
  { aspect: 'Entry pre-owned', dior: '$700 (small pouch/charm)', lv: '$600 (Pochette Accessoires)' },
  { aspect: 'Mid-range pre-owned', dior: '$2,000–3,500 (Lady Dior Small)', lv: '$750–1,100 (Neverfull MM)' },
  { aspect: 'Value retention', dior: '60–80% (Lady Dior: 70–85%)', lv: '70–90% (Neverfull: 75–90%)' },
  { aspect: 'Material', dior: 'Lambskin, calfskin, fabric', lv: 'Coated canvas, epi leather' },
  { aspect: 'Daily wear', dior: 'More formal/evening', lv: 'Better for daily carry — canvas holds up' },
  { aspect: 'Best pre-owned buy', dior: 'Lady Dior Small Lambskin', lv: 'Neverfull MM or Speedy 25 Monogram' },
]

export default function DiorVsLouisVuittonPage() {
  const diorItems = getItemsByBrand('dior').filter(i => i.price_ranges?.very_good).slice(0, 3)
  const lvItems = getItemsByBrand('louis vuitton').filter(i => i.price_ranges?.very_good).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Louis Vuitton</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dior vs Louis Vuitton: Pre-Owned 2025</h1>
      <p className="text-gray-500 mb-10">Two of LVMH's biggest houses — same parent company, very different pre-owned dynamics.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dior</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Lady Dior: the French first lady's bag, timeless</li>
            <li>✓ Saddle Bag: iconic silhouette, strong fashion identity</li>
            <li>✓ More formal/fashion-forward aesthetic</li>
            <li>✗ Lambskin scratches easily — condition premium is real</li>
            <li>✗ Lower retention than LV on most models</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Louis Vuitton</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Coated canvas: extremely durable, holds up for decades</li>
            <li>✓ Higher value retention — Neverfull one of best pre-owned holds</li>
            <li>✓ Larger resale market = more price transparency</li>
            <li>✓ Neverfull: the ultimate daily bag</li>
            <li>✗ LV logo is very visible — not quiet luxury</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Dior</th>
                <th className="text-left py-3 px-4 font-semibold">Louis Vuitton</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.dior}</td>
                  <td className="py-3 px-4 text-gray-600">{row.lv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(diorItems.length > 0 || lvItems.length > 0) && (
        <section className="mb-10">
          <div className="grid md:grid-cols-2 gap-6">
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
            {lvItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">LV Pre-Owned</h3>
                {lvItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                    <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                    <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                  </div>
                ))}
                <Link href="/brands/louis-vuitton" className="text-sm text-blue-600 hover:underline mt-3 block">All LV →</Link>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/compare/dior-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Chanel →</Link>
        <Link href="/compare/chanel-vs-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs LV →</Link>
        <Link href="/guides/lv-monogram-vs-damier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Canvas Guide →</Link>
      </div>
    </div>
  )
}
