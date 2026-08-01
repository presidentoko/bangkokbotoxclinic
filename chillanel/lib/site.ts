export const SUPPORTED_LANGS = ["en", "th", "ko"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const SITE = {
  name: "chillanel",
  domain: "chillanel.com",
  origin: "https://www.chillanel.com",
  defaultLang: DEFAULT_LANG,
  supportedLangs: SUPPORTED_LANGS,
};

export function isLang(v: string): v is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(v);
}

// City slugs come straight from spa_output/{slug}/ folder names, which
// mirror watchdog.py's city_tag convention — multi-word cities use
// underscores ("chiang_mai", "koh_samui", "hua_hin"), not hyphens. Title-case
// every word so e.g. "chiang_mai" reads as "Chiang Mai", not "Chiang_mai".
export function cityLabel(city: string): string {
  return city
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Builds a hreflang alternates map (+ x-default) for a route shape shared across all languages. */
export function hreflangAlternates(pathForLang: (lang: Lang) => string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of SUPPORTED_LANGS) langs[l] = `${SITE.origin}${pathForLang(l)}`;
  langs["x-default"] = `${SITE.origin}${pathForLang(DEFAULT_LANG)}`;
  return langs;
}
