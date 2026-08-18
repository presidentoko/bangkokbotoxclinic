import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Chanel Mini Flap vs Small Classic Flap ${PRICE_YEAR}: Size Guide | SecondLuxuryItems`,
  description: `Chanel Mini Flap vs Classic Flap Small ${PRICE_YEAR} — dimensions, what fits, price difference, which size to buy pre-owned. Mini Square vs Mini Rectangular vs Small.`,
  alternates: { canonical: `${BASE}/guides/chanel-mini-vs-small-flap` },
}

const sizes = [
  { name: 'Mini Rectangular (6 × 4 × 2.5 in)', category: 'Mini', price: '$2,200–$3,800', retail: '~$4,600', fits: 'Phone, cards, lipstick, small wallet only', note: 'The evening bag. Most often worn crossbody. High resale demand. The most compact Chanel — not suited as a daily bag. Check: "Mini Rectangular" comes with a full chain, Mini Square with dual chains.' },
  { name: 'Mini Square (6.3 × 4.5 × 2.5 in)', category: 'Mini', price: '$2,500–$4,200', retail: '~$5,100', fits: 'Phone, cards, small wallet', note: 'Slightly wider than Rectangular. Equal popularity. Some collectors prefer the square proportions. Pre-owned price tracks within $300 of Rectangular.' },
  { name: 'Small Classic Flap (9.8 × 6 × 2.6 in)', category: 'Small', price: '$4,500–$7,500', retail: '~$9,300', fits: 'iPhone 15 Pro Max, AirPods, wallet, keys, lipstick, thin notebook', note: 'The "everyday Chanel." Fits everything a Mini does not. The most balanced size — large enough to function, small enough to remain elegant. Most investment-grade size for pre-owned.' },
]

export default function ChanelMiniVsSmall() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Chanel Mini vs Small Flap</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel Mini Flap vs Small Classic Flap {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">The most common Chanel size question. The Mini (Rectangular or Square) is the bag you photograph. The Small is the bag you carry. They look similar but serve completely different purposes. The price difference is $2,000–$4,000 pre-owned.</p>

      <div className="space-y-4 mb-10">
        {sizes.map((s, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <div>
                <h2 className="font-bold text-gray-900">{s.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{s.category} — Fits: {s.fits}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-gray-900">{s.price}</div>
                <div className="text-xs text-gray-400">Retail: {s.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy the Mini if:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You already have a daily bag and want a special occasion piece</li>
            <li>• You prefer crossbody or single-chain carry</li>
            <li>• Budget is $2,200–$4,200 pre-owned</li>
            <li>• You value the highest resale demand in Chanel</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Buy the Small if:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You want one Chanel bag that does everything</li>
            <li>• You need to carry a full phone, wallet, and keys daily</li>
            <li>• You prefer double-chain carry or shoulder wear</li>
            <li>• Investment hold is the priority — Small outperforms Mini long-term</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Pre-Owned →</Link>
        <Link href="/guides/chanel-bag-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Full Chanel Size Guide →</Link>
        <Link href="/guides/chanel-classic-vs-boy" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Classic vs Boy Bag →</Link>
      </div>
    </div>
  )
}
