import type { Locale } from "./locale";

// Route types that have real th/ko hub-page translations: /c/[cuisine], /d/[district], /city/[name].
// Everything else (restaurant/, best/, guide/, saved, about, ...) has no
// locale twin, so leaving those hrefs unprefixed is correct, not a bug.
const LOCALIZED_HUB = /^\/(c|d|city)\/[^/]+\/?$/;

export function localizedHubHref(href: string, locale: Locale): string {
  if (locale === "en") return href;
  if (LOCALIZED_HUB.test(href)) return `/${locale}${href}`;
  return href;
}
