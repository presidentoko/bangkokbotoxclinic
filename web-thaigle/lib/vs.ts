import {
  NICHES,
  NICHE_CITY_MIN_VENUES,
  NICHE_CITY_SLUGS,
  cityPageDuplicatesHub,
  loadNicheDb,
  qualifyingNichePlaces,
  type NicheSlug,
  type NichePlace,
} from "@/lib/niches";
import { AREAS, AREA_MIN_VENUES, areaSearchLabel, placesInArea } from "@/lib/areas";
import { isThinVenue } from "@/lib/venueContent";
import { nicheContext } from "@/lib/verdict";
import { adjustedRating } from "@/lib/vsMetrics";

// Which venue-vs-venue pages exist.
//
// A comparison page is only worth a URL when someone choosing between the two
// is a real person, so pairs are drawn from the top of ONE neighbourhood or
// city, never across the country: the best spa in Sukhumvit against the next
// best spa in Sukhumvit, not a Phuket resort against a Bangkok massage shop.
//
// The set is deliberately small. This site already carries ~6,900 URLs, was
// hit by the August 2026 quality update, and sits on a Vercel team that has
// exceeded its ISR meters; a few hundred pages with real analysis on each is
// the right shape, thousands of near-identical ones is the shape that got the
// network demoted. Every constant below is a cap, and the page count it
// produces is asserted at build time (see assertSane).

/** Below this a rating is a rumour; 60 reviews is where the adjusted rating starts to agree with the raw one. */
export const MIN_REVIEWS = 60;
/** A group needs this many eligible venues before its top is worth pairing. */
export const MIN_GROUP = 5;
/** Venues paired per group: all pairs among the top K, so K=4 is 6 pairs. */
export const TOP_K = 4;
/** Hard ceiling per niche, so one big niche cannot dominate the build. */
export const MAX_PER_NICHE = 80;

export type VsGroup = {
  id: string;
  label: string;
  scope: "area" | "city";
  /** The listing this pair came out of, for the "see all" link. */
  href: string;
};

export type VsPair = {
  niche: NicheSlug;
  /** URL segment: /activities/{niche}/vs/{slug} */
  slug: string;
  a: NichePlace;
  b: NichePlace;
  group: VsGroup;
};

export type VsIndex = {
  niche: NicheSlug;
  generatedAt: string;
  medianRating: number;
  pairs: VsPair[];
  bySlug: Map<string, VsPair>;
  byVenue: Map<string, VsPair[]>;
};

