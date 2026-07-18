import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getSearchIndex } from '@/lib/data'
import { SearchPageClient } from '@/components/SearchPageClient'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Search — SecondLuxuryItems',
  description: 'Search pre-owned luxury handbag and watch prices by brand or model.',
  alternates: { canonical: `${BASE}/search` },
}

// Static shell — searchIndex is computed once at build time and all query
// filtering happens client-side, so this page needs no per-request server work.
export default function SearchPage() {
  const items = getSearchIndex()
  return (
    <Suspense fallback={<div className="text-[#6B6052]">Loading…</div>}>
      <SearchPageClient items={items} />
    </Suspense>
  )
}
