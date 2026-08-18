import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Authenticate Fendi: 7 Checks for Baguette, Peekaboo & More (${PRICE_YEAR}) | SecondLuxuryItems`,
  description: 'Authenticate any Fendi bag with 7 checks: FF logo stitching, Zucca canvas, interior serial, hardware quality, lining, zipper, and stitching consistency. Covers Baguette, Peekaboo, Kan I.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-fendi` },
}

const checks = [
  {
    title: 'FF logo and Zucca canvas pattern',
    quick: 'FF logos must be perfectly mirrored and symmetrical — any misalignment at seams is a fake sign',
    detail: 'Fendi\'s double-F (FF) logo and Zucca canvas pattern must align perfectly at every seam and corner. On the Baguette in Zucca canvas: the pattern continues seamlessly across the flap. On the Kan I and Sunshine bags: the FF monogram is woven into the fabric, not printed on top. Fakes consistently fail on pattern alignment — the canvas shifts at seams or the pattern is scaled incorrectly.',
  },
  {
    title: 'Interior serial number and authenticity card',
    quick: 'Serial on interior leather tab, format: RU-## series or alphanumeric depending on year',
    detail: 'Genuine Fendi bags have an interior serial number on a leather tab. Format varies by year: older pieces use a pattern like "RU-23 Made in Italy"; modern pieces use a longer alphanumeric code. The serial must be stamped into the leather, not printed. An authenticity card (if original) must have the serial matching the interior stamp. Fendi moved to chip-based authentication (NFC) for some post-2022 pieces.',
  },
  {
    title: 'Hardware quality and engraving',
    quick: '"FENDI" engraved on all hardware — zipper pulls, clasps, feet, locks — not stamped or printed',
    detail: 'All genuine Fendi hardware is weighty, with "FENDI" engraved (not stamped) on zipper pulls, clasps, and feet. On the Peekaboo: the two clasps at the base have "FENDI" on the interior face. On the Baguette: the FF clasp is smooth-turning with positive engagement. Gold hardware should not tarnish within months — Fendi uses real gold plating. Fakes have lightweight hardware, shallow "FENDI" lettering, and clasps that stick or wobble.',
  },
  {
    title: 'Stitching consistency',
    quick: '8–10 stitches per inch, consistent thread colour exactly matching leather — no variation',
    detail: 'Fendi stitching is extremely consistent: 8–10 stitches per inch depending on leather thickness. Thread colour exactly matches (or deliberately contrasts) the leather — both are intentional choices, not mistakes. On the Baguette, double stitching runs along the gusset and base. On the Peekaboo, single saddle-stitch on main panels. Fakes have irregular stitch length, thread that bleeds colour, and corners where stitching puckers or gaps.',
  },
  {
    title: 'Leather quality and smell',
    quick: 'New genuine Fendi leather smells clean and slightly sweet — harsh chemical smell = fake',
    detail: 'Fendi uses primarily Roman nappa, satin, and specialty leathers. New leather has a clean, slightly sweet smell (tannin + leather conditioner). Genuine lambskin is buttery soft without feeling flimsy. The calf leather on Peekaboo has a very slight grain visible under light. Fakes use PU leather that smells strongly of plastic/chemicals and feels stiff or too stretchy. The inside of the flap on genuine bags: smooth, cool to the touch, no pilling.',
  },
  {
    title: 'Lining fabric and interior finishing',
    quick: 'Fendi linings are typically satin or quality cotton — perfectly sewn, no raw edges',
    detail: 'The lining in a genuine Fendi Baguette is fabric (varies by season: satin, cotton, sometimes leather) sewn perfectly flat with no puckering. Interior pockets have clean finished edges and the Fendi label is sewn on without exposed threads. On Peekaboo: full leather interior with consistent grain. Fakes have linings that ripple, labels that are glued not sewn, and visible glue residue along interior seams.',
  },
  {
    title: 'Made in Italy / Roma stamp',
    quick: '"FENDI ROMA" and "MADE IN ITALY" must appear on both the interior label and exterior hardware',
    detail: 'All genuine Fendi bags are made in Italy. "FENDI ROMA" appears on the interior label in a specific font — sans-serif, no italics. "MADE IN ITALY" is on a separate leather tab below the brand name. On some hardware (particularly the Peekaboo clasp interior): "MADE IN ITALY" is engraved. Fakes often have "Made in China" hidden inside or use incorrect font weight on "FENDI ROMA". The Roma has a specific appearance — not bold, not italic, consistent spacing.',
  },
]

export default function AuthenticateFendi() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Fendi</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Fendi: 7 Checks</h1>
      <p className="text-gray-500 mb-4">Fendi bags — particularly the Baguette and Peekaboo — are among the most counterfeited in the market. High-quality fakes can fool casual buyers. These seven checks cover the specific details genuine Fendi always gets right and fakes consistently get wrong.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">Fastest check: FF canvas pattern alignment</p>
        <p className="text-sm text-amber-800">On any Zucca or FF canvas Fendi piece, look at the seams and corners. The FF logo pattern must continue perfectly across every seam with no shift. Hold the bag up to light and look at the corner where the front meets the side — genuine Fendi aligns the pattern precisely. Any misalignment at a seam immediately indicates a fake.</p>
      </div>

      <div className="space-y-4 mb-10">
        {checks.map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-1">{i + 1}. {c.title}</h2>
            <p className="text-xs text-amber-700 font-medium mb-2">{c.quick}</p>
            <p className="text-sm text-gray-600">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="font-semibold text-green-900 mb-2">Model-specific tips</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li><strong>Baguette:</strong> FF clasp must turn smoothly — not click. The turn is smooth and engages with a soft lock.</li>
            <li><strong>Peekaboo:</strong> Two-compartment structure — gusset between compartments should be full grain leather.</li>
            <li><strong>Kan I:</strong> Spiral stud has a specific screw-on mechanism — fakes glue the stud.</li>
            <li><strong>Mini Sunshine:</strong> Chain link proportion — each link is 12mm wide on genuine. Fakes use narrower links.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">Common fake signs</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• FF pattern misalignment at seams or corners</li>
            <li>• Serial number printed rather than stamped</li>
            <li>• Hardware that tarnishes quickly or has shallow "FENDI" lettering</li>
            <li>• Lining that ripples or has raw edges</li>
            <li>• "Made in China" stamp hidden inside</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/fendi" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi Pre-Owned →</Link>
        <Link href="/compare/fendi-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href="/compare/fendi-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Valentino →</Link>
        <Link href="/compare/fendi-vs-dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Dior →</Link>
      </div>
    </div>
  )
}