/** ASCII only. A Thai-script slug answers 200 and renders a 404 (feedback_nextjs_nonascii_slug_404). */
function part(p: NichePlace, niche: string): string {
  const tail = p.id.replace(/[^A-Za-z0-9]/g, "").slice(-6).toLowerCase();
  let s = p.slug
    .normalize("NFKD")
    .replace(/[^\x20-\x7e]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (s.startsWith(`${niche}-`)) s = s.slice(niche.length + 1);
  if (s.endsWith(`-${tail}`)) s = s.slice(0, -(tail.length + 1));
  if (s.length > 34) s = s.slice(0, 34).replace(/-[^-]*$/, "") || s.slice(0, 34);
  return `${s || "venue"}-${tail}`;
}

export function pairSlug(niche: string, a: NichePlace, b: NichePlace): string {
  // Stable order so the same two venues are always one URL.
  const [x, y] = a.id < b.id ? [a, b] : [b, a];
  return `${part(x, niche)}-vs-${part(y, niche)}`;
}

const cache = new Map<string, Promise<VsIndex>>();

export function getVsIndex(niche: NicheSlug): Promise<VsIndex> {
  let hit = cache.get(niche);
  if (!hit) {
    hit = build(niche);
    cache.set(niche, hit);
  }
  return hit;
}

async function build(niche: NicheSlug): Promise<VsIndex> {
  const db = await loadNicheDb(niche);
  const ctx = nicheContext(niche, db.places);
  const prior = ctx.medianRating;

  const eligible = (p: NichePlace) => p.rating != null && (p.review_count ?? 0) >= MIN_REVIEWS && !isThinVenue(p);
  const ranked = (ps: NichePlace[]) =>
    ps
      .filter(eligible)
      .map((p) => ({ p, adj: adjustedRating(p.rating, p.review_count, prior) ?? 0 }))
      .sort((x, y) => y.adj - x.adj || (y.p.review_count ?? 0) - (x.p.review_count ?? 0))
      .map((x) => x.p);

  const groups: { group: VsGroup; venues: NichePlace[] }[] = [];

  // Bangkok neighbourhoods, by address. Same definition the area listing pages use.
  for (const area of AREAS) {
    const all = placesInArea(area, niche, db.places);
    const venues = ranked(all);
    if (venues.length < MIN_GROUP) continue;
    groups.push({
      group: {
        id: `area:${area.slug}`,
        label: areaSearchLabel(area),
        scope: "area",
        // The area page only exists above the venue floor; below it, link the hub.
        href: all.length >= AREA_MIN_VENUES ? `/activities/${niche}/area/${area.slug}` : `/activities/${niche}`,
      },
      venues,
    });
  }

  // The other cities this site has listing pages for.
  const qualifying = qualifyingNichePlaces(niche, db.places);
  for (const [city, citySlug] of Object.entries(NICHE_CITY_SLUGS)) {
    if (city === "Bangkok") continue; // covered by neighbourhoods; a city-wide Bangkok pair is nobody's real choice
    const inCity = qualifying.filter((p) => p.city === city);
    const venues = ranked(inCity);
    if (venues.length < MIN_GROUP) continue;
    const hasPage = inCity.length >= NICHE_CITY_MIN_VENUES && !cityPageDuplicatesHub(niche, db.places, city);
    groups.push({
      group: { id: `city:${citySlug}`, label: city, scope: "city", href: hasPage ? `/activities/${niche}/city/${citySlug}` : `/activities/${niche}` },
      venues,
    });
  }

  // Neighbourhoods overlap (Thonglor sits inside Sukhumvit). The narrower
  // group claims a pair first, so the pair is attributed to the place a
  // person would actually name.
  groups.sort((x, y) => x.venues.length - y.venues.length);

  const claimed = new Set<string>();
  const pairs: VsPair[] = [];
  for (const { group, venues } of groups) {
    const top = venues.slice(0, TOP_K);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        if (pairs.length >= MAX_PER_NICHE) break;
        const key = [top[i].id, top[j].id].sort().join("|");
        if (claimed.has(key)) continue;
        claimed.add(key);
        // `a` is the stronger side by adjusted rating (top is already ranked).
        pairs.push({ niche, slug: pairSlug(niche, top[i], top[j]), a: top[i], b: top[j], group });
      }
    }
  }

  const bySlug = new Map<string, VsPair>();
  const byVenue = new Map<string, VsPair[]>();
  for (const pair of pairs) {
    const clash = bySlug.get(pair.slug);
    if (clash) throw new Error(`vs: slug collision ${pair.slug} (${clash.a.id}/${clash.b.id} vs ${pair.a.id}/${pair.b.id})`);
    bySlug.set(pair.slug, pair);
    for (const p of [pair.a, pair.b]) {
      const list = byVenue.get(p.id) ?? [];
      list.push(pair);
      byVenue.set(p.id, list);
    }
  }

  return { niche, generatedAt: db.generated_at, medianRating: prior, pairs, bySlug, byVenue };
}

/** Every pair across every niche, for generateStaticParams and the sitemap. */
export async function allVsParams(): Promise<{ niche: string; pair: string }[]> {
  const out: { niche: string; pair: string }[] = [];
  for (const n of NICHES) {
    const idx = await getVsIndex(n.slug as NicheSlug);
    for (const p of idx.pairs) out.push({ niche: n.slug, pair: p.slug });
  }
  return out;
}

/** Niches that actually have comparisons, for the hub and its links. */
export async function nichesWithVs(): Promise<NicheSlug[]> {
  const out: NicheSlug[] = [];
  for (const n of NICHES) {
    if ((await getVsIndex(n.slug as NicheSlug)).pairs.length > 0) out.push(n.slug as NicheSlug);
  }
  return out;
}

/** Comparisons a given venue appears in, strongest group first, for the "compare" block on its page. */
export async function vsForVenue(niche: string, venueId: string, limit = 3): Promise<VsPair[]> {
  if (!NICHES.some((n) => n.slug === niche)) return [];
  const idx = await getVsIndex(niche as NicheSlug);
  return (idx.byVenue.get(venueId) ?? []).slice(0, limit);
}
