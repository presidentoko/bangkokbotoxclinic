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

export function cityLabel(city: string): string {
  return city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");
}

/** Builds a hreflang alternates map (+ x-default) for a route shape shared across all languages. */
export function hreflangAlternates(pathForLang: (lang: Lang) => string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of SUPPORTED_LANGS) langs[l] = `${SITE.origin}${pathForLang(l)}`;
  langs["x-default"] = `${SITE.origin}${pathForLang(DEFAULT_LANG)}`;
  return langs;
}
