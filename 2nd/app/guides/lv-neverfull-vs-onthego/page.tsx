import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `LV Neverfull vs OnTheGo ${PRICE_YEAR}: Which Tote to Buy? | SecondLuxuryItems`,
  description: `Louis Vuitton Neverfull MM vs OnTheGo MM compared — size, capacity, price, resale, canvas vs leather, convertible strap. Which LV tote is better for pre-owned buyers in ${PRICE_YEAR}?`,
  alternates: { canonical: `${BASE}/guides/lv-neverfull-vs-onthego` },
}

const rows = [
  { label: 'Launched', neverfull: '2007 — one of LV\'s most successful bag launches', onthego: '2020 — a newer addition as an elevated tote alternative' },
  { label: 'Material', neverfull: 'Monogram canvas (most popular), Damier Ebène, Damier Azur', onthego: 'Monogram canvas outside + natural cowhide handles. Also available in Empreinte (all leather).' },
  { label: 'Capacity', neverfull: 'MM: extremely roomy — great for travel, daily use, beach', onthego: 'MM: similar capacity but feels more structured and stiffer' },
  { label: 'Interior pouch', neverfull: 'Comes with a removable zip pouch (can be used as a clutch). Signature feature.', onthego: 'No separate interior pouch. Has two interior pockets.' },
  { label: 'Straps and carry', neverfull: 'Two short handles only — no shoulder strap. Can be worn on crook of arm.', onthego: 'Two handles PLUS a removable longer strap — can be worn crossbody. Key differentiator.' },
  { label: 'Closure', neverfull: 'No zipper — open top with side drawstring tie. Very easy access.', onthego: 'Zipper closure across the top — more secure.' },
  { label: 'Pre-owned price (MM)', neverfull: '$1,000–$1,600 depending on condition and year', onthego: '$1,200–$2,000 depending on condition (newer, so fewer pre-owned options)' },
  { label: 'Retail price (MM, 2025)', neverfull: '~$2,290', onthego: '~$2,860 (Empreinte: ~$3,750)' },
  { label: 'Resale %', neverfull: '50–75% of retail for well-maintained pieces', onthego: '55–70% of retail (fewer pre-owned units, but demand is growing)' },
]

export default function NeverFullVsOnTheGo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Neverfull vs OnTheGo</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">LV Neverfull vs OnTheGo {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">The Neverfull has been LV's bestselling bag since 2007. The OnTheGo launched in 2020 as an elevated alternative with a zipper and a crossbody strap. Both are large totes in Monogram canvas. The key decision: do you need the extra security of a zip and the flexibility of a crossbody strap (OnTheGo), or do you want the open-top convenience and removable pouch of the Neverfull?</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-36 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Neverfull MM</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">OnTheGo MM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.neverfull}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.onthego}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Neverfull if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Open-top easy access preferred</li>
            <li>• You want the removable zip pouch</li>
            <li>• Budget-conscious: $300–$600 cheaper pre-owned</li>
            <li>• Travel or beach bag use</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy OnTheGo if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You want a crossbody strap option</li>
            <li>• Zipper security is important</li>
            <li>• Modern look vs the classic Neverfull</li>
            <li>• Empreinte (leather) version interests you</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Louis Vuitton Pre-Owned →</Link>
        <Link href="/guides/lv-neverfull-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size Guide →</Link>
        <Link href="/guides/lv-monogram-vs-damier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Monogram vs Damier →</Link>
      </div>
    </div>
  )
}
