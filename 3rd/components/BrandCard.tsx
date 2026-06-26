import Link from 'next/link'
import { BrandSummary } from '@/lib/data'

interface Props extends BrandSummary {
  locale: string
  modelsLabel: string
  savingsBadge?: string
}

export function BrandCard({ brand, slug, count, locale, modelsLabel, savingsBadge }: Props) {
  return (
    <Link href={`/${locale}/${slug}`} className="group block p-6 border border-[#E8E2D9] rounded-sm bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200">
      <div className="w-8 h-px bg-[#B8954A] mb-4" />
      <h2 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
        {brand}
      </h2>
      <p className="text-xs text-[#9C8B7A] mt-2 tracking-wide uppercase">{count} {modelsLabel}</p>
      {savingsBadge && (
        <span className="inline-block mt-3 text-xs px-2.5 py-1 bg-[#F5F0E8] text-[#8C7355] rounded-full">
          {savingsBadge}
        </span>
      )}
    </Link>
  )
}
