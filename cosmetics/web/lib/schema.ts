import type { Product, IngredientEntry } from "./types";

export function itemListLd(pageUrl: string, products: Product[], urlOf: (p: Product) => string) {
  return { "@context": "https://schema.org", "@type": "ItemList", url: pageUrl,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1,
      url: urlOf(p), name: p.name })) };
}
export function productLd(p: Product, pageUrl: string) {
  const ld: any = { "@context": "https://schema.org", "@type": "Product", name: p.name,
    brand: { "@type": "Brand", name: p.brand }, image: p.image_url, description: p.description,
    url: pageUrl, offers: { "@type": "Offer", priceCurrency: "THB", price: String(p.price_thb), url: pageUrl } };
  if (p.konvy_review_count > 0 && p.konvy_rating > 0) {
    ld.aggregateRating = { "@type": "AggregateRating", ratingValue: p.konvy_rating,
      reviewCount: p.konvy_review_count, bestRating: 5, worstRating: 1 };
  }
  ld.review = (p.review_summary?.samples ?? []).slice(0, 3).map((r) => ({ "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    author: { "@type": "Person", name: r.author || "Konvy user" }, reviewBody: r.body }));
  return ld;
}
export function ingredientLd(ing: IngredientEntry & { inci: string }, pageUrl: string) {
  return { "@context": "https://schema.org", "@type": "DefinedTerm", name: ing.en_name || ing.inci,
    alternateName: ing.th_name, description: ing.mechanism_en, url: pageUrl,
    inDefinedTermSet: pageUrl.replace(/\/ingredient\/.*/, "/ingredient") };
}
export function faqLd(qas: { q: string; a: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: qas.map((x) => ({ "@type": "Question", name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a } })) };
}
export function orgLd(siteUrl: string) {
  return { "@context": "https://schema.org", "@type": "Organization", name: "BangkokFillers",
    url: siteUrl };
}
