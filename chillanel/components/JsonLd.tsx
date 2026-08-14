import type { Place } from "@/lib/types";
import type { FaqItem } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import { SITE, cityLabel } from "@/lib/site";
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
      "A Thailand massage & spa guide that reads real Google reviews to surface each place's actual mood — quiet & relaxing, strong pressure, good value — not just a star rating.",
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

export function ArticleJsonLd({
  headline,
  description,
  url,
}: {
  headline: string;
  description: string;
  url: string;
}) {
  // No datePublished/dateModified: guides carry no real per-guide authored
  // date in the data model, and inventing one would be exactly the kind of
  // unverified claim this project's JSON-LD avoids everywhere else.
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
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

export function LocalBusinessJsonLd({
  place,
  lang,
  description,
}: {
  place: Place;
  lang: Lang;
  description?: string | null;
}) {
  const median = priceMedian(place.priceMentions);
  // place.address is one unstructured scraped string (already ends in
  // "<city> NNNNN, Thailand" for the large majority of places) rather than
  // separately parsed components — using it as streetAddress plus the two
  // fields we can actually assert (city, country) is honest; inventing a
  // parsed district/postal code we didn't verify would not be.
  // addressLocality must come from place.city, not a fixed string — chillanel
  // now ingests spa_output/{city}/ for multiple cities (see build-data.mjs
  // --city), and hardcoding "Bangkok" here would emit false structured data
  // for every place scraped from another city.
  // streetAddress omitted (not emitted as "") for the 8/2,556 Bangkok
  // places with no scraped address at all -- Google's structured data
  // validator flags an empty string as an invalid PostalAddress field, and
  // locality/country are still real/assertable on their own.
  const addressTrimmed = place.address.trim();
  const json = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: place.name,
    address: {
      "@type": "PostalAddress",
      ...(addressTrimmed ? { streetAddress: addressTrimmed } : {}),
      addressLocality: cityLabel(place.city),
      addressCountry: "TH",
    },
    // Must match this page's own canonical (place/[id]/page.tsx's
    // alternates.canonical: `/${lang}/place/${id}`) -- this used to be
    // hardcoded to /en on every language, so the th/ko pages emitted
    // structured data whose declared URL contradicted their own canonical.
    url: `${SITE.origin}/${lang}/place/${place.id}`,
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
    // Deliberately no `review` array: these review texts/author names are
    // scraped from Google, not authored on chillanel -- emitting them as
    // schema.org Review objects under this business's own LocalBusiness
    // markup asserts to Google's structured-data crawler that they're
    // chillanel's own first-party reviews, which they aren't. aggregateRating
    // above (a single rolled-up number) is a much smaller version of the same
    // claim and is kept for the star-rating rich snippet; the individual
    // review text/author is still shown to human readers on the page itself
    // (place/[id]/page.tsx), just not asserted as structured data.
  };
  return jsonLdScript(json);
}
