'use client'
import { useEffect } from 'react'

export function TrackPageView({ slug, brand, model, priceText }: {
  slug: string; brand: string; model: string; priceText: string
}) {
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('chic_recent') || '[]')
      const filtered = stored.filter((i: { slug: string }) => i.slug !== slug)
      const updated = [{ slug, brand, model, priceText }, ...filtered].slice(0, 10)
      localStorage.setItem('chic_recent', JSON.stringify(updated))
    } catch {}
  }, [slug, brand, model, priceText])
  return null
}
