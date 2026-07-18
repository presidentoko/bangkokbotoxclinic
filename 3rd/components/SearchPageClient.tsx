'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { SearchIndexEntry } from '@/lib/data'
import { formatPriceTHB, normalizeForSearch } from '@/lib/data'

export function SearchPageClient({
  items,
  locale,
  initialQuery,
}: {
  items: SearchIndexEntry[]
  locale: string
  initialQuery: string
}) {
  const t = useTranslations('search')
  const [query, setQuery] = useState(initialQuery)

  const results = useMemo(() => {
    const q = normalizeForSearch(query.trim())
    if (q.length < 2) return []
    return items.filter(i => normalizeForSearch(`${i.brand} ${i.model}`).includes(q))
  }, [items, query])

  const trimmed = query.trim()

  return (
    <div>
      <input
        type="search"
        autoFocus
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full px-5 py-3 text-base border border-[#E8E2D9] rounded-full bg-white text-[#1A1A1A] placeholder-[#8C7355] focus:outline-none focus:border-[#B8954A] mb-8"
      />

      {trimmed.length < 2 ? (
        <p className="text-[#9C8B7A] text-sm">{t('empty_prompt')}</p>
      ) : results.length === 0 ? (
        <p className="text-[#9C8B7A] text-sm">{t('no_results', { query: trimmed })}</p>
      ) : (
        <>
          <p className="text-xs text-[#9C8B7A] uppercase tracking-wide mb-6">
            {t('results_count', { count: results.length, query: trimmed })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(item => {
              const [brand, ...rest] = item.slug.split('/')
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/${brand}/${rest.join('/')}`}
                  className="group block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
                >
                  <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-1">{item.brand}</p>
                      <h3
                        className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors leading-tight"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {item.model}
                      </h3>
                    </div>
                    {item.avg_price != null && (
                      <span className="text-lg font-medium text-[#B8954A] shrink-0">
                        {formatPriceTHB(item.avg_price)}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
