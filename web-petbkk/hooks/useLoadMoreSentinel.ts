'use client'
import { useCallback, useEffect, useRef } from 'react'

// Attach the returned ref to an empty div at the bottom of a list; once it
// scrolls into view, `onReach` fires (typically to grow how many items render).
//
// This is a *callback* ref rather than an object ref on purpose: the sentinel is
// conditionally rendered (it disappears once the list is fully shown), so an
// effect keyed on [] would bind to whatever node existed at mount and never
// re-observe a sentinel that unmounts and comes back after a filter change.
export function useLoadMoreSentinel(onReach: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  // Keep the latest callback without re-creating the observer on every render.
  const onReachRef = useRef(onReach)
  onReachRef.current = onReach

  useEffect(() => () => observerRef.current?.disconnect(), [])

  return useCallback((el: HTMLDivElement | null) => {
    observerRef.current?.disconnect()
    if (!el) return
    observerRef.current = new IntersectionObserver(
      entries => { if (entries[0]?.isIntersecting) onReachRef.current() },
      { rootMargin: '600px' }
    )
    observerRef.current.observe(el)
  }, [])
}
