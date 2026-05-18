// Schema.org JSON-LD — Thai Supply Hub.
// 풍부한 Schema 노출로 Rich Results / AEO answer extraction 최대화.

import type { Supplier } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

function tag(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── 사이트 전역 ──────────────────────────────────────────────
export function OrgJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}#organization`,
    name: BRAND,
    url: SITE,
    logo: `${SITE}/icon`,
    description:
      "Independent directory of Thai manufacturers, industrial estates, warehouses, and logistics operators. Trust Scores from real Google review analysis. Direct contact, no sourcing-agent middleman.",
    knowsAbout: [
      "Thai manufacturers",
      "Eastern Seaboard industrial estates",
      "Pinthong Industrial Estate",
      "Amata City Chonburi",
      "WHA Logistics Park",
      "Rojana Industrial Park",
      "Map Ta Phut petrochemical complex",
      "Thai automotive parts suppliers",
      "Tier 1 OEM Thailand",
      "Thai food manufacturers",
      "Bangkok manufacturing hub",
    ],
    areaServed: { "@type": "Country", name: "Thailand" },
  });
}

export function WebsiteJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}#website`,
    name: BRAND,
    url: SITE,
    inLanguage: ["en", "ko", "th"],
    publisher: { "@id": `${SITE}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });
}

// ── Breadcrumb ──────────────────────────────────────────────
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return tag({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE}${it.url}`,
    })),
  });
}

// ── FAQ ────────────────────────────────────────────────────
export function FaqJsonLd({ faqs, lang = "en" }: { faqs: { q: string; a: string }[]; lang?: string }) {
  if (!faqs.length) return null;
  return tag({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
}

// ── ItemList (top X 컬렉션) ──────────────────────────────────
export function ItemListJsonLd({ name, items, description }: {
  name: string;
  items: { name: string; url: string }[];
  description?: string;
}) {
  return tag({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url.startsWith("http") ? it.url : `${SITE}${it.url}`,
    })),
  });
}

// ── CollectionPage (카테고리/도시/베스트 페이지 marker) ──────
export function CollectionPageJsonLd({
  name, description, url, lang = "en", numberOfItems,
}: {
  name: string; description: string; url: string;
  lang?: string; numberOfItems?: number;
}) {
  return tag({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: url.startsWith("http") ? url : `${SITE}${url}`,
    inLanguage: lang,
    isPartOf: { "@id": `${SITE}#website` },
    publisher: { "@id": `${SITE}#organization` },
    numberOfItems,
  });
}

// ── Schema.org type 매핑 — supplier 카테고리 → Schema type 배열 ──
function schemaTypeFor(categories: string[]): string[] {
  const has = (c: string) => categories.includes(c);
  if (has("warehouse")) return ["LocalBusiness", "Place", "Organization"];
  if (has("industrial_estate")) return ["Place", "LocalBusiness"];
  if (has("logistics")) return ["MovingCompany", "LocalBusiness", "Organization"];
  if (has("corporate_office")) return ["Corporation", "Organization"];
  if (
    has("manufacturer") || has("auto_parts") || has("electronics") ||
    has("chemical") || has("food_mfg") || has("plastic") || has("steel") ||
    has("machining") || has("packaging") || has("rubber") || has("textile") ||
    has("machinery") || has("factory")
  ) return ["Manufacturer", "Organization", "LocalBusiness"];
  return ["LocalBusiness", "Organization"];
}

// ── Supplier 상세 (Manufacturer/LocalBusiness/Place 등) ─────
export function SupplierJsonLd({ r }: { r: Supplier }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaTypeFor(r.categories),
    "@id": `${SITE}/supplier/${r.id}#supplier`,
    name: r.name,
    url: `${SITE}/supplier/${r.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address,
      addressLocality: r.district || r.city_label || "Chon Buri",
      addressRegion: r.city_label || "Chon Buri",
      addressCountry: "TH",
    },
  };
  if (r.total_reviews > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: r.rating,
      reviewCount: r.total_reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }
  if (r.lat && r.lng) {
    data.geo = { "@type": "GeoCoordinates", latitude: r.lat, longitude: r.lng };
  }
  if (r.phone) data.telephone = r.phone;
  if (r.image_url || r.hero_image) {
    data.image = r.image_url || (r.hero_image ? `${SITE}${r.hero_image}` : undefined);
  }
  const sameAs: string[] = [];
  if (r.website) sameAs.push(r.website);
  if (r.maps_url) sameAs.push(r.maps_url);
  if (sameAs.length) data.sameAs = sameAs;
  if (r.categories.length > 0) {
    data.makesOffer = r.categories.map((c) => ({ "@type": "Offer", category: c }));
  }
  const samples = [...r.sample_reviews_en, ...r.sample_reviews_th, ...r.sample_reviews_ko].slice(0, 3);
  if (samples.length > 0) {
    data.review = samples.map((rev) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: rev.rating, bestRating: 5 },
      author: { "@type": "Person", name: rev.author || "Google reviewer" },
      reviewBody: rev.text,
    }));
  }
  return tag(data);
}

// ── ProfilePage marker (supplier detail 페이지에 함께 노출) ──
export function ProfilePageJsonLd({ r }: { r: Supplier }) {
  return tag({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE}/supplier/${r.id}`,
    name: r.name,
    mainEntity: { "@id": `${SITE}/supplier/${r.id}#supplier` },
    isPartOf: { "@id": `${SITE}#website` },
    publisher: { "@id": `${SITE}#organization` },
    inLanguage: "en",
  });
}

// 기존 import 호환 alias
export const RestaurantJsonLd = SupplierJsonLd;
