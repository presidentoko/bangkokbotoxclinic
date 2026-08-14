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

// Number formatting (price/count digit grouping) used to call
// .toLocaleString() with no argument, which resolves to the build
// machine's ICU default (en-US) baked into the static HTML on every
// language variant -- th/ko pages showed English digit grouping. Pass this
// explicitly everywhere a number is formatted for display; never call
// toLocaleString() bare, since the "default" isn't actually deterministic
// across environments.
const LOCALE_FOR_LANG: Record<Lang, string> = { en: "en-US", th: "th-TH", ko: "ko-KR" };
export function localeFor(lang: Lang): string {
  return LOCALE_FOR_LANG[lang];
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
