import type { Product, IngredientEntry } from "./types";
import { concernLabel } from "./i18n";
import type { Locale } from "./i18n";

export function itemListLd(pageUrl: string, products: Product[], urlOf: (p: Product) => string) {
  return { "@context": "https://schema.org", "@type": "ItemList", url: pageUrl,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1,
      url: urlOf(p), name: p.name })) };
}
export function productLd(p: Product, pageUrl: string) {
  const ld: any = { "@context": "https://schema.org", "@type": "Product", name: p.name,
    brand: { "@type": "Brand", name: p.brand }, image: p.image_url, description: p.description,
    url: pageUrl,
    offers: {
      "@type": "Offer", priceCurrency: "THB", price: String(p.price_thb),
      url: pageUrl, availability: "https://schema.org/InStock",
      ...(p.list_price_thb > p.price_thb ? { priceValidUntil: new Date(Date.now() + 7*24*3600*1000).toISOString().slice(0,10) } : {}),
    },
    ...(p.gtin8 ? { gtin8: p.gtin8 } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
  };
  if (p.konvy_review_count > 0 && p.konvy_rating > 0) {
    ld.aggregateRating = { "@type": "AggregateRating", ratingValue: p.konvy_rating,
      reviewCount: p.konvy_review_count, bestRating: 5, worstRating: 1 };
  }
  ld.review = (p.review_summary?.samples ?? []).slice(0, 3).map((r) => ({ "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    author: { "@type": "Person", name: r.author || "Konvy user" }, reviewBody: r.body }));
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
export function ingredientLd(ing: IngredientEntry & { inci: string }, pageUrl: string) {
  return { "@context": "https://schema.org", "@type": "DefinedTerm", name: ing.en_name || ing.inci,
    alternateName: ing.th_name, description: ing.mechanism_en, url: pageUrl,
    inDefinedTermSet: pageUrl.replace(/\/ingredient\/.*/, "/ingredient") };
}
/** Rich FAQ for a concern hub page — AEO featured snippet targets */
export function concernFaqLd(concern: string, locale: Locale, topProductName: string, topScore: number) {
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

  return faqLd(qas);
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
