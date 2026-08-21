import type { NichePlace, KlookEntry } from "@/lib/niches";

/**
 * The subset of a venue that the results grid actually renders.
 *
 * NicheGrid is a client component, so every field of every place it receives
 * is serialised into the RSC payload the browser downloads. It was being
 * handed 60 whole NichePlace objects: measured on spa.json that is 228,579
 * bytes, of which 47,788 are fields the component reads. The rest —
 * reviews_sample, the affiliate URL set, photos_sample beyond the first,
 * opening_hours_json — is downloaded by every visitor on every hub, city and
 * area page and never displayed. That was the bulk of the 939 KB hub.
 *
 * Projecting here rather than trimming inside the component matters: the cost
 * is in what crosses the server/client boundary, so it has to be gone before
 * the prop is passed.
 */
export type GridPlace = {
  id: string;
  slug: string;
  name: string;
  city: string;
  /** Pre-resolved: the locality line the card shows, never the full address. */
  locality: string;
  rating: number | null;
  reviewCount: number | null;
  trustScore: number;
  priceMinThb: number;
  priceBand: string | null;
  photo: string | null;
  topReview: string | null;
  beginner: boolean;
  open24h: boolean;
  ko: boolean;
  en: boolean;
};

/** The one Klook fact per venue the card needs, instead of the whole entry. */
export type GridKlook = {
  url: string;
  priceThb: number | null;
};

function locality(p: NichePlace): string {
  // "12/3 Soi 4, Khlong Toei, Bangkok 10110, Thailand" -> "Khlong Toei, Bangkok"
  //
  // 17 venues have an address with no comma at all ("24/63 Bangkok 10600"),
  // where the old slice(-3,-1) produced an empty string and the card rendered
  // a blank line. Falling back to the city keeps every card complete.
  const parts = (p.address ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) return parts.slice(-3, -1).join(", ");
  return p.city;
}

export function toGridPlace(p: NichePlace): GridPlace {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    city: p.city,
    locality: locality(p),
    rating: p.rating ?? null,
    reviewCount: p.review_count ?? null,
    trustScore: p.trust_score,
    priceMinThb: p.price_min_thb ?? 0,
    priceBand: p.price_band ?? null,
    photo: p.top_photo_url || p.photos_sample?.[0] || null,
    topReview: p.top_review_text ?? null,
    beginner: !!p.is_beginner_friendly,
    open24h: !!p.is_open_24h,
    ko: !!p.languages?.ko,
    en: !!p.languages?.en,
  };
}

export function toGridKlook(
  entries: [string, KlookEntry | undefined][],
): [string, GridKlook][] {
  const out: [string, GridKlook][] = [];
  for (const [id, entry] of entries) {
    const product = entry?.products?.[0];
    if (product?.product_url) {
      out.push([id, { url: product.product_url, priceThb: product.price_thb ?? null }]);
    }
  }
  return out;
}
