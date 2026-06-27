import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Fendi vs Loewe: Pre-Owned Bags 2025 | SecondLuxuryItems',
  description: 'Fendi Baguette vs Loewe Puzzle — which brand holds value better? Pre-owned price comparison, resale rates, and which to buy in 2025.',
  alternates: { canonical: `${BASE}/compare/fendi-vs-loewe` },
}

const rows = [
  { aspect: 'Founded', fendi: '1925, Rome (Adele & Edoardo Fendi)', loewe: '1846, Madrid (Enrique Loewe Roessberg)' },
  { aspect: 'Iconic bag', fendi: 'Baguette, Peekaboo, First', loewe: 'Puzzle, Hammock, Gate, Basket' },
  { aspect: 'Entry pre-owned', fendi: '$650 (FF Logo charm, well-worn)', loewe: '$600 (Gate Bag, good condition)' },
  { aspect: 'Mid-range pre-owned', fendi: '$1,200–2,000 (Baguette, logo)', loewe: '$1,200–2,200 (Puzzle Small, calfskin)' },
  { aspect: 'Value retention', fendi: '55–70% (Baguette: 65–75%)', loewe: '55–75% (Puzzle: 65–80%)' },
  { aspect: 'Design director', fendi: 'Kim Jones (menswear) + Silvia Venturini Fendi (bags)', loewe: 'Jonathan Anderson (2013–2024)' },
  { aspect: 'Growing/declining', fendi: '→ Stable with Baguette nostalgia boom', loewe: '↑ Rising — Anderson era desirability' },
  { aspect: 'Best pre-owned buy', fendi: 'Baguette 1997 (original shape)', loewe: 'Puzzle Small Calfskin (Anderson era)' },
]

export default function FendiVsLoewePage() {
  const fendiItems = getItemsByBrand('fendi').filter(i => i.price_ranges?.very_good).slice(0, 3)
  const loeweItems = getItemsByBrand('loewe').filter(i => i.price_ranges?.very_good).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Loewe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Fendi vs Loewe: Pre-Owned 2025</h1>
      <p className="text-gray-500 mb-10">Italian nostalgia vs Spanish craft — Baguette vs Puzzle for pre-owned buyers.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fendi</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Baguette: one of the most recognizable bags in fashion history (SJP effect)</li>
            <li>✓ FF Zucca logo: instantly identifiable, strong brand presence</li>
            <li>✓ Rome heritage: 100 years old in 2025</li>
            <li>✗ Lower retention on non-Baguette models</li>
            <li>✗ LVMH ownership diluted some exclusivity perception</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Loewe</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Puzzle: architectural design loved by fashion insiders</li>
            <li>✓ Jonathan Anderson era has become highly collectible</li>
            <li>✓ LVMH house — same parent as LV, Dior</li>
            <li>✓ Best leather quality at this price tier</li>
            <li>✗ Less globally recognized than Fendi outside Europe/Asia</li>
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
                <th className="text-left py-3 px-4 font-semibold">Fendi</th>
                <th className="text-left py-3 px-4 font-semibold">Loewe</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.fendi}</td>
                  <td className="py-3 px-4 text-gray-600">{row.loewe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verdict</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="border-l-4 border-green-400 pl-4"><strong className="text-gray-900">Buy Fendi if:</strong> you want the Baguette specifically (iconic shape, strong nostalgia demand) or prefer bold FF branding</div>
          <div className="border-l-4 border-purple-400 pl-4"><strong className="text-gray-900">Buy Loewe if:</strong> you want the best leather quality, want a more understated but fashion-forward look, or believe in the Anderson-era appreciation</div>
          <div className="border-l-4 border-amber-400 pl-4"><strong className="text-gray-900">Neither is a strong investment:</strong> both retain 55–75%. If investment is the goal, Chanel or Hermès dominate this comparison</div>
        </div>
      </section>

      {(fendiItems.length > 0 || loeweItems.length > 0) && (
        <section className="mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            {fendiItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fendi Pre-Owned</h3>
                <div className="space-y-2">
                  {fendiItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                      <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                      <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                    </div>
                  ))}
                </div>
                <Link href="/brands/fendi" className="text-sm text-blue-600 hover:underline mt-3 block">All Fendi →</Link>
              </div>
            )}
            {loeweItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Loewe Pre-Owned</h3>
                <div className="space-y-2">
                  {loeweItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                      <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                      <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                    </div>
                  ))}
                </div>
                <Link href="/brands/loewe" className="text-sm text-blue-600 hover:underline mt-3 block">All Loewe →</Link>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/fendi" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi Guide →</Link>
        <Link href="/brands/loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe Guide →</Link>
        <Link href="/compare/bottega-veneta-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega vs Loewe →</Link>
      </div>
    </div>
  )
}
