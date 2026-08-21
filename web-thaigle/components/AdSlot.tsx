"use client";

import { useEffect, useRef } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT, AD_SLOTS, AD_HEIGHTS, type AdSlotName } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One AdSense placement.
 *
 * Three things this does that the copy-pasted AdSense snippet does not:
 *
 * 1. Reserves its height before the ad exists, so the creative arriving does
 *    not shift the page. See AD_HEIGHTS — the reserved box is styled with a
 *    CSS custom property so the mobile and desktop heights can differ without
 *    a media query in JS (which would need a client-side measure, which is
 *    itself a shift).
 *
 * 2. Pushes exactly once per mounted <ins>. React can mount a component twice
 *    in development, and `adsbygoogle.push({})` against an <ins> that already
 *    has an ad throws "All 'ins' elements in the DOM with class=adsbygoogle
 *    already have ads in them" — which in production surfaces as a blank slot
 *    for the rest of the session.
 *
 * 3. Renders nothing when there is no publisher ID or no slot ID, so
 *    placements can be committed and deployed before the AdSense account
 *    exists. An unfilled slot is invisible, not an empty box.
 */
export function AdSlot({
  name,
  className = "",
  label = true,
}: {
  name: AdSlotName;
  className?: string;
  /**
   * Renders the "Advertisement" label. Required by AdSense policy wherever an
   * ad could be mistaken for site content — which, for the in-content and
   * in-list placements here, is all of them. Off only for placements that are
   * already visually fenced off from content.
   */
  label?: boolean;
}) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const slotId = AD_SLOTS[name];

  useEffect(() => {
    if (!ADS_ENABLED || !slotId || pushed.current) return;
    // An <ins> the script has already filled carries data-adsbygoogle-status.
    // Re-pushing it is the throw described above.
    if (ref.current?.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // A failed push must never take the page down with it.
    }
  }, [slotId]);

  if (!ADS_ENABLED || !slotId) return null;

  const h = AD_HEIGHTS[name];

  return (
    <aside
      className={`my-6 mx-auto w-full text-center ${className}`}
      // Reserved box. The custom properties feed the height rule in
      // globals.css, which is where the mobile/desktop split lives.
      style={
        {
          "--ad-h-mobile": `${h.mobile}px`,
          "--ad-h-desktop": `${h.desktop}px`,
        } as React.CSSProperties
      }
      data-ad-reserved={name}
    >
      {label && (
        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1 select-none">
          Advertisement
        </div>
      )}
      <ins
        ref={ref}
        className="adsbygoogle block w-full"
        style={{ display: "block", height: "100%" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
