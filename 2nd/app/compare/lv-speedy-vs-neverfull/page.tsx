import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'LV Speedy vs Neverfull 2025: Which Pre-Owned Bag to Buy? | SecondLuxuryItems',
  description: 'Louis Vuitton Speedy vs Neverfull — structured vs tote, resale retention, which LV is the better investment, and pre-owned price comparison for 2025.',
  alternates: { canonical: `${BASE}/compare/lv-speedy-vs-neverfull` },
}

const rows = [
  { aspect: 'Launched', sp: '1930 — inspired by the Keepall, first "fast" bag', nf: '2007 — designed for everyday shopping' },
  { aspect: 'Shape', sp: 'Structured barrel/doctor bag with top handles', nf: 'Open tote with cinch drawstring sides' },
  { aspect: 'Canvas options', sp: 'Monogram, Damier Ebène, Damier Azur, Empreinte', nf: 'Monogram, Damier Ebène, Damier Azur' },
  { aspect: 'Size options', sp: 'B20, B25, B30, B35, B40 (most popular: B25, B30)', nf: 'PM, MM, GM (most popular: MM)' },
  { aspect: 'Closure', sp: 'Top zip (B25+) — fully enclosed', nf: 'Open top with optional drawstring closure' },
  { aspect: 'New price', sp: '$1,380–1,780 (B25–B30 Monogram)', nf: '$1,670–1,960 (PM–MM Monogram)' },
  { aspect: 'Pre-owned entry', sp: '$650–900 (B25 Monogram, worn)', nf: '$780–1,100 (PM–MM Monogram, worn)' },
  { aspect: 'Resale retention', sp: '65–80% (Empreinte: 75–85%)', nf: '70–85% (MM most liquid LV tote)' },
  { aspect: 'Investment tier', sp: 'B+ (stable, broad market)', nf: 'A-Tier (exceptional tote liquidity)' },
  { aspect: 'Open top risk', sp: 'None — fully zipped closure', nf: 'Security concern for Bangkok transit' },
]

export default function LvSpeedyVsNeverfull() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>LV Speedy vs Neverfull</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">LV Speedy vs Neverfull (2025): Which Pre-Owned to Buy?</h1>
      <p className="text-gray-500 mb-10">The two most recognisable Louis Vuitton bags in the world — and both excellent pre-owned investments. The Speedy is a structured handheld; the Neverfull is the definitive open tote. The choice comes down to how you carry and whether security matters.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Speedy</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-600">Neverfull</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.sp}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.nf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">Choose Speedy if…</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• You prefer a structured bag with a secure zip top</li>
            <li>• Hand-carry or shoulder (Bandoulière version) is your style</li>
            <li>• You want more size flexibility (B20 to B40)</li>
            <li>• Empreinte Speedy is your target — strongest value retention</li>
            <li>• You'll carry it into crowded transit (MBK, MRT) — zip is safer</li>
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-2">Choose Neverfull if…</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• You need to carry more — the Neverfull MM is a true workhorse tote</li>
            <li>• Shoulder carry only is your preference</li>
            <li>• The cinch drawstring to convert from open to narrowed tote appeals</li>
            <li>• Resale is a priority — Neverfull MM is among the most liquid LV bags</li>
            <li>• The interior pochette is useful to you</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">The Speedy vs Neverfull pre-owned market</h3>
        <p className="text-sm text-gray-600">Both bags have extremely deep pre-owned markets — more listings than almost any other luxury brand globally. This means competitive pricing (good for buyers) but also more fakes in circulation. For the Speedy, the most counterfeited size is the B25 in Monogram. For the Neverfull, the MM in Monogram is the #1 faked bag in the world by volume. Get authentication for either before buying pre-owned.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Pre-Owned →</Link>
        <Link href="/guides/lv-neverfull-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size Guide →</Link>
        <Link href="/guides/lv-speedy-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Speedy Size Guide →</Link>
        <Link href="/guides/lv-monogram-vs-damier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Monogram vs Damier →</Link>
        <Link href="/guides/how-to-authenticate-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate LV →</Link>
      </div>
    </div>
  )
}
