import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Fendi vs Gucci 2025: Italian Luxury Comparison & Pre-Owned Investment | SecondLuxuryItems',
  description: 'Fendi vs Gucci — Roman heritage vs Florentine craft, Baguette vs Bamboo/Jackie, resale retention, investment tier, and which Italian house holds value better pre-owned in 2025.',
  alternates: { canonical: `${BASE}/compare/fendi-vs-gucci` },
}

const rows = [
  { aspect: 'Founded', fendi: 'Rome, 1925 — fur atelier by Adele and Edoardo Fendi', gucci: 'Florence, 1921 — luggage shop by Guccio Gucci' },
  { aspect: 'Parent group', fendi: 'LVMH (acquired 2000-01)', gucci: 'Kering (acquired 1999)' },
  { aspect: 'Design identity', fendi: 'Roman edge — FF logo, fur, structured architecture, Baguette', gucci: 'Florentine eclecticism — GG monogram, horsebit, web stripe, maximalism' },
  { aspect: 'Signature bags', fendi: 'Baguette, Peekaboo, Kan I, Mini Sunshine', gucci: 'Bamboo 1947, Jackie, Horsebit 1955, Dionysus, Marmont' },
  { aspect: 'New price range', fendi: '$1,400–5,500 (Baguette–Peekaboo)', gucci: '$1,100–4,800 (Jackie 1961–Bamboo 1947)' },
  { aspect: 'Pre-owned entry', fendi: '$600–900 (Baguette worn)', gucci: '$450–750 (Marmont small worn)' },
  { aspect: 'Resale retention', fendi: '45–65% (Baguette Zucca: up to 70%)', gucci: '35–55% (GG Marmont: softening; vintage Jackie: 60-80%)' },
  { aspect: 'Investment tier', fendi: 'B (broad pre-owned market)', gucci: 'C+/B (brand inconsistency hurts — vintage pieces stronger)' },
  { aspect: 'Vintage opportunity', fendi: '1990s-2000s Baguette by Siliano — collector pieces', gucci: 'Vintage 1950s-70s bamboo handle bags: strong appreciation' },
  { aspect: 'Brand stability', fendi: 'More consistent — LVMH alignment since 2001', gucci: 'Creative director churn has hurt resale consistency 2019-2023' },
]

export default function FendiVsGucci() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
        <span className="mx-2">/</span>
        <span>Fendi vs Gucci</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Fendi vs Gucci (2025): Which Italian House Holds Value Better?</h1>
      <p className="text-gray-500 mb-10">Both are Italian luxury giants with century-long histories — Fendi Roman architecture vs Gucci Florentine eclecticism. In the pre-owned market, Fendi's more consistent LVMH-era positioning gives it a slight edge over Gucci, which has been volatile through creative director changes since 2019.</p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Aspect</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Fendi</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-green-700">Gucci</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.fendi}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.gucci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-amber-900 mb-2">Gucci's creative director problem</h3>
        <p className="text-sm text-amber-800">Gucci's resale market has been disrupted by creative director transitions: Alessandro Michele's maximalist era (2015-2022) defined a very specific aesthetic that now reads as dated to many. Sabato De Sarno's quieter era (2023-2024) has not yet produced iconic new pieces. This creates two Gucci pre-owned markets: Michele-era pieces that can look very "2018," and older vintage Gucci (1950s-80s bamboo, horsebit) that has genuine collector demand. The GG Marmont in particular has softened significantly pre-owned.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-800 mb-2">Fendi Baguette: 1997 and the cultural moment</h3>
        <p className="text-sm text-amber-700">The Fendi Baguette was the first "It bag" — carried under the arm like a French baguette. The original 1990s-2000s Baguettes designed under Karl Lagerfeld have significant collector value. A genuine Baguette from the Siliano or Zucca canvas era (1997-2005) can resell for $700-1,200 — above its pre-owned market average — because of the cultural moment it represents (SATC, celebrity endorsement). Look for the season serial code in the interior.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Choose Fendi if…</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• You value Roman structured aesthetics</li>
            <li>• The Baguette or Peekaboo speak to you</li>
            <li>• More consistent LVMH-era brand direction matters</li>
            <li>• A 1990s-era "It bag" with cultural capital appeals</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Choose Gucci if…</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• You're buying vintage 1950s-80s Gucci (strongest investment)</li>
            <li>• The Bamboo 1947 or Jackie 1961 appeal to you</li>
            <li>• You find a GG Marmont at deep discount — personal use</li>
            <li>• Florentine craft and horsebit heritage matters to you</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/fendi" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi Pre-Owned →</Link>
        <Link href="/brands/gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci Pre-Owned →</Link>
        <Link href="/compare/fendi-vs-loewe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href="/compare/gucci-vs-bottega-veneta" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Gucci vs BV →</Link>
        <Link href="/compare/prada-vs-gucci" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Prada vs Gucci →</Link>
      </div>
    </div>
  )
}
