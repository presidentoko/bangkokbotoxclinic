import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Pre-Owned Valentino Bags ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Valentino Garavani Rockstud, VLogo & Locò pre-owned prices. Save 40-55% vs retail. Piccioli vs Alessandro Michele era guide.',
  alternates: { canonical: `${BASE}/brands/valentino` },
}

export default function ValentinoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Valentino Garavani {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">Rockstud · VLogo · Locò · Roman Stud · Save 40–55% vs retail</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-Owned Valentino Prices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Pre-owned</th>
                <th className="text-right py-3 px-4 font-semibold">Save</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Rockstud Crossbody (small)', retail: 1950, preowned: [800, 1200] },
                { name: 'VLogo Signature Medium', retail: 2300, preowned: [950, 1450] },
                { name: 'Locò Shoulder Bag Small', retail: 2600, preowned: [1100, 1700] },
                { name: 'Roman Stud Chain Shoulder', retail: 2850, preowned: [1200, 1900] },
                { name: 'Supervee Sneakers', retail: 750, preowned: [300, 520] },
              ].map((m, i) => {
                const savePct = Math.round((1 - m.preowned[0] / m.retail) * 100)
                return (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{m.name}</td>
                    <td className="text-right py-3 px-4 text-gray-500">${m.retail.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-green-700 font-medium">${m.preowned[0].toLocaleString()}–{m.preowned[1].toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Save {savePct}%+</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Piccioli vs Alessandro Michele Era</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="font-semibold text-gray-900 mb-2">Pierpaolo Piccioli era (2016–2023)</div>
            <ul className="text-gray-600 space-y-1.5">
              <li>• Bold colour, Roman Stud, Locò silhouettes</li>
              <li>• Most recognisable Valentino aesthetic</li>
              <li>• Pre-owned holds 45–60% of retail</li>
              <li>• Rockstud from this era highly sought after</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="font-semibold text-gray-900 mb-2">Alessandro Michele era (2023–present)</div>
            <ul className="text-gray-600 space-y-1.5">
              <li>• Maximalist florals and vintage romanticism</li>
              <li>• VLogo updated, new silhouettes introduced</li>
              <li>• Pre-owned: 40–55% (still available new)</li>
              <li>• Long-term collectible potential TBD</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/handbags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Handbags →</Link>
        <Link href="/brands/balenciaga" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga →</Link>
      </div>
    </div>
  )
}
