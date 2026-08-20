// Schema.org JSON-LD 구조화 데이터 컴포넌트.
// 각 페이지 타입별로 사용 — Google 리치결과 + AEO 신호.

import type { Clinic } from "@/lib/types";
import { getSiteConfig, getSiteUrl } from "@/lib/site";

const SITE = getSiteUrl();

function tag(data: object) {
  // 스크랩 데이터(클리닉명, 리뷰에서 뽑은 의사명, Pantip 제목 등)가 그대로 들어오므로
  // "<"를 이스케이프 안 하면 "</script><script>..." 로 태그 이탈 가능 (stored XSS).
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

// focus 별 knowsAbout — Google/AI 가 사이트 주제 빠르게 파악. AEO 핵심 신호.
const KNOWS_ABOUT_BY_FOCUS: Record<string, string[]> = {
  all: ["Aesthetic clinics in Bangkok", "Medical tourism Thailand", "Clinic reviews"],
  botox: ["Botox", "Botulinum toxin", "Allergan", "Dysport", "Botulax", "Xeomin", "Wrinkle treatment", "Anti-aging injection"],
  filler: ["Dermal filler", "Hyaluronic acid filler", "Juvederm", "Restylane", "Belotero", "Lip filler", "Cheek filler", "Jawline filler"],
  hifu: ["HIFU", "Ultherapy", "Thermage", "Ultraformer", "Skin lifting", "Non-surgical face lift"],
  facial: ["HydraFacial", "Facial treatment", "LED light therapy", "Chemical peel", "Skin brightening"],
  laser: ["Pico laser", "CO2 laser", "IPL", "Laser hair removal", "Acne scar laser", "Skin pigmentation laser"],
  dental: ["Dental implants", "Dental veneers", "Teeth whitening", "Orthodontics", "Invisalign", "All-on-4", "Dental crowns", "Cosmetic dentistry"],
  hair: [
    "Hair transplant", "FUE hair transplant", "DHI hair transplant", "Scalp micropigmentation", "SMP",
    "Beard restoration", "Eyebrow transplant", "Hair loss treatment", "PRP for hair",
    "Men's clinic", "Men-only clinic", "TRT", "Testosterone replacement therapy",
    "Men's anti-aging", "Hormone wellness", "Male grooming", "Body hair laser removal",
    "Men's wellness", "Medical tourism Thailand",
  ],
};

const SITE_SAMEAS: Record<string, string[]> = {
  botox: ["https://www.google.com/maps/search/botox+clinic+bangkok"],
  dental: ["https://www.google.com/maps/search/dental+clinic+bangkok"],
  hair: ["https://www.google.com/maps/search/hair+transplant+bangkok"],
};

export function OrgJsonLd() {
  const cfg = getSiteConfig();
  return tag({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: cfg.brand,
    url: SITE,
    description: cfg.description,
    areaServed: [
      { "@type": "City", name: "Bangkok", "@id": "https://www.wikidata.org/wiki/Q1861" },
      { "@type": "Country", name: "Thailand", "@id": "https://www.wikidata.org/wiki/Q869" },
    ],
    knowsAbout: KNOWS_ABOUT_BY_FOCUS[cfg.focus] ?? KNOWS_ABOUT_BY_FOCUS.all,
    sameAs: SITE_SAMEAS[cfg.focus] ?? [],
    foundingDate: "2024",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 1 },
  });
}

