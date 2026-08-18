/**
 * Brands that have a hand-written buying guide at /brands/<slug>.
 *
 * These pages carry the authentication advice, era notes and FAQs that the
 * generated /<brand> price index cannot. Nothing linked to them: /brands
 * (the natural hub) linked only to /<brand>, so the guides sat one weak
 * inbound link away from orphaned — which is how Google ends up filing pages
 * as "Discovered – currently not indexed". Both directions are wired now.
 *
 * The display name is carried here rather than read from the dataset because a
 * few guides (Van Cleef & Arpels, and on chicpreowned also Givenchy and
 * Goyard) cover brands with no priced items — the hub can't learn their name
 * from `getAllBrands()`, and those are exactly the guides that would stay
 * orphaned.
 */
export const BRAND_GUIDES: ReadonlyArray<{ slug: string; name: string }> = [
  { slug: 'audemars-piguet', name: 'Audemars Piguet' },
  { slug: 'balenciaga', name: 'Balenciaga' },
  { slug: 'bottega-veneta', name: 'Bottega Veneta' },
  { slug: 'bulgari', name: 'Bulgari' },
  { slug: 'cartier', name: 'Cartier' },
  { slug: 'celine', name: 'Celine' },
  { slug: 'chanel', name: 'Chanel' },
  { slug: 'dior', name: 'Dior' },
  { slug: 'fendi', name: 'Fendi' },
  { slug: 'givenchy', name: 'Givenchy' },
  { slug: 'goyard', name: 'Goyard' },
  { slug: 'gucci', name: 'Gucci' },
  { slug: 'hermes', name: 'Hermès' },
  { slug: 'loewe', name: 'Loewe' },
  { slug: 'louis-vuitton', name: 'Louis Vuitton' },
  { slug: 'miu-miu', name: 'Miu Miu' },
  { slug: 'omega', name: 'Omega' },
  { slug: 'patek-philippe', name: 'Patek Philippe' },
  { slug: 'prada', name: 'Prada' },
  { slug: 'rolex', name: 'Rolex' },
  { slug: 'saint-laurent', name: 'Saint Laurent' },
  { slug: 'tag-heuer', name: 'TAG Heuer' },
  { slug: 'valentino', name: 'Valentino' },
  { slug: 'van-cleef', name: 'Van Cleef & Arpels' },
]

const SLUGS = new Set(BRAND_GUIDES.map(g => g.slug))

export function hasBrandGuide(slug: string): boolean {
  return SLUGS.has(slug)
}
