import type { Product, IngredientEntry } from "./types";
import { concernLabel } from "./i18n";
import type { Locale } from "./i18n";

export function itemListLd(pageUrl: string, products: Product[], urlOf: (p: Product) => string) {
  return { "@context": "https://schema.org", "@type": "ItemList", url: pageUrl,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1,
      url: urlOf(p), name: p.name })) };
}
/** Maps a scraped retailer product URL to the retailer's display name. */
function sellerFromUrl(url: string | undefined): string | null {
  const host = String(url ?? "");
  if (host.includes("konvy.com")) return "Konvy";
  if (host.includes("watsons.co.th")) return "Watsons Thailand";
  if (host.includes("boots.co.th")) return "Boots Thailand";
  if (host.includes("iherb.com")) return "iHerb";
  if (host.includes("thebeautrium.com")) return "Beautrium";
  return null;
}

export function productLd(p: Product, pageUrl: string) {
  // Derive concern-based category
  const concernSeed = Array.isArray(p.concern_seeds)
    ? p.concern_seeds[0]
    : String(p.concern_seeds || "").split("|")[0] || "";
  const CONCERN_CATEGORY: Record<string, string> = {
    acne: "Acne skincare", whitening: "Brightening & dark spot skincare",
    antiaging: "Anti-aging skincare", pores: "Pore & texture skincare",
    oilcontrol: "Oil control skincare", sensitive: "Sensitive skin care",
  };
  const category = CONCERN_CATEGORY[concernSeed] ?? "Skincare";

  // Key active ingredients as additionalProperty
  const keyActives = (p.ingredient_analysis ?? [])
    .filter((a) => (a.concern_efficacy?.[concernSeed] ?? 0) > 0)
    .slice(0, 5)
    .map((a) => ({ "@type": "PropertyValue", name: "Active ingredient", value: a.inci }));

  const ld: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: p.brand },
    image: p.image_url,
    description: p.description,
    url: pageUrl,
    category,
    ...(p.gtin8 ? { gtin8: p.gtin8 } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
    ...(keyActives.length > 0 ? { additionalProperty: keyActives } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "THB",
      price: String(p.price_thb),
      url: pageUrl,
      availability: "https://schema.org/InStock",
      // BangkokFillers does not sell anything — it aggregates retailer listings.
      // Naming ourselves as `seller` is a factual misstatement and puts the page
      // in scope for Google's merchant-listing policies. The real seller is the
      // retailer the price was scraped from (p.url), so name them instead and
      // omit the field entirely when the source URL doesn't identify one.
      ...(sellerFromUrl(p.url) ? { seller: { "@type": "Organization", name: sellerFromUrl(p.url) } } : {}),
      // No priceValidUntil: these pages are statically prerendered, so any date
      // derived from Date.now() freezes at build time and silently drifts into
      // the past — and a past priceValidUntil makes Google treat the offer as
      // expired and drop the Product rich result. The field is optional; a
      // stale value is strictly worse than no value.
    },
  };
  if (p.konvy_review_count > 0 && p.konvy_rating > 0) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: p.konvy_rating,
      reviewCount: p.konvy_review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }
  // Individual review text. review_summary.samples is empty for every product in
  // master_db — the Konvy/Boots/iHerb review scrapers currently return 0 snippets
  // across the board — which was emitting `"review": []` on all ~1,000 product
  // pages. An empty array is a schema validation error, not a neutral omission.
  //
  // Watsons is the one source that does return review text (1,905 snippets across
  // 166 products), and WatsonsModule already renders those quotes visibly on the
  // page, so marking them up here describes on-page content rather than inventing
  // it. They are attributed to Watsons via `publisher`, since BangkokFillers did
  // not collect them.
  type Rev = { rating: number; author?: string; body: string; date?: string; fromWatsons: boolean };
  const fromSamples: Rev[] = (p.review_summary?.samples ?? []).map((r) => {
    const rr = r as typeof r & { body?: string; text?: string };
    return { rating: r.rating ?? 0, author: r.author, body: rr.body || rr.text || "", fromWatsons: false };
  });
  const fromWatsons: Rev[] = (p.watsons?.snippets ?? []).map((s) => ({
    rating: s.rating ?? 0,
    author: s.author,
    body: s.text ?? "",
    date: s.date,
    fromWatsons: true,
  }));
  const reviews = [...fromSamples, ...fromWatsons]
    .filter((r) => r.body.trim() !== "" && r.rating > 0)
    // WatsonsModule shows 4; keeping the markup to the same 4 avoids describing
    // reviews the visitor cannot actually see on the page.
    .slice(0, 4);
  if (reviews.length > 0) {
    ld.review = reviews.map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { "@type": "Person", name: r.author || "Verified buyer" },
      reviewBody: r.body.trim(),
      ...(r.date ? { datePublished: String(r.date).slice(0, 10) } : {}),
      ...(r.fromWatsons
        ? { publisher: { "@type": "Organization", name: "Watsons Thailand" } }
        : {}),
    }));
  }
  return ld;
}

