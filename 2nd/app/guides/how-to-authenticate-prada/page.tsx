import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate Prada Bags 2025: Galleria, Re-Edition | SecondLuxuryItems',
  description: 'How to spot fake Prada bags — triangle logo plate, serial tag, zipper quality, nylon vs fabric stitching, interior label. Authenticate Prada pre-owned 2025.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-prada` },
}

const checks = [
  { title: 'Triangle logo plate (inverted triangle)', detail: 'The enamel Prada triangle should have sharp corners and a matte finish (not shiny). The font is precise — "P" has a round curve, "R" has a diagonal leg. Fakes often have rounded corners on the triangle or thick, blocky lettering. On authentic pieces, "PRADA" has even letter spacing, not cramped.' },
  { title: 'Serial number interior tag', detail: 'Authentic Prada has a white serial tag sewn inside with "Prada" printed in a specific font above a serial number. The stitching on the tag itself is always even. Fakes often have the serial tag glued (not sewn) or use a different font that looks slightly italic. Run your finger over the tag — it should feel flush against the lining.' },
  { title: 'Zipper pull and logo', detail: 'Authentic Prada zippers are either YKK or custom branded "Prada" zippers. The zipper pull should have a slight weight to it and the engraved "Prada" text should be deep and clean. Fake zippers feel light and plasticky. The pull should slide smoothly without catching.' },
  { title: 'Re-Edition 2000 / 2005 nylon stitching', detail: 'Nylon Prada bags have a distinctive woven appearance. Stitching on authentic bags is perfectly aligned with the weave pattern. Fakes often show diagonal stitching that cuts across the nylon weave rather than following it. Under direct light, authentic Prada nylon has a subtle sheen that fake nylon lacks.' },
  { title: 'Interior label and lining', detail: 'The interior label reads "PRADA / Milano / Made in Italy" in a clean engraved format (leather goods) or printed on satin-like fabric. Fakes often have "Made In Italy" (with capital I on "In") or incorrect spacing. Authentic Prada lining is either suede-like or woven fabric — smooth but not cheap.' },
  { title: 'Hardware weight and finish', detail: 'Authentic Prada gold or silver hardware has a solid feel when lifted. The "PRADA" engraving on buckles and clasps is always crisp, never shallow. Fake hardware often has a painted-on shine that wears off at edges within weeks. Tap the hardware — authentic rings clearly, fake sounds dull.' },
]

export default function AuthenticatePrada() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>How to Authenticate Prada</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Prada Bags 2025</h1>
      <p className="text-gray-500 mb-10">Prada is one of the most counterfeited luxury brands in Asia. The Re-Edition 2000 and Galleria are both high-risk. Six checks that identify authentic Prada — checking all six takes under two minutes.</p>

      <div className="space-y-4 mb-10">
        {checks.map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">{i + 1}</div>
              <div>
                <h2 className="font-bold text-gray-900 mb-1">{c.title}</h2>
                <p className="text-sm text-gray-600">{c.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/prada" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada Pre-Owned →</Link>
        <Link href="/compare/prada-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Gucci →</Link>
        <Link href="/guides/how-to-spot-fake-luxury-bags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Spot Fakes Guide →</Link>
      </div>
    </div>
  )
}
