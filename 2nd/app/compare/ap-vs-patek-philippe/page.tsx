import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Audemars Piguet vs Patek Philippe: Which Watch ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'AP vs Patek Philippe pre-owned comparison — Royal Oak vs Nautilus, value retention, price history. The two most prestigious Swiss watchmakers compared.',
  alternates: { canonical: `${BASE}/compare/ap-vs-patek-philippe` },
}

const rows = [
  { aspect: 'Founded', ap: '1875, Le Brassus, Switzerland', patek: '1839, Geneva, Switzerland' },
  { aspect: 'Prestige tier', ap: 'Haute horlogerie (top 3 globally)', patek: 'Haute horlogerie (top 3 globally)' },
  { aspect: 'Iconic model', ap: 'Royal Oak (1972 — Gerald Genta)', patek: 'Nautilus (1976 — Gerald Genta)' },
  { aspect: 'Design language', ap: 'Integrated bracelet, octagonal bezel, "Grande Tapisserie" dial', patek: 'Porthole case, horizontal embossed dial, integrated bracelet' },
  { aspect: 'Entry pre-owned', ap: '$18,000 (AP Code 11:59 — non-Royal Oak)', patek: '$12,000 (Calatrava ref. 5196)' },
  { aspect: 'Royal Oak / Nautilus', ap: 'Royal Oak 15500ST: $28,000–38,000', patek: 'Nautilus 5711 (discontinued): $100,000–180,000' },
  { aspect: 'Value retention', ap: '80–120% (Royal Oak)', patek: '150–300%+ (Nautilus 5711)' },
  { aspect: 'Availability', ap: 'AD requires purchase history; grey market active', patek: '5711 discontinued in 2021 — secondary market only' },
  { aspect: 'Best investment', ap: 'Royal Oak 15500ST (stainless, blue/grey dial)', patek: 'Nautilus 5711/1A (blue dial) if available' },
]

export default function APvsPatekPage() {
  const apItems = getItemsByBrand('audemars piguet').filter(i => i.price_ranges?.very_good).slice(0, 2)
  const patekItems = getItemsByBrand('patek philippe').filter(i => i.price_ranges?.very_good).slice(0, 2)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span>AP vs Patek Philippe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Audemars Piguet vs Patek Philippe: Pre-Owned {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Two of the three great Swiss watchmaking houses — Royal Oak vs Nautilus. Both designed by Gerald Genta, both worth more pre-owned than retail.</p>

      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Aspect</th>
              <th className="text-left py-3 px-4 font-semibold">Audemars Piguet</th>
              <th className="text-left py-3 px-4 font-semibold">Patek Philippe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.ap}</td>
                <td className="py-3 px-4 text-gray-600">{row.patek}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>The Genta legacy:</strong> Both Royal Oak (1972) and Nautilus (1976) were designed by Gerald Genta — the most influential watch designer of the 20th century. Genta was also behind the Patek Calatrava and IWC Ingenieur. This shared DNA is why both pieces command such extraordinary premiums.
      </div>

      {(apItems.length > 0 || patekItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {apItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">AP Pre-Owned</h3>
              {apItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
          {patekItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Patek Philippe Pre-Owned</h3>
              {patekItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPrice(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/audemars-piguet" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP Pre-Owned →</Link>
        <Link href="/brands/patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Patek Pre-Owned →</Link>
        <Link href="/compare/rolex-vs-audemars-piguet" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs AP →</Link>
        <Link href="/trends/luxury-bags-above-retail" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Above-Retail Guide →</Link>
      </div>
    </div>
  )
}
