'use client'
import { useEffect, useState } from 'react'

interface RecentItem {
  slug: string
  brand: string
  model: string
  priceText: string
}

export function RecentlyViewed({ currentSlug, locale }: { currentSlug: string; locale: string }) {
  const [items, setItems] = useState<RecentItem[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('chic_recent') || '[]') as RecentItem[]
      setItems(stored.filter(i => i.slug !== currentSlug).slice(0, 6))
    } catch {}
  }, [currentSlug])

  if (items.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        {locale === 'th' ? 'ดูล่าสุด' : 'Recently Viewed'}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(item => (
          <a
            key={item.slug}
            href={`/${locale}/${item.slug}`}
            className="border border-gray-200 rounded-lg p-3 hover:border-gray-400 transition-colors text-sm"
          >
            <p className="font-medium">{item.brand} {item.model}</p>
            <p className="text-gray-500 text-xs mt-0.5">{item.priceText}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
