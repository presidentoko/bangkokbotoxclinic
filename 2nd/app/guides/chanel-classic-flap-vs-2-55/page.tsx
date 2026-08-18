import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Chanel Classic Flap vs 2.55 Reissue: What Is the Difference? | SecondLuxuryItems',
  description: `Classic Flap vs 2.55 Reissue — hardware differences, closure type, chain type, interior layout, price, resale. The definitive Chanel guide ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/guides/chanel-classic-flap-vs-2-55` },
}

const differences = [
  {
    aspect: 'Year introduced',
    classic: '1983 by Karl Lagerfeld (rework of the original 2.55)',
    reissue: '1955 by Coco Chanel (original). Reissued 2005 for the 50th anniversary.',
  },
  {
    aspect: 'Closure (most visible difference)',
    classic: 'CC turn-lock — the interlocking CC logo clasp. Introduced by Lagerfeld.',
    reissue: 'Mademoiselle lock — a rectangular, non-logo clasp. This is Coco\'s original hardware.',
  },
  {
    aspect: 'Chain type',
    classic: 'Gold-tone or silver-tone chain interwoven with leather. Softer drape.',
    reissue: 'Distressed metal chain — aged gold or ruthenium. All-metal (no leather weave).',
  },
  {
    aspect: 'Interior layout',
    classic: 'Single large compartment with a back zip pocket, multiple card slots, and a lipstick holder.',
    reissue: 'Compartmentalized interior: multiple flat pockets, a zip coin pocket, and a red interior (signature of the original design). More organized.',
  },
  {
    aspect: 'Leather',
    classic: 'Lambskin or Caviar leather (Caviar most popular — more durable).',
    reissue: 'Aged calfskin (distressed finish). Not typically available in Caviar.',
  },
  {
    aspect: 'Price (2025 retail)',
    classic: 'Small Classic Flap: ~$7,500. Medium: ~$8,600. Jumbo: ~$9,900.',
    reissue: '226 Reissue (≈ Medium): ~$9,200. 227 (≈ Jumbo): ~$9,800.',
  },
  {
    aspect: 'Pre-owned resale',
    classic: 'Classic Flap in Caviar: 80–120% of retail. Well-maintained Lambskin: 70–95%.',
    reissue: '2.55 Reissue aged calfskin: 70–100% of retail. More niche market than Classic Flap.',
  },
  {
    aspect: 'Who wears it',
    classic: 'The "standard" Chanel. More widely recognized. More accessible looking.',
    reissue: 'The "Chanel insider" choice — people who know the 2.55 history prefer the Reissue.',
  },
]

export default function ChanelClassicVs255() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Classic Flap vs 2.55 Reissue</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Chanel Classic Flap vs 2.55 Reissue</h1>
      <p className="text-gray-500 mb-10">They look nearly identical to outsiders. But the closure, chain, interior, and history are completely different — and Chanel enthusiasts absolutely distinguish between them. The Classic Flap is Karl Lagerfeld's 1983 rework; the 2.55 Reissue is Coco Chanel's 1955 original. The single fastest way to tell them apart: look at the clasp.</p>

      <div className="space-y-4 mb-10">
        {differences.map((d, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{d.aspect}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Classic Flap</p>
                <p className="text-sm text-gray-600">{d.classic}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">2.55 Reissue</p>
                <p className="text-sm text-gray-600">{d.reissue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-gray-900 mb-2">Quick tell: one-second identification</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>CC interlocking logo clasp</strong> = Classic Flap (Lagerfeld era, 1983+)</li>
          <li>• <strong>Rectangular "Mademoiselle" lock</strong> = 2.55 Reissue (Coco Chanel original)</li>
          <li>• <strong>Leather-woven chain</strong> = Classic Flap</li>
          <li>• <strong>All-metal distressed chain</strong> = 2.55 Reissue</li>
          <li>• <strong>Red interior with small compartments</strong> = 2.55 Reissue</li>
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/brands/chanel" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Pre-Owned →</Link>
        <Link href="/guides/chanel-classic-vs-boy" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Classic vs Boy Bag →</Link>
        <Link href="/guides/chanel-price-history" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel Price History →</Link>
      </div>
    </div>
  )
}
