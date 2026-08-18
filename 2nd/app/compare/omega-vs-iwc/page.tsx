import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Omega vs IWC ${PRICE_YEAR}: Seamaster vs Pilot Watch Comparison | SecondLuxuryItems`,
  description: `Omega vs IWC compared — Seamaster vs Pilot's Watch, price range, movement quality, resale value, investment case. Which Swiss watch to buy pre-owned in ${PRICE_YEAR}?`,
  alternates: { canonical: `${BASE}/compare/omega-vs-iwc` },
}

const rows = [
  { label: 'Founded', omega: 'La Chaux-de-Fonds, Switzerland, 1848.', iwc: 'Schaffhausen, Switzerland, 1868. The only major Swiss watch manufacturer in German-speaking Switzerland.' },
  { label: 'SWATCH Group / Richemont', omega: 'Swatch Group (world\'s largest watch company). Volume: ~700,000 watches/year.', iwc: 'Richemont Group. Smaller production: ~170,000 watches/year. More exclusive.' },
  { label: 'Signature collection', omega: 'Seamaster (sport/dive), Speedmaster (space), Constellation (dress)', iwc: 'Pilot\'s Watch, Portofino (dress), Aquatimer (dive), Ingenieur' },
  { label: 'James Bond connection', omega: 'Omega is the official James Bond watch — Seamaster 300M since 1995.', iwc: 'No Bond connection. Positioned more toward aviation/military heritage.' },
  { label: 'Entry price (pre-owned)', omega: 'Seamaster 300M: $2,800–$4,500. Speedmaster Moonwatch: $3,500–$5,500.', iwc: 'Pilot\'s Watch Mark XX: $2,200–$3,500. Portofino auto: $2,000–$3,200.' },
  { label: 'Complications and prestige', omega: 'Co-Axial master chronometer movements. METAS-certified. Excellent anti-magnetism.', iwc: 'Less prestigious in-house movement tradition. Relies more on calibers. Fewer COSC-certified models.' },
  { label: 'Resale value', omega: 'Seamaster 300M: 60–80% of retail. Speedmaster (limited): 80–120%+. Gold models: 100%+.', iwc: 'Pilot\'s Chronograph: 55–70% of retail. Portofino: 45–60%. Big Pilot: 65–80%.' },
  { label: 'Investment case', omega: 'Stronger. Speedmaster Moonwatch is a genuine collector\'s icon. Seamaster very liquid on the secondary market.', iwc: 'Moderate. IWC lacks the iconic collector anchors of Omega. More fashion watch than investment.' },
]

export default function OmegaVsIWC() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Omega vs IWC</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Omega vs IWC {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Two Swiss icons with very different identities. Omega is the most commercially successful prestige watch brand in the world — Bond's watch, the moon watch, the Seamaster on every wrist. IWC is the watchmaker for pilot and aviation heritage — understated, German-speaking Swiss, and more of an insider's choice. Both are legitimate luxury watches; the investment case tilts heavily toward Omega.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-36 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Omega</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">IWC Schaffhausen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.omega}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.iwc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Omega if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Resale and investment value matter</li>
            <li>• Sport/dive watch appeal (Seamaster)</li>
            <li>• History and iconography (Moonwatch, Bond)</li>
            <li>• Broad market recognition</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy IWC if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Aviation/pilot aesthetic resonates</li>
            <li>• Dress watch (Portofino) is the goal</li>
            <li>• You want something less omnipresent</li>
            <li>• Budget flexibility: IWC entry is slightly lower</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Pre-Owned →</Link>
        <Link href="/compare/omega-vs-tag-heuer" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs Tag Heuer →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
