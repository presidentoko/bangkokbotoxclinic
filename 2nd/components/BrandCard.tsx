import Link from 'next/link'
import { BrandSummary } from '@/lib/data'

export function BrandCard({ brand, slug, count }: BrandSummary) {
  return (
    <Link
      href={`/${slug}`}
      className="block p-5 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <h2 className="font-semibold text-lg">{brand}</h2>
      <p className="text-sm text-gray-500 mt-1">{count} model{count !== 1 ? 's' : ''} tracked</p>
    </Link>
  )
}
