// Schema.org JSON-LD 구조화 데이터 컴포넌트.
// 각 페이지 타입별로 사용 — Google 리치결과 + AEO 신호.

import type { Clinic } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

function tag(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrgJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bangkok Clinics",
    url: SITE,
    description:
      "Independent directory of Bangkok aesthetic and medical clinics with Google review analysis and Trust Scores.",
  });
}

export function WebsiteJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bangkok Clinics",
    url: SITE,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

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

export function ClinicJsonLd({ c }: { c: Clinic }) {
  // MedicalBusiness 가 적합 — 미용/시술 클리닉이면 BeautySalon 도 가능하지만 의료 레지스트리상 MedicalBusiness 가 안전.
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: c.name,
    url: `${SITE}/clinic/${c.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address,
      addressLocality: c.district || "Bangkok",
      addressRegion: "Bangkok",
      addressCountry: "TH",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: c.rating,
      reviewCount: c.total_reviews,
      bestRating: 5,
      worstRating: 1,
    },
  };
  if (c.lat && c.lng) {
    data.geo = { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lng };
  }
  if (c.phone) data.telephone = c.phone;
  if (c.website) data.sameAs = [c.website];
  if (c.maps_url) {
    data.sameAs = data.sameAs ? [...(data.sameAs as string[]), c.maps_url] : [c.maps_url];
  }
  if (c.business_status) data.openingHours = c.business_status;
  // Sample reviews 노출 — review snippet rich result 가능
  const samples = [...c.sample_reviews_en, ...c.sample_reviews_th].slice(0, 3);
  if (samples.length > 0) {
    data.review = samples.map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      author: { "@type": "Person", name: r.author || "Google reviewer" },
      reviewBody: r.text,
    }));
  }
  return tag(data);
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return tag({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
}

export function ItemListJsonLd({ name, items }: {
  name: string;
  items: { name: string; url: string }[];
}) {
  return tag({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url.startsWith("http") ? it.url : `${SITE}${it.url}`,
    })),
  });
}

/**
 * Collection page (카테고리/구/도시 페이지)의 aggregate 통계 + ItemList 포함.
 * 카테고리/구/도시 페이지에 1개씩 추가. Google rich-result + AEO 신호.
 */
export function CollectionPageJsonLd({ name, description, url, items }: {
  name: string;
  description: string;
  url: string;
  items: Pick<Clinic, "id" | "name" | "rating" | "total_reviews" | "trust_score" | "district" | "city_label">[];
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  // 평균 평점 가중평균 (review count 가중)
  const totalReviews = items.reduce((s, c) => s + (c.total_reviews || 0), 0);
  const weightedRating = totalReviews > 0
    ? items.reduce((s, c) => s + (c.rating || 0) * (c.total_reviews || 0), 0) / totalReviews
    : 0;

  return tag({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: fullUrl,
    numberOfItems: items.length,
    aggregateRating: items.length > 0 && totalReviews > 0 ? {
      "@type": "AggregateRating",
      ratingValue: Number(weightedRating.toFixed(2)),
      reviewCount: totalReviews,
      bestRating: 5,
      worstRating: 1,
      itemReviewed: { "@type": "Thing", name },
    } : undefined,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 25).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "MedicalBusiness",
          "@id": `${SITE}/clinic/${c.id}`,
          name: c.name,
          url: `${SITE}/clinic/${c.id}`,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: c.rating,
            reviewCount: c.total_reviews,
            bestRating: 5,
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: c.district || c.city_label || "Bangkok",
            addressCountry: "TH",
          },
        },
      })),
    },
  });
}
