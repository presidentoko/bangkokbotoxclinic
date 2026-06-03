import { CONCERNS, allProducts, productSlug } from "@/lib/data";
export const dynamic = "force-static";
export function GET() {
  const base = "https://bangkokfillers.com";
  const lines = [
    "# BangkokFillers — Thai skincare ranked by ingredient science + real reviews",
    "# Trust data, not influencers.", "",
    "## Concern rankings",
    ...CONCERNS.map((c) => `${base}/th/${c}`),
    ...CONCERNS.map((c) => `${base}/en/${c}`),
    "", "## Methodology", `${base}/th/methodology`, "",
    "## Products (Thai)",
    ...allProducts().slice(0, 500).map((p) => `${base}/th/product/${productSlug(p)}`),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
