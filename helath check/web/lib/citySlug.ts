// One place that decides what /city/<slug> a hospital belongs to.
//
// Four call sites each did `city.toLowerCase().replace(/\s+/g, "-")` and hoped.
// The city route publishes `chon-buri`, `ko-samui` and `korat`, while the data
// says "Chonburi", "Koh Samui" and "Nakhon Ratchasima", so ten hospitals —
// four in Chonburi, two in Nakhon Ratchasima, two on Samui, Samut Prakan and
// Chanthaburi — linked their own breadcrumb, their footer link and their
// BreadcrumbList JSON-LD at a hard 404 (the route is dynamicParams=false).
//
// Now the mapping is explicit and, crucially, a slug that the route does not
// publish returns null so the caller renders plain text instead of a dead link.

/** Slugs the /city/[city] route actually pre-renders. Keep in sync with CITY_SLUGS there. */
export const CITY_ROUTE_SLUGS = new Set([
  "bangkok", "chiang-mai", "phuket", "pattaya", "hua-hin", "ko-samui", "krabi",
  "chiang-rai", "hat-yai", "khon-kaen", "koh-chang", "udon-thani", "korat",
  "ayutthaya", "chon-buri", "nakhon-si-thammarat", "lampang", "nakhon-pathom",
  "rayong", "surat-thani", "phitsanulok", "trang", "trat", "samut-sakhon",
]);

/** Data spellings that do not slugify to the route's slug. */
const ALIASES: Record<string, string> = {
  chonburi: "chon-buri",
  "chon-buri": "chon-buri",
  "koh-samui": "ko-samui",
  samui: "ko-samui",
  "nakhon-ratchasima": "korat",
  "phra-nakhon-si-ayutthaya": "ayutthaya",
  "chiangmai": "chiang-mai",
  "chiangrai": "chiang-rai",
  "hatyai": "hat-yai",
  "huahin": "hua-hin",
  "khonkaen": "khon-kaen",
  "udonthani": "udon-thani",
  "suratthani": "surat-thani",
  "nakhonpathom": "nakhon-pathom",
  "samutsakhon": "samut-sakhon",
};

function slugify(city: string): string {
  return city.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** The city page slug for a hospital's city, or null when no such page exists. */
export function citySlug(city: string | null | undefined): string | null {
  if (!city) return null;
  const base = slugify(city);
  const mapped = ALIASES[base] ?? base;
  return CITY_ROUTE_SLUGS.has(mapped) ? mapped : null;
}
