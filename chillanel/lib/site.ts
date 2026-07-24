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
