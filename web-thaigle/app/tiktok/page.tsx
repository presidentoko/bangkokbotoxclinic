import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Thaigle × @yunmindoneit — Bangkok Venues We've Reviewed",
  description: "Every Bangkok café, restaurant, and spot reviewed by @yunmindoneit — with real Trust Score ratings, prices, and booking links.",
  robots: "noindex",
  alternates: { canonical: "/tiktok" },
};

type ReviewedVenue = {
  name: string;
  thaiglePath: string;
  category: string;
  emoji: string;
  trustScore?: number;
  rating?: number;
  priceLabel?: string;
  videoId?: string;
  isNew?: boolean;
};

// Manual list — update every time a new video drops
// thaiglePath: copy from the URL on the venue detail page
// trustScore: visible on the Thaigle detail page (0-100)
// videoId: last part of the TikTok URL (e.g. 7123456789)
const REVIEWED: ReviewedVenue[] = [
  // { name: "Thonglor Thai Kitchen", thaiglePath: "/restaurants/bangkok/watthana/thonglor-thai-kitchen", category: "Thai Restaurant", emoji: "🍜", trustScore: 87, rating: 4.6, priceLabel: "฿150–฿350", videoId: "7123456789", isNew: true },
];

const NICHE_COLORS: Record<string, string> = {
  "🍜": "bg-orange-100 text-orange-800",
  "☕": "bg-amber-100 text-amber-800",
  "🥊": "bg-red-100 text-red-800",
  "💆": "bg-purple-100 text-purple-800",
  "🧘": "bg-emerald-100 text-emerald-800",
  "👨‍🍳": "bg-yellow-100 text-yellow-800",
  "💉": "bg-pink-100 text-pink-800",
  "🦷": "bg-blue-100 text-blue-800",
};

function TrustPill({ score }: { score: number }) {
  const capped = Math.min(100, score);
  const color = capped >= 75 ? "#16a34a" : capped >= 60 ? "#059669" : "#ca8a04";
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0"
      style={{ background: `${color}18`, color }}
    >
      <span className="w-1 h-1 rounded-full" style={{ background: color }} />
      {capped}
    </span>
  );
}

export default function TikTokHubPage() {
  const hasVenues = REVIEWED.length > 0;

  return (
    <div className="max-w-sm mx-auto px-4 pt-10 pb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <a
          href="https://www.tiktok.com/@yunmindoneit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition"
        >
          <span className="text-3xl">📱</span>
          <div className="text-left">
            <div className="font-black text-lg leading-tight tracking-tight">@yunmindoneit</div>
            <div className="text-xs text-[var(--muted)]">Bangkok Food & Life</div>
          </div>
        </a>

        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Real Reviews</span>
          <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full">No Ads</span>
          <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full">No Paid Placements</span>
        </div>

        {hasVenues && (
          <p className="text-sm text-[var(--muted)]">
            {REVIEWED.length} venue{REVIEWED.length !== 1 ? "s" : ""} reviewed and verified with real data
          </p>
        )}
      </div>

      {/* Venue cards */}
      {hasVenues ? (
        <div className="space-y-3 mb-8">
          {REVIEWED.map((v, i) => {
            const utmSuffix = `?src=tiktok${v.videoId ? `&v=${v.videoId}` : ""}`;
            const href = `${v.thaiglePath}${utmSuffix}`;
            const pillColor = NICHE_COLORS[v.emoji] ?? "bg-gray-100 text-gray-700";

            return (
              <a
                key={i}
                href={href}
                className="flex items-center gap-3 bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-400 hover:shadow-sm transition group relative overflow-hidden"
              >
                {v.isNew && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                    NEW
                  </span>
                )}
                <div className={`text-xl shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${pillColor}`}>
                  {v.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-black text-sm group-hover:text-orange-600 transition truncate pr-8">
                    {v.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-[var(--muted)]">{v.category}</span>
                    {v.priceLabel && (
                      <>
                        <span className="text-[10px] text-[var(--muted)]">·</span>
                        <span className="text-[10px] text-[var(--muted)]">{v.priceLabel}</span>
                      </>
                    )}
                    {v.rating && (
                      <>
                        <span className="text-[10px] text-[var(--muted)]">·</span>
                        <span className="text-[10px] text-yellow-700 font-bold">★{v.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {v.trustScore != null && <TrustPill score={v.trustScore} />}
                  <span className="text-[var(--muted)] group-hover:translate-x-0.5 transition text-sm">→</span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-[var(--muted)] mb-8">
          <div className="text-3xl mb-3">🎬</div>
          <p className="text-sm mb-4">Video reviews coming soon — follow us on TikTok for updates.</p>
          <a
            href="https://www.tiktok.com/@yunmindoneit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white font-bold px-5 py-3 rounded-xl hover:bg-gray-800 transition text-sm"
          >
            Follow @yunmindoneit →
          </a>
        </div>
      )}

      {/* Day Plan CTA */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 text-center mb-4">
        <div className="font-black mb-1 text-sm">Build a full Bangkok day</div>
        <p className="text-xs text-[var(--muted)] mb-3">
          Combine any reviewed venue with a spa, Muay Thai, or cooking class.
        </p>
        <a
          href="/day-plan?src=tiktok"
          className="inline-block bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition text-sm"
        >
          See Bangkok Day Plans →
        </a>
      </div>

      {/* Browse all */}
      <div className="text-center">
        <a
          href="/?src=tiktok"
          className="text-xs text-[var(--muted)] hover:text-black transition underline underline-offset-2"
        >
          Browse all of Thaigle →
        </a>
      </div>
    </div>
  );
}
