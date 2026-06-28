import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate TAG Heuer: 7 Checks (2025 Guide) | SecondLuxuryItems',
  description: 'Authenticate any TAG Heuer watch with 7 checks: case engraving, dial text, movement finish, crown logo, serial format, clasp, and bezel. Covers Aquaracer, Carrera, Monaco.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-tag-heuer` },
}

const checks = [
  {
    title: 'Case back engraving',
    quick: 'Always "SWISS MADE IN GERMANY" on modern pieces or "SWISS MADE" with model name',
    detail: 'Genuine TAG Heuer case backs have deep, precise laser engraving. The "H" of Heuer is always larger than the surrounding letters. On Aquaracer: 300M screw-down caseback with wave pattern. On Carrera: solid polished caseback. On fakes: shallow engraving, inconsistent font weight, missing "H" emphasis.',
  },
  {
    title: 'Dial text and logo precision',
    quick: '"TAG Heuer" text should be razor-crisp — any blur or feathering is a red flag',
    detail: 'The TAG Heuer logo uses a specific helvetica-like font. The "H" in "Heuer" has a distinctive cross-bar. Subdial text is printed, not applied — look for consistent ink depth. On Carrera, the chronograph subdials have crisp white printed text. On fakes: fuzzy text edges, incorrect font weight, inconsistent capitalization.',
  },
  {
    title: 'Movement quality through caseback',
    quick: 'Many TAG Heuers have solid casebacks — if you can see the movement, check for "ETA" or "CAL." markings',
    detail: 'TAG Heuer uses ETA (Swatch Group) movements, Sellita movements, and their own Calibre 5 (based on ETA 2824-2). Heuer 02 chronograph movement is in-house and easily verified by the column wheel and vertical clutch. Fakes often use cheap Chinese movements that look correct but have inconsistent rotor weight and finishing.',
  },
  {
    title: 'Crown and pushers',
    quick: 'TAG Heuer engraved on crown face — should be centered, deep, and consistent',
    detail: 'The crown shows "TAG HEUER" text in a specific circular pattern on the crown face. On chronographs (Carrera, Monaco): pushers should have positive engagement feel with a mechanical click. Fakes have crowns that are too light, too dark, or with incorrect engraving depth. The Aquaracer screw-down crown must thread smoothly without resistance.',
  },
  {
    title: 'Serial number format and placement',
    quick: 'Serial on caseback, reference on clasp and paperwork — must match',
    detail: 'TAG Heuer serial numbers are 8 characters: letters + numbers (e.g., FV312A00). On modern pieces post-2014, the serial is on the caseback, not between the lugs. Reference number is engraved on the clasp. If the seller cannot produce matching documentation, verify the serial on TAG Heuer\'s website at support.tagheuer.com. Fakes often have serials that don\'t match the clasp reference.',
  },
  {
    title: 'Bracelet and clasp quality',
    quick: 'Shark mesh, link bracelets: all links should move smoothly with no lateral play',
    detail: 'TAG Heuer\'s shark mesh bracelet (Aquaracer) is a dense weave that should lie perfectly flat. The clasp is engraved "TAG HEUER" and has an additional "H" security closure on modern pieces. Link bracelets (Carrera): links are secured by threaded screws, not push-pins. Fakes use push-pin construction or have loose links with lateral wobble. The clasp deployment should engage firmly.',
  },
  {
    title: 'Crystal and anti-reflective coating',
    quick: 'Sapphire crystal shows a blue-green tint in light — no tint usually means mineral glass',
    detail: 'All modern TAG Heuer watches use sapphire crystal with anti-reflective coating on the inside. When viewed at an angle under light, the crystal shows a blue-green iridescent shimmer. The Monaco uses flat sapphire crystal with the same coating. Fakes typically use mineral glass or very thin sapphire without proper coating — no shimmer effect, or wrong color (orange instead of blue-green).',
  },
]

export default function AuthenticateTagHeuer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>How to Authenticate TAG Heuer</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate a TAG Heuer Watch: 7 Checks</h1>
      <p className="text-gray-500 mb-4">TAG Heuer is one of the most counterfeited Swiss watch brands — their Aquaracer, Carrera, and Monaco are produced in high-volume fakes across all price points. The good news: genuine TAG Heuers have specific manufacturing details that fakes consistently get wrong. Here are seven checks to run before any purchase.</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-blue-900 font-medium">Quick check: The crown engraving</p>
        <p className="text-sm text-blue-800">The fastest single check: look at the crown face under a loupe or macro photo. "TAG HEUER" in a circular arrangement, perfectly centered. The engraving should be deep with sharp edges. A blurry, shallow, or off-center crown engraving is almost always a fake.</p>
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
            <li><strong>Aquaracer:</strong> Rotating bezel should engage with positive clicks — 120 total positions. One-way only.</li>
            <li><strong>Carrera:</strong> Tachymeter bezel (if equipped) should have etched not painted numbers</li>
            <li><strong>Monaco:</strong> Square case must be exactly 39mm — fakes are often slightly off. Crown is at 9 o'clock position.</li>
            <li><strong>Formula 1:</strong> Entry-level line — ceramic bezel on quartz versions should be scratch-free</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">Common fake signs</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• "SWISS MADE" missing from dial at 6 o'clock</li>
            <li>• Cyclops lens over date (TAG Heuer doesn't use cyclops)</li>
            <li>• Crown that unscrews but doesn't have a waterproof feel</li>
            <li>• Incorrect subdial positions on Carrera chronograph</li>
            <li>• Pushers that feel hollow or plastic</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/tag-heuer" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">TAG Heuer Pre-Owned →</Link>
        <Link href="/compare/omega-vs-tag-heuer" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Omega vs TAG Heuer →</Link>
        <Link href="/guides/how-to-authenticate-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Omega →</Link>
        <Link href="/guides/how-to-authenticate-rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Rolex →</Link>
      </div>
    </div>
  )
}
