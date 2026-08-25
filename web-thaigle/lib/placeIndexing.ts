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

/**
 * Whether /{lang}/place/* may be indexed at all.
 *
 * Set false 2026-08-21. These 1,647 pages carry a median of ~137 characters
 * of text unique to the page: `feedSays` has 7 distinct values across all
 * 1,647 (339 places share one sentence verbatim), `dataSays` reduces to 9
 * templates, and 99.3% of them end with the identical clause "below category
 * average". That is thin, templated content at scale, which is the single
 * most common reason an AdSense application is refused — and it is judged
 * against the whole account, so these pages put the rest of the site's
 * monetisation at risk while earning nothing themselves.
 *
 * They stay crawlable on purpose. A robots.txt Disallow would stop Google
 * fetching them, and a page Google cannot fetch is a page whose noindex it
 * cannot read — the already-indexed ones would simply stay indexed. Letting
 * the crawler in to see the noindex is what actually removes them.
 *
 * The pages themselves remain: they still serve visitors who land on them and
 * they still pass internal links. Only the invitation to rank is withdrawn.
 */
export const PLACE_TREE_INDEXABLE = false;

export const INDEXABLE_PLACE_LANGS: Lang[] = ["en"];

export const BLOCKED_PLACE_LANGS: Lang[] = PLACE_LANGS.filter(
  (l) => !INDEXABLE_PLACE_LANGS.includes(l)
);

/**
 * robots.txt Disallow entries for the place tree — now empty, deliberately.
 *
 * `/th/place/` and `/ko/place/` were disallowed to hold crawl volume down.
 * The GSC export for 2026-06-20..08-22 shows what that produced: `/ko/place/`
 * is the site's single largest source of impressions (1,962, including the
 * top page at 948) while being a tree Google is forbidden to fetch. Blocked
 * URLs still get indexed from links — as URLs, with no content, ranking on
 * nothing and consolidating into nothing.
 *
 * Every page in this tree now carries an instruction: a canonical to the
 * venue's `/activities` page where one exists (lib/placeCanonical.ts, 1,225
 * of 1,647), and `noindex` for the remainder. Both instructions live in the
 * page's own head, and a crawler that is not allowed to fetch the page never
 * reads either one. Disallow is the wrong tool whenever the goal is for
 * Google to *learn* something about a URL; it is only right for URLs nothing
 * links to.
 *
 * The original cost argument is also gone: this route is force-static with
 * dynamicParams=false and performs no ISR writes, so the crawl it invites is
 * static-file transfer, not the ISR read/write overage that prompted the
 * 2026-07-26 block.
 */
export const BLOCKED_PLACE_PATHS: string[] = [];

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
/**
 * Build a link to a place detail page, falling back to "en" for any lang
 * outside PLACE_LANGS (ja/ru/ar) — those homepages exist (SUPPORTED_LANGS in
 * app/[lang]/page.tsx) but /{lang}/place/* is only statically generated for
 * th/en/ko (dynamicParams=false), so linking with the raw lang 404s. Every
 * place-linking call site should go through this instead of hand-rolling
 * `/${lang}/place/${slug}` — that pattern has recurred bug-for-bug in five
 * different files.
 */
export function placeHref(lang: string, slug: string): string {
  const safeLang = (PLACE_LANGS as readonly string[]).includes(lang) ? lang : "en";
  return `/${safeLang}/place/${encodeURIComponent(slug)}`;
}

export function asciiSlug(slug: string): string {
  if (!/[^\x00-\x7F]/.test(slug)) return slug;
  return slug
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
