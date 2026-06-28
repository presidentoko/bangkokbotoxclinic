import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Rolex Daytona Investment 2025: Which Reference & Is It Worth Buying? | SecondLuxuryItems',
  description: 'Rolex Daytona investment analysis 2025 — Panda vs Reverse Panda, steel vs gold, ceramic bezel shift, Paul Newman vintage opportunity, and pre-owned price outlook.',
  alternates: { canonical: `${BASE}/trends/rolex-daytona-investment-2025` },
}

const references = [
  { ref: '116500LN', name: 'Daytona 40mm Ceramic (Steel)', tag: '↑ Stable-High', price: '$18,000–28,000', retail: '$14,550', note: 'Current flagship. Ceramic bezel since 2016. White "Panda" dial: higher demand.' },
  { ref: '116500LN (Black)', name: 'Daytona Ceramic Black Dial', tag: '→ Stable', price: '$17,000–25,000', retail: '$14,550', note: '"Reverse Panda." Slightly lower demand than white dial but strong floor.' },
  { ref: '116520', name: 'Daytona 40mm SS (Pre-2016)', tag: '↑ Rising', price: '$14,000–20,000', retail: 'Discontinued ~$10,000', note: 'Last steel Daytona before ceramic bezel. Sought by purists.' },
  { ref: '116506', name: 'Daytona Platinum/Ice Blue', tag: '↑ Appreciating', price: '$65,000–90,000', retail: '$75,000', note: 'Ultra-rare. Retail is approachable only at AD relationship, secondary market volatile.' },
  { ref: '6263/6265', name: 'Vintage Paul Newman (1960s-80s)', tag: '↑↑ Steeply rising', price: '$40,000–400,000+', retail: 'N/A', note: 'The original Paul Newman dials. Extraordinary collector demand. Auction record: $17.8M.' },
]

export default function RolexDaytonaInvestment2025() {
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
        <span>Rolex Daytona Investment 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Rolex Daytona Investment 2025: Which Reference to Buy?</h1>
      <p className="text-gray-500 mb-6">The Daytona is Rolex's most celebrated chronograph and one of the few modern production watches that consistently trades above retail in secondary markets. But not all references perform equally — and the 2025 market has shifted significantly from the peak frenzy of 2021-2022.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-medium text-amber-900">2025 market context</p>
        <p className="text-sm text-amber-800">Rolex Daytona prices peaked in 2021-2022 (steel 116500LN reaching $35,000–45,000 pre-owned). They have since corrected to $18,000–28,000 — still 20-90% above retail, but no longer the extreme premiums of the pandemic era. This correction is a buying window for long-term holders; day-traders who expected continued short-term appreciation have been disappointed.</p>
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
              {r.retail !== 'N/A' && <span>Retail: {r.retail}</span>}
            </div>
            <p className="text-sm text-gray-600">{r.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">Paul Newman Daytona: an extraordinary story</h3>
        <p className="text-sm text-gray-300">The "Paul Newman" Daytona refers to refs 6239, 6240, 6263, 6265 with a distinctive "exotic" dial — extra chapter ring, different sub-dial design. Actor Paul Newman wore one throughout the 1970s-1980s. When his personal Daytona ref. 6239 sold at auction in 2017 for $17.75 million, it reset the market for all Newman dial Daytonas. Authentic Newman dials in excellent condition start at $40,000 and can exceed $400,000. The challenge: extensive faking — do not buy vintage Daytona without expert authentication.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Panda vs Reverse Panda</h3>
          <p className="text-xs text-gray-600">White dial (Panda) consistently commands $1,000–3,000 premium over black dial on the same ref. Both are strong; white is slightly more liquid.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Ceramic vs Oysterflext</h3>
          <p className="text-xs text-gray-600">The Oysterflext rubber strap variant (2023+) commands a premium for novelty but traditional Oystersteel bracelet has proven deeper secondary liquidity.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Box and papers</h3>
          <p className="text-xs text-gray-600">A Daytona with original box and papers (B&P complete set) commands $2,000–5,000 premium over "no papers" examples. Always verify papers match the reference number on caseback.</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/how-to-authenticate-rolex" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Rolex →</Link>
        <Link href="/guides/rolex-submariner-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Submariner Guide →</Link>
        <Link href="/guides/rolex-reference-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Reference Guide →</Link>
        <Link href="/compare/rolex-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
        <Link href="/trends/quiet-luxury-watch-brands-2025" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Quiet Luxury Watches →</Link>
      </div>
    </div>
  )
}
