import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Tiffany & Co vs Van Cleef & Arpels 2025: Which to Buy? | SecondLuxuryItems',
  description: 'Tiffany vs Van Cleef comparison — HardWear vs Alhambra, entry price, resale value, investment case, celebrity factor. Two jewelry giants compared for pre-owned buyers 2025.',
  alternates: { canonical: `${BASE}/compare/tiffany-vs-van-cleef` },
}

const rows = [
  { label: 'Founded', tiffany: 'New York, 1837. American luxury icon.', vcaf: 'Paris, 1906. French Maison, Place Vendôme since 1906.' },
  { label: 'Signature piece', tiffany: 'Tiffany Setting diamond ring (1886). T Wire, HardWear, Return to Tiffany.', vcaf: 'Alhambra (1968). Perlée. Lotus. Magic Alhambra.' },
  { label: 'Aesthetic', tiffany: 'Bold, geometric, American confidence. The HardWear chain bracelet is urban/statement.', vcaf: 'Delicate, floral, French romanticism. Alhambra four-leaf clover is understated elegance.' },
  { label: 'Entry price (pre-owned)', tiffany: 'Return to Tiffany toggle bracelet: $150–$400. HardWear link bracelet: $400–$900.', vcaf: 'Alhambra vintage necklace (1 motif): $1,200–$2,000. 20-motif sautoir: $8,000–$15,000.' },
  { label: 'Most popular piece', tiffany: 'T Wire bracelet, HardWear chain, Tiffany Setting', vcaf: 'Vintage Alhambra necklace, Magic Alhambra earrings, Perlée bangle' },
  { label: 'Resale value', tiffany: 'Return to Tiffany: 30–50% of retail. HardWear and T: 40–65%. Diamonds hold better.', vcaf: 'Alhambra: 60–90% of retail for classic MOP. Rare/vintage: 100–150%+ of retail.' },
  { label: 'Investment case', tiffany: 'Moderate. Tiffany is repositioning upmarket under LVMH (acquired 2021). Long-term upside but short-term resale below retail.', vcaf: 'Strong. VCA pieces appreciate reliably. Vintage 1970s Alhambra significantly above retail.' },
  { label: 'Counterfeits', tiffany: 'Return to Tiffany heavily faked. T and HardWear also widely copied. Authentication required.', vcaf: 'Alhambra extremely heavily faked — most-counterfeited jewelry piece globally. Professional authentication recommended.' },
]

export default function TiffanyVsVCA() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Tiffany vs Van Cleef</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Tiffany & Co vs Van Cleef & Arpels 2025</h1>
      <p className="text-gray-500 mb-10">American confidence vs French delicacy. Tiffany and Van Cleef represent two completely different luxury jewelry philosophies — Tiffany's bold HardWear chain vs VCA's delicate Alhambra clover. Both are investment pieces; the resale dynamics are notably different. Here is the breakdown.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-36 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Tiffany & Co</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Van Cleef & Arpels</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.tiffany}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.vcaf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Tiffany if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Entry budget under $1,000 for a recognizable luxury piece</li>
            <li>• You prefer bold, statement jewelry</li>
            <li>• American or NY aesthetic resonates</li>
            <li>• Buying diamonds (Tiffany grading is strong)</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy Van Cleef if…</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Investment/resale value is a priority</li>
            <li>• You prefer delicate, everyday-wearable jewelry</li>
            <li>• French aesthetic and craftsmanship matter</li>
            <li>• Budget is $2,000+ for Alhambra</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/tiffany" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Tiffany Pre-Owned →</Link>
        <Link href="/brands/van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Van Cleef Pre-Owned →</Link>
        <Link href="/compare/cartier-vs-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Van Cleef →</Link>
        <Link href="/compare/cartier-vs-tiffany" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Tiffany →</Link>
      </div>
    </div>
  )
}
