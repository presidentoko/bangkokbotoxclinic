import type { Place } from "@/lib/types";
import type { FaqItem } from "@/lib/i18n";
import { SITE } from "@/lib/site";

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
  const json = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: place.name,
    address: place.address,
    url: `${SITE.origin}/en/place/${place.id}`,
    ...(description ? { description } : {}),
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
  };
  return jsonLdScript(json);
}
