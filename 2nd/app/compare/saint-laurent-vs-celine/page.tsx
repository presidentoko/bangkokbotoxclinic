import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Saint Laurent vs Celine: Which to Buy Pre-Owned? 2025 Guide',
  description: 'Saint Laurent vs Celine pre-owned price comparison. Loulou vs Belt Bag, resale value, authentication tips and which is right for your style.',
  alternates: { canonical: `${BASE}/compare/saint-laurent-vs-celine` },
}

export default function SaintLaurentVsCelinePage() {
  const slItems = getItemsByBrand('saint-laurent').filter(i => i.price_ranges.very_good)
  const celineItems = getItemsByBrand('celine').filter(i => i.price_ranges.very_good)

  const rows = [
    { aspect: 'Founded', sl: '1961, Yves Saint Laurent', celine: '1945, Céline Vipiana' },
    { aspect: 'Current creative director', sl: 'Anthony Vaccarello', celine: 'Hedi Slimane' },
    { aspect: 'Aesthetic', sl: 'French girl, rock-edged, Parisian cool', celine: 'Minimalist, intellectual, quiet luxury' },
    { aspect: 'Most iconic bag', sl: 'Loulou / Kate Tassel', celine: 'Belt Bag / Luggage Tote / Triomphe' },
    { aspect: 'Pre-owned price range', sl: '$600–2,200', celine: '$700–3,500' },
    { aspect: 'Value retention', sl: '55–70% of current retail', celine: '60–75% of current retail' },
    { aspect: 'Logo visibility', sl: 'YSL prominent on hardware', celine: 'Minimal or absent (pre-Slimane)' },
    { aspect: 'Resale liquidity', sl: 'High — Loulou very popular', celine: 'Strong — Belt Bag top-searched' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/handbags" className="hover:text-gray-800">Handbags</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Saint Laurent vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Saint Laurent vs Celine: Pre-Owned Comparison 2025</h1>
      <p className="text-gray-500 mb-10">Two distinct visions of French fashion — both strong performers on the secondary market.</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Saint Laurent</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Rock-edged Parisian cool with YSL hardware</li>
            <li>✓ Loulou one of the most demanded bags globally</li>
            <li>✓ Wide range from casual to evening</li>
            <li>✓ Strong international resale pool</li>
            <li>✗ Newer pieces have received mixed quality reviews</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Celine</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Quiet luxury — no visible logos on classic pieces</li>
            <li>✓ Belt Bag consistently top-searched pre-owned</li>
            <li>✓ Slightly stronger value retention than YSL</li>
            <li>✓ Strong quality reputation — hardware and leather</li>
            <li>✗ Slimane-era designs more polarising to buyers</li>
          </ul>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                <th className="text-left py-3 px-4 font-semibold">Saint Laurent</th>
                <th className="text-left py-3 px-4 font-semibold">Celine</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.sl}</td>
                  <td className="py-3 px-4 text-gray-600">{row.celine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Saint Laurent Pre-Owned Prices</h3>
          <div className="space-y-2">
            {slItems.slice(0, 5).map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
          <Link href="/brands/saint-laurent" className="text-sm text-blue-600 hover:underline mt-3 block">All Saint Laurent →</Link>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Celine Pre-Owned Prices</h3>
          <div className="space-y-2">
            {celineItems.slice(0, 5).map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
          <Link href="/brands/celine" className="text-sm text-blue-600 hover:underline mt-3 block">All Celine →</Link>
        </div>
      </div>
    </div>
  )
}
