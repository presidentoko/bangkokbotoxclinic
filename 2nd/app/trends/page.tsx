import type { Metadata } from 'next'
import Link from 'next/link'
import { listContentEntries } from '@/lib/content'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Luxury Resale Market Trends | SecondLuxuryItems',
  description: 'What is happening in the pre-owned luxury market right now — price increases, investment picks, and shifting demand across brands.',
  alternates: { canonical: `${BASE}/trends` },
}

export default function TrendsHubPage() {
  const trends = listContentEntries('trends')

  return (
    <>
      <div className="mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Market Watch</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Resale Market Trends
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          Price movements, investment picks, and shifting demand in the pre-owned luxury market.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {trends.map(t => (
          <Link
            key={t.slug}
            href={`/trends/${t.slug}`}
            className="group block p-5 bg-white border border-[#E8E2D9] hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
          >
            <h2 className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              {t.title}
            </h2>
            {t.description && (
              <p className="text-sm text-[#6B6052] leading-relaxed line-clamp-2">{t.description}</p>
            )}
          </Link>
        ))}
      </div>
    </>
  )
}
