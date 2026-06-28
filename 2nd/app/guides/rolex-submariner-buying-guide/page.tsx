import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Rolex Submariner Buying Guide 2025: Pre-Owned Prices | SecondLuxuryItems',
  description: 'Complete Rolex Submariner buying guide — 5513, 14060, 114060, 124060 references, pre-owned prices, what to look for, how to avoid fakes 2025.',
  alternates: { canonical: `${BASE}/guides/rolex-submariner-buying-guide` },
}

const references = [
  { ref: '124060 ("No-Date", 2020–present)', price: '$8,500–$12,000', retail: '~$10,100', note: 'Current production 41mm no-date. Ceramic bezel (Cerachrom), Oystersteel. Most available pre-owned reference right now. The purist\'s choice — no date magnifier disrupts the symmetry.' },
  { ref: '126610LN ("Date", 2020–present)', price: '$11,000–$15,000', retail: '~$11,200', note: 'Current production 41mm with date. Black bezel, black dial. Over retail due to demand. The most recognizable sports watch in existence. If you find it at retail price pre-owned, buy it.' },
  { ref: '126610LV ("Kermit/Hulk" green bezel)', price: '$13,000–$20,000', retail: '~$13,150', note: 'Green bezel with black dial. New "Kermit" generation since 2020. Significant premium over retail. The watch that people most want to flip — buy for love, not investment.' },
  { ref: '114060 (2012–2020, no-date)', price: '$7,500–$10,000', retail: 'Discontinued', note: 'Excellent pre-owned entry to Sub. Ceramic bezel, 40mm, same DNA as current. Discontinued means no future retail competition — a clean choice for pre-owned buyers.' },
  { ref: '16610 (1988–2010, vintage-modern)', price: '$5,500–$9,000', retail: 'Discontinued', note: 'Last generation with aluminum bezel. 40mm. The "transitional" reference — vintage appeal without extreme vintage premium. Watch the "Swiss Only" serif distinction on older dials.' },
]

export default function RolexSubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Rolex Submariner Buying Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Rolex Submariner Buying Guide 2025</h1>
      <p className="text-gray-500 mb-10">The Rolex Submariner is the most recognizable luxury sports watch in the world and the most traded on the secondary market. Understanding the five key references and their pre-owned premiums protects you from overpaying and helps you find the best entry point.</p>

      <div className="space-y-4 mb-10">
        {references.map((r, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">Submariner {r.ref}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-gray-900">{r.price}</div>
                <div className="text-xs text-gray-400">Retail: {r.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{r.note}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">6 Things to Check Before Buying</h2>
      <div className="space-y-2 mb-10">
        {[
          { check: 'Case serial number', detail: 'Engraved between lugs (6 o\'clock side) and between lugs (12 o\'clock side). Matches case back serial. Mismatched = parts watch, significant value reduction.' },
          { check: 'Cyclops date magnification', detail: '124060 no-date has no cyclops. 126610 date has cyclops that magnifies 2.5x. Undersized or off-center cyclops = replacement crystal or fake.' },
          { check: 'Submariner crown guards', detail: 'The "triplock" crown and protective shoulders are unique to Sub. Crown must screw down smoothly. Stripped crown thread = expensive service ($600+).' },
          { check: 'Ceramic bezel (post-2010)', detail: 'Cerachrom ceramic virtually unscratchable. Aluminum bezels (pre-2010) scratch and fade — check for faded numerals, especially 12 o\'clock pip.' },
          { check: 'Movement caseback', detail: 'Open caseback = service-modified (red flag on current production Sub). Original Sub has solid caseback. Request service history paperwork.' },
          { check: 'Papers and box', detail: 'Original papers add $500–$2,000 depending on reference and age. No papers is normal — ask for photos of the warranty card front and back if present.' },
        ].map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4">
            <p className="font-semibold text-gray-900 text-sm mb-0.5">{item.check}</p>
            <p className="text-xs text-gray-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Pre-Owned →</Link>
        <Link href="/guides/rolex-reference-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Reference Guide →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
