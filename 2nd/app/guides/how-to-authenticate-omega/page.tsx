import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate Omega: Speedmaster & Seamaster Guide | SecondLuxuryItems',
  description: 'How to spot a fake Omega watch — Speedmaster Moonwatch, Seamaster 300M, Constellation. 7 authentication checks with movement verification and caseback tips.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-omega` },
}

const checks = [
  {
    n: 1,
    label: 'Caseback Engraving Depth & Quality',
    pass: 'Omega casebacks are either solid (screwback) with a seahorse engraving, or display (exhibition) with anti-reflective sapphire crystal. The "SWISS MADE" text and reference numbers on the caseback should be laser-engraved — sharp, clean, consistent depth.',
    fail: 'Shallow, uneven engraving. Blurry seahorse motif. Screwbacks with visible tool marks (fakes are often opened and re-closed clumsily). On exhibition backs: low-quality sapphire with visible distortion when looking at the movement.',
  },
  {
    n: 2,
    label: 'Movement Quality (Exhibition Back Models)',
    pass: 'Omega Co-Axial movements have distinctive Geneva stripes on the bridges, blue screws on the balance wheel and escape wheel, and a COSC-stamped or METAS-certified chronometer designation on the movement itself. The Speedmaster Cal.1861/3861 should show the classic column wheel.',
    fail: 'Uneven Geneva stripes or stamped-looking finishing. Missing blue screws. Movement text is blurry or poorly applied. The oscillation should be smooth and consistent — a fake movement often shows uneven regulation.',
  },
  {
    n: 3,
    label: 'Dial Text Sharpness (Omega Logo)',
    pass: 'The Omega logo (Ω) on the dial is laser-applied or printed with crisp edges. The "OMEGA" wordmark below the symbol should have no blurring, spacing inconsistencies, or uneven ink application. Swiss Made text at 6 o\'clock should be small, clean, and centered.',
    fail: 'Blurry Omega symbol. Uneven spacing in "OMEGA" or "SWISS MADE". Date window text that doesn\'t align cleanly with the magnification lens (if equipped). Lume plots that look flat or painted rather than applied.',
  },
  {
    n: 4,
    label: 'Bezel (Seamaster 300M: Ceramic)',
    pass: 'Seamaster 300M (2005+) uses a ceramic bezel insert with platinum or gold fill on the minute indices. The ceramic should be matte, uniform color, and the indices should feel inset (not painted over). Helium escape valve at 10 o\'clock should unscrew smoothly.',
    fail: 'Painted or anodized aluminum bezel attempting to look ceramic. Indices that scratch off easily. Helium escape valve that doesn\'t turn or is cosmetic only. Color variations across the bezel (real ceramic is uniform from ring production).',
  },
  {
    n: 5,
    label: 'Crown & Pushers (Speedmaster)',
    pass: 'The Speedmaster crown has a distinctive ring profile and should wind smoothly with appropriate resistance. Pushers at 2 and 4 o\'clock have a positive click. Caseback screw-in crown on the Seamaster should require multiple turns to seal.',
    fail: 'Spongy or unresponsive pushers. Wobbly crown with little resistance. On Seamasters: crown that doesn\'t require significant torque to seal — indicating non-waterproof construction.',
  },
  {
    n: 6,
    label: 'Serial Number Verification',
    pass: 'Omega serial numbers (on caseback or between lugs on older models) can be verified against Omega\'s public serial range database to confirm approximate year of manufacture. Post-2010 casebacks have laser-engraved reference and serial inside.',
    fail: 'Serial numbers that don\'t match the claimed year. Duplicate serials (fakes reuse known serials). Pre-2010 models: serial stamped between lugs should be evenly deep and consistent — fakes are typically shallower and less precise.',
  },
  {
    n: 7,
    label: 'Bracelet Quality & End Links',
    pass: 'Omega bracelets (brushed/polished on Seamaster) should have consistent brushing direction, solid end links that fit flush with the case, and a clasp that clicks firmly. The Speedmaster tropical bracelet or mesh strap should flex uniformly across all links.',
    fail: 'Hollow bracelet that feels lightweight. End links with visible gaps at the case junction. Clasp that opens too easily or doesn\'t click positively. On meshes: uneven weave or links that don\'t flex consistently.',
  },
]

export default function AuthenticateOmega() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Omega</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate an Omega Watch</h1>
      <p className="text-gray-500 mb-10">Omega is the second most counterfeited watch brand after Rolex — the Seamaster 300M and Speedmaster Moonwatch are the most targeted models. Seven checks that identify fakes across all price points.</p>

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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">Register your watch</h3>
        <p className="text-sm text-blue-800">Omega offers a free authentication and service history lookup via their warranty card system. For pre-owned purchases, the Omega website can validate a serial number against production records — use this before paying for any watch over $1,500.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega Pre-Owned →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/compare/omega-vs-iwc" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs IWC →</Link>
        <Link href="/guides/best-pre-owned-watches-under-5000" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Watches Under $5k →</Link>
      </div>
    </div>
  )
}
