import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Cartier Love Bracelet Buying Guide ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Complete Cartier Love Bracelet buying guide — sizes, metals, pre-owned prices, authentication. How much to pay for a pre-owned Cartier Love in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/guides/cartier-love-bracelet-guide` },
}

const variants = [
  { name: 'Love Bracelet Yellow Gold (17–19)', price: '$4,500–$7,000', retail: '~$10,000', note: 'The gold standard (literally). Yellow gold holds value best in Asian markets. Most common size range. Condition is critical — scratched screws vs. polished screws is $500 difference.' },
  { name: 'Love Bracelet Rose Gold (17–19)', price: '$4,000–$6,500', retail: '~$9,400', note: 'Rose gold is more fashionable but slightly less liquid than yellow gold. Popular with younger Thai and Southeast Asian buyers. Resale 10–15% lower than YG equivalent.' },
  { name: 'Love Bracelet White Gold (17–19)', price: '$4,200–$7,000', retail: '~$10,700', note: 'Least common gold Love. Clean, minimalist look. Strong demand in East Asian markets. Authentic white gold appears slightly grey compared to rhodium-plated fake.' },
  { name: 'Love Bracelet with Diamonds (4 diamonds, YG)', price: '$6,000–$10,000', retail: '~$14,500', note: 'Diamonds add appeal but the diamond version is actually slightly harder to sell (higher price point, more specialized buyer). Know your market before buying diamond variants.' },
  { name: 'Love Bracelet Ceramic (Black/White)', price: '$2,500–$4,500', retail: '~$8,200', note: 'Titanium core with ceramic coating. Lighter feel, more casual aesthetic. Ceramic can chip over time — inspect carefully. Lower resale than gold but more durable for daily wear.' },
]

export default function CartierLovePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Cartier Love Bracelet Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Cartier Love Bracelet Buying Guide {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">The Cartier Love Bracelet is the most recognized luxury jewelry piece in Southeast Asia. Understanding sizes, metals, and condition grades before buying pre-owned saves thousands. Yellow gold remains the strongest investment; ceramic is the daily-wear pick.</p>

      <div className="space-y-4 mb-10">
        {variants.map((v, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">{v.name}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-gray-900">{v.price}</div>
                <div className="text-xs text-gray-400">Retail: {v.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{v.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/how-to-authenticate-cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Authenticate Cartier →</Link>
        <Link href="/compare/cartier-vs-tiffany" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Tiffany →</Link>
        <Link href="/guides/luxury-jewelry-buying-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Jewelry Buying Guide →</Link>
      </div>
    </div>
  )
}
