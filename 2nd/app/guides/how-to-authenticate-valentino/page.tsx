import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate Valentino: Rockstud, Roman Stud & Garavani (2025) | SecondLuxuryItems',
  description: 'Authenticate any Valentino bag with 7 checks: Rockstud pyramid studs, "VALENTINO GARAVANI" hardware, leather quality, interior serial, stitching, lining, and Made in Italy stamp.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-valentino` },
}

const checks = [
  {
    title: 'Rockstud pyramid dimensions and attachment',
    quick: 'Genuine Rockstud pyramids are 4mm at base, brushed not shiny, and screwed on — not glued',
    detail: 'The Rockstud pyramid is Valentino\'s most faked detail. Genuine pyramids: exactly 4mm base, matte-brushed finish (gold/silver/gunmetal), and each stud is a separate piece screwed into the leather (not glued). Tilt the bag under light — genuine pyramids have a uniform satin sheen, not high gloss. Fakes use plastic or lightweight metal studs with glue traces visible at the base, and the surface is often too shiny or unevenly finished.',
  },
  {
    title: '"VALENTINO GARAVANI" hardware engraving',
    quick: '"VALENTINO GARAVANI" in specific font on clasps, zipper pulls — not "VALENTINO" alone',
    detail: 'The brand name on hardware is always "VALENTINO GARAVANI" (full name) — never "VALENTINO" alone. The font is sans-serif, not bold, consistent spacing. On the Rockstud bag: the signature V-lock has "VALENTINO GARAVANI" engraved on the interior face of the lock. On zipper pulls: same full name. Fakes often use "VALENTINO" only, wrong font weight, or inconsistent letter spacing.',
  },
  {
    title: 'Interior serial and date code',
    quick: 'Interior leather stamp: style code + season code — stamped into leather, not printed',
    detail: 'Valentino bags have an interior leather stamp with a style code and season code. Format varies by decade: pre-2010 pieces use alpha-numeric codes; post-2015 use longer alphanumeric serials. The stamp must be pressed into the leather — never heat-printed or inkjet. An authenticity card (if included from purchase) will reference this same code. Fakes often have a printed label or a stamp that is too light or superficial.',
  },
  {
    title: 'Leather quality and finish',
    quick: 'New Valentino Nappa: buttery soft, even grain, matte finish — not rubbery or overly shiny',
    detail: 'Valentino uses primarily Italian nappa lambskin for the Rockstud and Roman Stud. Genuine nappa is buttery-soft with an even, very subtle grain. It has a slight matte finish (not high gloss). Under direct light, the surface should be smooth with no dimpling or uneven texture. Fakes use PU leather that feels rubbery, has an artificial grain pattern, or is excessively shiny. The Roman Stud (newer design) uses a quilted pattern — the quilting on genuine pieces is perfectly uniform.',
  },
  {
    title: 'Stitching consistency',
    quick: '8–10 stitches per inch, thread exactly matching leather — no gaps, no colour bleeding',
    detail: 'Valentino stitching is consistent at 8–10 stitches per inch on main panels, slightly tighter (10–12) on handle seams. Thread colour exactly matches leather. On the Rockstud: double saddle-stitch visible along the gusset. On the Roman Stud flap: single stitch at the quilting edge. Fakes have irregular stitch length, thread that bleeds, or visible gaps where the stitching loosens at corners.',
  },
  {
    title: 'Lining and interior quality',
    quick: 'Satin or quality suede lining, sewn flat — no rippling, no glued labels, no raw edges',
    detail: 'Valentino linings vary by model: the Rockstud flap has a smooth satin lining; the larger Valentino totes use quality cotton or suede. The lining must be sewn (not glued) and perfectly flat. The "VALENTINO" interior label is embossed on a leather tab and sewn in. Fakes: linings that pucker or ripple, labels that are glued or have the wrong font, and raw fabric edges inside pockets.',
  },
  {
    title: '"MADE IN ITALY" and country of origin',
    quick: '"MADE IN ITALY" on interior leather tab and engraved on hardware — no exceptions',
    detail: 'All genuine Valentino bags are produced in Italy. "MADE IN ITALY" appears on: (1) interior leather tab below the brand name, (2) back of hardware clasps. The interior tab reads "VALENTINO GARAVANI / MADE IN ITALY" in a specific sans-serif font. Fakes often stamp "MADE IN CHINA" or have a label glued over a different country marking. The font on authentic pieces: consistent weight, no italics, even letter spacing.',
  },
]

export default function AuthenticateValentino() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Valentino: 7 Checks</h1>
      <p className="text-gray-500 mb-4">Valentino fakes have become increasingly sophisticated, particularly for the Rockstud — the most faked Valentino bag. These seven checks cover the specific details that separate genuine Valentino from counterfeits.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">Fastest check: Rockstud pyramid attachment</p>
        <p className="text-sm text-amber-800">Hold the bag and gently try to twist a pyramid stud. On genuine Valentino: the stud is screwed tight and does not move at all. On fakes: glued studs have slight give or rotate. At the base of the stud where it meets the leather, genuine pieces show a clean, precise circular contact point with no glue traces. Any residue, gap, or looseness indicates a fake.</p>
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
            <li><strong>Rockstud:</strong> V-lock clasp interior: "VALENTINO GARAVANI" engraved — check font.</li>
            <li><strong>Roman Stud:</strong> Quilting must be perfectly uniform — each quilted diamond the same size.</li>
            <li><strong>Loco:</strong> Oversized VLogo buckle — "VALENTINO" incised into buckle face, clean edges.</li>
            <li><strong>Garavani totes:</strong> Base feet — 4 feet on genuine, plastic feet on fakes.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">Common fake signs</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Rockstud pyramids that are too shiny or can be twisted</li>
            <li>• "VALENTINO" only on hardware (not full "VALENTINO GARAVANI")</li>
            <li>• Rubber or PU leather smell</li>
            <li>• Interior lining that ripples or has glued labels</li>
            <li>• Missing "MADE IN ITALY" on hardware or interior tab</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Valentino Pre-Owned →</Link>
        <Link href="/compare/saint-laurent-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">YSL vs Valentino →</Link>
        <Link href="/compare/fendi-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Valentino →</Link>
        <Link href="/compare/dior-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Valentino →</Link>
      </div>
    </div>
  )
}
