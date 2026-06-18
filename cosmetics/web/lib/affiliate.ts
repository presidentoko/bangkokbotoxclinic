import type { Product } from "./types";
// Open item: replace with the real Involve Asia deep-link template once the account is set up.
// Until then we link straight to the Konvy product page (still our affiliate destination).
// WRAP must end with a query param fragment, e.g. "https://invol.co/aff?url="
// so that &af_sub1= appends as a valid second query param.
const WRAP = process.env.NEXT_PUBLIC_AFFILIATE_WRAP || "";
export function affiliateUrl(p: Pick<Product, "url" | "product_id">): string {
  if (!p.url) return "https://www.konvy.com/";
  if (!WRAP) return p.url;
  return WRAP + encodeURIComponent(p.url) + "&af_sub1=" + encodeURIComponent(p.product_id);
}

import { getLinkHealth } from "./link-health";

export async function isLinkAlive(product_id: string): Promise<boolean> {
  const health = await getLinkHealth();
  const entry = health[product_id];
  if (!entry) return true; // not yet checked → optimistically show
  return entry.ok;
}
