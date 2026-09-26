/**
 * Thai transliterations of an INCI name split the same demand across spellings,
 * and Search Console shows this page losing the larger half: for
 * /th/ingredient/niacinamide, ไนอะซินาไมด์ drew 44 impressions at position 76
 * and ไนอาซินาไมด์ 33 at position 57 (2026-06-15..09-12). The page carried the
 * second spelling in its title and h1 and the first only in body prose, so the
 * variant Google saw most often was the one the page never led with.
 *
 * The first alternate joins the title and the h1; the rest stay in the
 * "หรือเรียกว่า" line below, which already lists them all. One variant only:
 * `| BangkokFillers` is appended by the layout template, and a title that gets
 * truncated in results helps nobody. English pages are untouched — the split is
 * a Thai-script phenomenon.
 *
 * Returns null when there is nothing to add, rather than the plain name: the
 * first cut returned the name and the caller's `titleName ? a : b` then took
 * the variant branch for every Thai page, quietly dropping the
 * "— ส่วนผสมสกินแคร์" tail from the 50 ingredients that have no variant.
 */
export function thaiNameWithVariant(
  ing: { th_name: string; alt_th_names?: string[] },
  isTh: boolean,
  join: (primary: string, variant: string) => string
): string | null {
  const variant = isTh ? ing.alt_th_names?.[0] : undefined;
  return variant ? join(ing.th_name, variant) : null;
}
