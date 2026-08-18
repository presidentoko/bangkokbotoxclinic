import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Chanel Classic Flap vs Boy Bag: Which to Buy Pre-Owned ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Chanel Classic Flap vs Boy Bag — value retention, resale, practical differences. Which Chanel holds value better pre-owned? Complete ${PRICE_YEAR} comparison.`,
  alternates: { canonical: `${BASE}/guides/chanel-classic-vs-boy` },
}

const rows = [
  { aspect: 'Origin', classic: 'Redesigned by Karl Lagerfeld, 1983 (original Gabrielle Chanel, 1955)', boy: 'Karl Lagerfeld, 2011' },
  { aspect: 'Shape', classic: 'Rectangular, quilted, double C turn-lock (Mademoiselle or CC closure)', boy: 'Structured rectangular, side pinstripe quilting, CC push-lock with Boy lock' },
  { aspect: 'Strap', classic: 'Interwoven leather-chain strap — can convert to crossbody or shoulder', boy: 'Fixed chain strap — no strap adjustment; shoulder wear only' },
  { aspect: 'Best pre-owned size', classic: 'Small (6.3"): $5,800–8,500 · Medium (10"): $6,500–10,000', boy: 'Small (8"): $3,500–5,500 · Medium (10"): $4,200–6,500 · Old Medium: $5,000–8,000' },
  { aspect: 'Value retention', classic: '80–95%+ — best Chanel resale (CF consistently above retail at auction)', boy: '60–75% — newer piece, slightly weaker; Old Medium highest retention' },
  { aspect: 'Practical difference', classic: 'More casual-luxury. Opens with flap+tuck (faster access). More versatile outfit pairing', boy: 'More structured, androgynous. Straps are shorter — not adjustable' },
  { aspect: 'Best for', classic: 'Investment buyer. Daily versatility. Timeless piece', boy: 'Strong aesthetic statement. Edgier look. More size options (small/medium/large/phone)' },
]

const priceRows = [
  { model: 'Classic Flap Small (lambskin, GHW)', range: '$5,800–8,500', retention: '95–115%' },
  { model: 'Classic Flap Medium (caviar, CHW)', range: '$6,500–10,000', retention: '85–105%' },
  { model: 'Classic Flap Jumbo (caviar, GHW)', range: '$7,500–11,000', retention: '80–95%' },
  { model: 'Boy Bag Small (lambskin, GHW)', range: '$3,500–5,500', retention: '65–80%' },
  { model: 'Boy Bag Old Medium (caviar)', range: '$5,000–8,000', retention: '75–90%' },
  { model: 'Boy Bag Large (caviar)', range: '$5,500–8,500', retention: '70–85%' },
]

export default function ChanelClassicVsBoyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Classic Flap vs Boy Bag</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel Classic Flap vs Boy Bag: Which to Buy Pre-Owned?</h1>
      <p className="text-gray-500 mb-10">The two most important Chanel bags. The Classic Flap is timeless; the Boy is statement. Both hold value — but differently. Here&apos;s how to choose.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Aspect</th>
              <th className="text-left py-3 px-4 font-semibold">Classic Flap</th>
              <th className="text-left py-3 px-4 font-semibold">Boy Bag</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.classic}</td>
                <td className="py-3 px-4 text-gray-600">{row.boy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-Owned Prices 2025 (USD)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-left py-3 px-4 font-semibold">Pre-Owned Range</th>
                <th className="text-left py-3 px-4 font-semibold text-amber-700">vs Retail</th>
              </tr>
            </thead>
            <tbody>
              {priceRows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                  <td className="py-3 px-4 text-gray-700">{row.range}</td>
                  <td className="py-3 px-4 font-semibold text-amber-700">{row.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>Caviar vs Lambskin:</strong> Caviar leather is more durable and scratches less — better for daily use and stronger pre-owned value. Lambskin is softer and more luxurious-looking but scratches easily. For investment, choose caviar. For aesthetics, lambskin if you use with care.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">All Chanel Pre-Owned →</Link>
        <Link href="/guides/chanel-price-history" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Price History →</Link>
        <Link href="/guides/chanel-bag-size-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Size Guide →</Link>
      </div>
    </div>
  )
}
