// Schema.org JSON-LD — Golf course edition.

import type { Restaurant } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thailandgolfguide.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thailand Golf Guide";

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
    name: BRAND,
    url: SITE,
    description:
      "Independent directory of golf courses, country clubs, driving ranges, and resorts across Thailand. Trust Scores from real Google review analysis.",
  });
}

export function WebsiteJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
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

// Golf course schema — Schema.org has GolfCourse + SportsActivityLocation
export function RestaurantJsonLd({ r }: { r: Restaurant }) {
  const isResort = r.categories.includes("resort");
  const isCountryClub = r.categories.includes("country_club");
  const isDrivingRange = r.categories.includes("driving_range") && !r.categories.includes("course");

  // GolfCourse for actual courses; SportsActivityLocation for ranges/indoor; Resort for resorts
  const type =
    isResort ? ["Resort", "GolfCourse"] :
    isCountryClub ? ["GolfCourse", "SportsActivityLocation"] :
    isDrivingRange ? "SportsActivityLocation" :
    "GolfCourse";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: r.name,
    url: `${SITE}/course/${r.id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address,
      addressLocality: r.district || r.city_label || "Bangkok",
      addressRegion: r.city_label || "Bangkok",
      addressCountry: "TH",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: r.rating,
      reviewCount: r.total_reviews,
      bestRating: 5,
      worstRating: 1,
    },
  };
  if (r.lat && r.lng) {
    data.geo = { "@type": "GeoCoordinates", latitude: r.lat, longitude: r.lng };
  }
  if (r.phone) data.telephone = r.phone;
  if (r.price_level) data.priceRange = r.price_level;
  if (r.hero_image) data.image = `${SITE}${r.hero_image}`;
  const sameAs: string[] = [];
  if (r.website) sameAs.push(r.website);
  if (r.maps_url) sameAs.push(r.maps_url);
  if (sameAs.length) data.sameAs = sameAs;
  // Sport / amenity
  data.sport = "Golf";
  if (r.holes) data.numberOfHoles = r.holes;
  if (r.par) data.par = r.par;
  const samples = [...r.sample_reviews_en, ...r.sample_reviews_th].slice(0, 3);
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
