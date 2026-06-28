import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate Bulgari: Serpenti, B.zero1 & Diva Guides | SecondLuxuryItems',
  description: 'How to spot a fake Bulgari — Serpenti bracelet, B.zero1 ring, and Diva\'s Dream. 6 authentication checks with red flags and hallmark guide.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-bulgari` },
}

const checks = [
  {
    n: 1,
    label: 'BVLGARI Engraving (not "Bulgari")',
    pass: 'All authentic Bulgari pieces use the ancient Latin spelling "BVLGARI" — the "U" is written as "V". This is a founding-house decision referencing Roman inscriptions, not a typo.',
    fail: 'Any piece reading "BULGARI" (with U) on the interior is a fake. This single check eliminates most counterfeits immediately.',
  },
  {
    n: 2,
    label: 'Hallmark & Gold Purity Stamp',
    pass: 'Authentic gold Bulgari is stamped 750 (18k) or 585 (14k). White gold will be stamped 750 with Rhodium plating. Italian pieces also carry a government assay mark (star in oval for Italian manufacture).',
    fail: 'Missing or illegible hallmarks. Incorrect purity (e.g., 925 on something sold as gold). Hallmark placement should be consistent with the piece type — on Serpenti bracelets it\'s typically inside the spring mechanism.',
  },
  {
    n: 3,
    label: 'Serpenti Spring Mechanism',
    pass: 'The Serpenti coil bracelet uses a precision spring mechanism that allows it to coil and uncoil naturally around the wrist. Each segment should be individually articulated with smooth movement. Head detail should be crisp, with visible scale texture and set stones.',
    fail: 'Fakes frequently have stiff, mis-aligned segments. The head will have visible mold seams or flat stone settings instead of bezel-set or prong-set stones. Spring tension should feel substantial — flimsy coil spring is a red flag.',
  },
  {
    n: 4,
    label: 'B.zero1 Spiral Detail',
    pass: 'The B.zero1 ring has a distinctive spiral band that wraps around the central cylindrical barrel. The Bulgari logo should be cleanly engraved on the barrel, and the spiral wings should be flush and uniformly spaced. The ring should feel heavy for its size (solid gold, not hollow).',
    fail: 'Lightweight rings are hollow (plated base metal). Spiral edges that are sharp or uneven. Logo engraving that is shallow, blurry, or stamped rather than engraved. The barrel should not wobble relative to the spiral wings.',
  },
  {
    n: 5,
    label: 'Gemstone Setting Quality',
    pass: 'Bulgari\'s signature pave and bezel settings are precise. Stones sit flat and evenly spaced, prongs (where used) are consistent in height, and no glue residue is visible. Colored stones (Serpenti eye, Diva\'s Dream petals) should have natural variation when viewed under light.',
    fail: 'Uneven stone heights, visible glue at settings, stones that rock in their mounts. Fakes frequently use glass or low-grade synthetic stones — the tell is uniform color with no depth when viewed from the side.',
  },
  {
    n: 6,
    label: 'Interior Markings & Serial Number',
    pass: 'Most post-2000 Bulgari fine jewelry includes a model number or serial reference inside (e.g., on the B.zero1 barrel or inside the Serpenti clasp). The BVLGARI ROMA engraving is common on higher pieces.',
    fail: 'No interior marking, or markings in incorrect positions. Serial numbers on counterfeits are often repeated across multiple pieces or format differently than authentic Bulgari records.',
  },
]

export default function AuthenticateBulgari() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Bulgari</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Bulgari (BVLGARI)</h1>
      <p className="text-gray-500 mb-10">The Roman house founded in 1884 is consistently targeted by counterfeiters — especially the Serpenti coil bracelet and the B.zero1 ring. Six checks that eliminate fakes at every price point.</p>

      <div className="space-y-6 mb-10">
        {checks.map(c => (
          <div key={c.n} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs bg-gray-900 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold shrink-0">{c.n}</span>
              <h2 className="font-semibold text-gray-900">{c.label}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800 mb-1">✓ Authentic</p>
                <p className="text-sm text-green-700">{c.pass}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-800 mb-1">✗ Fake indicator</p>
                <p className="text-sm text-red-700">{c.fail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-900 mb-2">The single fastest check</h3>
        <p className="text-sm text-amber-800">Look for "BVLGARI" with a V — not "BULGARI" with a U. Every authentic piece uses the Roman spelling. This one test eliminates 90% of counterfeits within 30 seconds of inspection.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/bulgari" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bulgari Pre-Owned →</Link>
        <Link href="/compare/cartier-vs-bulgari" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Bulgari →</Link>
        <Link href="/compare/tiffany-vs-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Tiffany vs Van Cleef →</Link>
        <Link href="/guides/how-to-authenticate-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Auth VCA →</Link>
      </div>
    </div>
  )
}