export function breadcrumbLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c.name, item: c.url,
    })),
  };
}
export function ingredientLd(ing: IngredientEntry & { inci: string }, pageUrl: string, locale: Locale = "en") {
  return { "@context": "https://schema.org", "@type": "DefinedTerm", name: ing.en_name || ing.inci,
    alternateName: ing.th_name, description: locale === "th" ? ing.mechanism_th : ing.mechanism_en, url: pageUrl,
    inDefinedTermSet: pageUrl.replace(/\/ingredient\/.*/, "/ingredient") };
}
/** Rich FAQ for a concern hub page — AEO featured snippet targets */
// Extracted so the concern page can render the exact same Q&A visibly
// (avoids a FAQPage schema with no matching on-page content).
export function concernFaqQas(concern: string, locale: Locale, topProductName: string, topScore: number): { q: string; a: string }[] {
  const label = concernLabel(locale, concern);
  const isTh = locale === "th";

  const qas: { q: string; a: string }[] = isTh ? [
    {
      q: `${label}ที่ดีที่สุดตัวไหน`,
      a: `${topProductName} ได้คะแนนสูงสุดในหมวด${label} ด้วยคะแนน ${topScore}/100 คำนวณจากส่วนผสม 45% รีวิวจริง 45% และความคุ้มค่า 10%`,
    },
    {
      q: `ส่วนผสมอะไรที่ดีสำหรับ${label}`,
      a: concern === "acne"
        ? "Salicylic Acid (BHA) ผลัดเซลล์ในรูขุมขน, Niacinamide ควบคุมความมัน, Benzoyl Peroxide ฆ่าเชื้อสิว และ Adapalene เรตินอยด์ปรับการผลัดเซลล์"
        : concern === "whitening"
          ? "Niacinamide ลดเม็ดสี, Tranexamic Acid ลดฝ้า, Vitamin C (Ascorbic Acid) ยับยั้งไทโรซิเนส, Alpha-Arbutin ลดจุดด่างดำ"
          : `ดูหน้ารายการ${label}เพื่อดูส่วนผสมที่มีประสิทธิภาพสูงสุด`,
    },
    {
      q: `ผลิตภัณฑ์${label}ราคาถูกที่ดีมีไหม`,
      a: `มี — ในหน้านี้มีผลิตภัณฑ์หลายตัวที่มีคะแนนสูงในราคาต่ำกว่า ฿300 ใช้ตัวกรองงบประมาณเพื่อค้นหา`,
    },
    {
      q: `จะรู้ได้อย่างไรว่าผลิตภัณฑ์${label}ไหนดี`,
      a: `BangkokFillers ให้คะแนนจาก 3 มิติ: ส่วนผสม (45%) — ส่วนผสมออกฤทธิ์มีหลักฐานวิทยาศาสตร์รองรับ, รีวิวจริง (45%) — รวบรวมจาก Konvy และ Pantip, ความคุ้มค่า (10%) — เปรียบเทียบราคาต่อมล`,
    },
    {
      q: `${label}กับผิวแพ้ง่ายใช้อะไรได้`,
      a: `เลือกผลิตภัณฑ์ที่ไม่มี Fragrance, Alcohol Denat. และ Benzoyl Peroxide ใช้ตัวกรอง "ผิวแพ้ง่าย" ในหน้านี้เพื่อดูตัวเลือกที่ปลอดภัยกว่า`,
    },
  ] : [
    {
      q: `What is the best product for ${label}?`,
      a: `${topProductName} scores highest in the ${label} category with ${topScore}/100, calculated from 45% ingredient science, 45% real reviews, and 10% value.`,
    },
    {
      q: `What ingredients work for ${label}?`,
      a: concern === "acne"
        ? "Salicylic Acid (BHA) exfoliates pores, Niacinamide controls sebum, Benzoyl Peroxide kills acne bacteria, and Adapalene (retinoid) normalises cell turnover."
        : concern === "whitening"
          ? "Niacinamide inhibits pigment transfer, Tranexamic Acid reduces melasma, Vitamin C inhibits tyrosinase, and Alpha-Arbutin fades dark spots."
          : `See the ${label} ranking page for highest-evidence actives.`,
    },
    {
      q: `Are there affordable ${label} products that actually work?`,
      a: `Yes — this page includes highly-scored products under ฿300. Use the budget filter to find them.`,
    },
    {
      q: `How is the ${label} ranking calculated?`,
      a: `BangkokFillers scores on 3 dimensions: Ingredients (45%) — actives with peer-reviewed evidence; Real Reviews (45%) — aggregated from Konvy and Pantip; Value (10%) — price-per-ml comparison.`,
    },
    {
      q: `Which ${label} products are safe for sensitive skin?`,
      a: `Avoid Fragrance, Alcohol Denat., and Benzoyl Peroxide. Use the "Sensitive" filter on this page to see gentler options.`,
    },
  ];

  return qas;
}

