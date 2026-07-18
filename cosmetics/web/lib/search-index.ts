import { allProducts, productSlug, getRanking, getProduct, CONCERNS } from "./data";

// Slim, client-safe projection of the product catalog for in-browser search.
// Never import "@/lib/data" (8.6MB master_db.json) from a "use client" file —
// build this index server-side and pass it down as a prop instead.
export interface SearchIndexEntry {
  id: string;
  brand: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  score: number;
  reviews: number;
  ingredients: string[]; // lowercased INCI names, for matching only
}

export function buildSearchIndex(): SearchIndexEntry[] {
  return allProducts().map((p) => {
    const bestScore = Math.round(
      Math.max(0, ...CONCERNS.map((c) => p.total_score?.[c] ?? 0))
    );
    return {
      id: p.product_id,
      brand: p.brand,
      name: p.name,
      slug: productSlug(p),
      image: p.image_url ?? "",
      price: p.price_thb ?? 0,
      score: bestScore,
      reviews: p.konvy_review_count ?? 0,
      ingredients: (p.ingredient_analysis ?? [])
        .map((a) => a.inci?.toLowerCase())
        .filter((s): s is string => Boolean(s)),
    };
  });
}

// Sorted-product-id-pair key -> canonical "slugA-vs-slugB" string, mirroring
// exactly the pairs generateStaticParams() prerenders in
// app/[locale]/compare/[slugs]/page.tsx (top-5-per-concern). compare has
// dynamicParams=false, so any pair NOT in this map 404s — the search UI
// must only ever link to pairs found here, and must use this exact slug
// order (the reverse order string is a different, non-prerendered path).
export function buildComparablePairs(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const concern of CONCERNS) {
    const top = getRanking(concern).slice(0, 5);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const pA = getProduct(top[i].product_id);
        const pB = getProduct(top[j].product_id);
        if (!pA || !pB) continue;
        const key = [top[i].product_id, top[j].product_id].sort().join("~");
        if (result[key]) continue;
        result[key] = `${productSlug(pA)}-vs-${productSlug(pB)}`;
      }
    }
  }
  return result;
}
