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
  return tag({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: process.env.NEXT_PUBLIC_BRAND || "Thaigle",
    url: SITE,
    description:
      "Independent Bangkok activity and restaurant directory ranked by real Google reviews — no influencer picks, no paid placements.",
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
  if (r.price_level) data.priceRange = r.price_level;
  const sameAs: string[] = [];
  if (r.website) sameAs.push(r.website);
  if (r.maps_url) sameAs.push(r.maps_url);
  if (sameAs.length) data.sameAs = sameAs;
  if (r.cuisines.length > 0) data.servesCuisine = r.cuisines;
  const samples = [...r.sample_reviews_en, ...r.sample_reviews_th]
    .filter((rev) => rev.rating && rev.rating > 0 && rev.rating <= 5)
    .slice(0, 3);
  if (samples.length > 0) {
    data.review = samples.map((rev) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: rev.rating, bestRating: 5, worstRating: 1 },
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
        url: `${SITE}/activities/${p.niche}/${p.slug}`,
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

export function LocalBusinessJsonLd({ name, address, phone, website, rating, reviewCount, category, imageUrl, url }: {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number | null;
  reviewCount?: number | null;
  category?: string;
  imageUrl?: string | null;
  url: string;
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
      addressLocality: "Bangkok",
      addressCountry: "TH",
    },
  };
  if (phone) data.telephone = phone;
  if (website) data.sameAs = [website];
  if (imageUrl) data.image = imageUrl;
  if (category) data.description = category;
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
  const totalReviews = items.reduce((s, r) => s + (r.total_reviews || 0), 0);
  const weightedRating = totalReviews > 0
    ? items.reduce((s, r) => s + (r.rating || 0) * (r.total_reviews || 0), 0) / totalReviews
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
      itemListElement: items.slice(0, 25).map((r, i) => {
        const entry = slugMap?.[r.id];
        const rUrl = entry
          ? `${SITE}${restaurantUrl(entry)}`
          : entry === undefined && slugMap
            ? `${SITE}${restaurantUrl({ city: r.city, district: r.district || "other", slug: r.id })}`
            : `${SITE}/restaurant/${r.id}`;
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