export function concernFaqLd(concern: string, locale: Locale, topProductName: string, topScore: number) {
  return faqLd(concernFaqQas(concern, locale, topProductName, topScore));
}

export function faqLd(qas: { q: string; a: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: qas.map((x) => ({ "@type": "Question", name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a } })) };
}
export function orgLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BangkokFillers",
    url: siteUrl,
    description: "Independent skincare product rankings for Thailand — scored by ingredient science, real reviews from Konvy, Watsons & iHerb, and value-per-ml. No sponsored rankings.",
    // /og-image.png was never a real file — 404, which disqualifies the Organization
    // entity from knowledge-panel/logo treatment. /opengraph-image is the site's real,
    // already-working next/og-generated image (verified: 200 image/png).
    logo: { "@type": "ImageObject", url: `${siteUrl}/opengraph-image`, width: 1200, height: 630 },
    // No real external profiles (social, Wikipedia, etc.) exist yet to list here —
    // a self-referential sameAs is worse than omitting the field. Add real ones
    // (Facebook, Instagram, etc.) here once they exist.
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: `${siteUrl}/th/contact` },
  };
}

export function websiteLd(siteUrl: string, locale: string) {
  return {
    "@context": "https://schema.org", "@type": "WebSite",
    name: "BangkokFillers", url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/${locale}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function howToLd(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function brandFaqLd(brand: string, locale: Locale, topProductName: string, topConcern: string) {
  const isTh = locale === "th";
  const qas: { q: string; a: string }[] = isTh ? [
    {
      q: `${brand} ตัวไหนดีที่สุดในไทย`,
      a: `${topProductName} ได้รับคะแนนสูงสุดจากผลิตภัณฑ์ ${brand} ในไทย คำนวณจากส่วนผสม 45% รีวิวจริง 45% และความคุ้มค่า 10%`,
    },
    {
      q: `${brand} ขายที่ไหนในไทย`,
      a: `${brand} วางขายที่ Konvy, Watsons Thailand, Boots Thailand และ iHerb — BangkokFillers รวบรวมราคาและรีวิวจากทุกช่องทาง`,
    },
    {
      q: `${brand} ดีจริงไหม`,
      a: `BangkokFillers วิเคราะห์ผลิตภัณฑ์ ${brand} โดยดูจากส่วนผสมออกฤทธิ์ที่มีหลักฐานวิทยาศาสตร์ รีวิวจากผู้ซื้อจริง และคุ้มค่าต่อมล — ไม่ใช่การตลาด`,
    },
    {
      q: `${brand} เหมาะกับปัญหาผิวอะไร`,
      a: `ดูหน้า ${brand} เพื่อดูผลิตภัณฑ์แยกตามหมวดสิว ฝ้า ริ้วรอย รูขุมขน และผิวแพ้ง่าย`,
    },
  ] : [
    {
      q: `What is the best ${brand} product in Thailand?`,
      a: `${topProductName} scores highest among ${brand} products in Thailand, based on 45% ingredient science, 45% real reviews, and 10% value-per-ml.`,
    },
    {
      q: `Where to buy ${brand} in Thailand?`,
      a: `${brand} is available at Konvy, Watsons Thailand, Boots Thailand, and iHerb. BangkokFillers aggregates pricing and reviews across all channels.`,
    },
    {
      q: `Is ${brand} worth buying?`,
      a: `BangkokFillers analyses every ${brand} product by active ingredient evidence, real purchaser reviews, and price-per-ml — not marketing claims.`,
    },
    {
      q: `Which ${brand} products are best for ${topConcern}?`,
      a: `See the ${brand} brand page on BangkokFillers for products filtered by acne, brightening, anti-aging, pores, oil control, and sensitive skin.`,
    },
  ];
  return faqLd(qas);
}
