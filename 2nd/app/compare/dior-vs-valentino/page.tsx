import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Dior vs Valentino ${PRICE_YEAR}: Lady Dior vs Rockstud, Investment Case | SecondLuxuryItems`,
  description: `Dior vs Valentino compared — Lady Dior vs Roman Stud, heritage, resale value, investment case, price ranges. Two Paris luxury houses for pre-owned buyers ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/dior-vs-valentino` },
}

const rows = [
  { label: 'Founded', dior: 'Paris, 1946 by Christian Dior. Reconstructed French fashion after WWII.', valentino: 'Rome, 1960 by Valentino Garavani. "The last couturier."' },
  { label: 'Current creative', dior: 'Maria Grazia Chiuri (2016–present). First woman to head Dior.', valentino: 'Alessandro Michele (2023–present). Previously Gucci\'s creative director.' },
  { label: 'Signature bags', dior: 'Lady Dior, Book Tote, Dior Saddle, Dior 30 Montaigne', valentino: 'Rockstud (bags and shoes), Roman Stud, VSling, Loco bag' },
  { label: 'Price range (pre-owned)', dior: 'Lady Dior small: $1,800–$3,200. Book Tote canvas: $700–$1,200.', valentino: 'Rockstud bag: $600–$1,400. Roman Stud: $700–$1,500. VSling: $450–$900.' },
  { label: 'Resale value', dior: 'Lady Dior leather: 55–75% of retail. Book Tote: 40–65%. Saddle: 60–80%.', valentino: 'Rockstud: 45–60% of retail. Roman Stud: 40–55%. Below Dior consistency.' },
  { label: 'Investment case', dior: 'Stronger. Lady Dior is an established collector\'s piece. Saddle has dramatic resale story.', valentino: 'Weaker. Valentino bags are fashion accessories more than investment pieces. Roman Stud may appreciate under Michele.', },
  { label: 'Shoes vs bags', dior: 'Equal prestige across categories. D-Stiletto and Mary Jane are iconic.', valentino: 'Shoes (Rockstud heels and flats) are MORE invested in than bags — stronger resale on footwear.' },
  { label: 'Heritage weight', dior: 'One of the "Big Six" fashion houses. Bar jacket is in fashion history.', valentino: 'Couture heritage is deep. Less mainstream recognition than Dior but highly respected in fashion circles.' },
]

export default function DiorVsValentino() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dior vs Valentino {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Two European luxury houses with completely different commercial profiles. Dior is one of the most commercially dominant luxury brands globally — the Lady Dior alone outsells most competitors. Valentino is the insider choice: deep couture heritage, Alessandro Michele's new direction in 2023, and shoes that may be more investable than the bags. The investment case diverges sharply here.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-36 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Christian Dior</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Valentino</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.dior}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.valentino}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Dior if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Investment/resale is a consideration</li>
            <li>• Lady Dior or Saddle Bag appeal</li>
            <li>• Strong brand recognition globally</li>
            <li>• Couture pieces that hold across fashion cycles</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Valentino if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• The Rockstud or Roman Stud aesthetic resonates</li>
            <li>• Shoes are the primary interest (stronger resale)</li>
            <li>• Alessandro Michele's new direction interests you</li>
            <li>• Budget flexibility: some Valentino pieces enter below $500</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Pre-Owned →</Link>
        <Link href="/compare/dior-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Gucci →</Link>
        <Link href="/compare/balenciaga-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga vs Valentino →</Link>
      </div>
    </div>
  )
}
