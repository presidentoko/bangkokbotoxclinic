// 신뢰도 / 검증 / 시간 / sponsored 배지들.

import type { Clinic } from "@/lib/types";
import { sponsoredTier, SPONSORED_BADGE } from "@/lib/sponsored";

// AI Verified badge — Local Guide 비율을 "AI 검증된 실제 후기" 비율로 표시.
// 비율 계산: max(local_guide_ratio, 0.5) → 50-100%. (낮은 LG ratio 도 50% 노이즈 필터로 보장)
export function AIVerifiedBadge({ clinic, size = "sm" }: { clinic: Clinic; size?: "sm" | "md" }) {
  if (clinic.scraped_review_count < 5) return null;
  const lg = clinic.local_guide_count;
  const total = clinic.scraped_review_count;
  const lgRatio = total > 0 ? lg / total : 0;
  const verifiedRate = Math.round(50 + lgRatio * 50);
  // Low estimates hidden from cards — only shown in detail view alongside methodology link
  if (verifiedRate < 65) return null;
  const cls = size === "md"
    ? "px-3 py-1 text-sm"
    : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${cls}`}
      style={{ background: "#ecfeff", color: "#155e75" }}
      title="Automated estimate based on public review patterns (Local Guide ratio). Not a finding of wrongdoing. See /methodology."
    >
      <span aria-hidden>✓</span>
      Authenticity est. ~{verifiedRate}%
    </span>
  );
}

// Sponsored 배지 (tier별 색깔 다름)
export async function SponsoredBadge({ clinicId }: { clinicId: string }) {
  const tier = await sponsoredTier(clinicId);
  if (!tier) return null;
  const cfg = SPONSORED_BADGE[tier];
  const gradient =
    tier === "editors_pick" ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)"
    : tier === "recommended" ? "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)"
    : "linear-gradient(135deg, #d946ef 0%, #9333ea 50%, #7e22ce 100%)";
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap text-white shadow-md"
      style={{ background: gradient }}
    >
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

// Verified Partner badge — sponsored tier 가 있는 클리닉에 표시.
export async function VerifiedPartnerBadge({ clinicId }: { clinicId: string }) {
  const tier = await sponsoredTier(clinicId);
  if (!tier) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-sm"
      style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
    >
      🏅 Verified Partner
    </span>
  );
}

// Freshness — master_db.generated_at 으로부터 상대 시간.
export function Freshness({ generatedAt, mode = "card" }: {
  generatedAt: string;
  mode?: "card" | "detail";
}) {
  const ago = relativeTimeFromIso(generatedAt);
  if (mode === "card") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
        Updated {ago}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs text-[var(--muted)] bg-white px-3 py-1 rounded-full border border-[var(--border)]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Last updated {ago}
    </span>
  );
}

// Trust 상대 ranking — 카테고리/지역 내 percentile.
export function RelativeRanking({ percentile, label }: {
  percentile: number;
  label: string;
}) {
  const top = Math.max(1, Math.round((1 - percentile / 100) * 100));
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: "#f0fdf4", color: "#166534" }}
    >
      <span aria-hidden>🏆</span>
      Top {top}% in {label}
    </span>
  );
}

function relativeTimeFromIso(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "recently";
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
