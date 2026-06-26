'use client'
import { useEffect } from 'react'

interface TrackPageViewProps {
  slug: string
  brand: string
  model: string
  priceText: string
}

export function TrackPageView({ slug, brand, model, priceText }: TrackPageViewProps) {
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sli_recent') || '[]')
      const filtered = stored.filter((i: { slug: string }) => i.slug !== slug)
      const updated = [{ slug, brand, model, priceText }, ...filtered].slice(0, 10)
      localStorage.setItem('sli_recent', JSON.stringify(updated))
    } catch {}
  }, [slug, brand, model, priceText])
  return null
}
