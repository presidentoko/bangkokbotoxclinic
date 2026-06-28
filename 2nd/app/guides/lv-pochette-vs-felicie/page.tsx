import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'LV Pochette Métis vs Félicie Pochette: Which to Buy Pre-Owned? (2025) | SecondLuxuryItems',
  description: 'Louis Vuitton Pochette Métis vs Félicie Pochette — size, structure, monogram vs chain, pre-owned prices, resale retention, and which LV is the better buy.',
  alternates: { canonical: `${BASE}/guides/lv-pochette-vs-felicie` },
}

const rows = [
  { aspect: 'Launched', pm: '1985 (original), 2014 relaunch', fp: '2013' },
  { aspect: 'Size', pm: '25 x 19 x 7cm (structured, medium)', fp: '21 x 12 x 3cm (slim, compact)' },
  { aspect: 'Structure', pm: 'Rigid semi-structured body, organized interior', fp: 'Soft flat pochette, minimal structure' },
  { aspect: 'Strap', pm: 'Two-way wear: top handle or shoulder strap', fp: 'Chain strap only (can detach)' },
  { aspect: 'Canvas', pm: 'Monogram, Empreinte leather, M-Bucket', fp: 'Monogram, Empreinte leather, DE canvas' },
  { aspect: 'New price', pm: '$1,580–2,500 (Monogram)', fp: '$1,150–1,650 (Monogram)' },
  { aspect: 'Pre-owned entry', pm: '$800–1,200 (Monogram, worn)', fp: '$550–900 (Monogram, worn)' },
  { aspect: 'Resale retention', pm: '70–85% (exceptionally high for LV)', fp: '60–75% (strong)' },
  { aspect: 'Investment tier', pm: 'A-Tier (one of strongest LV resale items)', fp: 'B+ (solid, especially Empreinte)' },
  { aspect: 'Waitlist (new)', pm: 'Yes — hard to get in LV stores', fp: 'Generally available' },
]

export default function LvPochetteVsFelicie() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>LV Pochette vs Félicie</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">LV Pochette Métis vs Félicie Pochette: Which Pre-Owned to Buy?</h1>
      <p className="text-gray-500 mb-10">Two of Louis Vuitton's most in-demand crossbody/pochette styles — both in Monogram canvas, both excellent resellers, but serving very different needs. The Pochette Métis is structured and organised; the Félicie is sleek and minimal. Here's everything you need to decide.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Pochette Métis</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-600">Félicie Pochette</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.pm}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.fp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">Choose Pochette Métis if…</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• You need to carry phone, wallet, keys, and make-up comfortably</li>
            <li>• You want a day-to-night bag (top handle + shoulder)</li>
            <li>• Investment is part of your decision — PM has stronger resale</li>
            <li>• You can wait — PM is waitlisted at retail</li>
            <li>• You prefer structure and interior organisation</li>
          </ul>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <h3 className="font-semibold text-orange-900 mb-2">Choose Félicie if…</h3>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• You want a lightweight evening/night-out bag</li>
            <li>• Chain strap is your preferred carrying style</li>
            <li>• Immediate availability at lower entry price</li>
            <li>• You prefer the flat/minimal silhouette</li>
            <li>• Empreinte leather Félicie is a particular sweet spot</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">The Pochette Métis waitlist situation</h3>
        <p className="text-sm text-amber-800">The Pochette Métis is one of the most waitlisted LV bags globally. New retail price is $1,580–2,500 depending on canvas, but getting one at retail requires LV relationship or significant luck. Pre-owned Métis in good-to-excellent condition ($900–1,400) often represents better value than waiting 6–18 months at retail. The pre-owned premium over retail entry has compressed — this is one of the few LV bags where pre-owned is close to fair value rather than a discount.</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Canvas vs Leather: which to choose?</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-700 mb-1">Monogram canvas:</p>
            <p>Coated canvas — water resistant, easier to maintain. Vachetta leather trim will patina over time (desirable). More casual. Pre-owned condition easier to assess.</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Empreinte leather:</p>
            <p>Embossed leather — more formal, quieter look. Scratches can show. Higher price but stronger resale in pristine condition. The Félicie Pochette in Empreinte is particularly sought-after.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Pre-Owned →</Link>
        <Link href="/guides/lv-neverfull-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Neverfull Size Guide →</Link>
        <Link href="/guides/lv-monogram-vs-damier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Monogram vs Damier →</Link>
        <Link href="/guides/how-to-authenticate-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate LV →</Link>
      </div>
    </div>
  )
}
