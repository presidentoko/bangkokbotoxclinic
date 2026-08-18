import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Authenticate Loewe: Puzzle, Hammock & Cubi (${PRICE_YEAR}) | SecondLuxuryItems`,
  description: 'Authenticate any Loewe bag with 7 checks: Anagram logo emboss, nappa leather quality, single-hide Puzzle panel construction, hardware engraving, interior stamp, stitching, and Made in Spain.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-loewe` },
}

const checks = [
  {
    title: 'Anagram logo — emboss depth and font precision',
    quick: '"LOEWE" inside double-L pattern: precisely embossed, never printed — consistent depth across all letters',
    detail: 'The Loewe Anagram (interlocking L-shaped letters forming a stylised "L") must be perfectly embossed into leather or woven into canvas. The emboss has a consistent depth across all elements — never uneven. On the Puzzle, Hammock, and Cubi, the Anagram appears on the turn-lock hardware and sometimes the interior. On smaller accessories: it\'s on a debossed leather patch. Fakes either print the logo flat (no depth), use a slightly different letterform, or have uneven emboss depth at certain letters.',
  },
  {
    title: 'Puzzle panel construction — single hide',
    quick: 'Each Puzzle panel cut from a single hide — no colour variance within one panel, and panels interlock precisely',
    detail: 'The Loewe Puzzle bag is named for its distinct geometric panel construction. Genuine Puzzle: each triangular and rectangular panel is cut from a single piece of nappa calf leather. Panels interlock at very precise angles with consistent stitching at each seam. The key tell: within any given panel, the leather grain is perfectly consistent (one hide). Fakes use leather panels with grain inconsistency within a single panel, or the joints between panels are irregular. The bottom corners where panels meet should form a perfect geometric fold — fake Puzzles pucker or gap at these corners.',
  },
  {
    title: '"LOEWE" hardware engraving',
    quick: '"LOEWE" in a specific uppercase sans-serif font, engraved on clasps and zipper pulls — never printed',
    detail: 'Loewe hardware bears "LOEWE" in a clean, capital sans-serif font. The engraving is deep and precise — each letter the same depth. On the Puzzle turn-lock: "LOEWE" is on the front face. On zipper pulls: "LOEWE" is on the flat face. Loewe doesn\'t use excessive hardware branding (unlike some brands); most pieces have just the turn-lock or one zip pull with the name. Fakes have shallow "LOEWE" lettering, inconsistent character weight, or the wrong font entirely.',
  },
  {
    title: 'Nappa leather quality — calf and lambskin',
    quick: 'Loewe nappa: buttery soft, very fine grain, slight natural variation — not uniform PU grain',
    detail: 'Loewe is known for using exceptional-quality nappa (Spanish and European calf and lambskin). The leather is buttery-soft with a very fine, natural grain that has slight variation — this is intentional, not a defect. Each hide has minor tonal differences and grain variation that are signs of genuine leather. The leather is cool to the touch and smooth without being slippery. Fakes use PU leather that is too uniform in texture (no natural grain variation), too shiny, and warms quickly in hand. Genuine Loewe leather also has a very faint clean smell — not chemical.',
  },
  {
    title: 'Interior stamp and serial',
    quick: '"LOEWE MADE IN SPAIN" debossed into interior leather — specific font, correct positioning',
    detail: 'Loewe is a Spanish heritage house (founded 1846, Madrid). All genuine pieces are "MADE IN SPAIN." The interior leather stamp reads "LOEWE" above "MADE IN SPAIN" in a clean, consistent font — debossed into the leather (not printed). Modern pieces (post-2013, Jonathan Anderson era) also include a serial number on a separate leather tag. The serial is stamped, not printed. Fakes often stamp "MADE IN ITALY" (wrong country), use a different font, or have a printed serial.',
  },
  {
    title: 'Stitching — saddle stitch quality',
    quick: '8-10 even stitches per inch, thread exactly matches leather — no gaps, no bleeding',
    detail: 'Loewe uses a traditional saddle-stitch on most pieces — a stronger, hand-finished technique visible on panel edges of the Puzzle and Hammock. Stitches: 8-10 per inch, consistent tension. Thread exactly matches leather colour. On the Puzzle: the stitching at each panel seam follows the panel edge precisely. Fakes have machine-stitching (less even than saddle-stitch), incorrect thread colour, or gaps at corner joins where panels meet.',
  },
  {
    title: 'Hardware finish and weight',
    quick: 'Palladium/gold hardware: weighty, satin finish — not lightweight or high-gloss',
    detail: 'Loewe hardware (typically palladium-plated or gold-plated brass) is substantial in weight and has a satin (not mirror) finish. The turn-lock mechanism engages smoothly with a positive click. Zipper pulls have a slight drag — genuine metal weight. Fakes use lightweight hardware with a plastic core, high-gloss finish (too shiny), and turn-locks that wobble or don\'t engage cleanly.',
  },
]

export default function AuthenticateLoewe() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Loewe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Loewe: 7 Checks</h1>
      <p className="text-gray-500 mb-4">Loewe has become one of the most faked luxury brands since the Puzzle bag's rise under Jonathan Anderson from 2014 onward. High-quality fakes now replicate the construction closely — but the panel geometry, leather quality, and hardware always reveal the truth.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">Fastest check: Puzzle panel corner geometry</p>
        <p className="text-sm text-amber-800">On a genuine Loewe Puzzle, look at the bottom corners where three different panels meet. The geometry is precise — each panel meets at a clean angle with no puckering, gaps, or irregular stitching. The seam is perfectly flat. On fakes, these corners almost always show puckering, an irregular joint, or a gap between panels. No single test separates genuine from fake Puzzles faster.</p>
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
            <li><strong>Puzzle (Small/Medium):</strong> Count the panels — genuine Puzzle Small: 18 panels. Medium: 18 panels (slightly larger). Each panel cut from one piece of calf leather.</li>
            <li><strong>Hammock:</strong> The fold-over top is a single piece of nappa — no seam across the fold.</li>
            <li><strong>Cubi:</strong> Interlocking brass rings are weighty and precise — fakes use lightweight alloy rings.</li>
            <li><strong>Squeeze:</strong> Square shape — all four bottom feet are evenly spaced and screw-on (not glued).</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">Common fake signs</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Puzzle panels that pucker or gap at corner joins</li>
            <li>• PU leather with uniform grain (no natural variation)</li>
            <li>• Shallow "LOEWE" hardware engraving or wrong font</li>
            <li>• "MADE IN ITALY" instead of "MADE IN SPAIN"</li>
            <li>• Printed interior serial (genuine: stamped into leather)</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe Pre-Owned →</Link>
        <Link href="/compare/loewe-vs-celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
        <Link href="/compare/bottega-veneta-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">BV vs Loewe →</Link>
        <Link href="/compare/fendi-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href="/compare/jacquemus-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Jacquemus vs Loewe →</Link>
      </div>
    </div>
  )
}
