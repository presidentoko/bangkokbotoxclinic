'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { SearchIndexEntry } from '@/lib/data'
import { formatPriceTHB, normalizeForSearch } from '@/lib/data'

export function SiteSearch({ items, locale }: { items: SearchIndexEntry[]; locale: string }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const results = query.length > 1
    ? items.filter(i =>
        normalizeForSearch(`${i.brand} ${i.model}`).includes(normalizeForSearch(query))
      ).slice(0, 8)
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const placeholder = locale === 'th' ? 'ค้นหาแบรนด์หรือรุ่น...' : 'Search brand or model...'

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="w-full px-4 py-2 text-sm border border-[#E8E2D9] rounded-full bg-white text-[#1A1A1A] placeholder-[#8C7355] focus:outline-none focus:border-[#B8954A]"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-[#E8E2D9] rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map(item => {
            const [brand, ...rest] = item.slug.split('/')
            return (
              <Link
                key={item.id}
                href={`/${locale}/${brand}/${rest.join('/')}`}
                onClick={() => { setOpen(false); setQuery('') }}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAF9] border-b border-[#E8E2D9] last:border-0"
              >
                <div>
                  <span className="text-xs text-[#8C7355] uppercase tracking-wide">{item.brand}</span>
                  <p className="text-sm font-medium text-[#1A1A1A]">{item.model}</p>
                </div>
                {item.avg_price != null && (
                  <span className="text-sm font-semibold text-[#B8954A]">
                    {formatPriceTHB(item.avg_price)}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
