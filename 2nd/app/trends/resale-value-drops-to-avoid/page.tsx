import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Luxury Bags That Drop in Resale Value: What to Avoid 2025 | SecondLuxuryItems',
  description: 'Which luxury bags lose value fastest? Avoid overpaying for trendy pieces with weak resale. Data-driven guide to 2025 value traps and what to buy instead.',
  alternates: { canonical: `${BASE}/trends/resale-value-drops-to-avoid` },
}

const drops = [
  {
    item: 'Gucci GG Marmont (top-handle)',
    peak: '2018–2020',
    dropEst: '60–70% from peak',
    why: 'Logo-heavy, fast trend cycle, now associated with its peak era',
    avoid: true,
  },
  {
    item: 'Fendi Baguette (fabric / embellished)',
    peak: '2019–2022',
    dropEst: '40–55% from peak',
    why: 'Trend-driven revival cooled; embellished versions are era-specific',
    avoid: true,
  },
  {
    item: 'Balenciaga City Bag',
    peak: '2007–2013',
    dropEst: '50–65% from 2010',
    why: 'Brand controversy 2022–2023 + fashion cycle; basic styles recoverable',
    avoid: true,
  },
  {
    item: 'LV Pochette Métis (seasonal canvas)',
    peak: '2021',
    dropEst: '25–35% from 2021',
    why: 'Special editions depreciate faster; Monogram/DE holds better',
    avoid: false,
  },
  {
    item: 'Dior Saddle Bag (large)',
    peak: '2019–2021',
    dropEst: '30–45%',
    why: 'Revival trend faded; mini size more durable (functional)',
    avoid: false,
  },
  {
    item: 'Prada Nylon Backpack',
    peak: '1999–2001 / 2020 revival',
    dropEst: '50–70% from revival peak',
    why: 'Nostalgia wave subsided; nylon resells poorly vs leather',
    avoid: true,
  },
]

const holds = [
  { item: 'Chanel Classic Flap (small/medium)', why: 'Annual price increases, timeless, high demand' },
  { item: 'LV Neverfull MM (Monogram/DE)', why: 'Evergreen, massive secondary market, holds 70–90%' },
  { item: 'Hermès Birkin/Kelly (neutral Togo)', why: 'Sells above retail consistently' },
  { item: 'Bottega Veneta Jodie (classic woven)', why: "Quiet luxury, steady demand, doesn't date" },
  { item: 'Cartier Love Bracelet / Juste un Clou', why: "Jewelry doesn't date like bags" },
]

export default function ResaleValueDropsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Resale Value Drops</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Luxury Bags That Drop in Resale Value: Avoid These 2025</h1>
      <p className="text-gray-500 mb-10">Not all luxury bags hold their value. Trendy pieces with logo saturation, brand controversies, or fast fashion cycles can lose 50–70% of their peak price. Here's what to watch out for — and what to buy instead.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pieces That Have Dropped Significantly</h2>
        <div className="space-y-3">
          {drops.map((d, i) => (
            <div key={i} className={`border rounded-xl p-4 ${d.avoid ? 'border-red-100 bg-red-50/40' : 'border-amber-100 bg-amber-50/30'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{d.item}</h3>
                  <p className="text-xs text-gray-500 mb-2">Peak: {d.peak} · Est. drop: {d.dropEst}</p>
                  <p className="text-sm text-gray-600">{d.why}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-medium ml-4 shrink-0 ${d.avoid ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {d.avoid ? 'Avoid' : 'Caution'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What Holds Value Instead</h2>
        <div className="space-y-2">
          {holds.map((h, i) => (
            <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-gray-100">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <div>
                <span className="font-medium text-gray-900">{h.item}</span>
                <span className="text-gray-500 ml-2">— {h.why}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 mb-8">
        <strong>The rule:</strong> Pieces driven by logo trends or celebrity moments depreciate the fastest. Classic hardware bags in neutral leathers from houses with controlled supply (Hermès, Chanel) hold the best. When buying to resell, favor timeless over trendy.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/trends/luxury-bags-above-retail" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Above-Retail Bags →</Link>
        <Link href="/guides/pre-owned-vs-new-luxury" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Pre-Owned vs New →</Link>
        <Link href="/guides/luxury-bags-as-investments" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Bags as Investments →</Link>
      </div>
    </div>
  )
}
