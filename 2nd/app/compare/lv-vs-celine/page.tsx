import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Louis Vuitton vs Céline: Pre-Owned Comparison ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'LV vs Céline — Neverfull vs Luggage Tote, value retention, resale. Two very different French luxury houses compared for pre-owned buyers.',
  alternates: { canonical: `${BASE}/compare/lv-vs-celine` },
}

const rows = [
  { aspect: 'Brand identity', lv: 'Monogram-forward, travel heritage (1854). Extremely high brand recognition globally', celine: 'Minimalist Parisian chic (Philo era) or rock-luxe (Slimane). Lower logo presence' },
  { aspect: 'Entry pre-owned', lv: '$200 (accessories) · $700 (Pochette) · $900 (Neverfull PM)', celine: '$350 (wallets) · $600 (Mini Belt) · $800 (Luggage Nano)' },
  { aspect: 'Iconic bag', lv: 'Neverfull (tote) — most-traded pre-owned bag globally', celine: 'Luggage Tote (Philo era 2009–2018) — niche but premium' },
  { aspect: 'Value retention', lv: '70–90% (Neverfull MM/GM, classic canvas) — extremely stable', celine: '45–65% (current pieces) · Philo era +15–25% premium' },
  { aspect: 'Best for resale', lv: 'Classic canvas (Monogram/Damier Ebene). Neverfull, Speedy, Alma', celine: 'Philo-era Luggage, Belt, Trapeze. Slimane pieces hold less' },
  { aspect: 'Aging', lv: 'Classic canvas ages very well — patinas gracefully. Epi/leather faster', celine: 'Clean leather ages well. Some Margiela/Slimane pieces less timeless' },
  { aspect: 'Brand trajectory', lv: 'Price increases 4–8%/year — base effect keeps pre-owned strong', celine: 'More designer-dependent — Philo departure 2018 hit demand' },
]

export default function LVVsCelinePage() {
  const lvItems = getItemsByBrand('louis vuitton').filter(i => i.price_ranges?.very_good).slice(0, 2)
  const celineItems = getItemsByBrand('celine').filter(i => i.price_ranges?.very_good).slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>LV vs Céline</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Louis Vuitton vs Céline Pre-Owned: {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Two very different French houses — LV is monogram-forward with massive global recognition; Céline (Philo era) is the cultured minimalist. Both have active pre-owned markets, but very different dynamics.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Aspect</th>
              <th className="text-left py-3 px-4 font-semibold">Louis Vuitton</th>
              <th className="text-left py-3 px-4 font-semibold">Céline</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.lv}</td>
                <td className="py-3 px-4 text-gray-600">{row.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(lvItems.length > 0 || celineItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {lvItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">LV Pre-Owned</h3>
              {lvItems.map(item => (
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
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Pre-Owned →</Link>
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Céline Pre-Owned →</Link>
        <Link href="/guides/lv-neverfull-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size Guide →</Link>
        <Link href="/compare/dior-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Céline →</Link>
      </div>
    </div>
  )
}
