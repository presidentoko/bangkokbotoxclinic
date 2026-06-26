// City normalization — maps non-canonical city_counts display names and supplier city slugs
// to canonical supplier city slugs (lowercase + underscores).
// Used in data.ts (normalizeCity) and city page generateStaticParams (citySlugFromDisplay).

// Thai script and alternate-spelling city_counts display names → canonical slug
const DISPLAY_TO_CANONICAL: Record<string, string> = {
  // Thai script keys in city_counts that have no matching supplier.city slug
  "จ.หนองคาย": "nong_khai",
  "พิษณุโลก": "phitsanulok",
  "จังหวัดพิษณุโลก": "phitsanulok",
  "ตาก": "tak",
  "ฉะเชิงเทรา": "chachoengsao",
  "สระแก้ว": "sa_kaeo",
  "จ.นครราชสีมา": "nakhon_ratchasima",
  "จังหวัดมุกดาหาร": "mukdahan",
  "นครปฐม": "nakhon_pathom",
  "จ.สุราษฎร์ธานี": "surat_thani",
  // English spelling variants in city_counts
  Chonburi: "chon_buri",
  Srisaket: "si_sa_ket",
  Suphanburi: "suphan_buri",
};

// Supplier city slug aliases → canonical slug
// Apply these in data.ts when loading supplier.city values.
export const CITY_SLUG_ALIASES: Record<string, string> = {
  chonburi: "chon_buri",
  srisaket: "si_sa_ket",
  suphanburi: "suphan_buri",
};

/**
 * Converts a city_counts display name to a canonical supplier city slug.
 * Used in generateStaticParams and sitemap to deduplicate city pages.
 */
export function citySlugFromDisplay(display: string): string {
  if (!display) return "";
  if (DISPLAY_TO_CANONICAL[display]) return DISPLAY_TO_CANONICAL[display];
  const slug = display.toLowerCase().replace(/\s+/g, "_");
  return CITY_SLUG_ALIASES[slug] ?? slug;
}

/**
 * Normalizes a raw supplier city slug to its canonical form.
 * Called on each supplier at DB load time.
 */
export function normalizeCity(slug: string | undefined): string {
  if (!slug) return "";
  return CITY_SLUG_ALIASES[slug] ?? slug;
}
