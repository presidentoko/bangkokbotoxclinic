import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Gen Z Luxury Trends 2025: What Pre-Owned Pieces Are They Buying? | SecondLuxuryItems',
  description: 'Gen Z is reshaping the pre-owned luxury market in 2025 — Miu Miu, Loewe, vintage LV, Y2K jewellery. Which brands and pieces are Gen Z collectors actually buying?',
  alternates: { canonical: `${BASE}/trends/gen-z-luxury-trends-2025` },
}

const picks = [
  {
    item: 'Miu Miu Wander Bag',
    brand: 'Miu Miu',
    range: '$800–1,400',
    why: 'The #1 Gen Z luxury bag in 2023–2025 by Lyst search volume. The Wander\'s sheepskin fur trim and relaxed silhouette is a reaction against polished Millennial "it bag" culture. Gen Z buyers prefer authenticity over status — Miu Miu signals "I know fashion" rather than "I have money".',
  },
  {
    item: 'Louis Vuitton Speedy (vintage, 1990s–2005)',
    brand: 'Louis Vuitton',
    range: '$400–900',
    why: 'Vintage Speedy is the most searched LV bag by Gen Z. They buy it pre-owned, often unrestored, as a deliberate vintage flex. The patina is desirable — Gen Z doesn\'t want pristine condition. Monogram canvas in dark honey patina is currently the most valued.',
  },
  {
    item: 'Loewe Puzzle Bag (small)',
    brand: 'Loewe',
    range: '$900–1,400',
    why: 'Jonathan Anderson\'s Loewe under-promises and over-delivers on craft. Gen Z\'s version of quiet luxury — the Puzzle is intellectually interesting, not merely expensive. The small Puzzle in calfskin is the most accessible entry point and has the best resale liquidity.',
  },
  {
    item: 'Cartier Trinity Ring / Love Ring',
    brand: 'Cartier',
    range: '$500–1,200',
    why: 'Gen Z jewellery buying is dominated by "forever pieces" — the Trinity Ring (three bands: gold, rose, white) and Love Ring are the most purchased. Pre-owned makes them accessible at 20–30% below retail. They wear them as everyday stacks, not occasion pieces.',
  },
  {
    item: 'Y2K Dior Saddle Bag (vintage)',
    brand: 'Dior',
    range: '$700–2,200',
    why: 'The Dior Saddle from 2000–2005 (Galliano era) has been the pre-owned Y2K trophy for Gen Z since 2022. Pre-owned values have risen 40–60% from 2019 lows. The vintage pieces feel more culturally meaningful than the 2018 reissue.',
  },
  {
    item: 'Acne Studios / Nanushka (emerging)',
    brand: 'Contemporary',
    range: '$200–600',
    why: 'Not traditional luxury but increasingly crossover: pre-owned Acne Studios leather jackets, Nanushka vegan leather pieces, and Staud bags have become the Gen Z "entry luxury" tier. Less cachet but genuine craft at accessible prices.',
  },
]

export default function GenZLuxuryTrends2025() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Gen Z Luxury Trends 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Gen Z Luxury Trends 2025: What They're Actually Buying Pre-Owned</h1>
      <p className="text-gray-500 mb-10">Gen Z (born 1997–2012) became the fastest-growing segment of the luxury pre-owned market in 2023–2025. Their preferences differ sharply from Millennials — they value craft over status, vintage over pristine, and cultural resonance over brand prestige. Understanding these preferences helps predict where the pre-owned market moves next.</p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Gen Z vs Millennial luxury buying (pre-owned)</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">Millennials prefer:</p>
            <ul className="text-gray-600 space-y-1">
              <li>• Classic brands: Chanel, Hermès, LV</li>
              <li>• Near-mint condition</li>
              <li>• Investment rationale</li>
              <li>• Box and papers = priority</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Gen Z prefers:</p>
            <ul className="text-gray-600 space-y-1">
              <li>• Fashion-forward: Miu Miu, Loewe, vintage</li>
              <li>• Patina acceptable (even desirable)</li>
              <li>• Cultural meaning over value retention</li>
              <li>• Sustainability narrative matters</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {picks.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-medium">{p.brand}</span>
                <h2 className="font-semibold text-gray-900">{p.item}</h2>
              </div>
              <span className="text-xs font-semibold text-amber-700">{p.range}</span>
            </div>
            <p className="text-sm text-gray-600">{p.why}</p>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-purple-900 mb-2">What this means for pre-owned investors</h3>
        <p className="text-sm text-purple-800">Gen Z taste sets trends but doesn't always sustain them. Their focus on Miu Miu, vintage LV, and Loewe has already appreciated these categories 20–40% from 2021 lows. The risk: as Gen Z enters their peak earnings in 2026–2030, demand may shift to newer brands. The opportunity: vintage pieces (Galliano-era Dior, 1990s Miu Miu) have fundamental collector value that outlasts trend cycles.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/trends/miu-miu-rise-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Miu Miu Rise →</Link>
        <Link href="/trends/y2k-luxury-bags-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Y2K Luxury Bags →</Link>
        <Link href="/trends/phoebe-philo-effect-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Phoebe Philo Effect →</Link>
        <Link href="/trends/quiet-luxury-bags-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Quiet Luxury Bags →</Link>
      </div>
    </div>
  )
}
