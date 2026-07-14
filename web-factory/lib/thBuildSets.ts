// Single source of truth for which category/city slugs actually get a /th/ page built.
// Used both by the /th/* pages themselves (generateStaticParams) and by the EN pages'
// generateMetadata (to avoid emitting a th-TH hreflang alternate that 404s).

export const TH_CATEGORY_VALID = new Set([
  "manufacturer", "auto_parts", "industrial_estate", "warehouse",
  "logistics", "packaging", "food_mfg",
]);

export const TH_CITY_VALID = new Set([
  "chon_buri", "rayong", "pathum_thani", "samut_sakhon",
  "samut_prakan", "bangkok", "phra_nakhon_si_ayutthaya", "songkhla",
  "si_racha", "map_ta_phut", "chiang_mai",
]);
