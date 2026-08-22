import buyUrls from '../data/food-buy-urls.json'
import { affiliateUrl } from './affiliate'

/**
 * Shop links, keyed by food id.
 *
 * Kept out of petfood-index.json because `buy_url` is 105 KB and exactly one
 * client page renders it — /compare. Leaving it in the card index made every
 * visitor to /food, /food/dog, /food/cat and the category pages download all
 * 986 shop URLs to render none of them.
 */
const URLS = buyUrls as Record<string, string>

export function getBuyUrl(foodId: string): string | undefined {
  const url = URLS[foodId]
  // Wrapped here rather than at each call site, so no outbound shop link can
  // be added later that quietly skips monetisation.
  return url ? affiliateUrl(url, foodId) : undefined
}
