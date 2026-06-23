"use client";

import { useState } from "react";
import type { NichePlace, KlookEntry } from "@/lib/niches";

type Props = {
  places: NichePlace[];
  klookData: [string, KlookEntry | undefined][];
  nicheSlug: string;
  nicheIcon: string;
  planType: string;
  PRICE_BAND_LABELS: Record<string, string>;
};

type Filter = "all" | "beginner" | "korean" | "24h" | "klook";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  beginner: "🌱 Beginner",
  korean: "🇰🇷 Korean",
  "24h": "🕐 24h",
  klook: "🎟 Bookable",
};

export function NicheGrid({ places, klookData, nicheSlug, nicheIcon, PRICE_BAND_LABELS }: Props) {
  const [active, setActive] = useState<Filter>("all");

  const klookMap = new Map(klookData);

  const filtered = places.filter((p) => {
    if (active === "beginner") return p.is_beginner_friendly;
    if (active === "korean") return p.languages?.ko;
    if (active === "24h") return p.is_open_24h;
    if (active === "klook") return klookMap.has(p.id) && (klookMap.get(p.id)?.products?.length ?? 0) > 0;
    return true;
  });

  const filters: Filter[] = ["all", "beginner", "korean", "24h", "klook"];
  const counts: Record<Filter, number> = {
    all: places.length,
    beginner: places.filter((p) => p.is_beginner_friendly).length,
    korean: places.filter((p) => p.languages?.ko).length,
    "24h": places.filter((p) => p.is_open_24h).length,
    klook: places.filter((p) => klookMap.has(p.id) && (klookMap.get(p.id)?.products?.length ?? 0) > 0).length,
  };

  return (
    <section className="mb-10">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          counts[f] > 0 && (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                active === f
                  ? "bg-orange-500 text-white border border-orange-500"
                  : "bg-white border border-[var(--border)] hover:border-orange-400 hover:text-orange-700"
              }`}
            >
              {FILTER_LABELS[f]}
              <span className={`tabular-nums text-xs ${active === f ? "opacity-80" : "text-[var(--muted)]"}`}>
                {counts[f]}
              </span>
            </button>
          )
        ))}
      </div>

      {/* Results count */}
      {active !== "all" && (
        <p className="text-sm text-[var(--muted)] mb-3">
          Showing {filtered.length} of {places.length} venues
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const klook = klookMap.get(p.id);
          const topProduct = klook?.products?.[0];
          const photo = p.top_photo_url || p.photos_sample?.[0] || null;
          const hasKo = p.languages?.ko;
          const hasEn = p.languages?.en;

          return (
            <div
              key={p.id}
              className="group relative bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-300 transition flex flex-col"
            >
              {photo ? (
                <div className="relative h-40 overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={photo}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    #{i + 1}
                  </div>
                  <div
                    className="absolute top-2 right-2 text-sm font-black px-2 py-0.5 rounded-full text-white"
                    style={{ background: p.trust_score >= 75 ? "#16a34a" : p.trust_score >= 60 ? "#059669" : "#ca8a04" }}
                  >
                    {Math.min(100, p.trust_score)}
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center shrink-0 relative">
                  <span className="text-4xl opacity-40">{nicheIcon}</span>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    #{i + 1}
                  </div>
                  <div
                    className="absolute top-2 right-2 text-sm font-black px-2 py-0.5 rounded-full text-white"
                    style={{ background: p.trust_score >= 75 ? "#16a34a" : p.trust_score >= 60 ? "#059669" : "#ca8a04" }}
                  >
                    {Math.min(100, p.trust_score)}
                  </div>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2">{p.name}</h3>
                <p className="text-xs text-[var(--muted)] mb-2 truncate">
                  {p.address ? p.address.split(",").slice(-3, -1).join(",").trim() : p.city}
                </p>

                <div className="flex items-center gap-2 text-xs mb-2">
                  {p.rating && (
                    <span className="text-yellow-700 font-bold">★{p.rating.toFixed(1)}</span>
                  )}
                  {p.review_count && (
                    <span className="text-[var(--muted)]">({p.review_count.toLocaleString()})</span>
                  )}
                  {p.price_min_thb > 0 && (
                    <>
                      <span className="text-[var(--muted)]">·</span>
                      <span className="font-medium">฿{p.price_min_thb.toLocaleString()}</span>
                    </>
                  )}
                  {p.price_band && PRICE_BAND_LABELS[p.price_band] && (
                    <span className="text-[var(--muted)]">{PRICE_BAND_LABELS[p.price_band]}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {p.is_beginner_friendly && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-bold">Beginner</span>
                  )}
                  {p.is_open_24h && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">24h</span>
                  )}
                  {hasEn && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">EN</span>}
                  {hasKo && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">한국어</span>}
                </div>

                {p.top_review_text && (
                  <p className="text-xs text-[var(--muted)] italic leading-relaxed line-clamp-2 mb-3 flex-1">
                    "{p.top_review_text}"
                  </p>
                )}

                <div className="mt-auto space-y-2">
                  {topProduct ? (
                    <a
                      href={topProduct.product_url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center justify-between w-full py-2 px-3 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition active:scale-95"
                    >
                      <span>🎟 Book on Klook</span>
                      <span className="opacity-90">
                        {topProduct.price_thb != null ? `฿${topProduct.price_thb.toLocaleString()}` : "View"}
                      </span>
                    </a>
                  ) : (
                    <a
                      href={`https://www.klook.com/en-US/search/?query=${encodeURIComponent(p.name + " Bangkok")}${process.env.NEXT_PUBLIC_KLOOK_AID ? `&aid=${process.env.NEXT_PUBLIC_KLOOK_AID}&aff_adid=thaigle` : ""}&utm_source=thaigle&utm_medium=affiliate&utm_campaign=${nicheSlug}`}
                      target="_blank"
                      rel="noopener noreferrer sponsored nofollow"
                      className="flex items-center justify-center w-full py-2 px-3 rounded-xl bg-orange-100 text-orange-800 text-xs font-bold hover:bg-orange-200 transition"
                    >
                      Find & book similar on Klook →
                    </a>
                  )}
                  <a
                    href={`/activities/${nicheSlug}/${p.slug}`}
                    className="block text-center text-xs text-[var(--muted)] hover:text-black py-1"
                  >
                    View details →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-4xl mb-3">{nicheIcon}</div>
          <p className="text-sm">No venues match this filter. <button onClick={() => setActive("all")} className="underline">Show all</button></p>
        </div>
      )}

      <p className="text-xs text-[var(--muted)] text-center pt-2 pb-4">
        We may earn a commission on bookings. Rankings are never paid.
      </p>
    </section>
  );
}
