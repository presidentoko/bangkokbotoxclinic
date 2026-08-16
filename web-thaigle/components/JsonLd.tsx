// Schema.org JSON-LD — Restaurant edition.

import type { Restaurant } from "@/lib/types";
import type { SlugMap } from "@/lib/restaurants";
import { restaurantUrl } from "@/lib/restaurants";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

function tag(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrgJsonLd() {
  const brand = process.env.NEXT_PUBLIC_BRAND || "Thaigle";
  return tag({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand,
    url: SITE,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/icon`,
      width: 512,
      height: 512,
    },
    description:
      "Independent Bangkok activity and restaurant directory ranked by real Google reviews — no influencer picks, no paid placements.",
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
    knowsAbout: [
      "Bangkok restaurants",
      "Muay Thai gyms Bangkok",
      "Thai massage and spas",
      "Bangkok cooking classes",
      "Yoga studios Bangkok",
      "Coworking spaces Bangkok",
      "Diving near Bangkok",
    ],
  });
}

export function WebsiteJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: process.env.NEXT_PUBLIC_BRAND || "Thaigle",
    url: SITE,
    description:
      "Bangkok activity and restaurant directory ranked by real Google reviews",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/?q={search_term_string}`,
      },
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

export function RestaurantJsonLd({ r, url }: { r: Restaurant; url: string }) {
  const resolvedUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: r.name,
    url: resolvedUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address,
      addressLocality: r.district || r.city_label || "Bangkok",
      addressRegion: r.city_label || "Bangkok",
      addressCountry: "TH",
    },
  };
  if (r.rating > 0 && r.total_reviews > 0) {
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
  if (r.menu_url) data.menu = r.menu_url;
  // Some scraped rows have price_level polluted with a review-photo
  // alt-text sentence or a raw address instead of a real price descriptor
  // (mirrors the same guard on the restaurant detail page template).
  if (r.price_level && r.price_level.length < 40) data.priceRange = r.price_level;
  const sameAs: string[] = [];
  if (r.website) sameAs.push(r.website);
  if (r.maps_url) sameAs.push(r.maps_url);
  if (sameAs.length) data.sameAs = sameAs;
  if (r.cuisines.length > 0) data.servesCuisine = r.cuisines;
  // No `review` markup: these are third-party Google reviews, and Google's
  // review-snippet policy prohibits republishing reviews you don't own —
  // aggregateRating (our own aggregate of that same public data) is fine.
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

export function NicheItemListJsonLd({ name, items, url }: {
  name: string;
  items: { name: string; slug: string; niche: string; rating: number | null; review_count: number | null; address: string }[];
  url: string;
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  return tag({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: fullUrl,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: p.name,
        // ~683 niche-place slugs contain Thai characters — must match the
        // RFC-3986-encoded canonical/sitemap URL for the same page, or
        // strict parsers treat this as a different (non-existent) URL.
        url: `${SITE}/activities/${p.niche}/${encodeURIComponent(p.slug)}`,
        address: { "@type": "PostalAddress", addressLocality: p.address || "Bangkok", addressCountry: "TH" },
        ...(p.rating && p.review_count ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.review_count,
            bestRating: 5,
            worstRating: 1,
          }
        } : {}),
      },
    })),
  });
}

const DAY_NAMES: Record<string, string> = {
  Monday: "Monday", Tuesday: "Tuesday", Wednesday: "Wednesday",
  Thursday: "Thursday", Friday: "Friday", Saturday: "Saturday", Sunday: "Sunday",
};

// Google writes hours as "10 AM to 10 PM" (with a narrow no-break space),
// "Open 24 hours", or "Closed". Those three shapes cover 96% of the 12,684
// day-entries we hold; anything else is skipped rather than guessed at, since
// a wrong opening time is worse than no opening time.
const HOURS_RE = /^\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*(?:to|–|-|—)\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*$/i;

function to24(hour: number, minute: number, meridiem?: string): string {
  let h = hour;
  const m = meridiem?.toUpperCase();
  if (m === "PM" && h !== 12) h += 12;
  if (m === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function openingHoursSpec(openingHoursJson?: string | null): Record<string, unknown>[] {
  if (!openingHoursJson) return [];
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(openingHoursJson);
  } catch {
    return [];
  }
  const out: Record<string, unknown>[] = [];
  for (const [day, raw] of Object.entries(parsed)) {
    const dayOfWeek = DAY_NAMES[day];
    if (!dayOfWeek || typeof raw !== "string") continue;
    if (/^\s*closed\s*$/i.test(raw)) continue;   // omitted, not asserted shut
    if (/24\s*hours/i.test(raw)) {
      out.push({ "@type": "OpeningHoursSpecification", dayOfWeek, opens: "00:00", closes: "23:59" });
      continue;
    }
    const m = HOURS_RE.exec(raw);
    if (!m) continue;
    out.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens: to24(Number(m[1]), Number(m[2] ?? 0), m[3]),
      closes: to24(Number(m[4]), Number(m[5] ?? 0), m[6]),
    });
  }
  return out;
}

