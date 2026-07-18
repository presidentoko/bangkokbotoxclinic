import type { Metadata } from 'next'
import Link from 'next/link'
import { listContentEntries } from '@/lib/content'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Luxury Brand & Model Comparisons | SecondLuxuryItems',
  description: 'Head-to-head comparisons of pre-owned luxury brands and models — price, value retention, and which is the better buy in 2025.',
  alternates: { canonical: `${BASE}/compare` },
}

export default function CompareHubPage() {
  const comparisons = listContentEntries('compare')

  return (
    <>
      <div className="mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Head-to-Head</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Brand & Model Comparisons
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          Which luxury brand or bag is the better buy pre-owned? Compare price, value retention, and resale demand side by side.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {comparisons.map(c => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="group block p-5 bg-white border border-[#E8E2D9] hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
          >
            <h2 className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              {c.title}
            </h2>
            {c.description && (
              <p className="text-sm text-[#6B6052] leading-relaxed line-clamp-2">{c.description}</p>
            )}
          </Link>
        ))}
      </div>
    </>
  )
}
