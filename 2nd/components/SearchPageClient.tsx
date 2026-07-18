'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { SearchIndexItem } from '@/lib/data'
import { formatPrice, normalizeForSearch } from '@/lib/data'

export function SearchPageClient({ items }: { items: SearchIndexItem[] }) {
  const searchParams = useSearchParams()
  const [q, setQ] = useState(() => searchParams.get('q') || '')

  // Filtering is entirely client-side, so we update the address bar directly
  // (no Next.js navigation / server round-trip) purely for shareable URLs.
  function handleChange(value: string) {
    setQ(value)
    const params = new URLSearchParams(window.location.search)
    if (value) params.set('q', value)
    else params.delete('q')
    const qs = params.toString()
    window.history.replaceState(null, '', `/search${qs ? `?${qs}` : ''}`)
  }

  const normQ = normalizeForSearch(q)
  const results = normQ.length >= 2
    ? items.filter(i => normalizeForSearch(`${i.brand} ${i.model}`).includes(normQ))
    : []

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#1A1A1A] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Search Results</h1>
      <form onSubmit={e => e.preventDefault()} className="mb-6">
        <input
          name="q"
          value={q}
          onChange={e => handleChange(e.target.value)}
          placeholder="Search brand or model..."
          className="border border-[#E8E2D9] rounded-full px-4 py-2 w-full max-w-md text-sm bg-white text-[#1A1A1A] placeholder-[#8C7355] focus:outline-none focus:border-[#B8954A]"
          autoFocus
        />
      </form>
      {q && normQ.length >= 2 && results.length === 0 && (
        <p className="text-[#6B6052]">No results for &quot;{q}&quot;</p>
      )}
      <div className="divide-y divide-[#E8E2D9]">
        {results.map(item => (
          <Link key={item.id} href={`/${item.slug}`} className="flex items-center justify-between py-4 hover:bg-[#FAFAF9] -mx-2 px-2 rounded">
            <span className="font-medium text-[#1A1A1A]">{item.brand} {item.model}</span>
            <span className="text-sm text-[#6B6052]">{item.avgPrice !== null ? formatPrice(item.avgPrice) : '—'}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
