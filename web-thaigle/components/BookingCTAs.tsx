"use client";

import { AffiliateLink } from "@/components/AffiliateLink";

type KlookProduct = {
  product_url: string;
  price_thb?: number | null;
  rating?: number | null;
};

type Props = {
  nicheSlug: string;
  placeId: string;
  placeName: string;
  klookProduct?: KlookProduct | null;
  viatorUrl?: string | null;
  gygUrl?: string | null;
  googleMapsUrl?: string | null;
  fallbackUrl?: string | null;
  fallbackLabel?: string | null;
  fallbackProvider?: string | null;
};

export function BookingCTAs({
  nicheSlug,
  placeId,
  klookProduct,
  viatorUrl,
  gygUrl,
  googleMapsUrl,
  fallbackUrl,
  fallbackLabel,
  fallbackProvider,
}: Props) {
  return (
    <div className="space-y-2 mb-6">
      {klookProduct && (
        <AffiliateLink
          href={klookProduct.product_url}
          tracking={{ type: "affiliate", provider: "Klook", activityType: nicheSlug, surface: "detail", venueId: placeId }}
          className="flex items-center justify-between gap-3 w-full py-3.5 px-5 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition active:scale-95"
        >
          <span>🎟 Book on Klook</span>
          <span className="text-sm opacity-90">
            {klookProduct.price_thb ? `฿${klookProduct.price_thb.toLocaleString()}` : "View prices"}
            {klookProduct.rating ? ` · ★${klookProduct.rating}` : ""}
          </span>
        </AffiliateLink>
      )}
      {viatorUrl && (
        <AffiliateLink
          href={viatorUrl}
          tracking={{ type: "affiliate", provider: "Viator", activityType: nicheSlug, surface: "detail", venueId: placeId }}
          className="flex items-center justify-between gap-3 w-full py-3 px-5 rounded-2xl bg-white border border-[var(--border)] font-medium hover:border-orange-400 hover:bg-orange-50 transition text-sm active:scale-95"
        >
          <span>🌐 Search on Viator</span>
          <span className="text-[var(--muted)]">→</span>
        </AffiliateLink>
      )}
      {gygUrl && (
        <AffiliateLink
          href={gygUrl}
          tracking={{ type: "affiliate", provider: "GetYourGuide", activityType: nicheSlug, surface: "detail", venueId: placeId }}
          className="flex items-center justify-between gap-3 w-full py-3 px-5 rounded-2xl bg-white border border-[var(--border)] font-medium hover:border-orange-400 hover:bg-orange-50 transition text-sm active:scale-95"
        >
          <span>🗓 GetYourGuide</span>
          <span className="text-[var(--muted)]">→</span>
        </AffiliateLink>
      )}
      {fallbackUrl && !klookProduct && !viatorUrl && !gygUrl && (
        <AffiliateLink
          href={fallbackUrl}
          tracking={{ type: "affiliate", provider: fallbackProvider ?? "Klook", activityType: nicheSlug, surface: "detail", venueId: placeId }}
          className="flex items-center justify-between gap-3 w-full py-3.5 px-5 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition active:scale-95"
        >
          <span>🎟 {fallbackLabel ?? "Find & book similar"}</span>
          <span className="text-sm opacity-80">→</span>
        </AffiliateLink>
      )}
      {googleMapsUrl && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 w-full py-3 px-5 rounded-2xl bg-white border border-[var(--border)] font-medium hover:border-gray-400 transition text-sm active:scale-95"
        >
          <span>🗺 View on Google Maps</span>
          <span className="text-[var(--muted)]">→</span>
        </a>
      )}
      <p className="text-xs text-[var(--muted)] text-center">
        We may earn a commission on bookings. Rankings are never paid.
      </p>
    </div>
  );
}
