import type { PetFood } from './types'
import { getFoodGrade } from './grading'
import { foodKind } from './foodKind'

/**
 * Which product pages are worth asking Google to index.
 *
 * On 2026-08-16 the site's daily impressions fell from 186 to 12 overnight and
 * average position went from ~10 to ~40, while the indexed count held at ~1,510
 * for weeks — the signature of a sitewide quality demotion, not a technical
 * outage (no deploy that day; Google's August 2026 spam update, which targets
 * scaled and programmatic content, rolled out 08-18 → 08-21).
 *
 * The previous gate, `hasPublishableData`, let a page in on a price alone. That
 * put 429 pages in the sitemap whose entire body was a product name, a table of
 * dashes, "no ingredient data yet" and a templated FAQ answering its own
 * questions with "no data" — 53% of each page's text identical to every other.
 * That is what scaled-content classifiers are built to find.
 *
 * A product page is indexable when it says something checkable about the
 * product: a grade from its ingredient panel, or a label protein+fat analysis.
 * Everything else stays live and linked, with `noindex`.
 */

/**
 * Pages the tighter gate would drop that Search Console shows earning
 * impressions (Performance export, 2026-06-14 → 09-13). Together 46 impressions
 * and no clicks, but they rank at 2–9, and removing pages that rank on the
 * theory that they "cannot" is exactly the mistake that cost bangkokfillers 80%
 * of its impressions in August. Re-check against a fresh export before pruning.
 */
const GSC_EARNING = new Set([
  'royal-canin-poodle-puppy',
  'royal-canin-pug-puppy',
  'royal-canin-jack-russell-terrier-puppy',
  'royal-canin-yorkshire-terrier-puppy',
  'royal-canin-golden-retriever-puppy',
  'royal-canin-shiba-inu-adult',
  'royal-canin-rottweiler-puppy',
  'acana-chunks-in-broth-chicken-salmon-recipe-for-kittenswet-cat-food',
  'acana-classics-beef-and-barley-recipedry-dog-food',
])

/**
 * 2026-09-23: no product page is indexable, whatever its data.
 *
 * The gate below cut the sitemap from 973 product URLs to 558 and left the
 * graded ones in. A week later the section still reads as what Google's spam
 * systems call a thin affiliate: 558 near-identical pages, each a name, a
 * panel, a buy button, most of the wording shared. Its whole contribution to
 * search in three months was 59 impressions and no clicks, so there is nothing
 * to protect and the section is the clearest remaining scaled-content signal on
 * the site.
 *
 * The pages stay live, linked and usable — the grades are the reason people are
 * sent here from a video — they are simply not offered to Search. The way back
 * in is a handful of problem-led comparison guides ("แมวเป็นโรคไต ควรกินอาหาร
 * อะไร") that cite these pages, not the product pages themselves.
 */
const PRODUCT_PAGES_INDEXABLE = false

export function isIndexableFood(food: PetFood, slug: string): boolean {
  if (!PRODUCT_PAGES_INDEXABLE) return false
  if (foodKind(food) === 'nonfood') return false
  if (GSC_EARNING.has(slug)) return true
  if (getFoodGrade(food)) return true
  return food.protein_pct > 0 && food.fat_pct > 0
}
