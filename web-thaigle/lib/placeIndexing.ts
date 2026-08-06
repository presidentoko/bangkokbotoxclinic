// Note: this is lib/places.ts's Lang (th/en/ko), not lib/i18n.ts's (en/th).
// The two are separate language sets and the names collide.
import type { Lang } from "@/lib/places";

/**
 * Single source of truth for which /{lang}/place/* language trees search
 * engines are allowed to index.
 *
 * Three separate files have to agree about this — app/robots.ts (what's
 * disallowed), app/sitemap.ts (what's submitted), and the place page's
 * alternates.languages (what hreflang advertises). When they disagree you get
 * hreflang pointing at robots-blocked URLs, or a sitemap listing pages Google
 * can't fetch. Deriving all three from here keeps them from drifting apart.
 *
 * History: all three langs were blocked on 2026-07-26 to stop ISR/transfer
 * overage from Googlebot recrawl. That route is now force-static with
 * dynamicParams=false and performs no ISR writes, so the cost argument is
 * gone; English (the cluster's x-default) is reopened at a third of the
 * original crawl volume.
 */
export const PLACE_LANGS: Lang[] = ["th", "en", "ko"];

export const INDEXABLE_PLACE_LANGS: Lang[] = ["en"];

export const BLOCKED_PLACE_LANGS: Lang[] = PLACE_LANGS.filter(
  (l) => !INDEXABLE_PLACE_LANGS.includes(l)
);

/** robots.txt Disallow entries for the non-indexable language trees. */
export const BLOCKED_PLACE_PATHS: string[] = BLOCKED_PLACE_LANGS.map(
  (l) => `/${l}/place/`
);
