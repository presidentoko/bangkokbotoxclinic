import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Authenticate Bottega Veneta Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Authenticate Bottega Veneta bags — Jodie, Arco, Cassette. Check the intrecciato weave, leather quality, hardware, and stitching. Complete ${PRICE_YEAR} guide.`,
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-bottega-veneta` },
}

const checks = [
  {
    step: 1,
    title: 'Intrecciato Weave Consistency',
    detail: 'BV\'s signature woven leather should have uniform diagonal strips with consistent spacing. Each strip should be approximately 5–8mm wide. Fakes often show uneven gaps, fraying edges between strips, or inconsistent angles. Run your finger across — authentic weave feels smooth and flush, not raised or bumpy.',
  },
  {
    step: 2,
    title: 'Leather Quality & Feel',
    detail: 'Bottega Veneta uses nappa lamb, calf, and Cervo (deer) leathers. Lambskin should feel impossibly soft with subtle grain. Calfskin is firmer with fine pebble texture. Fake leather feels plasticky, uniform, or stiff. Authentic BV leather has a slight warmth and yielding quality on first touch.',
  },
  {
    step: 3,
    title: 'Hardware (Minimal by Design)',
    detail: 'BV intentionally uses almost no visible hardware or branding. The Jodie has a knotted handle — no clasp. The Arco uses a simple top zipper with a fabric pull. What hardware exists should be matte or brushed (rarely high-shine), heavy, and smooth-turning. Gritty zippers or wobbling hardware = fake.',
  },
  {
    step: 4,
    title: 'Interior Lining & Stitching',
    detail: 'Interior is typically suede or smooth calf leather (never nylon or cheap fabric). Stitching at stress points (handles, corners) should be even, tightly spaced (8–10 stitches per cm), and same color as the leather. No glue residue visible. The knot at the Jodie handle should be perfectly formed.',
  },
  {
    step: 5,
    title: 'Interior Stamp (Pre-2021)',
    detail: 'Pre-Daniel Lee pieces (pre-2021) have the "Bottega Veneta" logo stamped in gold inside. Post-2022 pieces under Matthieu Blazy may vary. The stamp should be crisp, evenly spaced lettering. Blurry, smudged, or off-center stamps indicate fake.',
  },
  {
    step: 6,
    title: 'Made In Italy Stamp',
    detail: 'All BV is made in Italy (primarily Vicenza and Montebello). Look for "Made in Italy" and the maison\'s stamp inside. No serial numbers (unlike LV or Chanel) — BV does not use serial or date codes on most pieces.',
  },
]

export default function AuthBottegaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Bottega Veneta</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Bottega Veneta Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Bottega Veneta is among the most counterfeited luxury brands — ironically because its weave is both iconic and difficult to replicate well. Here are 6 checks that separate authentic BV from fakes.</p>

      <div className="space-y-4 mb-10">
        {checks.map(check => (
          <div key={check.step} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{check.step}</span>
              <h2 className="font-semibold text-gray-900">{check.title}</h2>
            </div>
            <p className="text-sm text-gray-600 ml-10">{check.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>The weave tells the story:</strong> Authentic BV intrecciato takes 3–5 hours per bag to complete. Counterfeiters cannot replicate the consistency of hand-woven high-grade leather at scale. If the weave looks right, the piece is almost certainly real. If it looks slightly off — wrong width, uneven tension, visible fraying — trust your eyes.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bottega Veneta Pre-Owned →</Link>
        <Link href="/compare/hermes-vs-bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès vs BV →</Link>
        <Link href="/guides/how-to-spot-fake-luxury-bags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Spot Fake Luxury Bags →</Link>
      </div>
    </div>
  )
}
