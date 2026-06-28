import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Quiet Luxury Watch Brands 2025: What to Buy | SecondLuxuryItems',
  description: 'Quiet luxury watch brands for 2025 — pre-owned pieces that signal taste without the Rolex logo. A. Lange & Söhne, IWC, Jaeger-LeCoultre, Vacheron Constantin.',
  alternates: { canonical: `${BASE}/trends/quiet-luxury-watch-brands-2025` },
}

const brands = [
  {
    brand: 'A. Lange & Söhne',
    country: 'Germany (Saxony)',
    known: 'Lange 1 (off-center dial), Datograph (flyback chronograph)',
    entry: '$8,000–14,000 (pre-owned)',
    why: 'The most horologically credible German maker. Technically exceptional. Only 5,000 pieces/year. Those who know, know.',
  },
  {
    brand: 'Jaeger-LeCoultre',
    country: 'Le Sentier, Switzerland',
    known: 'Reverso (1931 — reversible case), Master Ultra Thin',
    entry: '$2,500–5,500 (Reverso pre-owned)',
    why: 'The watchmakers\' watchmaker. Reverso is arguably the most elegant dress watch form ever created. Art Deco-style, instantly recognizable to the initiated.',
  },
  {
    brand: 'Vacheron Constantin',
    country: 'Geneva, Switzerland (founded 1755)',
    known: 'Patrimony (ultra-thin), Overseas (sport), Historiques',
    entry: '$6,000–12,000 (Patrimony pre-owned)',
    why: 'Oldest continuously operating watch brand. Patrimony is the quintessential "old money" timepiece — near-zero logo, pure proportion.',
  },
  {
    brand: 'IWC Schaffhausen',
    country: 'Schaffhausen, Switzerland',
    known: 'Portofino (dress), Pilot Watches (Mark series), Portugieser',
    entry: '$2,000–4,500 (Portofino pre-owned)',
    why: 'Engineering precision with understated design. Portugieser Chronograph is a quiet statement piece. Less flashy than Rolex sports, more respected in certain circles.',
  },
  {
    brand: 'Breguet',
    country: 'Le Sentier, Switzerland',
    known: 'Classique (guilloché dial), Marine, Tradition',
    entry: '$3,500–8,000 (Classique pre-owned)',
    why: 'Napoleon, Marie Antoinette, and Einstein all wore Breguet. The guilloché pattern is unmistakable. Now part of Swatch Group but maintains heritage.',
  },
]

export default function QuietLuxuryWatchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/trends" className="hover:text-gray-800">Trends</Link>
        <span className="mx-2">/</span>
        <span>Quiet Luxury Watches</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiet Luxury Watch Brands 2025</h1>
      <p className="text-gray-500 mb-10">The anti-Rolex play. While Submariner and Daytona signal success loudly, a different tier of collector favors watches that signal taste to those who know — and nothing to those who don&apos;t. Here are the key pre-owned picks.</p>

      <div className="space-y-6 mb-10">
        {brands.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-gray-900 text-lg">{b.brand}</h2>
              <span className="text-sm text-gray-500">{b.country}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2"><strong>Known for:</strong> {b.known}</p>
            <p className="text-sm text-amber-700 font-semibold mb-2">Pre-owned entry: {b.entry}</p>
            <p className="text-sm text-gray-600">{b.why}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 mb-8">
        <strong>The signal:</strong> These brands are impossible to name-drop in casual conversation — the people who recognize them are exactly the people you want to impress. A. Lange & Söhne and Vacheron on the wrist is a graduate-level statement. IWC and JLC are the entry to this tier.
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/audemars-piguet" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP Pre-Owned →</Link>
        <Link href="/compare/ap-vs-patek-philippe" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP vs Patek →</Link>
        <Link href="/compare/rolex-vs-omega" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
        <Link href="/guides/best-pre-owned-watches-for-beginners" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Watch Buying Guide →</Link>
      </div>
    </div>
  )
}
