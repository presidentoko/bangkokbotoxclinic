'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Condition, GridItem } from '@/lib/data'
import { formatPriceTHB, getAvgPrice } from '@/lib/data'

type SortKey = 'savings' | 'price_low' | 'price_high' | 'name'

// The headline price is not always Very Good — Patek Philippe, for one, only
// has credible Excellent listings. Label whichever grade is actually shown.
const CONDITION_LABELS: Record<Condition, { en: string; th: string }> = {
  excellent: { en: 'Excellent', th: 'สภาพดีเยี่ยม' },
  very_good: { en: 'Very Good', th: 'สภาพดีมาก' },
  good: { en: 'Good', th: 'สภาพดี' },
}

export function SortableItemGrid({ items, locale }: { items: GridItem[]; locale: string }) {
  const [sort, setSort] = useState<SortKey>('savings')

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'savings', label: locale === 'th' ? 'ประหยัดมากสุด' : 'Best Savings' },
    { key: 'price_low', label: locale === 'th' ? 'ราคาต่ำสุด' : 'Price: Low' },
    { key: 'price_high', label: locale === 'th' ? 'ราคาสูงสุด' : 'Price: High' },
    { key: 'name', label: locale === 'th' ? 'แบรนด์ ก–ฮ' : 'Brand A–Z' },
  ]

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const avgA = a.vg ? (a.vg.min + a.vg.max) / 2 : Infinity
      const avgB = b.vg ? (b.vg.min + b.vg.max) / 2 : Infinity
      const savA = a.retail > 0 && a.vg ? ((a.retail - avgA) / a.retail) * 100 : 0
      const savB = b.retail > 0 && b.vg ? ((b.retail - avgB) / b.retail) * 100 : 0
      if (sort === 'savings') return savB - savA
      if (sort === 'price_low') return avgA - avgB
      if (sort === 'price_high') return avgB - avgA
      return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)
    })
  }, [items, sort])

  return (
    <>
      {/* Sort bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs text-[#9C8B7A] uppercase tracking-wide mr-1">Sort:</span>
        {SORT_OPTIONS.map(o => (
          <button
            key={o.key}
            onClick={() => setSort(o.key)}
            aria-pressed={sort === o.key}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              sort === o.key
                ? 'border-[#B8954A] bg-[#B8954A] text-white'
                : 'border-[#E8E2D9] text-[#6B6052] hover:border-[#B8954A] hover:text-[#B8954A]'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sorted.map(item => {
          const vg = item.vg
          const savingsPct =
            vg && item.retail > 0
              ? Math.round(((item.retail - (vg.min + vg.max) / 2) / item.retail) * 100)
              : null
          return (
            <Link
              key={item.id}
              href={`/${locale}/${item.slug}`}
              className="group relative overflow-hidden block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
            >
              <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
              <div className="p-6">
                <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{item.brand}</p>
                <h3
                  className="font-serif text-2xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.model}
                </h3>
                {vg ? (
                  <div>
                    <p className="text-xs text-[#9C8B7A] mb-0.5">
                      {CONDITION_LABELS[item.condition ?? 'very_good'][locale === 'th' ? 'th' : 'en']}
                    </p>
                    <p className="text-xl font-medium text-[#1A1A1A] mb-1">{formatPriceTHB(getAvgPrice(vg))}</p>
                    {savingsPct !== null && savingsPct > 0 && (
                      <p className="text-xs text-[#4A7A35]">
                        {locale === 'th' ? `ประหยัด ${savingsPct}%` : `Save up to ${savingsPct}%`}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#9C8B7A]">
                    {locale === 'th' ? 'สอบถามราคา' : 'Price on request'}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
