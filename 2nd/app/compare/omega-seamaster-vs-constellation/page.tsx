import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Omega Seamaster vs Constellation ${PRICE_YEAR}: Which Pre-Owned Watch to Buy? | SecondLuxuryItems`,
  description: `Omega Seamaster vs Constellation — dive watch vs dress watch, resale retention, pre-owned prices, and which Omega is the better buy in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/omega-seamaster-vs-constellation` },
}

const rows = [
  { aspect: 'Launched', sm: '1948 — military diving heritage', con: '1952 — precision horology, observatory wins' },
  { aspect: 'DNA', sm: 'Professional sport/dive watch', con: 'Dress/refined sport watch' },
  { aspect: 'Case size', sm: '41mm (Professional 300M most common)', con: '38mm–41mm (men\'s), 28mm–36mm (ladies\')' },
  { aspect: 'Water resistance', sm: '300M standard. Planet Ocean: 600M+', con: '120M (not a dive watch)' },
  { aspect: 'Movement', sm: 'Cal.8800 (co-axial, METAS certified)', con: 'Cal.8800 or 8500 (co-axial, METAS certified)' },
  { aspect: 'New price range', sm: '$5,500–9,500 (Steel 300M)', con: '$4,800–8,200 (Steel 38mm)' },
  { aspect: 'Pre-owned entry', sm: '$2,800–4,500 (Professional 300M worn)', con: '$2,200–3,800 (Constellation 38mm worn)' },
  { aspect: 'Resale retention', sm: '65–80% (Seamaster is most liquid Omega)', con: '55–70% (decent but less liquid than Seamaster)' },
  { aspect: 'Investment tier', sm: 'B+ (strongest pre-owned Omega)', con: 'B (solid but slower market)' },
  { aspect: 'James Bond effect', sm: 'Yes — significant awareness from Bond films since 1995', con: 'No — less pop culture presence' },
]

export default function OmegaSeamasterVsConstellation() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Omega Seamaster vs Constellation</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Omega Seamaster vs Constellation ({PRICE_YEAR}): Which Pre-Owned Watch to Buy?</h1>
      <p className="text-gray-500 mb-10">Two of Omega's flagship lines — each with 70+ year histories, both using co-axial movements, but serving fundamentally different buyers. The Seamaster dominates pre-owned liquidity; the Constellation is the refined under-the-radar choice. Here's the complete comparison for 2025 pre-owned buyers.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-blue-700">Seamaster</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-700">Constellation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.sm}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.con}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">Buy Seamaster if…</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You want the most liquid Omega to resell</li>
            <li>• You need actual dive capability (300M+)</li>
            <li>• The Bond association appeals to you</li>
            <li>• You want the broadest pre-owned selection</li>
            <li>• The blue wave dial is your aesthetic</li>
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">Buy Constellation if…</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• You want something less common at the office</li>
            <li>• The "claw" bezel and cat-paw dial feet appeal to you</li>
            <li>• You prefer a dress watch that's not a Rolex Datejust</li>
            <li>• Ladies sizes (28mm–36mm) are available in Constellation only</li>
            <li>• Value proposition: similar movement, lower price</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">The James Bond premium</h3>
        <p className="text-sm text-blue-800">Since 1995 (GoldenEye), James Bond has worn an Omega Seamaster in every film. This cultural association has a measurable impact on Seamaster pre-owned values — demand consistently outstrips supply, especially for the Seamaster 300M "stainless steel" variant. When Constellation wearers ask why Seamasters resell faster, this is the main reason. The Bond effect creates a floor for Seamaster values that Constellation doesn't have.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Pre-Owned →</Link>
        <Link href="/guides/omega-seamaster-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Seamaster Buying Guide →</Link>
        <Link href="/guides/how-to-authenticate-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Omega →</Link>
        <Link href="/compare/omega-vs-tag-heuer" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs TAG Heuer →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
