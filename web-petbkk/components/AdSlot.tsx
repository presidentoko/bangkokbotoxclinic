'use client'

import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT } from '@/lib/ads'

/**
 * A display-ad slot that reserves its height before the ad arrives.
 *
 * Ads are the site's only revenue, and the usual way a site loses more to ads
 * than it earns is Cumulative Layout Shift: the slot occupies 0px during
 * render, the creative lands 400ms later, and everything below it jumps. That
 * costs a Core Web Vitals pass, which costs rankings, which costs the traffic
 * the ads were meant to monetise. So every slot declares a height up front and
 * keeps it whether or not a creative ever fills it.
 *
 * With no `NEXT_PUBLIC_ADSENSE_ID` configured the component renders nothing at
 * all — no placeholder, no reserved space. That keeps the layout honest while
 * the AdSense application is pending, and turning ads on later is an
 * environment-variable change rather than a code change.
 */

const CLIENT = ADSENSE_CLIENT

/**
 * The seven slot ids used across `app/` are still the placeholder sequence
 * (1234567890–1234567896) invented before an AdSense account existed. A slot id
 * only becomes real once the ad unit is created in the AdSense dashboard, and
 * an `<ins>` pointing at an id that does not exist never fills — it just leaves
 * a labelled ~280px hole on every page it sits on.
 *
 * So a placeholder id renders nothing even once the client id is set. The
 * loader script still ships from `Analytics.tsx`, which is what AdSense needs
 * to verify ownership of the site and what Auto ads runs on; replacing these
 * ids with the real ones is what turns the hand-placed units on.
 */
const PLACEHOLDER_SLOT = /^123456789\d$/

// Heights are the shortest creative each format can serve, so the reserved box
// is never taller than the ad that fills it.
const FORMATS = {
  // In-article, between content blocks. Responsive width, fluid height.
  inline: { minHeight: 280, format: 'fluid', layout: 'in-article' },
  // Top of a listing page, below the H1.
  leaderboard: { minHeight: 100, format: 'horizontal', layout: '' },
  // Inside a card grid, styled to sit in the flow.
  card: { minHeight: 250, format: 'rectangle', layout: '' },
} as const

export type AdFormat = keyof typeof FORMATS

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface Props {
  slot: string
  format?: AdFormat
  /** Screen-reader/label text. Required by AdSense policy to be visible. */
  label?: string
  className?: string
}

export default function AdSlot({ slot, format = 'inline', label = 'โฆษณา', className = '' }: Props) {
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!CLIENT || PLACEHOLDER_SLOT.test(slot) || pushed.current || !ref.current) return
    // React 18/19 double-invokes effects in development; pushing twice makes
    // AdSense throw "All ins elements... already have ads in them".
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* blocked by an ad blocker, or the script never loaded */
    }
  }, [slot])

  if (!CLIENT || PLACEHOLDER_SLOT.test(slot)) return null

  const cfg = FORMATS[format]

  return (
    <div className={`my-6 ${className}`} style={{ minHeight: cfg.minHeight }}>
      {/* AdSense requires ad units to be labelled and not disguised as content. */}
      <p className="text-[10px] uppercase tracking-widest text-gray-300 text-center mb-1">
        {label}
      </p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block', minHeight: cfg.minHeight }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={cfg.format}
        {...(cfg.layout ? { 'data-ad-layout': cfg.layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  )
}
