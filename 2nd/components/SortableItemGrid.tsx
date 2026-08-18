'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { GridItem } from '@/lib/data'
import { formatPrice, getAvgPrice } from '@/lib/data'

type SortKey = 'savings' | 'price_low' | 'price_high' | 'name'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'savings', label: 'Best Savings' },
  { key: 'price_low', label: 'Price: Low' },
  { key: 'price_high', label: 'Price: High' },
  { key: 'name', label: 'Brand A–Z' },
]

export function SortableItemGrid({ items }: { items: GridItem[] }) {
  const [sort, setSort] = useState<SortKey>('savings')

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
              href={`/${item.slug}`}
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
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-xs text-[#9C8B7A] mr-1">Very Good</span>
                      <span className="text-xl font-medium text-[#1A1A1A]">{formatPrice(getAvgPrice(vg))}</span>
                    </div>
                    {savingsPct !== null && savingsPct > 0 && (
                      <p className="text-xs text-[#4A7A35]">Save up to {savingsPct}% off retail</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#9C8B7A]">Price on request</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
