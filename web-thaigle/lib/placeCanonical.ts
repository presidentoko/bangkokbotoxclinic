import { NICHES, loadNicheDb, qualifyingNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { asciiSlug } from "@/lib/placeIndexing";

/**
 * Maps a /{lang}/place/{slug} page to the /activities venue page for the same
 * business, where one exists.
 *
 * These are two pages about one venue. The place tree is the thinner of the
 * two — 1,647 pages whose unique text is a templated sentence — and it was
 * given `noindex` on 2026-08-21 for that reason. The GSC export for
 * 2026-06-20..08-22 then showed what that cost: the single highest-impression
 * page on the whole site is `/ko/place/wellness-sathorn-boutique-spa-wellness-…`
 * at 948, with `/en/place/…` and `/ko/place/…` together carrying 3,306. Those
 * are impressions for venues that also have a full `/activities/wellness/…`
 * page — the demand is real, it just landed on the wrong URL.
 *
 * `noindex` is the wrong instrument for that. It drops the page *and*
 * discards the signals it accumulated, because Google will not consolidate
 * from a page it has been told to exclude. A cross-URL canonical is the
 * instrument for two URLs about one thing: the thin page stays out of results
 * and its signals move to the page that deserves them.
 *
 * Place slugs are the niche slugs — `wellness-sathorn-boutique-spa-wellness-v8omde`
 * is the key in both datasets — so the mapping is the slug itself, keyed
 * through asciiSlug() because that is the form the place route serves
 * (see lib/placeIndexing.ts).
 *
 * Only venues that clear `qualifyingNichePlaces` are mapped: that is the same
 * gate `/activities/[niche]/[slug]` uses in generateStaticParams, so a
 * canonical produced here always points at a page that was actually built.
 * Everything it does not cover keeps the existing noindex — there is no
 * better page to send those to.
 */
export type ActivityTarget = { niche: string; slug: string; path: string };

let _map: Map<string, ActivityTarget> | null = null;

async function build(): Promise<Map<string, ActivityTarget>> {
  const map = new Map<string, ActivityTarget>();
  for (const n of NICHES) {
    const db = await loadNicheDb(n.slug as NicheSlug);
    for (const p of qualifyingNichePlaces(n.slug, db.places)) {
      const key = asciiSlug(p.slug);
      // First niche wins. Slugs carry their niche as a prefix, so a collision
      // would mean two venues in one niche whose names differ only outside
      // ASCII — leaving the first is stable across builds either way.
      if (!map.has(key)) {
        map.set(key, {
          niche: n.slug,
          slug: p.slug,
          path: `/activities/${n.slug}/${encodeURIComponent(p.slug)}`,
        });
      }
    }
  }
  return map;
}

/** The activities page for this place slug, or null if it has none. */
export async function activityForPlace(placeSlug: string): Promise<ActivityTarget | null> {
  if (!_map) _map = await build();
  return _map.get(placeSlug) ?? null;
}
