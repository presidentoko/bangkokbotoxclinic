/**
 * Ad configuration, in one place.
 *
 * Everything here is env-gated on purpose. The AdSense account is created by
 * a human and the publisher ID does not exist until Google issues it, so the
 * code has to ship and deploy *before* the ID does. Until
 * NEXT_PUBLIC_ADSENSE_CLIENT is set, every slot renders nothing at all —
 * not an empty bordered box, not a placeholder. A reviewer landing on a page
 * full of empty ad frames is a rejection risk, and a visitor seeing them is a
 * trust problem.
 *
 * Set in Vercel:
 *   NEXT_PUBLIC_ADSENSE_CLIENT = ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_GA_ID          = G-XXXXXXXXXX
 */

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/** True once Google has issued a publisher ID and it's wired into the env. */
export const ADS_ENABLED = /^ca-pub-\d{10,}$/.test(ADSENSE_CLIENT);

/**
 * Slot IDs, created in the AdSense dashboard. Named by where they sit rather
 * than by size, because the size is decided by the container here — the whole
 * point of the reserved-height approach below.
 *
 * Empty string = not created yet. AdSlot renders nothing for an empty id, so
 * placements can be committed before the slots exist in the dashboard.
 */
export const AD_SLOTS = {
  /** Detail page, after the venue's key facts and before the reviews. */
  detailMid: process.env.NEXT_PUBLIC_AD_SLOT_DETAIL_MID || "",
  /** Detail page, above the footer. */
  detailFoot: process.env.NEXT_PUBLIC_AD_SLOT_DETAIL_FOOT || "",
  /** List/hub pages, injected between result cards. */
  listInline: process.env.NEXT_PUBLIC_AD_SLOT_LIST_INLINE || "",
  /** Long-form guide/topic articles, mid-article. */
  articleMid: process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_MID || "",
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;

/**
 * Reserved height per placement, in CSS pixels, mobile and desktop.
 *
 * This is the CLS defence and it is not optional. An AdSense <ins> starts at
 * zero height and grows when the creative arrives, which shoves the page down
 * a second or two after paint — exactly the pattern Core Web Vitals scores
 * worst, and this site's whole revenue plan depends on the pages ranking.
 * Reserving the space up front means the ad fills a hole that was always
 * there, and CLS from ads stays at zero.
 *
 * The values are the tallest creative AdSense will serve into each format, so
 * a shorter ad leaves whitespace rather than pushing content. That trade is
 * deliberate: whitespace costs nothing, layout shift costs ranking.
 */
export const AD_HEIGHTS: Record<AdSlotName, { mobile: number; desktop: number }> = {
  // Mobile in-content: 336x280 is the tallest common rectangle.
  detailMid: { mobile: 280, desktop: 280 },
  detailFoot: { mobile: 280, desktop: 90 },
  listInline: { mobile: 280, desktop: 280 },
  articleMid: { mobile: 280, desktop: 280 },
};

/**
 * How many result cards to show between inline list ads.
 *
 * Google's policy line is that ads must not outnumber content or dominate the
 * layout. One ad per six cards keeps ads well under a fifth of the page and
 * leaves the first screenful ad-free on mobile, where the first six cards are
 * roughly two screens.
 */
export const LIST_AD_INTERVAL = 6;

/**
 * Minimum content before a page is allowed to show ads at all.
 *
 * A page with two results and an ad reads as a made-for-advertising page, and
 * that is a documented AdSense rejection reason. Thin pages simply get no ad
 * rather than being excluded from the site — they still serve users and still
 * carry internal links.
 */
export const MIN_ITEMS_FOR_LIST_AD = 8;
