import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Authenticate Saint Laurent Bags ${PRICE_YEAR}: Lou Lou, Loulou | SecondLuxuryItems`,
  description: `How to spot fake Saint Laurent bags — YSL clasp, engraving, leather, interior stamp, Lou Lou stitching, Loulou YSL logo. Authenticate YSL pre-owned ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-saint-laurent` },
}

const checks = [
  { title: 'YSL logo clasp (Lou Lou and Loulou)', detail: 'The "YSL" monogram clasp should be deeply engraved — press your fingernail into the letters and feel the depth. Authentic clasps have clean, even letter spacing. The "Y" has straight arms at equal angles, the "S" curves are smooth and symmetric, the "L" base is horizontal. Fakes often have shallow engraving that looks printed rather than stamped.' },
  { title: '"Saint Laurent Paris" interior stamp', detail: 'Authentic bags stamped in gold or silver: "SAINT LAURENT / PARIS / MADE IN ITALY" in clean uppercase. Since the rebrand (2012 under Hedi Slimane), the brand became "SAINT LAURENT" without "Yves" — any bag stamped "YVES SAINT LAURENT" is either vintage (pre-2012) or a fake of the current line. Know which era you are buying.' },
  { title: 'Loulou chain texture', detail: 'The chain on the Loulou and Lou Lou has a specific antiqued gold finish — not bright yellow gold. Run your finger along the chain links: each link should be smooth with clean joins. Fakes have rough joins where the chain links connect or a too-bright gold finish that looks like costume jewelry.' },
  { title: 'Quilted leather quality', detail: 'Saint Laurent quilted leather (on the Lou Lou) has an even, tight diamond pattern. The stitching within each diamond is consistent — same thread tension throughout. Fakes have uneven diamonds or diagonal stitching that drifts. The leather itself should be soft but structured — not floppy.' },
  { title: 'Interior fabric and lining', detail: 'Authentic YSL bags have a dark suede-like lining (usually black or dark grey). The "SAINT LAURENT" stamp inside is positioned carefully, never crooked. The zipper pull inside should match the exterior hardware. Fake linings often feel synthetic or plasticky and have the interior stamp off-center.' },
  { title: 'Serial number location', detail: 'Authentic Saint Laurent has a serial number on a leather patch inside the bag. The format is typically a long number series. The patch should be cleanly stitched — not glued. Feel the back of the patch through the lining; you should feel it as a slightly raised leather layer.' },
]

export default function AuthenticateYSL() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>How to Authenticate Saint Laurent</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Saint Laurent Bags {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Saint Laurent is one of the most faked luxury brands in Southeast Asia. The Lou Lou and Loulou are both high-counterfeit risk. The 2012 rebrand from "Yves Saint Laurent" to "Saint Laurent" is the most commonly exploited confusion in fakes. Six checks across the classic quilted and chain bags.</p>

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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">Era check: YSL vs Saint Laurent</h3>
        <p className="text-sm text-blue-800">Bags before 2012: "YVES SAINT LAURENT" stamped inside. Post-2012: "SAINT LAURENT PARIS." A fake Lou Lou (2016+ design) with "YVES SAINT LAURENT" stamp is trying to confuse both eras.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/saint-laurent" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Saint Laurent Pre-Owned →</Link>
        <Link href="/compare/saint-laurent-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Gucci →</Link>
        <Link href="/guides/how-to-spot-fake-luxury-bags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Spot Fakes Guide →</Link>
      </div>
    </div>
  )
}
