import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate Van Cleef & Arpels Jewelry 2025: Alhambra | SecondLuxuryItems',
  description: 'How to spot fake Van Cleef & Arpels — Alhambra motif size, metal quality, signature engraving, stone setting, clasp system, certificate. Authenticate VCA pre-owned 2025.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-van-cleef` },
}

const checks = [
  { title: 'Alhambra motif: size and proportions', detail: 'The four-leaf clover (Alhambra) motif is precisely 1.5cm × 1.5cm per clover. Each clover has exactly 4 rounded petals with a center stone. Fakes often have motifs that are slightly too large (1.6–1.8cm) or petals that are not perfectly round. Hold the piece against a ruler — if the motif is outside the 1.4–1.6cm range, it is suspicious.' },
  { title: '"Van Cleef & Arpels" engraving on clasp', detail: 'The clasp of a necklace or bracelet is engraved "Van Cleef & Arpels" on the interior surface in a specific, fine font. The ampersand (&) is distinctive — a clean, balanced character. The period after "Arpels" in some periods. Use a loupe: the engraving should be sharp and crisp, not blurry or shallow. "VCA" shorthand engraving does NOT appear on authentic pieces — any clasp engraved "VCA" is fake.' },
  { title: 'Hallmarks and metal stamps', detail: '18k gold pieces: stamped "750" inside the clasp or on a connecting link. For platinum: "950 Plat" or "Pt950." French pieces also carry the French guarantee mark (owl or eagle head). The stamps are microscopic — use 10x magnification. Any piece without the correct hallmark for the metal claimed is immediately suspect.' },
  { title: 'Stone setting: golden bezel around each motif', detail: 'The Alhambra\'s clover petals are set within a gold bezel that has a distinctive milled (textured) edge pattern — like a cogwheel rim on each petal edge. This milling should be even and precise across all petals and across all links in a multi-clover piece. Fakes often have too smooth a rim or irregular milling depth that varies by petal.' },
  { title: 'Mother-of-pearl quality (for MOP versions)', detail: 'Van Cleef Alhambra pieces in mother-of-pearl should have a consistent, luminous iridescence across the entire clover surface. The color should shift between white, cream, and faint pink-green depending on angle. Fakes use plastic or resin "MOP" that does not shift — it looks static and flat in direct light.' },
  { title: 'Certificate and box', detail: 'VCA issues a certificate of authenticity with a unique ID number. Original box is a white square box with Van Cleef & Arpels branding in black. Interior is white leather-wrapped. Note: many pre-owned VCA pieces arrive without the original certificate — authentication then relies on hallmarks, engraving, and physical characteristics. A missing certificate does not mean fake; incorrect engraving does.' },
]

export default function AuthenticateVCA() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Van Cleef & Arpels</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Van Cleef & Arpels 2025</h1>
      <p className="text-gray-500 mb-10">Van Cleef & Arpels Alhambra is one of the most counterfeited jewelry pieces globally. The motif is simple enough that high-quality replicas exist at every price point. Six checks focusing on the Alhambra necklace and bracelet — the most commonly faked VCA pieces.</p>

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

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-red-900 mb-2">Immediate red flags</h3>
        <ul className="text-sm text-red-800 space-y-1">
          <li>• Clasp engraved "VCA" (authentic pieces say "Van Cleef & Arpels" in full)</li>
          <li>• Motif significantly larger or smaller than 1.5cm</li>
          <li>• No hallmark inside clasp</li>
          <li>• Milled edge on petals is smooth or irregular</li>
          <li>• MOP that looks flat/static (not shifting color)</li>
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Van Cleef Pre-Owned →</Link>
        <Link href="/compare/cartier-vs-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Van Cleef →</Link>
        <Link href="/guides/how-to-authenticate-cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Cartier →</Link>
      </div>
    </div>
  )
}
