import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Best Luxury Bags to Invest In 2026: Ranked by Resale Performance | SecondLuxuryItems',
  description: 'Which luxury bags to buy as investments in 2026? Hermès Birkin, Chanel Classic Flap, LV Neverfull — ranked by 5-year appreciation, resale retention, and pre-owned market liquidity.',
  alternates: { canonical: `${BASE}/trends/best-luxury-bags-to-invest-2026` },
}

const picks = [
  {
    rank: 1,
    tier: 'S-Tier Investment',
    bag: 'Hermès Birkin 25 / 30 (Togo or Epsom)',
    retention: '110–160% of retail',
    fiveYear: '+40–60% appreciation',
    why: 'The single best handbag investment available. Retail access is allocation-only, creating persistent secondary market premium. Birkin 25 Togo in black or gold outperforms almost any other non-financial asset over 10 years. The 2025 retail price (~$11,000) is now a floor, not a ceiling.',
    note: 'Avoid exotic skins unless you have authentication expertise — fakes and misidentified skins are common.',
  },
  {
    rank: 2,
    tier: 'S-Tier Investment',
    bag: 'Chanel Classic Flap (Medium, Lambskin or Caviar)',
    retention: '80–110% of retail',
    fiveYear: '+25–45% appreciation',
    why: 'Chanel raises retail prices ~10% every 6 months. A Classic Flap bought pre-owned two years ago has already appreciated in step with retail. Caviar leather (quilted, more durable) holds value slightly better than lambskin. The medium size is most liquid.',
    note: 'Authentication is critical — Chanel Classic Flap is one of the most counterfeited bags. CC clasp alignment is key.',
  },
  {
    rank: 3,
    tier: 'A-Tier Investment',
    bag: 'Hermès Kelly 28 / 35',
    retention: '100–145% of retail',
    fiveYear: '+30–55% appreciation',
    why: 'Marginally more accessible than Birkin through official retail, but still tightly allocation-controlled. The structured silhouette is more formal than the Birkin, limiting its daily-use versatility. However, collector demand for Sellier construction (external stitching) adds a premium.',
    note: 'Kelly 25 has become the fastest appreciating small Kelly size since 2022.',
  },
  {
    rank: 4,
    tier: 'A-Tier Investment',
    bag: 'Louis Vuitton Neverfull MM (Monogram)',
    retention: '70–90% of retail',
    fiveYear: '+15–25% appreciation',
    why: 'The Neverfull is the most liquid pre-owned bag in the world — outsells every other single model. Not the highest appreciation, but the fastest to sell if you need liquidity. Monogram canvas is durable and ages well. Entry point is accessible (~$1,200–1,600 pre-owned).',
    note: 'DE (Damier Ebene) holds value slightly less than Monogram — Monogram is preferred for resale.',
  },
  {
    rank: 5,
    tier: 'B-Tier Investment',
    bag: 'Bottega Veneta Jodie / Arco Tote',
    retention: '50–70% of retail',
    fiveYear: '+5–15% appreciation',
    why: 'Post-Daniel Lee era pieces have settled into a strong collector base. BV\'s "quiet luxury" positioning is insulated from trend cycles. The Intrecciato weave is genuinely hard to fake at high quality — authentication is easier than most brands. Jodie in Cloud, Butter, or Fondant colors command premiums.',
    note: 'Vintage BV (pre-2018 Lee era) is actually undervalued — the weave quality was excellent.',
  },
  {
    rank: 6,
    tier: 'B-Tier Investment',
    bag: 'Celine Classic Box (Philo era, pre-2018)',
    retention: '60–85% of original purchase price',
    fiveYear: '+10–30% appreciation',
    why: 'A Philo-era Celine box bought for $700 three years ago now fetches $1,000+. The Phoebe Philo halo effect (her own label launched 2023) has reignited collector demand for everything she designed at Celine. Very specific: only Philo-era pieces (pre-2018, no accent on CELINE).',
    note: 'Not every Philo piece is rising equally — the Box and Phantom are the strongest performers.',
  },
]

export default function BestLuxuryBagsToInvest2026() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Best Bags to Invest 2026</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Best Luxury Bags to Invest In 2026</h1>
      <p className="text-gray-500 mb-2">Ranked by 5-year appreciation rate and resale market liquidity.</p>
      <p className="text-xs text-gray-400 mb-10">Investment performance is based on secondary market data and historical retail price increases. Past appreciation does not guarantee future returns.</p>

      <div className="space-y-6 mb-12">
        {picks.map(p => (
          <div key={p.rank} className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">#{p.rank}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.tier.startsWith('S') ? 'bg-amber-100 text-amber-800' : p.tier.startsWith('A') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.tier}</span>
                </div>
                <h2 className="font-bold text-gray-900">{p.bag}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Resale retention</p>
                <p className="text-sm font-bold text-green-700">{p.retention}</p>
                <p className="text-xs text-amber-700">{p.fiveYear}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{p.why}</p>
            <p className="text-xs text-gray-400 italic">{p.note}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2">What NOT to buy as an investment</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Gucci, Prada, Balenciaga, Valentino — retention 40–60%, trend-sensitive</li>
            <li>• Any "It bag" from the last 2–3 years — insufficient track record</li>
            <li>• Exotic skins unless you can authenticate perfectly</li>
            <li>• Limited editions without serial paperwork</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Investment rules</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Papers/receipt/dustbag add 10–20% to resale</li>
            <li>• Neutral colors (black, gold, tan) outperform seasonal colors</li>
            <li>• Classic hardware (gold) outperforms silver or palladium on most Hermès</li>
            <li>• Never clean or condition leather yourself — use professionals only</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/trends/hermes-birkin-price-increase-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin Price History →</Link>
        <Link href="/compare/kelly-vs-birkin" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Kelly vs Birkin →</Link>
        <Link href="/trends/phoebe-philo-effect-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Philo-era Celine →</Link>
      </div>
    </div>
  )
}
