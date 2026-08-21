/**
 * Directly-sold sponsor placements.
 *
 * Network ads (AdSense) pay a few dollars per thousand views. A clinic that
 * wants to be seen by people searching for a vet in its own district pays
 * vastly more for the same impression, because the impression is worth more to
 * it. This module is the inventory for that second kind of sale.
 *
 * Everything is a static config edit — no CMS, no runtime lookup — so a sold
 * placement ships with the next deploy and costs nothing to serve. `slot` keys
 * are stable strings the pages ask for by name:
 *
 *   district:<slug>   the top of /hospital/area/<slug>
 *   page:24h          /hospital/24h
 *   page:emergency    /emergency
 *   page:food         /food
 *   page:food-dog     /food/dog
 *   page:food-cat     /food/cat
 *
 * Two rules are enforced in code rather than left to good intentions:
 * a sponsor is always rendered with a visible "ผู้สนับสนุน" label, and it is
 * always rendered *outside* the ranked list, never inside it. Ranking is by
 * review score and grade only — see /advertise, where that promise is public.
 */

export interface Sponsor {
  /** Placement key, e.g. "district:huai-khwang". */
  slot: string
  name: string
  /** One line. Shown under the name; keep it factual, not a slogan. */
  blurb: string
  url: string
  /** Optional phone, shown as a tap-to-call button on mobile. */
  phone?: string
  /** Emoji or short text badge. Kept tiny — no image hosting, no CLS. */
  icon?: string
  /** ISO date. A placement past its end date stops rendering on next build. */
  endsOn?: string
}

/**
 * Live placements. Empty until the first slot is sold — `SponsorSlot` renders
 * nothing for an unsold key, so the layout is identical either way.
 */
export const SPONSORS: Sponsor[] = []

export function getSponsor(slot: string, today = new Date()): Sponsor | null {
  const found = SPONSORS.find(s => s.slot === slot)
  if (!found) return null
  if (found.endsOn) {
    const ends = new Date(found.endsOn)
    if (!isNaN(ends.getTime()) && ends < today) return null
  }
  return found
}