export function WebsiteJsonLd() {
  const cfg = getSiteConfig();
  return tag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: cfg.brand,
    url: SITE,
    description: cfg.description,
    inLanguage: ["en", "th", "ko"],
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

// localePrefix — "" (EN) | "/th" | "/ko". /th·/ko 클리닉 페이지는 canonical 은
// 자기 자신을 가리키는데 JSON-LD 의 url 만 영어 경로를 뱉고 있어서, 같은 문서가
// 스스로를 두 URL 로 주장하는 상태였다 (2026-08-06 감사).
export function ClinicJsonLd({ c, photos, priceRange, localePrefix = "" }: {
  c: Clinic;
  photos?: { large: string }[];
  priceRange?: { min: number; max: number };
  localePrefix?: string;
}) {
  // MedicalBusiness 가 기본 — 치과는 Dentist 타입이 리치결과 적중률 더 높음.
  const schemaType = c.categories?.includes("dental") ? "Dentist" : "MedicalBusiness";
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: c.name,
    url: `${SITE}${localePrefix}/clinic/${c.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address,
      addressLocality: c.district || "Bangkok",
      addressRegion: "Bangkok",
      addressCountry: "TH",
    },
  };
  // 리뷰 0건인데 aggregateRating을 발행하면 GSC에서 "필수 필드 누락" 에러 →
  // 사이트 전체 리치결과 자격 상실 위험 (2026-07-10 감사). 실데이터 있을 때만.
  if (c.rating && c.total_reviews) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: c.rating,
      reviewCount: c.total_reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }
  if (c.lat && c.lng) {
    data.geo = { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lng };
  }
  if (c.phone) data.telephone = c.phone;
  if (c.website) data.sameAs = [c.website];
  if (c.maps_url) {
    data.sameAs = data.sameAs ? [...(data.sameAs as string[]), c.maps_url] : [c.maps_url];
  }
  // openingHours는 "Mo-Fr 09:00-17:00" 형식이어야 함 — business_status("Open" 등)는
  // 스펙 위반이라 넣지 않음. 실제 영업시간 데이터 확보 전까지 필드 생략.
  // Photos — Google rich result image carousel + AEO 시각 정보
  if (photos && photos.length > 0) {
    data.image = photos.slice(0, 6).map((p) => p.large);
  }
  // Pricing 범위 — Google price-range rich snippet
  if (priceRange) {
    data.priceRange = `฿${priceRange.min}–฿${priceRange.max}`;
  }
  // Categories를 medicalSpecialty로 (Botox/Dental/HIFU 등은 schema 표준 specialty 아니지만 의미적 매핑)
  const specialtyMap: Record<string, string> = {
    dental: "Dentistry",
    hair_transplant: "DermatologicSurgery",
    botox: "PlasticSurgery",
    filler: "PlasticSurgery",
    hifu: "Dermatology",
    facial: "Dermatology",
    laser: "Dermatology",
  };
  const specialties = c.categories.map((cat) => specialtyMap[cat]).filter(Boolean);
  if (specialties.length > 0) {
    data.medicalSpecialty = Array.from(new Set(specialties));
  }
  // NOTE: 이전에 여기서 Google 리뷰(제3자 데이터)를 schema.org Review로 마크업했으나
  // Google 리치결과 정책상 자사 사이트에서 직접 수집한 리뷰만 허용 — 제3자 집계 리뷰
  // 마크업은 리치결과 무시 또는 수동 조치 리스크가 있어 제거함.
  return tag(data);
}

/**
 * HowTo schema — 단계별 가이드 페이지에 적합. Google rich result 가능.
 * 자동 사용: 가이드 sections 가 "Step 1 —", "01 —", "1." 같은 enumerable 형식이면 적용.
 * AEO: LLM이 "how to X" 질문에 우리 가이드 인용하기 쉬워짐.
 */
export function HowToJsonLd({ name, description, url, steps }: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
}) {
  if (steps.length < 2) return null;
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  return tag({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url: fullUrl,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${fullUrl}#step-${i + 1}`,
    })),
  });
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

/**
 * Speakable schema — Google Assistant 등 음성 검색이 페이지의 어느 부분을 읽을지 알림.
 * AEO: 음성으로 "방콕 X 클리닉" 물으면 우리 페이지의 요약 섹션이 답변됨.
 * cssSelector 가 가리키는 요소가 음성 친화 텍스트여야 함 (짧고 자체 완결).
 */
export function SpeakableJsonLd({ url, selectors }: {
  url: string;
  selectors?: string[];
}) {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: url.startsWith("http") ? url : `${SITE}${url}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: selectors ?? [
        '[aria-label="Clinic summary"] p',     // WikiSummaryCard 본문
        'h1',                                    // 페이지 타이틀
      ],
    },
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
  items: Pick<Clinic, "id" | "name" | "rating" | "total_reviews" | "trust_score" | "district" | "city_label" | "categories">[];
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
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 25).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": c.categories?.includes("dental") ? "Dentist" : "MedicalBusiness",
          "@id": `${SITE}/clinic/${c.id}`,
          name: c.name,
          url: `${SITE}/clinic/${c.id}`,
          // 리뷰 0건이면 aggregateRating 생략 — ClinicJsonLd와 동일 가드
          ...(c.rating && c.total_reviews && {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: c.rating,
              reviewCount: c.total_reviews,
              bestRating: 5,
            },
          }),
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
