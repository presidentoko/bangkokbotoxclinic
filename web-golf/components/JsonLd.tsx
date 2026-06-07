// Schema.org JSON-LD — Golf course edition.

import type { Restaurant, VideoRef } from "@/lib/types";

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

  // image: prefer scraped course photos array, fall back to hero/top_photo single
  const images: string[] = [];
  if (r.hero_image) images.push(r.hero_image.startsWith("http") ? r.hero_image : `${SITE}${r.hero_image}`);
  if (r.top_photo_url && !images.includes(r.top_photo_url)) images.push(r.top_photo_url);
  if (r.photos) {
    for (const p of r.photos) {
      if (p && !images.includes(p)) images.push(p);
    }
  }
  if (images.length === 1) data.image = images[0];
  else if (images.length > 1) data.image = images.slice(0, 10);

  const sameAs: string[] = [];
  if (r.website) sameAs.push(r.website);
  if (r.maps_url) sameAs.push(r.maps_url);
  if (r.website_facebook) sameAs.push(r.website_facebook);
  if (r.website_instagram) sameAs.push(r.website_instagram);
  if (sameAs.length) data.sameAs = sameAs;

  // Sport / amenity
  data.sport = "Golf";
  if (r.holes) data.numberOfHoles = r.holes;
  if (r.par) data.par = r.par;
  if (r.is_korean_friendly || r.is_english_friendly) {
    data.amenityFeature = [
      ...(r.is_korean_friendly ? [{
        "@type": "LocationFeatureSpecification",
        name: "Korean caddy",
        value: true,
      }] : []),
      ...(r.is_english_friendly ? [{
        "@type": "LocationFeatureSpecification",
        name: "English caddy",
        value: true,
      }] : []),
    ];
  }

  // Reviews: prefer curated sample_reviews; supplement with scraped_reviews if present
  const reviews: object[] = [];
  for (const rev of [...r.sample_reviews_en, ...r.sample_reviews_th].slice(0, 3)) {
    reviews.push({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: rev.rating, bestRating: 5 },
      author: { "@type": "Person", name: rev.author || "Google reviewer" },
      reviewBody: rev.text,
    });
  }
  if (r.sample_reviews_ko) {
    for (const rev of r.sample_reviews_ko.slice(0, 2)) {
      reviews.push({
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: rev.rating, bestRating: 5 },
        author: { "@type": "Person", name: rev.author || "Google 리뷰어" },
        reviewBody: rev.text,
        inLanguage: "ko",
      });
    }
  }
  if (reviews.length === 0 && r.scraped_reviews) {
    for (const sr of r.scraped_reviews.slice(0, 3)) {
      if (!sr.text) continue;
      reviews.push({
        "@type": "Review",
        author: { "@type": "Person", name: sr.reviewer || "Google reviewer" },
        ...(sr.rating ? { reviewRating: { "@type": "Rating", ratingValue: sr.rating, bestRating: 5 } } : {}),
        reviewBody: sr.text,
        ...(sr.date ? { datePublished: sr.date } : {}),
      });
    }
  }
  if (reviews.length > 0) data.review = reviews;

  return tag(data);
}

// VideoObject schema — one per YouTube video matched to a course. Embed in
// course pages so Google Search shows video carousel.
export function CourseVideosJsonLd({ r }: { r: Restaurant }) {
  if (!r.videos || r.videos.length === 0) return null;
  const items = r.videos.slice(0, 3).map((v: VideoRef) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title || `${r.name} — golf course video`,
    description: v.title
      ? `YouTube review of ${r.name}, Thailand. ${v.channel ? `Channel: ${v.channel}.` : ""}`.trim()
      : `${r.name} golf course YouTube footage.`,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.video_id}/hqdefault.jpg`,
    contentUrl: v.url || `https://www.youtube.com/watch?v=${v.video_id}`,
    embedUrl: `https://www.youtube.com/embed/${v.video_id}`,
    ...(v.published ? { uploadDate: v.published } : {}),
    ...(v.duration ? { duration: v.duration } : {}),
    publisher: { "@type": "Organization", name: v.channel || "YouTube" },
    about: { "@type": "GolfCourse", name: r.name, url: `${SITE}/course/${r.id}` },
  }));
  return (
    <>
      {items.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}

// HowTo schema — used on /guide/booking-thai-golf (and similar step-by-step
// guides). Rich result type that pulls structured steps into SERP.
export function HowToJsonLd({
  name,
  description,
  totalTime,
  steps,
}: {
  name: string;
  description: string;
  totalTime?: string;  // ISO 8601 duration, e.g. "PT15M"
  steps: { name: string; text: string; url?: string }[];
}) {
  return tag({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
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
