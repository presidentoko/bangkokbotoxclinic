import { NEIGHBORHOODS } from "./neighborhoods";
import { qualifyingNichePlaces, type NichePlace } from "./niches";

/**
 * Bangkok areas for activity venues, resolved from the venue's address text.
 *
 * Why text and not geo: activity records carry no lat/lng (46 of 2,124 have
 * one), so the restaurant tree's radius matching in ./neighborhoods.ts can't
 * be reused here. They do carry `address`, and a Thai address names its road
 * and khet — "Sukhumvit 31, Khlong Toei Nuea, Watthana" — which is exactly
 * the thing people type. Address coverage was 0% when this split was first
 * considered, which is why /activities/[niche]/city/[city] only splits by
 * city; the 2026-08 Apify backfill took it to 99% and unblocked this.
 *
 * Areas share slug and label with ./neighborhoods.ts wherever both trees know
 * the place, so /restaurants/bangkok/silom and /activities/spa/area/silom mean
 * the same Silom. Two areas exist only here — the activity data is dense in
 * Ratchada and along the river, the restaurant data isn't.
 *
 * Overlap is intended: Thonglor and Ekkamai are on Sukhumvit and match both.
 * A venue belongs to every area whose name its address carries, the same way
 * it would belong to both in a person's head.
 */
export type Area = {
  slug: string;
  label: string;
  transit: string;
  blurb: string;
  /** Matched case-insensitively against `${address} ${name}`. */
  pattern: RegExp;
};

/** Reuse the restaurant tree's identity for a slug both trees know. */
function shared(slug: string, pattern: RegExp, blurb: string): Area {
  const n = NEIGHBORHOODS.find((x) => x.city === "bangkok" && x.slug === slug);
  if (!n) throw new Error(`areas.ts: "${slug}" is not a bangkok neighbourhood`);
  return { slug, label: n.label, transit: n.transit, blurb, pattern };
}

export const AREAS: Area[] = [
  shared(
    "sukhumvit",
    /sukhumvit|watthana|khlong ?toei|asok|asoke|nana|phrom ?phong|thong ?lo|ekkamai|ekamai|phra ?khanong|on ?nut|udomsuk/i,
    "The long international spine of the city. Sukhumvit carries more spas, gyms and studios per kilometre than anywhere else in Bangkok, and the BTS runs the length of it, so nothing here needs a taxi.",
  ),
  shared(
    "thonglor",
    /thong ?lo(r|re)?\b|thonglor/i,
    "Bangkok's design district, and where the city's more expensive wellness studios cluster. Small, walkable, and priced accordingly.",
  ),
  shared(
    "ekkamai",
    /ekkamai|ekamai/i,
    "One BTS stop past Thonglor and noticeably cheaper for the same thing. Quieter side sois, more independent operators.",
  ),
  shared(
    "silom",
    /silom|sathorn|sathon|bang ?rak|surawong|si ?lom|chong ?nonsi/i,
    "The business district, which means lunchtime massage, after-work gyms and hotel spas at the top end. Busiest on weekdays, calm on Sundays.",
  ),
  shared(
    "siam",
    /siam|pathum ?wan|ratchaprasong|chit ?lom|phloen ?chit|ploenchit|ratchadamri|lumphini|lumpini/i,
    "Central Bangkok's mall belt. Most of what's here sits inside or beside a shopping centre, which makes it the easiest area to combine with anything else in a day.",
  ),
  shared(
    "ari",
    /\bari\b|\baree\b|phaya ?thai|sanam ?pao|saphan ?khwai/i,
    "A residential pocket that turned into a neighbourhood people travel to. Independent studios and small spas rather than chains.",
  ),
  shared(
    "chinatown",
    /yaowarat|chinatown|samphanthawong|charoen ?krung/i,
    "Old Bangkok at its densest. Traditional Thai massage shops here are long-established and cheap, and the MRT finally made the area easy to reach.",
  ),
  shared(
    "rattanakosin",
    /rattanakosin|phra ?nakhon|khao ?san|banglamphu|bang ?lamphu|tha ?tien/i,
    "The old royal quarter, and the area most visitors see first. Massage near the temples runs cheaper than anywhere on Sukhumvit for the same hour.",
  ),
  {
    slug: "ratchada",
    label: "Ratchada & Huai Khwang",
    transit: "MRT Huai Khwang / Thailand Cultural Centre / Lat Phrao",
    blurb:
      "Where Bangkok goes when Sukhumvit gets expensive. The MRT line is lined with 24-hour massage, boxing gyms and late-night everything, at local prices.",
    pattern: /ratchada|huai ?khwang|din ?daeng|lat ?phrao|ladprao|lardprao/i,
  },
  {
    slug: "riverside",
    label: "Riverside & Thonburi",
    transit: "BTS Krung Thon Buri / Saphan Taksin · Chao Phraya ferry",
    blurb:
      "The Chao Phraya's west bank and the hotel strip facing it. Riverside spas skew high-end and resort-style; a few streets inland the prices fall away.",
    pattern: /charoen ?nakhon|khlong ?san|klongsan|iconsiam|thonburi|riverside/i,
  },
];

/**
 * Same floor as NICHE_CITY_MIN_VENUES. Below this a page is a stub competing
 * with its own parent hub for the same query, which helps nobody.
 */
export const AREA_MIN_VENUES = 15;

export function findArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

function haystack(p: NichePlace): string {
  return `${p.address ?? ""} ${p.name ?? ""}`;
}

/**
 * Qualifying Bangkok venues of `nicheSlug` whose address places them in `area`,
 * best-ranked first. Bangkok-only: the area names are Bangkok's, and a Chiang
 * Mai venue on a road called Silom would be a lie on the page.
 */
export function placesInArea(area: Area, nicheSlug: string, places: NichePlace[]): NichePlace[] {
  return qualifyingNichePlaces(nicheSlug, places)
    .filter((p) => p.city === "Bangkok" && area.pattern.test(haystack(p)))
    .sort((a, b) => b.trust_score - a.trust_score);
}

/** Areas of this niche that clear AREA_MIN_VENUES, largest first. */
export function nicheAreaCounts(
  nicheSlug: string,
  places: NichePlace[],
): { area: Area; count: number }[] {
  return AREAS.map((area) => ({ area, count: placesInArea(area, nicheSlug, places).length }))
    .filter(({ count }) => count >= AREA_MIN_VENUES)
    .sort((a, b) => b.count - a.count);
}
