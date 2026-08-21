"use client";

import { Fragment, useState } from "react";
import { SaveButton } from "@/components/SaveButton";
import { CardImage } from "@/components/CardImage";
import { AdSlot } from "@/components/AdSlot";
import { withKlookAid } from "@/lib/affiliate";
import { LIST_AD_INTERVAL, MIN_ITEMS_FOR_LIST_AD } from "@/lib/ads";
import type { GridPlace, GridKlook } from "@/lib/gridPlace";

type Props = {
  places: GridPlace[];
  klookData: [string, GridKlook][];
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

// Fixed locale. `.toLocaleString()` with no argument formats using the
// browser's locale on the client and the server's on the server, so a visitor
// in Germany hydrated "1,240" into "1.240" and React logged a text mismatch
// on every card.
const num = (n: number) => n.toLocaleString("en-US");

export function NicheGrid({ places, klookData, nicheSlug, nicheIcon, PRICE_BAND_LABELS }: Props) {
  const [active, setActive] = useState<Filter>("all");

  const klookMap = new Map(klookData);

  const filtered = places.filter((p) => {
    if (active === "beginner") return p.beginner;
    if (active === "korean") return p.ko;
    if (active === "24h") return p.open24h;
    if (active === "klook") return klookMap.has(p.id);
    return true;
  });

  const filters: Filter[] = ["all", "beginner", "korean", "24h", "klook"];
  const counts: Record<Filter, number> = {
    all: places.length,
    beginner: places.filter((p) => p.beginner).length,
    korean: places.filter((p) => p.ko).length,
    "24h": places.filter((p) => p.open24h).length,
    klook: places.filter((p) => klookMap.has(p.id)).length,
  };

  // Ads go between cards, not after them. The single slot used to sit below
  // the whole grid: on mobile the grid is one column, so ~60 cards put the
  // only ad on the page roughly 20,000px down, where essentially nobody
  // reached it. Thin result sets get no ad at all.
  const adsAllowed = filtered.length >= MIN_ITEMS_FOR_LIST_AD;

  return (
    <section className="mb-10">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          counts[f] > 0 && (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-full text-sm font-medium transition ${
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
          const href = `/activities/${nicheSlug}/${p.slug}`;

          return (
            <Fragment key={p.id}>
              {adsAllowed && i > 0 && i % LIST_AD_INTERVAL === 0 && (
                <AdSlot name="listInline" className="sm:col-span-2 lg:col-span-3 my-0" />
              )}
              <div className="group relative bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-300 transition flex flex-col">
                {/* The photo and the title are the link. Previously the only
                    on-site link on the card was a 12px grey "View details"
                    strip sitting under a large orange button that led off the
                    site — so the card's obvious action was the one that ends
                    the session, and the second pageview was the one you had
                    to squint for. */}
                <a href={href} className="block">
                  <div className="relative h-40 overflow-hidden bg-gray-100 shrink-0">
                    <CardImage
                      src={p.photo}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      fallbackIcon={nicheIcon}
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-black px-2 py-0.5 rounded-full">
                      #{i + 1}
                    </div>
                    <div
                      className="absolute top-2 right-2 text-sm font-black px-2 py-0.5 rounded-full text-white"
                      style={{ background: p.trustScore >= 75 ? "#16a34a" : p.trustScore >= 60 ? "#059669" : "#ca8a04" }}
                    >
                      {Math.min(100, Math.round(p.trustScore))}
                    </div>
                  </div>
                </a>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base leading-tight line-clamp-2 flex-1">
                      <a href={href} className="hover:text-orange-700 transition">
                        {p.name}
                      </a>
                    </h3>
                    <SaveButton
                      size="sm"
                      item={{ id: p.id, name: p.name, type: "activity", url: href, icon: nicheIcon }}
                    />
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-2 truncate">{p.locality}</p>

                  <div className="flex items-center gap-2 text-xs mb-2">
                    {p.rating != null && (
                      <span className="text-yellow-700 font-bold">★{p.rating.toFixed(1)}</span>
                    )}
                    {p.reviewCount != null && p.reviewCount > 0 && (
                      <span className="text-[var(--muted)]">({num(p.reviewCount)})</span>
                    )}
                    {p.priceMinThb > 0 && (
                      <>
                        <span className="text-[var(--muted)]">·</span>
                        <span className="font-medium">฿{num(p.priceMinThb)}</span>
                      </>
                    )}
                    {p.priceBand && PRICE_BAND_LABELS[p.priceBand] && (
                      <span className="text-[var(--muted)]">{PRICE_BAND_LABELS[p.priceBand]}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.beginner && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-bold">Beginner</span>
                    )}
                    {p.open24h && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">24h</span>
                    )}
                    {p.en && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">EN</span>}
                    {p.ko && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">한국어</span>}
                  </div>

                  {p.topReview && (
                    <p className="text-xs text-[var(--muted)] italic leading-relaxed line-clamp-2 mb-3 flex-1">
                      &ldquo;{p.topReview}&rdquo;
                    </p>
                  )}

                  <div className="mt-auto space-y-2">
                    <a
                      href={href}
                      className="flex items-center justify-center w-full min-h-[44px] py-2 px-3 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition active:scale-95"
                    >
                      View details →
                    </a>
                    {klook ? (
                      <a
                        href={withKlookAid(klook.url)}
                        target="_blank"
                        rel="noopener noreferrer sponsored nofollow"
                        className="flex items-center justify-between w-full min-h-[44px] py-2 px-3 rounded-xl bg-orange-50 text-orange-800 text-xs font-bold hover:bg-orange-100 transition"
                      >
                        <span>🎟 Book on Klook</span>
                        <span className="opacity-90">
                          {klook.priceThb != null ? `฿${num(klook.priceThb)}` : "View"}
                        </span>
                      </a>
                    ) : (
                      <a
                        // The city, not a hardcoded "Bangkok": 748 of the
                        // qualifying venues are elsewhere in Thailand, and a
                        // Phuket studio was sending people to search Klook for
                        // itself "in Bangkok".
                        href={`https://www.klook.com/en-US/search/?query=${encodeURIComponent(`${p.name} ${p.city}`)}${process.env.NEXT_PUBLIC_KLOOK_AID ? `&aid=${process.env.NEXT_PUBLIC_KLOOK_AID}&aff_adid=thaigle` : ""}&utm_source=thaigle&utm_medium=affiliate&utm_campaign=${nicheSlug}`}
                        target="_blank"
                        rel="noopener noreferrer sponsored nofollow"
                        className="flex items-center justify-center w-full min-h-[44px] py-2 px-3 rounded-xl bg-orange-50 text-orange-800 text-xs font-bold hover:bg-orange-100 transition"
                      >
                        Find &amp; book similar on Klook →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-4xl mb-3">{nicheIcon}</div>
          <p className="text-sm">No venues match this filter. <button onClick={() => setActive("all")} className="underline">Show all</button></p>
        </div>
      )}
    </section>
  );
}
