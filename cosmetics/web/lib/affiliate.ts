import type { Product } from "./types";
// Open item: replace with the real Involve Asia deep-link template once the account is set up.
// Until then we link straight to the Konvy product page (still our affiliate destination).
const WRAP = process.env.NEXT_PUBLIC_AFFILIATE_WRAP || ""; // e.g. "https://invol.co/aff?url="
export function affiliateUrl(p: Pick<Product, "url">): string {
  if (!p.url) return "https://www.konvy.com/";
  return WRAP ? WRAP + encodeURIComponent(p.url) : p.url;
}

import { getLinkHealth } from "./link-health";

export async function isLinkAlive(product_id: string): Promise<boolean> {
  const health = await getLinkHealth();
  const entry = health[product_id];
  if (!entry) return true; // not yet checked → optimistically show
  return entry.ok;
}
