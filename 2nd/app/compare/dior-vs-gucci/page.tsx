import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Dior vs Gucci Pre-Owned ${PRICE_YEAR}: Lady Dior vs Marmont | SecondLuxuryItems`,
  description: `Dior vs Gucci pre-owned comparison — Lady Dior vs Dionysus and Marmont, resale value, authentication, investment case. Which French-Italian house to buy in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/compare/dior-vs-gucci` },
}

const rows = [
  { metric: 'Heritage', dior: 'Founded Paris 1946. New Look revolution, Christian Dior himself. 80 years of couture DNA.', gucci: 'Founded Florence 1921. Leather goods and equestrian roots. 100+ years of Italian craftsmanship.' },
  { metric: 'Icon bag', dior: 'Lady Dior ($2,000–$5,000 pre-owned). Introduced 1994, named for Princess Diana.', gucci: 'Dionysus ($600–$1,200) or Marmont ($700–$1,400) pre-owned. Both 2010s creations.' },
  { metric: 'Entry price', dior: '$700+ (Book Tote canvas)', gucci: '$300+ (canvas/nylon entry pieces)' },
  { metric: 'Resale vs retail', dior: '55–75% (Lady Dior). Saddle Bag can reach 80–90% in some references.', gucci: '40–65%. Director volatility (post–Alessandro Michele exit) weakens some pieces. Bamboo and Jackie hold well.' },
  { metric: 'Investment case', dior: 'Solid. Lady Dior holds value. Kim Jones era (menswear) and Maria Grazia Chiuri era (womenswear) both have collector pieces.', gucci: 'Mixed. Alessandro Michele era pieces (Dionysus, Marmont, GG Psychedelic) are now collector-tier. Sabato De Sarno era (2024+) unclear.' },
  { metric: 'Authentication difficulty', dior: 'Medium. Cannage stitching, CD clasp, foot stud pattern. Lady Dior fakes are improving.', gucci: 'Medium-High. Canvas pieces (GG Supreme, Ophidia) are heavily counterfeited. Leather hardware is easier to verify.' },
  { metric: 'Thailand market', dior: 'Strong. Lady Dior and Book Tote among top pre-owned searches in Bangkok.', gucci: 'Very strong for Marmont, Dionysus. Ophidia canvas and Bamboo also popular in Thai market.' },
  { metric: 'Best for', dior: 'Investment value, feminine aesthetics, stronger long-term resale', gucci: 'Design history, creative diversity, lower entry price, Italian leather quality' },
]

export default function DiorVsGucci() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/brands" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Gucci</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Dior vs Gucci Pre-Owned {PRICE_YEAR}</h1>
      <p className="text-gray-500 mb-10">Dior is Parisian couture — the Lady Dior is the best-known French bag after Chanel. Gucci is Florentine heritage and creative maximalism — from the Bamboo bag to the Marmont and beyond. Both houses are investment-grade in their icons, but Dior edges Gucci on consistent resale. The entry price gap is significant: Gucci goes much lower.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Dior</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Gucci</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.dior}</td>
                <td className="py-3 px-4 text-gray-700">{r.gucci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior Pre-Owned →</Link>
        <Link href="/brands/gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci Pre-Owned →</Link>
        <Link href="/compare/chanel-vs-dior" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Dior →</Link>
        <Link href="/compare/chanel-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Gucci →</Link>
      </div>
    </div>
  )
}
