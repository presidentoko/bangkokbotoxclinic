import { getAllItems, formatPrice } from '@/lib/data'
import Link from 'next/link'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQ } = await searchParams
  const q = (rawQ || '').toLowerCase()
  const items = getAllItems()
  const results = q.length >= 2
    ? items.filter(i =>
        i.brand.toLowerCase().includes(q) ||
        i.model.toLowerCase().includes(q)
      )
    : []
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <form action="/search" method="get" className="mb-6">
        <input
          name="q"
          defaultValue={rawQ}
          placeholder="Search brand or model..."
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md text-sm"
          autoFocus
        />
      </form>
      {q && results.length === 0 && (
        <p className="text-gray-500">No results for &quot;{q}&quot;</p>
      )}
      <div className="divide-y divide-gray-100">
        {results.map(item => {
          const vg = item.price_ranges.very_good
          return (
            <Link key={item.id} href={`/${item.slug}`} className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.brand} {item.model}</span>
              <span className="text-sm text-gray-500">{vg ? `${formatPrice(vg.min)} – ${formatPrice(vg.max)}` : '—'}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
