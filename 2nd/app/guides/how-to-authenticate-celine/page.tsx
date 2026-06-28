import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Authenticate Celine Bags 2025: Classic, Triomphe | SecondLuxuryItems',
  description: 'How to spot fake Celine bags — Triomphe canvas print, interior stamp, zipper hardware, classic box hardware. Authenticate Celine Luggage, Classic, Triomphe 2025.',
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-celine` },
}

const checks = [
  { title: 'Triomphe arc print (canvas bags)', detail: 'The Triomphe "C" overlapping logo should be perfectly symmetrical. On authentic bags the canvas has a woven texture — run your finger across and feel the fine weave. Fakes often use a flat printed canvas. The "CELINE" text in the repeat should be perfectly spaced with the exact same kerning throughout. Check the cut edges of the canvas — authentic Celine canvas has clean, heat-sealed edges.' },
  { title: 'Interior stamp and font', detail: 'Authentic Celine bags stamped with "CELINE / PARIS" in gold or silver debossed lettering (not printed). The font is clean sans-serif — "E" has three even horizontal bars, the spacing between letters is precise. Post-2018 Celine (under Hedi Slimane) uses no accent on the "E" — just "CELINE" without the accent mark that Phoebe Philo-era used ("CÉLINE"). Fakes confuse the eras.' },
  { title: 'Classic Box hardware (turn-lock)', detail: 'The Classic Box turn-lock has a specific click when locked — sharp and definitive, not loose. The "CELINE" engraving on the turn-lock should be precise and deep. Fake turn-locks feel wobbly and the engraving is often shallow. Press the lock from the side — authentic has zero lateral movement.' },
  { title: 'Zipper and pull quality', detail: 'Authentic Celine uses YKK or custom zippers with "CELINE" engraved on the pull. The zipper pull should be heavy for its size. Zippers on the Luggage bag should open and close with even resistance throughout. Fakes have zippers that catch, skip, or feel plasticky.' },
  { title: 'Leather texture and smell', detail: 'Authentic Celine calfskin (the most common leather) has a slightly pebbled, consistent texture. The smell is a clean, high-grade leather — not sharp chemicals or rubber. Fakes often have irregular pebble texture with patches that look pressed or smoothed. The interior suede-like lining should be evenly soft, not patchy.' },
  { title: 'Serial number and date code', detail: 'Authentic Celine has a serial number on a leather tag sewn inside the main compartment. The format is: [letter][number series] (e.g., "M-[8 digits]" or similar). Fakes often have the tag glued instead of sewn. Check the thread on the tag — it matches the interior lining color on authentic pieces.' },
]

export default function AuthenticateCeline() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>How to Authenticate Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Celine Bags 2025</h1>
      <p className="text-gray-500 mb-10">Celine counterfeits have become more sophisticated since the Triomphe canvas trend. The Luggage and Classic Box are heavily faked. The post-2018 transition from "CÉLINE" (with accent) to "CELINE" (without) is the most common era confusion in fakes. Six checks that work across Celine generations.</p>

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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">Era check: CÉLINE vs CELINE</h3>
        <p className="text-sm text-blue-800">Phoebe Philo era (before 2018): bags stamped "CÉLINE" with accent. Hedi Slimane era (2018–present): "CELINE" without accent. A fake that mixes eras — Philo-era shape with Slimane-era stamp — is an immediate red flag.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/celine" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine Pre-Owned →</Link>
        <Link href="/compare/celine-vs-saint-laurent" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Celine vs Saint Laurent →</Link>
        <Link href="/guides/how-to-spot-fake-luxury-bags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Spot Fakes Guide →</Link>
      </div>
    </div>
  )
}