export function LocalBusinessJsonLd({ name, address, city, phone, website, rating, reviewCount, category, imageUrl, url, priceMin, priceMax, priceBand, openingHoursJson, reviews }: {
  name: string;
  address: string;
  /** Venue's own city. 35% of ranked venues are not in Bangkok. */
  city?: string;
  phone?: string;
  website?: string;
  rating?: number | null;
  reviewCount?: number | null;
  category?: string;
  imageUrl?: string | null;
  url: string;
  priceMin?: number;
  priceMax?: number;
  priceBand?: string;
  openingHoursJson?: string | null;
  reviews?: { reviewer?: string; rating?: number | null; text?: string }[];
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url: fullUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      // Was hardcoded "Bangkok", which mislabelled 748 of 2,124 ranked venues
      // — every Chiang Mai, Phuket, Pattaya and Krabi page asserted the wrong
      // city to every consumer of this markup.
      addressLocality: city || "Bangkok",
      addressCountry: "TH",
    },
  };
  if (phone) data.telephone = phone;
  if (website) data.sameAs = [website];
  if (imageUrl) data.image = imageUrl;
  if (category) data.description = category;
  // Many venues here have no rating (nulls across the board for some
  // niches like spa) — price is often the only structured signal available,
  // so prefer the real THB figures over the coarser budget/mid/premium band.
  if (priceMin && priceMin > 0) {
    data.priceRange = priceMax && priceMax > priceMin ? `฿${priceMin}-฿${priceMax}` : `฿${priceMin}+`;
  } else if (priceBand && priceBand !== "unknown") {
    data.priceRange = priceBand === "budget" ? "$" : priceBand === "mid" ? "$$" : "$$$";
  }
  if (rating && reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  const hours = openingHoursSpec(openingHoursJson);
  if (hours.length) data.openingHoursSpecification = hours;

  // The scraped review samples, which the detail page already renders as
  // visible text. Markup that isn't on the page is a structured-data
  // violation, so this stays in step with what the page shows.
  const usable = (reviews ?? []).filter((r) => r.text && r.rating);
  if (usable.length) {
    data.review = usable.slice(0, 3).map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { "@type": "Person", name: r.reviewer || "Google reviewer" },
      reviewBody: r.text,
    }));
  }
  return tag(data);
}

export function TouristAttractionJsonLd({ name, description, url, items }: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string; rating?: number | null; reviewCount?: number | null; address?: string }[];
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  return tag({
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    description,
    url: fullUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangkok",
      addressCountry: "TH",
    },
    touristType: ["Travelers", "Tourists", "Expats"],
    isAccessibleForFree: false,
    containsPlace: items.slice(0, 10).map((it) => ({
      "@type": "LocalBusiness",
      name: it.name,
      url: it.url.startsWith("http") ? it.url : `${SITE}${it.url}`,
      ...(it.address ? { address: { "@type": "PostalAddress", streetAddress: it.address, addressCountry: "TH" } } : {}),
      ...(it.rating && it.reviewCount ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: it.rating,
          reviewCount: it.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      } : {}),
    })),
  });
}

export function SpeakableJsonLd({ url, cssSelectors }: { url: string; cssSelectors: string[] }) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  return tag({
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: fullUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  });
}

export function ActivityServiceJsonLd({ name, description, url, category, priceMin, priceMax, rating, reviewCount }: {
  name: string;
  description: string;
  url: string;
  category: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  reviewCount?: number;
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: fullUrl,
    serviceType: category,
    areaServed: {
      "@type": "City",
      name: "Bangkok",
      containedIn: { "@type": "Country", name: "Thailand" },
    },
    provider: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_BRAND || "Thaigle",
      url: SITE,
    },
  };
  if (priceMin && priceMax) {
    data.offers = {
      "@type": "AggregateOffer",
      lowPrice: priceMin,
      highPrice: priceMax,
      priceCurrency: "THB",
      offerCount: reviewCount || undefined,
    };
  }
  if (rating && reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return tag(data);
}

/** Cuisine/district/city collection page — aggregateRating + Restaurant ItemList. */
export function CollectionPageJsonLd({ name, description, url, items, slugMap }: {
  name: string;
  description: string;
  url: string;
  items: Pick<Restaurant, "id" | "name" | "rating" | "total_reviews" | "trust_score" | "district" | "city_label" | "city">[];
  slugMap?: SlugMap;
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;

  return tag({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: fullUrl,
    numberOfItems: items.length,
    // No page-level aggregateRating: Google requires it to describe a specific
    // reviewable entity (itemReviewed), not a collection page — each item's
    // own aggregateRating below is the correct place for rating data.
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 25).map((r, i) => {
        const entry = slugMap?.[r.id];
        const rUrl = `${SITE}${restaurantUrl(entry ?? { city: r.city, district: r.district || "other", slug: r.id })}`;
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Restaurant",
            "@id": rUrl,
            name: r.name,
            url: rUrl,
            ...(r.rating > 0 && r.total_reviews > 0 ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: r.rating,
                reviewCount: r.total_reviews,
                bestRating: 5,
                worstRating: 1,
              },
            } : {}),
            address: {
              "@type": "PostalAddress",
              addressLocality: r.district || r.city_label || "Bangkok",
              addressCountry: "TH",
            },
          },
        };
      }),
    },
  });
}
