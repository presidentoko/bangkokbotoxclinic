import type { Metadata } from 'next'
import Link from 'next/link'
import { listContentEntries } from '@/lib/content'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Luxury Buying Guides — Sizing, Authentication & Value | SecondLuxuryItems',
  description: 'All our pre-owned luxury guides in one place: authentication, size guides, buying guides, and value guides for Chanel, Hermès, Louis Vuitton, Rolex and more.',
  alternates: { canonical: `${BASE}/guides` },
}

export default function GuidesHubPage() {
  const guides = listContentEntries('guides')

  return (
    <>
      <div className="mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Resource Center</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Luxury Buying Guides
        </h1>
        <p className="text-[#6B6052] text-lg max-w-xl leading-relaxed">
          Authentication tips, size guides, and buying advice for pre-owned luxury handbags, watches and jewelry.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {guides.map(g => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group block p-5 bg-white border border-[#E8E2D9] hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
          >
            <h2 className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              {g.title}
            </h2>
            {g.description && (
              <p className="text-sm text-[#6B6052] leading-relaxed line-clamp-2">{g.description}</p>
            )}
          </Link>
        ))}
      </div>
    </>
  )
}
