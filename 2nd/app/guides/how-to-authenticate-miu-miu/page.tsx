import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Authenticate Miu Miu: Wander, Arcadie & Matelassé (${PRICE_YEAR}) | SecondLuxuryItems`,
  description: 'Authenticate any Miu Miu bag with 7 checks: "MIU MIU" emboss on interior tab, serial format, hardware, washed nappa texture, matelassé quilting, stitching, and Made in Italy verification.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-miu-miu` },
}

const checks = [
  {
    title: '"MIU MIU" interior leather tab emboss',
    quick: '"MIU MIU" embossed on interior leather tab in a specific sans-serif: two equal words, same size, correct spacing',
    detail: 'Every genuine Miu Miu bag has an interior leather tab stamped "MIU MIU" in a clean uppercase sans-serif. The two "MIU" words are the same size, same weight, evenly spaced with a gap between them. Below: "MADE IN ITALY." On older pieces (pre-2015): the font is slightly different — thinner serifs. On post-2015 pieces: clean geometric sans-serif. Fakes have the wrong font (often too bold), uneven word spacing, or use "MiuMiu" without the space. The tab itself should be quality leather with no fraying.',
  },
  {
    title: 'Serial number format',
    quick: 'Serial on interior tab or embossed separately: 2 letters + 4 digits (e.g., FP1234) — not printed, stamped',
    detail: 'Miu Miu serial format: 2 uppercase letters + 4 digits. The first letter codes the color or leather type; the second codes the season or factory. This is stamped (not printed) into a leather tab, either attached to the interior lining or embossed on the back of the "MIU MIU" label tab. The digits are not sequential — they reference the production run. Fakes often use 6-8 digit numeric-only serials (copying the Prada format incorrectly, since Miu Miu uses the 2+4 format distinct from Prada\'s codes).',
  },
  {
    title: 'Washed nappa leather — texture and feel',
    quick: 'Washed nappa Wander: matte, slightly pebbled with soft micro-wrinkle texture — not smooth, not shiny',
    detail: 'The signature Miu Miu Wander bag uses a "washed" nappa lambskin that has been tumbled to create a soft, slightly crinkled texture with a matte finish. When you run your finger across it, there should be a slight resistance — not slippery smooth. Under direct light: a very subtle micro-texture pattern, not high-gloss. Fakes replicate this with either smooth PU leather (too flat, too shiny) or textured PU (too uniform, too regular). Genuine washed nappa also has natural tonal variation — slightly lighter at folds and slightly darker at the base of the crinkles.',
  },
  {
    title: 'Matelassé quilting precision',
    quick: 'Matelassé diamonds: perfectly uniform in size, consistent depth, no puckering at corners',
    detail: 'For quilted Miu Miu pieces (Matelassé collection), the quilting must be perfectly uniform. Each diamond is the same size with consistent depth from edge to edge. At the corners where four diamonds meet, the leather forms a clean four-pointed junction — no puckering, no gap. The stitching channel is even. Fakes have irregular diamond sizes (diamonds narrow at edges), puckering at corners, or stitching that is too deep (causing the leather to bunch) or too shallow (causing the diamonds to look flat).',
  },
  {
    title: '"MIU MIU" hardware and metal clasp',
    quick: '"MIU MIU" on hardware: clean engraving, appropriate weight — the Wander bow closure is cast metal, not plastic',
    detail: 'Miu Miu hardware varies by collection: the Wander has a signature bow-clasp in burnished metal; the Arcadie has a simple clasp with "MIU MIU" on the interior face. All hardware: the "MIU MIU" text is engraved (not stamped), consistent depth across both words. The Wander bow is cast metal — substantial weight, bow arms do not flex under light pressure. Fakes use lightweight hardware that feels hollow or bends slightly, and the "MIU MIU" text is often too shallow or uses a different character spacing.',
  },
  {
    title: 'Stitching and construction quality',
    quick: '8–10 stitches per inch, thread exactly matching leather — double stitching at stress points',
    detail: 'Miu Miu stitching: 8-10 per inch, consistent tension. Thread matches leather colour exactly. Double-stitching at handle attachment and base corners. On the Wander: the ruched detail at the handle base is formed by deliberate gathering with additional stitches — the gathers should be even. On the Arcadie: single stitching at the main panels. Fakes have irregular stitch length, thread colour that doesn\'t match, or gathers at the Wander handle that are uneven.',
  },
  {
    title: 'Lining and interior quality',
    quick: 'Miu Miu lining: quality woven fabric or suede, perfectly flat — "MIU MIU" hardware and leather tabs always sewn, never glued',
    detail: 'Miu Miu linings are typically a quality woven nylon or natural fabric, sewn flat with no rippling. Interior pockets have finished edges. The "MIU MIU" label tab is always sewn in at both ends — not glued. Fakes have linings that ripple, labels that are glued on one end, and interior pockets with raw edges. Some Miu Miu pieces use a suede interior — genuine suede is fine, consistent, and doesn\'t pill; fake suede pilles immediately.',
  },
]

export default function AuthenticateMiuMiu() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Miu Miu</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Miu Miu: 7 Checks</h1>
      <p className="text-gray-500 mb-4">Miu Miu fakes have surged alongside the brand's Gen Z resurgence — particularly for the Wander bag. These checks focus on the specific construction details that distinguish genuine Miu Miu from high-quality counterfeits.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">Fastest check: serial number format</p>
        <p className="text-sm text-amber-800">Genuine Miu Miu serial format: 2 uppercase letters + 4 digits (e.g., FP1234, RL5678). If the serial is all numbers, has more than 6 characters, or uses lowercase letters, it is not a genuine Miu Miu serial. This single check eliminates a large portion of fakes immediately — many fakes copy Prada's longer serial format by mistake, since Miu Miu and Prada are sister brands with different serial conventions.</p>
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
            <li><strong>Wander:</strong> Bow clasp must be cast metal (weighty). Ruching at handle: even gathers, same interval.</li>
            <li><strong>Arcadie:</strong> Two-compartment flap — the partition between compartments should be full leather, not fabric.</li>
            <li><strong>Matelassé:</strong> All diamonds identical size. Four-point corner junction: no puckering.</li>
            <li><strong>Vintage (1990s-2000s):</strong> Serial may use older format — check font on "MIU MIU" tab (slightly different letterform than current).</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">Common fake signs</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Serial that is all-numeric or has more than 6 characters</li>
            <li>• "MiuMiu" (no space) or wrong font weight on interior tab</li>
            <li>• Wander bow clasp that bends under light pressure</li>
            <li>• Matelassé puckering at diamond corners</li>
            <li>• PU leather with no natural tonal variation</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/miu-miu" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu Pre-Owned →</Link>
        <Link href="/compare/prada-vs-miu-miu" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Miu Miu →</Link>
        <Link href="/trends/miu-miu-rise-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu Rise 2025 →</Link>
        <Link href="/guides/how-to-authenticate-prada" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Prada →</Link>
      </div>
    </div>
  )
}
