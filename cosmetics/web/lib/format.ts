export function slugify(s: string): string {
  return (s || "").toLowerCase().trim()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

// Client-safe — only needs brand/product_id, never import "@/lib/data"
// (8.6MB master_db.json) from a "use client" file just for this.
export const productSlug = (p: { brand: string; product_id: string }) =>
  `${slugify(p.brand)}-${p.product_id}`;
export const productIdFromSlug = (slug: string) => slug.split("-").pop() ?? "";
export const baht = (n: number) => "฿" + Math.round(n).toLocaleString("en-US");
export const score1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1);

/** Returns a Tailwind text-color class based on the score value. */
export function scoreColor(n: number): string {
  if (n >= 85) return "text-emerald-600";
  if (n >= 70) return "text-amber-600";
  return "text-[#8a7a76]";
}
