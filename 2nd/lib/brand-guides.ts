/**
 * Brands that have a hand-written buying guide at /brands/<slug>.
 *
 * These pages carry the authentication advice, era notes and FAQs that the
 * generated /<brand> price index cannot. Nothing linked to them: /brands
 * (the natural hub) linked only to /<brand>, so the guides sat one weak
 * inbound link away from orphaned — which is how Google ends up filing pages
 * as "Discovered – currently not indexed". Both directions are wired now.
 */
export const BRAND_GUIDE_SLUGS: readonly string[] = [
  'audemars-piguet',
  'balenciaga',
  'bottega-veneta',
  'bulgari',
  'cartier',
  'celine',
  'chanel',
  'dior',
  'fendi',
  'givenchy',
  'goyard',
  'gucci',
  'hermes',
  'loewe',
  'louis-vuitton',
  'miu-miu',
  'omega',
  'patek-philippe',
  'prada',
  'rolex',
  'saint-laurent',
  'tag-heuer',
  'valentino',
  'van-cleef',
]

export function hasBrandGuide(slug: string): boolean {
  return BRAND_GUIDE_SLUGS.includes(slug)
}
