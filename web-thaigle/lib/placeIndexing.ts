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

/**
 * Strips non-ASCII characters out of a place slug.
 *
 * /{lang}/place/{slug} does not resolve when the slug contains Thai script.
 * The page is prerendered — the .html is in the build output and the path is
 * in prerender-manifest.json — but the request 404s. It is specific to this
 * route, not to the slug or its encoding: the identical slug served under
 * /activities/{niche}/{slug} returns 200, and /en, /th and /ko place URLs all
 * fail together, so it tracks the dynamic [lang] first segment rather than
 * anything we control in the data. 415 of 1,647 places are affected.
 *
 * Applied in both loaders (lib/places.ts for the client bundle,
 * lib/places-server.ts for the route) so links, generateStaticParams, the
 * detail lookup and sitemap.ts can't disagree about a URL's shape.
 *
 * Deliberately a no-op for slugs that are already ASCII: those resolve today,
 * and normalising them would silently move a working URL (one slug ends in a
 * dash, which the trim below would have rewritten). Only the 415 that have
 * never resolved change, and they keep their trailing unique id, so an
 * all-Thai name degrades to "{category}-{id}" — verified 0 collisions.
 */
export function asciiSlug(slug: string): string {
  if (!/[^\x00-\x7F]/.test(slug)) return slug;
  return slug
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
