import Link from 'next/link'
import { BrandSummary } from '@/lib/data'

interface Props extends BrandSummary {
  locale: string
  modelsLabel: string
}

export function BrandCard({ brand, slug, count, locale, modelsLabel }: Props) {
  return (
    <Link
      href={`/${locale}/${slug}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <p className="font-semibold text-gray-900">{brand}</p>
      <p className="text-sm text-gray-500 mt-1">{count} {modelsLabel}</p>
    </Link>
  )
}
