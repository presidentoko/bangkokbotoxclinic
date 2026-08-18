import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Pre-Owned Balenciaga ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Balenciaga City, Le Cagole, Hourglass pre-owned prices. Save 40-55% vs retail. Demna era collections and buying guide for pre-owned Balenciaga.',
  alternates: { canonical: `${BASE}/brands/balenciaga` },
}

export default function BalenciagaBrandPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Brands</Link>
        <span className="mx-2">/</span>
        <span>Balenciaga</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Owned Balenciaga {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-8">City Bag · Le Cagole · Hourglass · Save 40–55% vs retail · Demna era guide</p>

      <div className="bg-gray-900 text-gray-100 rounded-xl p-5 mb-8 text-sm">
        <strong className="text-white">Demna era (2015–present):</strong>
        <span className="ml-2 text-gray-300">Demna Gvasalia transformed Balenciaga into a cultural force — blending streetwear DNA with couture construction. The Le Cagole (2021) became a celebrity favourite almost instantly. Pre-owned Balenciaga is particularly price-sensitive: buy 2+ years old for the best value.</span>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-Owned Balenciaga Prices</h2>
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
                { name: 'City Bag Classic (with GSH)', retail: 2150, preowned: [900, 1400], note: 'Most iconic, distressed leather' },
                { name: 'City Bag (RH)', retail: 2000, preowned: [800, 1200], note: null },
                { name: 'Le Cagole Medium', retail: 2350, preowned: [1100, 1600], note: 'Celebrity favourite 2021–23' },
                { name: 'Hourglass Small', retail: 2300, preowned: [1000, 1550], note: null },
                { name: 'Motorcycle Bag XS', retail: 1850, preowned: [700, 1050], note: null },
                { name: 'Crush Bag Small', retail: 2100, preowned: [950, 1400], note: null },
              ].map((m, i) => {
                const savePct = Math.round((1 - m.preowned[0] / m.retail) * 100)
                return (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{m.name}</div>
                      {m.note && <div className="text-xs text-gray-400 mt-0.5">{m.note}</div>}
                    </td>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">City Bag Buying Guide</h2>
        <p className="text-sm text-gray-600 mb-4">The City Bag is the most counterfeited Balenciaga bag. Key authenticity checks:</p>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><strong>Hardware stamps:</strong> "BALENCIAGA PARIS" engraved on all hardware pieces (zipper pulls, D-rings, studs)</li>
          <li><strong>Logo card:</strong> Genuine pieces come with a mirror card; the font is thin and precise</li>
          <li><strong>Leather texture:</strong> Classic distressed leather has a specific grain — fakes often look too smooth or too rough</li>
          <li><strong>Stud backs:</strong> Real studs have a screwback that is flush with the leather; fakes often have uneven backs</li>
          <li><strong>Year tag:</strong> Inside the back pocket — confirms the season (format: SS24, FW23, etc.)</li>
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/handbags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Handbags →</Link>
        <Link href="/brands/bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Veneta →</Link>
      </div>
    </div>
  )
}
