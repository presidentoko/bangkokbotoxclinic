import type { Place } from "@/lib/types";
import type { FaqItem } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { priceMedian } from "@/lib/summary";

function jsonLdScript(json: unknown) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}

export function WebsiteJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.origin,
    description:
      "A Bangkok massage & spa guide built around who's actually giving the massage — real Google reviews, therapist mentions surfaced automatically.",
  };
  return jsonLdScript(json);
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return jsonLdScript(json);
}

export function ItemListJsonLd({
  name,
  items,
  numberOfItems,
}: {
  name: string;
  items: { name: string; url: string }[];
  /** True count of matching items when `items` is a capped top-N — signals the list isn't exhaustive. */
  numberOfItems?: number;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(numberOfItems != null ? { numberOfItems } : {}),
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
  return jsonLdScript(json);
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return jsonLdScript(json);
}

export function LocalBusinessJsonLd({ place, description }: { place: Place; description?: string | null }) {
  const median = priceMedian(place.priceMentions);
  // place.address is one unstructured scraped string (already ends in
  // "Bangkok NNNNN, Thailand" for 725/734 places) rather than separately
  // parsed components — using it as streetAddress plus the two fields we
  // can actually assert (city, country) is honest; inventing a parsed
  // district/postal code we didn't verify would not be.
  const reviewsWithText = place.reviews.filter((r) => r.text && r.text.trim().length > 0).slice(0, 10);
  const json = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: place.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address.trim(),
      addressLocality: "Bangkok",
      addressCountry: "TH",
    },
    url: `${SITE.origin}/en/place/${place.id}`,
    ...(description ? { description } : {}),
    ...(place.phone ? { telephone: place.phone } : {}),
    ...(place.website ? { sameAs: [place.website] } : {}),
    ...(median != null ? { priceRange: `~${median}฿` } : {}),
    ...(place.rating != null && place.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: place.rating,
            reviewCount: place.reviewCount,
          },
        }
      : {}),
    ...(place.lat != null && place.lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } }
      : {}),
    // Capped at the same 10 reviews the page itself renders (place/[id]/page.tsx
    // does place.reviews.slice(0, 10)) so the schema never claims more than a
    // reader can actually see and verify on the page.
    ...(reviewsWithText.length > 0
      ? {
          review: reviewsWithText.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.authorName || "Anonymous" },
            ...(r.rating != null ? { reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 } } : {}),
            reviewBody: r.text,
          })),
        }
      : {}),
  };
  return jsonLdScript(json);
}
