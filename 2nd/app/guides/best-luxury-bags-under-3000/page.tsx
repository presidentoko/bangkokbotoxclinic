import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Best Pre-Owned Luxury Bags Under $3,000 in ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `The best pre-owned luxury handbags under $3,000 in ${PRICE_YEAR} — Louis Vuitton, Gucci, Prada, Celine, Dior picks with resale data and what to look for.`,
  alternates: { canonical: `${BASE}/guides/best-luxury-bags-under-3000` },
}

const picks = [
  {
    brand: 'Louis Vuitton',
    bag: 'Neverfull MM (Monogram)',
    priceRange: '$1,000–$1,600',
    why: 'The best-recognized bag in the world, the Neverfull in pre-owned excellent condition sits 30–50% below current retail. Extremely liquid — sells in any market, any condition. If this is your first luxury bag, the Monogram Neverfull is the most defensible pre-owned purchase under $3,000.',
    watchFor: 'Date code format varies by era. Pre-2022 pieces have a date code inside; 2022+ have a microchip. Any seller unable to show the date code on older pieces is a red flag.',
    resale: '65–80% of pre-owned price — the safest resale in this price range',
  },
  {
    brand: 'Prada',
    bag: 'Re-Edition 2000 Mini (Re-Nylon)',
    priceRange: '$500–$900',
    why: 'The Re-Edition 2000 captured the nostalgia wave in 2021 and has become a permanent Prada staple. At $500–$900 pre-owned, it is the most affordable entry into a serious luxury brand. Lightweight, functional, and recognizable to fashion-literate eyes.',
    watchFor: 'Re-Nylon versions: check the enamel triangle logo plate for chipping (a common wear point). The seams where the nylon meets the leather trim should be clean and unfrayed.',
    resale: '60–75% — good liquidity due to low entry price',
  },
  {
    brand: 'Celine',
    bag: 'Luggage Nano',
    priceRange: '$900–$1,500',
    why: 'The Luggage is Celine\'s most iconic shape. At Nano size, it is compact (20cm wide) and works as a crossbody or top-handle. Celine pre-owned has improved as "quiet luxury" has gained ground. A Nano in good condition is one of the best quiet-luxury statements under $2,000.',
    watchFor: 'Celine brand changed from "CÉLINE" (Phoebe Philo era, pre-2018) to "CELINE" (Hedi Slimane era, post-2018). Earlier pieces now command a premium. Know which era you are buying.',
    resale: '50–65% — moderate liquidity',
  },
  {
    brand: 'Dior',
    bag: 'Book Tote (Canvas)',
    priceRange: '$700–$1,200',
    why: 'The canvas Book Tote is the most functional bag Dior makes. Large, structured, with the Dior toile de jouy pattern. Pre-owned canvas pieces under $1,200 are particularly well-priced given retail is now $2,800+. Canvas condition matters less than leather — scratches and light marks are largely invisible on canvas.',
    watchFor: 'The embroidered Book Totes (with patterns) command higher prices. Canvas versions are the entry. Interior fabric should be clean — stains on the canvas lining are harder to clean than leather.',
    resale: '55–70% — steady demand for iconic canvas',
  },
  {
    brand: 'Gucci',
    bag: 'Dionysus Small (GG Supreme)',
    priceRange: '$600–$1,200',
    why: 'The Dionysus under Alessandro Michele is one of the most collected Gucci pieces. At $600–$1,200 in the small size, it provides access to one of the most creative director runs in recent luxury history. GG Supreme canvas versions are lower maintenance than leather.',
    watchFor: 'Post–Alessandro Michele (2024 Sabato De Sarno era) Dionysus: slightly different hardware and interior stamp. Michele-era pieces are preferred by collectors. Check the era of the piece before buying.',
    resale: '55–70% for Michele-era pieces',
  },
  {
    brand: 'Bottega Veneta',
    bag: 'Jodie Small',
    priceRange: '$1,200–$1,800',
    why: 'The Jodie is the quietest designer bag you can carry — zero visible branding, pure Intrecciato weave. The Jodie small under Matthieu Blazy (2022+) holds resale value well and positions you in the strongest-growing segment of quiet luxury. Under $2,000 pre-owned, it is exceptional value.',
    watchFor: 'Blazy-era Jodies (2022+) have a rounder shape and more refined weave than Lee-era. Both are authentic; prices differ. Check the weave tightness and consistency — loose or uneven weave sections are a fake indicator.',
    resale: '70–85% — among the strongest in this price tier',
  },
]

export default function BestBagsUnder3000() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Best Luxury Bags Under $3,000</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Pre-Owned Luxury Bags Under $3,000 in {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">The most expensive bags get the most attention, but pre-owned luxury under $3,000 is where the best value-to-prestige ratio lives. These six picks are ranked for brand recognition, resale flexibility, and why they make sense as your first or next pre-owned purchase in 2025.</p>

      <div className="space-y-5 mb-10">
        {picks.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
              <div>
                <h2 className="font-bold text-gray-900">{p.brand}: {p.bag}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{p.resale}</p>
              </div>
              <div className="shrink-0 font-semibold text-gray-900">{p.priceRange}</div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{p.why}</p>
            <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2"><strong>Watch for: </strong>{p.watchFor}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/first-luxury-bag" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">First Luxury Bag Guide →</Link>
        <Link href="/guides/luxury-bags-as-investments" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bags as Investments →</Link>
        <Link href="/guides/luxury-condition-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Condition Grading →</Link>
      </div>
    </div>
  )
}
