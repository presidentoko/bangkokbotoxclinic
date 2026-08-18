import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Authenticate a Rolex: 8-Point Check ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Authenticate a pre-owned Rolex before buying — rehaut engraving, serial weight, movement sweep, dial printing, crown, clasp, and more. ${PRICE_YEAR} guide.`,
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-rolex` },
}

const checks = [
  {
    n: 1, title: 'Case Weight',
    detail: 'Genuine Rolex uses 904L steel (Oyster) or 18k gold alloy — both significantly heavier than the 316L stainless or chrome-plated zinc on fakes. A 40mm Datejust in steel should weigh ~140–160g with bracelet. Hold it in your palm. Fakes feel noticeably lighter and cheaper.',
  },
  {
    n: 2, title: 'Rehaut (Inner Bezel) Engraving',
    detail: 'Since 2002, all Rolex watches have "ROLEX ROLEX ROLEX" engraved around the rehaut (the angled ring between dial and crystal). The engraving should be laser-etched, perfectly uniform, and microscopically precise. On fakes it\'s either absent, stamped (not laser), or uneven. Use a loupe at 10× — any blur means fake.',
  },
  {
    n: 3, title: 'Crown Guard at 3 O\'clock',
    detail: 'Modern Rolex (2008+) has a serial number laser-engraved at the 6 o\'clock position between the lugs, visible at an angle. Pre-2008 have between-lug serial at 12 o\'clock. Check the number against Rolex\'s known serial-to-year database. If the number style doesn\'t match the claimed year, it\'s suspect.',
  },
  {
    n: 4, title: 'Caseback',
    detail: 'Rolex casebacks are plain polished metal — no exhibition window (display) on production watches. Fakes often have a transparent sapphire back "to show the movement." If someone is selling a Rolex with a display caseback, it is either a very old vintage piece or a replica. The caseback text should read ROLEX OYSTER ORIGINAL GAS ESCAPE VALVE with fine brushwork.',
  },
  {
    n: 5, title: 'Movement Sweep',
    detail: 'Rolex movements beat at 8 ticks per second (28,800 bph), producing an almost perfectly smooth sweep. The seconds hand should glide. If it ticks once per second (quartz) — immediately fake. If it ticks 6× per second (budget automatic) — also fake. Record with slow-motion video and count the ticks.',
  },
  {
    n: 6, title: 'Cyclops Lens Magnification',
    detail: 'The Cyclops lens over the date (on models with date) should magnify the date 2.5×, making the number nearly fill the lens. Fakes use cheap plastic magnifiers that give 1.5× or less — the date looks small in the lens. Close-focus your camera over the lens and compare.',
  },
  {
    n: 7, title: 'Dial Printing Quality',
    detail: 'Rolex dials are created with multi-layer printing and physical applied indexes (raised hour markers). The "ROLEX" and "OYSTER PERPETUAL" text should have a lacquer 3D quality under magnification. Flat, slightly fuzzy printing is a red flag. Luminous dots on the indexes should be perfectly circular and equal size.',
  },
  {
    n: 8, title: 'Crown and Crown Logo',
    detail: 'The Rolex crown logo on the dial should be microscopically sharp at 10× magnification. On fakes it\'s either missing entirely, printed flat, or blurry under a loupe. The Triplock crown on waterproof models has a rubber-sealed stem — turn it and feel for the smooth, positive click of the genuine article.',
  },
]

export default function AuthenticateRolexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Authenticate a Rolex</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate a Rolex: 8-Point Check</h1>
      <p className="text-gray-500 mb-10">The grey market is full of convincing Rolex replicas. These 8 checks — done in order — will identify 99% of fakes before you pay.</p>

      <div className="space-y-6 mb-12">
        {checks.map(c => (
          <div key={c.n} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{c.n}</div>
              <div>
                <div className="font-semibold text-gray-900 mb-2">{c.title}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{c.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900 mb-8">
        <strong>Instant red flags:</strong> display caseback, quartz movement, price under $2,000 for a current stainless Submariner (retail is $9,100), mismatched serial year, or a seller who won't allow a watchmaker inspection.
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 mb-8">
        <strong>For peace of mind:</strong> Watchmakers and specialist dealers (Wempe, Bucherer) often do in-person authentication. Third-party services like Entrupy or Dial & Bezel do photo-based authentication from $40–80.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/rolex-reference-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Reference Guide →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/brands/rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Pre-Owned →</Link>
      </div>
    </div>
  )
}
