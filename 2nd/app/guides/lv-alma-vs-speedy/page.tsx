import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'LV Alma vs Speedy 2025: Size Guide & Which to Buy Pre-Owned | SecondLuxuryItems',
  description: 'LV Alma vs Speedy — arch shape vs barrel shape, BB/PM/MM vs B20/25/30, resale retention, and which Louis Vuitton is the better pre-owned investment in 2025.',
  alternates: { canonical: `${BASE}/guides/lv-alma-vs-speedy` },
}

const rows = [
  { aspect: 'Shape', alma: 'Arch (dome-shaped, flat bottom, rigid)', speedy: 'Barrel (rounded, soft structure)' },
  { aspect: 'Launched', alma: '1934 (Art Deco inspiration, named for Rue de l\'Alma)', speedy: '1930 (inspired by the Keepall travel bag)' },
  { aspect: 'Closure', alma: 'Turn-lock clasp — rigid, structured', speedy: 'Top zip (B25+) — soft, slightly collapsible' },
  { aspect: 'Sizes', alma: 'BB (25×19×12cm), PM (36×28×18cm), MM (40×31×20cm)', speedy: 'B20, B25 (most popular), B30, B35, B40' },
  { aspect: 'Canvas options', alma: 'Monogram, Damier Ebène, Damier Azur, Vernis', speedy: 'Monogram, Damier Ebène, Damier Azur, Empreinte' },
  { aspect: 'New price', alma: '$1,480–2,150 (BB–PM Monogram)', speedy: '$1,380–1,780 (B25–B30 Monogram)' },
  { aspect: 'Pre-owned entry', alma: '$700–1,000 (BB Monogram, worn)', speedy: '$650–900 (B25 Monogram, worn)' },
  { aspect: 'Resale retention', alma: '60–75% (Vernis: up to 80%)', speedy: '65–80% (Empreinte: 75–85%)' },
  { aspect: 'Investment tier', alma: 'B+ (Vernis Alma is the standout)', speedy: 'B+ (Empreinte Speedy strongest)' },
  { aspect: 'Carry style', alma: 'Top handle only (no crossbody strap on most)', speedy: 'Top handle; Bandoulière adds shoulder strap' },
]

export default function LvAlmaVsSpeedy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>LV Alma vs Speedy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">LV Alma vs Speedy (2025): Size Guide & Which to Buy Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Both are Louis Vuitton icons with nearly a century of history — but they feel completely different to carry. The Alma is rigid Art Deco architecture; the Speedy is relaxed barrel freedom. The decision ultimately comes down to structure preference and whether you want a shoulder strap.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Alma</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-600">Speedy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.alma}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.speedy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Alma size guide</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Alma BB (25cm):</strong> Fits phone, wallet, keys, lipstick — going-out bag</li>
            <li><strong>Alma PM (36cm):</strong> Full work day — laptop doesn't fit, everything else does</li>
            <li><strong>Alma MM (40cm):</strong> Roomy weekend — noticeably large on petite frames</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Speedy size guide</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Speedy B20:</strong> Tiny — phone and cards, no more</li>
            <li><strong>Speedy B25:</strong> Most popular — daily essentials, proportional on most frames</li>
            <li><strong>Speedy B30:</strong> Generous carry, still balanced — best for taller frames</li>
            <li><strong>Speedy B35:</strong> Weekend/overnight — overtly large for daily use</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-900 mb-2">Vernis Alma: the pre-owned exception</h3>
        <p className="text-sm text-amber-800">The Alma in Vernis (patent leather) is the standout pre-owned play from this family. Older Vernis Alma in Rose Indien, Fuchsia, or Amarante have strong collector demand. Pre-owned Vernis Alma BB: $800–1,200 (excellent condition). Retention: up to 80% for rare colourways. The structured shape keeps Vernis from cracking at the seams — a common complaint with softer Vernis LV pieces.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-2">Choose Alma if…</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• You prefer rigid structure and an Art Deco silhouette</li>
            <li>• You love the turn-lock closure — it holds shape perfectly</li>
            <li>• Vernis leather appeals to you (best Alma colourways)</li>
            <li>• You don't need a crossbody strap</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">Choose Speedy if…</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You want the Bandoulière crossbody strap option</li>
            <li>• Empreinte leather is your target — strongest retention</li>
            <li>• A more casual, relaxed shape suits your lifestyle</li>
            <li>• Bangkok transit — the zip is safer than the Alma's clasp</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV Pre-Owned →</Link>
        <Link href="/compare/lv-speedy-vs-neverfull" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Speedy vs Neverfull →</Link>
        <Link href="/guides/how-to-authenticate-louis-vuitton" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate LV →</Link>
        <Link href="/guides/lv-monogram-vs-damier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Monogram vs Damier →</Link>
      </div>
    </div>
  )
}
