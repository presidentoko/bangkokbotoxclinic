import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Authenticate Balenciaga Bags ${PRICE_YEAR}: Triple S, City Bag | SecondLuxuryItems`,
  description: `How to spot fake Balenciaga bags — City bag hardware, Triple S sole construction, Cagole zip, interior stamp, leather texture. Authenticate Balenciaga pre-owned ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/guides/how-to-authenticate-balenciaga` },
}

const checks = [
  { title: 'City bag hardware: "Balenciaga Paris" engraving', detail: 'The buckle and zip pull on the City bag are engraved "BALENCIAGA PARIS" in crisp, deep lettering. The font is specific — the "B" and "G" have a distinctive weight. Fake City bags often have blurry or shallow engraving, or the spacing between letters is uneven. Run your fingernail across the engraving and feel the depth — it should be clearly recessed.' },
  { title: 'Triple S sole construction', detail: 'The Triple S sole is three-layered: each layer is visible from the side. Authentic Triple S has even layer heights and a clean seam where each layer meets. The "Balenciaga" text on the tongue is stitched, not stamped. Fakes have mismatched layer heights or the "S" wavy texture on the mid-sole is too regular — the authentic version has subtle variation across the pattern.' },
  { title: 'Cagole: zip and hardware weight', detail: 'The Cagole uses a heavy YKK zipper with "BALENCIAGA" pull tab engraving. The hardware overall — studs, chain, buckles — should feel genuinely substantial, not hollow. Cagole fakes often have lightweight hardware that sounds hollow when tapped against a hard surface. Authentic studs have a pyramid profile that is consistent across all studs on the bag.' },
  { title: '"Balenciaga" interior stamp', detail: 'Interior stamp: "BALENCIAGA / MADE IN SPAIN" (or ITALY on older pieces) in clean uppercase. The font should be consistent with the exterior branding. Fakes often have the stamp slightly off-center or in the wrong font weight. City bags made before 2012 may say "MADE IN FRANCE" — if the serial number is 2017+ and says "MADE IN FRANCE," that is a red flag.' },
  { title: 'Leather texture (City, Cagole)', detail: 'Authentic Balenciaga City leather has a distinctive "arena" texture — a slightly mottled, distressed feel that is soft but not floppy. It should have slight variation in color depth across the surface (the natural aging the house celebrates). Fakes use leather that is either too uniform in texture or too stiff. Run your finger across the surface — authentic arena leather feels almost like paper-thin glove leather.' },
  { title: 'Serial number tag', detail: 'Authentic Balenciaga bags have a leather serial number tag stitched into the interior seam. The format is a long numeric code. The stitching holding the tag should match the bag\'s interior construction — same thread color and even tension. Fakes often have the tag glued rather than stitched, or use a different thread color.' },
]

export default function AuthenticateBalenciaga() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>How to Authenticate Balenciaga</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Authenticate Balenciaga Bags {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Balenciaga is one of the most counterfeited brands in Asia, particularly the Triple S sneaker and City bag. The City bag (Nicolas Ghesquière era, pre-2012) is heavily faked due to its iconic status. The Triple S is one of the most counterfeited sneakers globally. Six checks for bags and footwear.</p>

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

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-900 mb-2">City bag era guide</h3>
        <p className="text-sm text-amber-800">Nicolas Ghesquière era City bags (2001–2012): most sought-after, "MADE IN FRANCE" on tags. Demna Gvasalia era (2015+): "MADE IN SPAIN" or "MADE IN ITALY." Avoid any City bag claiming to be 2015+ with a "MADE IN FRANCE" stamp — that combination does not exist authentically.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/balenciaga" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga Pre-Owned →</Link>
        <Link href="/compare/balenciaga-vs-valentino" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga vs Valentino →</Link>
        <Link href="/guides/how-to-spot-fake-luxury-bags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Spot Fakes Guide →</Link>
      </div>
    </div>
  )
}
