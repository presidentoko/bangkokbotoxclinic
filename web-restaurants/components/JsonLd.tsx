// Schema.org JSON-LD — Restaurant edition.

import type { Restaurant } from "@/lib/types";
import { getSiteConfig } from "@/lib/site";
import { CUISINE_LABELS } from "@/lib/types";
import { deriveLocalityFromAddress } from "@/lib/locality";
import { getVerdict } from "@/lib/verdict";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";
const BRAND = getSiteConfig().brand;

function tag(data: object) {
  // Scraped restaurant names are third-party data and can contain "<" or a
  // literal "</script>" sequence — unescaped, that terminates the script tag
  // early and lets the rest render as markup. < is valid inside a JSON
  // string and can't break out of the surrounding <script> element.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
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
      "Independent directory of Bangkok and Pattaya restaurants with Google review analysis and Trust Scores.",
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

export function RestaurantJsonLd({ r }: { r: Restaurant }) {
  const locality = r.district || deriveLocalityFromAddress(r.address);
  const verdict = getVerdict(r);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE}/restaurant/${r.id}`,
    name: r.name,
    url: `${SITE}/restaurant/${r.id}`,
    // The verdict, in the field an answer engine actually quotes. Google's own
    // panel already carries the name, address and star average, so repeating
    // them here wins nothing; the recent-vs-older comparison is the one fact
    // about this venue that exists nowhere else, which is what makes it worth
    // citing.
    description: verdict.reason,
    // Real venue photos outrank our generated OG card for rich-result
    // eligibility when we have them; fall back to the generated card.
    image: r.photos.length > 0
      ? r.photos.slice(0, 6).map((p) => p.url)
      : `${SITE}/restaurant/${r.id}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address,
      addressLocality: locality || r.city_label || "Bangkok",
      addressRegion: r.city_label || "Bangkok",
      addressCountry: "TH",
    },
  };
  // An unrated venue must not publish aggregateRating: ratingValue 0 /
  // reviewCount 0 is rejected by Google ("Value in property 'ratingCount'
  // must be positive"), and the rejection invalidates the whole rich result
  // for the page rather than just the rating.
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
  if (r.price_level) data.priceRange = r.price_level;
  const sameAs: string[] = [];
  if (r.website) sameAs.push(r.website);
  if (r.maps_url) sameAs.push(r.maps_url);
  if (sameAs.length) data.sameAs = sameAs;
  if (r.cuisines.length > 0) data.servesCuisine = r.cuisines.map((c) => CUISINE_LABELS[c] ?? c);
  // No `review` block: those review bodies are scraped from Google, not collected
  // on this site — republishing them as our own Review markup risks a Google
  // review-snippet policy violation / manual action.
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

/** Cuisine/district/city collection page — aggregateRating + Restaurant ItemList. */
export function CollectionPageJsonLd({ name, description, url, items }: {
  name: string;
  description: string;
  url: string;
  items: Pick<Restaurant, "id" | "name" | "rating" | "total_reviews" | "trust_score" | "district" | "city_label">[];
}) {
  const fullUrl = url.startsWith("http") ? url : `${SITE}${url}`;

  return tag({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: fullUrl,
    numberOfItems: items.length,
    // No collection-level aggregateRating/itemReviewed here — a CollectionPage
    // isn't a reviewable entity, and that combo is flagged by GSC as unsupported.
    // Per-restaurant ratings still live on each item below.
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 25).map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Restaurant",
          "@id": `${SITE}/restaurant/${r.id}`,
          name: r.name,
          url: `${SITE}/restaurant/${r.id}`,
          ...(r.rating > 0 && r.total_reviews > 0 ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: r.rating,
              reviewCount: r.total_reviews,
              bestRating: 5,
            },
          } : {}),
          address: {
            "@type": "PostalAddress",
            addressLocality: r.district || r.city_label || "Bangkok",
            addressCountry: "TH",
          },
        },
      })),
    },
  });
}
