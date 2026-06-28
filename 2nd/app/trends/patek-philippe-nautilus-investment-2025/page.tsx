import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Patek Philippe Nautilus Investment 2025: 5711 vs 5726 & Market Outlook | SecondLuxuryItems',
  description: 'Patek Philippe Nautilus investment analysis 2025 — 5711/1A legend status, 5726A Annual Calendar, market correction from 2022 peak, and why the Nautilus remains the apex pre-owned watch.',
  alternates: { canonical: `${BASE}/trends/patek-philippe-nautilus-investment-2025` },
}

const references = [
  { ref: '5711/1A-010', name: 'Nautilus 5711/1A Stainless Olive Green', tag: '↑↑ Legend', price: '$160,000–220,000', retail: 'Discontinued 2021 ($34,893)', note: 'Last 5711/1A produced. Limited final run. Regularly exceeds 5× retail. The "Holy Grail" of modern production watches.' },
  { ref: '5711/1A-011', name: 'Nautilus 5711/1A Blue (Classic)', tag: '↑ Premium', price: '$60,000–90,000', retail: 'Discontinued 2021 ($29,765)', note: 'Original blue dial 5711/1A. Deep pre-owned market but prices corrected from 2022 peak ($120,000+). 2–3× retail is still strong.' },
  { ref: '5726A', name: 'Nautilus 5726A Annual Calendar', tag: '↑ Rising', price: '$55,000–80,000', retail: '~$65,000', note: 'Annual Calendar complication. Appeals to collectors who want function + Nautilus prestige. Approached retail in 2023 correction but rebounding.' },
  { ref: '5740G', name: 'Nautilus 5740G Perpetual Calendar (WG)', tag: '↑ Appreciating', price: '$140,000–200,000', retail: '~$120,000', note: 'Top-complication Nautilus. White gold + perpetual calendar. Very limited — premium over retail consistent.' },
  { ref: '5711/1R', name: 'Nautilus 5711/1R Rose Gold', tag: '→ Stable', price: '$45,000–70,000', retail: 'Discontinued ~$55,000', note: 'Rose gold version. Different collector demographic. Less liquid than steel but stable pricing.' },
]

export default function PatekNautilusInvestment2025() {
  const tagColor = (tag: string) => {
    if (tag.startsWith('↑↑')) return 'bg-green-900 text-green-100'
    if (tag.startsWith('↑')) return 'bg-green-700 text-green-100'
    return 'bg-gray-700 text-gray-100'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Patek Nautilus Investment 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Patek Philippe Nautilus Investment 2025: Which Reference?</h1>
      <p className="text-gray-500 mb-6">The Nautilus is the most investable watch in the world — but 2022-2024 saw significant market correction from the pandemic-era peaks. The 5711/1A blue dial that reached $120,000+ in 2022 is now $60,000-90,000. This correction separates the speculators from serious long-term holders.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-medium text-amber-900">2025 market context</p>
        <p className="text-sm text-amber-800">The Nautilus peaked in 2021-2022 driven by extreme supply constraint and pandemic-era luxury spending. Prices have corrected 20-50% from peak but remain 100-500% above retail across references. The correction created a buying window for the 5726A Annual Calendar (now closer to retail) and a reality check for 5711/1A buyers who hoped for continued appreciation. Long-term: the Nautilus 5711 is the last generation to have been discontinued — demand for it as a "final chapter" watch is structural.</p>
      </div>

      <div className="space-y-4 mb-10">
        {references.map((r, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="font-semibold text-gray-900">{r.name}</h2>
                <p className="text-xs text-gray-500">Ref. {r.ref}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${tagColor(r.tag)}`}>{r.tag}</span>
            </div>
            <div className="flex gap-4 mb-2 text-xs text-gray-500">
              <span>Pre-owned: <strong className="text-gray-700">{r.price}</strong></span>
              <span>Retail: {r.retail}</span>
            </div>
            <p className="text-sm text-gray-600">{r.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">Why the 5711/1A Olive Green is in a class of its own</h3>
        <p className="text-sm text-gray-300">Patek announced the 5711/1A's discontinuation in January 2021, simultaneously announcing a final limited run with an olive green dial (5711/1A-014). Only a few thousand were produced. At discontinuation announcement, the blue 5711/1A immediately jumped from $50,000 to $80,000+ pre-owned. The olive green, being the final piece, commands an extraordinary premium — $160,000–220,000 for what retailed at $34,893. No other production watch in history has commanded this consistent premium relative to retail.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/patek-philippe-nautilus-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Nautilus Guide →</Link>
        <Link href="/compare/rolex-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
        <Link href="/compare/ap-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP vs Patek →</Link>
        <Link href="/trends/rolex-daytona-investment-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Daytona Investment →</Link>
      </div>
    </div>
  )
}
