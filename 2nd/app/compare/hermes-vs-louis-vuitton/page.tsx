import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Hermès vs Louis Vuitton: Pre-Owned Comparison ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Hermès vs Louis Vuitton pre-owned bags compared. Birkin vs Neverfull — price, value retention, investment potential and which to buy in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/hermes-vs-louis-vuitton` },
}

const rows = [
  { aspect: 'Founded', hermes: '1837, Thierry Hermès (saddle maker)', lv: '1854, Louis Vuitton (trunk maker)' },
  { aspect: 'Iconic bag', hermes: 'Birkin / Kelly', lv: 'Neverfull / Speedy / Capucines' },
  { aspect: 'Entry pre-owned price', hermes: '$1,800 (Garden Party/Evelyne)', lv: '$700 (Speedy 30 / Neverfull MM)' },
  { aspect: 'Flagship bag vs retail', hermes: 'Birkin: 150–250%+ above retail', lv: 'Neverfull: 85–100% of retail' },
  { aspect: 'Value retention', hermes: 'Birkin/Kelly: 100–200%+; other: 80–95%', lv: 'Mono canvas: 85–100%; leather: 60–80%' },
  { aspect: 'Wait list', hermes: '1–5+ years for Birkin at AD', lv: 'No wait — generally available' },
  { aspect: 'Price range (pre-owned)', hermes: '$1,800–200,000+', lv: '$700–5,000' },
  { aspect: 'Material durability', hermes: 'Exceptional — Togo/Clemence last decades', lv: 'Monogram canvas extremely durable; vachetta requires care' },
]

export default function HermesVsLVPage() {
  const hermesItems = getItemsByBrand('hermes').filter(i => i.price_ranges?.very_good).slice(0, 5)
  const lvItems = getItemsByBrand('louis vuitton').filter(i => i.price_ranges?.very_good).slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/handbags" className="hover:text-gray-800">Handbags</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Hermès vs Louis Vuitton</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Hermès vs Louis Vuitton: Pre-Owned Comparison {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">The oldest luxury house vs the biggest — a comparison of two entirely different markets.</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>Investment note:</strong> Hermès Birkin and Kelly are in a class of their own — they have outperformed the S&P 500 over the past 35 years. Louis Vuitton Monogram is the most liquid and universally resaleable pre-owned luxury bag in the world. These serve different needs.
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hermès</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Birkin/Kelly: appreciating assets — best long-term value retention of any bag</li>
            <li>✓ Hand-crafted by a single artisan — unmatched build quality</li>
            <li>✓ Quieter brand presence — prestige without visible logos</li>
            <li>✓ Entry options under $2,500 (Garden Party, Evelyne, Picotin)</li>
            <li>✗ Birkin/Kelly new only through waitlist and relationship at AD</li>
            <li>✗ Wider price variance — condition matters enormously</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Louis Vuitton</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Most recognisable luxury brand globally</li>
            <li>✓ Entry from $700 pre-owned — most accessible luxury option</li>
            <li>✓ Monogram canvas extremely durable and easy to authenticate</li>
            <li>✓ Fastest resale of any luxury brand — sells quickly everywhere</li>
            <li>✗ Over-saturated — Monogram is ubiquitous, less exclusive</li>
            <li>✗ Leather models depreciate more than canvas</li>
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
                <th className="text-left py-3 px-4 font-semibold">Hermès</th>
                <th className="text-left py-3 px-4 font-semibold">Louis Vuitton</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                  <td className="py-3 px-4 text-gray-600">{row.hermes}</td>
                  <td className="py-3 px-4 text-gray-600">{row.lv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Hermès Pre-Owned Prices</h3>
          <div className="space-y-2">
            {hermesItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
          <Link href="/brands/hermes" className="text-sm text-blue-600 hover:underline mt-3 block">All Hermès →</Link>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Louis Vuitton Pre-Owned Prices</h3>
          <div className="space-y-2">
            {lvItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
              </div>
            ))}
          </div>
          <Link href="/brands/louis-vuitton" className="text-sm text-blue-600 hover:underline mt-3 block">All Louis Vuitton →</Link>
        </div>
      </div>
    </div>
  )
}
