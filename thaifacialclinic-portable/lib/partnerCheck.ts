// Treat a clinic as a "paid partner" if either:
//   - data flag c.is_partner is true (set by build-data.mjs), OR
//   - clinic id appears in any SPONSORED_* env var (manual paid placement)
//
// For partners we suppress the Bookimed affiliate link — we don't send
// OUR audience to a competing aggregator after the clinic is paying us.

import { sponsoredEditorsPick, sponsoredRecommended, sponsoredFeatured } from "./sponsoredStore";
import type { Clinic } from "./types";

export function isPaidPartner(c: Pick<Clinic, "id" | "is_partner">): boolean {
  if (c.is_partner) return true;
  const ids = new Set<string>([
    ...sponsoredEditorsPick(),
    ...sponsoredRecommended(),
    ...sponsoredFeatured(),
  ]);
  return ids.has(c.id);
}

export function showAffiliateLink(c: Pick<Clinic, "id" | "is_partner">): boolean {
  return !isPaidPartner(c);
}
