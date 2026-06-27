import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate Dior Bags: Lady Dior & Saddle Guide 2025 | SecondLuxuryItems',
  description: 'Authenticate a Dior Lady Dior or Saddle Bag — stitching, cannage pattern, hardware, date code, and dust bag checks explained for pre-owned buyers.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-dior` },
}

export default function AuthenticateDiorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate Dior</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate a Dior Bag 2025</h1>
      <p className="text-gray-500 mb-10">Dior Lady Dior and Saddle authentication checklist — what to check before buying pre-owned.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lady Dior Authentication</h2>
        <div className="space-y-4">
          {[
            {
              check: '1. Cannage Stitching Pattern',
              real: 'Precise diamond stitching — equal size, uniform depth, tight tension. Diamonds should be consistent from top to bottom.',
              fake: 'Uneven diamonds, loose stitching, varying depths, puckering at corners'
            },
            {
              check: '2. "Christian Dior" Charms',
              real: '10 individual letter charms spelling "CHRISTIAN DIOR" — each letterform is crisp, gold is consistent, ring attachment is solid',
              fake: 'Letters may be too flat or too raised; ring attachments are often cheap and rattle; letter spacing inconsistent'
            },
            {
              check: '3. Zipper Pull',
              real: 'Heavy, substantial zipper pull. Engraved "CD" or "Christian Dior" on the pull. Smooth operation.',
              fake: 'Light, hollow-feeling pull; poorly engraved or stamped text; zipper catches'
            },
            {
              check: '4. Interior Lining',
              real: 'Genuine: Alcantara (suede-like) or cotton twill lining — the "DIOR" repeat pattern is precise, consistent coloring',
              fake: 'Shiny fabric or rough weave; blurry logo repeat; ink bleeding'
            },
            {
              check: '5. Date Code / Serial Number',
              real: 'Embossed on leather tab inside — format varies by year: older bags use letter+number codes, newer use RFID chips',
              fake: 'Printed rather than embossed; wrong format for the purported year'
            },
          ].map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5">
              <div className="font-semibold text-gray-900 mb-2">{item.check}</div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="text-green-800 bg-green-50 rounded-lg p-3">
                  <span className="font-medium">✓ Real: </span>{item.real}
                </div>
                <div className="text-red-800 bg-red-50 rounded-lg p-3">
                  <span className="font-medium">✗ Fake: </span>{item.fake}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Saddle Bag Authentication</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="border-l-4 border-blue-400 pl-4">
            <strong className="text-gray-900">Saddle shape:</strong> The distinctive D-shaped flap should be symmetrical with smooth curvature — flat spots or irregular curves indicate a replica
          </div>
          <div className="border-l-4 border-blue-400 pl-4">
            <strong className="text-gray-900">Embroidered "Christian Dior" on flap:</strong> Vintage Saddles (2000–2001 original, 2018 reissue) have slightly different embroidery styles — the 2018 reissue uses a more block-letter approach
          </div>
          <div className="border-l-4 border-blue-400 pl-4">
            <strong className="text-gray-900">Hardware weight:</strong> Real Saddle has substantial, weighty hardware. The D-shaped ring clasp should click solidly with no rattling
          </div>
          <div className="border-l-4 border-blue-400 pl-4">
            <strong className="text-gray-900">Oblique canvas (if applicable):</strong> The CD oblique logo repeat must be consistent, never cut mid-pattern at seams — Dior quality controls this carefully
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Dust Bag & Box Authentication</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>Authentic Dior dust bags are white cotton with "Christian Dior" woven (not printed) in the fabric. The font is consistent — check specifically that the "D" in Dior is open at the center (not a filled circle). Modern dust bags (2018+) include a RFID authentication card.</p>
          <p>Note: dust bags and boxes are easily counterfeited and widely sold separately. Their presence does NOT authenticate a bag — only check internal bag hardware and construction.</p>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Price Guide →</Link>
        <Link href="/compare/dior-vs-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Chanel →</Link>
        <Link href="/how-to-authenticate-chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Chanel →</Link>
      </div>
    </div>
  )
}
