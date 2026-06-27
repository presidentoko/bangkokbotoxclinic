import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Rolex Reference Number Guide 2025 | SecondLuxuryItems',
  description: 'How to read Rolex reference numbers — decode 126610LN, 126234, 116500LN and every modern Rolex ref. Pre-owned price guide by reference.',
  alternates: { canonical: `${BASE}/guides/rolex-reference-guide` },
}

export default function RolexReferenceGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Rolex Reference Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Rolex Reference Number Guide 2025</h1>
      <p className="text-gray-500 mb-10">How to decode any Rolex reference number, and what each ref trades for pre-owned in 2025.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Read a Rolex Reference Number</h2>
        <div className="bg-gray-50 rounded-xl p-5 mb-6 font-mono text-sm">
          <div className="mb-3 text-gray-900 font-bold text-base">Example: 126610 LN</div>
          <div className="space-y-2 text-gray-600">
            <div><span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">126610</span> = Model code (6 digits for post-2010 refs)</div>
            <div><span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded">LN</span> = Bezel suffix: <strong>LN</strong> = Black Ceramic (Lunette Noire), <strong>LV</strong> = Green Ceramic (Lunette Verte)</div>
          </div>
          <div className="mt-4 text-gray-500 text-xs">Older refs used 5 digits: 16610 = Submariner Date (pre-2010)</div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-3">Common Suffix Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-4 font-semibold">Suffix</th>
                <th className="text-left py-2 px-4 font-semibold">Meaning</th>
                <th className="text-left py-2 px-4 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                { suffix: 'LN', meaning: 'Black ceramic bezel', ex: '126610LN (Sub Date, black)' },
                { suffix: 'LV', meaning: 'Green ceramic bezel', ex: '126610LV (Sub Date "Kermit")' },
                { suffix: 'BKSO', meaning: 'Black dial, steel oyster bracelet', ex: '126300BKSO (Datejust 41)' },
                { suffix: 'RG', meaning: 'Rose gold', ex: '126655 (Submariner RG)' },
                { suffix: 'WG', meaning: 'White gold', ex: 'Day-Date 228239 (white gold)' },
                { suffix: 'G', meaning: 'Yellow gold', ex: 'Day-Date 228238 (YG)' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 px-4 font-mono font-bold text-gray-900">{r.suffix}</td>
                  <td className="py-2 px-4 text-gray-600">{r.meaning}</td>
                  <td className="py-2 px-4 text-gray-500 text-xs">{r.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key References & Pre-Owned Prices 2025</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Reference</th>
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-right py-3 px-4 font-semibold">Retail</th>
                <th className="text-right py-3 px-4 font-semibold">Pre-owned</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: '126610LN', model: 'Submariner Date, black', retail: '$10,100', preowned: '$11,500–14,000', above: true },
                { ref: '126610LV', model: 'Submariner Date, green', retail: '$10,100', preowned: '$13,500–17,000', above: true },
                { ref: '126500LN', model: 'Daytona, black ceramic', retail: '$15,100', preowned: '$28,000–45,000', above: true },
                { ref: '126334', model: 'Datejust 41, blue', retail: '$9,150', preowned: '$8,000–10,000', above: false },
                { ref: '126234', model: 'Datejust 36, silver', retail: '$7,100', preowned: '$6,200–8,500', above: false },
                { ref: '126710BLRO', model: 'GMT-Master II "Pepsi"', retail: '$10,700', preowned: '$16,000–22,000', above: true },
                { ref: '126711CHNR', model: 'GMT-Master II "Root Beer"', retail: '$13,150', preowned: '$18,000–25,000', above: true },
                { ref: '126900', model: 'Air-King', retail: '$7,100', preowned: '$6,000–7,500', above: false },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-gray-700">{r.ref}</td>
                  <td className="py-3 px-4 text-gray-700">{r.model}</td>
                  <td className="text-right py-3 px-4 text-gray-500">{r.retail}</td>
                  <td className="text-right py-3 px-4">
                    <span className={r.above ? 'text-amber-600 font-medium' : 'text-green-700 font-medium'}>{r.preowned}</span>
                    {r.above && <span className="ml-1 text-xs text-amber-500">↑ above retail</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Price Guide →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/compare/rolex-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
      </div>
    </div>
  )
}
