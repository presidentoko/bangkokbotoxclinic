/**
 * Affiliate link wrapping for outbound shop links.
 *
 * Mirrors cosmetics/web/lib/affiliate.ts so both sites are wired the same way.
 * `NEXT_PUBLIC_AFFILIATE_WRAP` holds the network's deep-link prefix — for
 * Involve Asia that is something like `https://invol.co/aff_m?offer_id=…&url=`
 * — and must end with the parameter the destination URL slots into, so the
 * sub-id can be appended as a further parameter.
 *
 * With the variable unset the raw shop URL is returned unchanged. The site
 * therefore works identically before and after an affiliate account exists;
 * turning monetisation on is an environment change, not a deploy of new code.
 *
 * The sub-id carries the product id, which is what turns a payout report into
 * something you can act on: it says *which* of the 986 products earned, so the
 * catalogue can be prioritised by revenue rather than by guess.
 */

const WRAP = process.env.NEXT_PUBLIC_AFFILIATE_WRAP || ''

export function affiliateUrl(rawUrl: string, productId?: string): string {
  if (!rawUrl) return ''
  if (!WRAP) return rawUrl
  const sub = productId ? `&af_sub1=${encodeURIComponent(productId)}` : ''
  return WRAP + encodeURIComponent(rawUrl) + sub
}

/** Whether outbound links are currently monetised. */
export const affiliateEnabled = Boolean(WRAP)
