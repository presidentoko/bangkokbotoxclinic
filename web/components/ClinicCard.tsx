// 클리닉 카드 — rich data 시각화: highlights · specialty · trend.

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { AIVerifiedBadge } from "./Badges";
import { sponsoredTier } from "@/lib/sponsored";

// 긍정 시그널 — 신뢰감 주는 topic 만 highlight chip 으로 노출.
const POSITIVE_TOPICS: Record<string, { label: string; emoji: string }> = {
  english_speaking:   { label: "English",     emoji: "🇬🇧" },
  korean_doctor:      { label: "Korean Dr",   emoji: "🇰🇷" },
  genuine_brand:      { label: "Genuine",     emoji: "🛡" },
  clean_facility:     { label: "Clean",       emoji: "✨" },
  professional:       { label: "Pro",         emoji: "👔" },
  friendly_staff:     { label: "Friendly",    emoji: "😊" },
  no_pain:            { label: "Gentle",      emoji: "🌿" },
  affordable:         { label: "Affordable",  emoji: "💰" },
  premium:            { label: "Premium",     emoji: "✦" },
  results_satisfied:  { label: "Results",     emoji: "✓" },
  recommend:          { label: "Recommended", emoji: "👍" },
};

const NEGATIVE_TOPICS: Record<string, { label: string; emoji: string }> = {
  long_wait: { label: "Wait time", emoji: "⏱" },
  expensive: { label: "Expensive", emoji: "💸" },
};

function ratingDelta(c: Clinic): { delta: number; arrow: string; color: string } | null {
  const recent = c.rating_trend.recent.avg;
  const old = c.rating_trend.old.avg;
  if (recent === null || old === null) return null;
  const delta = recent - old;
  if (Math.abs(delta) < 0.1) return null;
  return delta > 0
    ? { delta, arrow: "↗", color: "text-green-700" }
    : { delta, arrow: "↘", color: "text-red-600" };
}

// 3-point sparkline 좌표 — old / midterm / recent rating averages
function sparklinePoints(c: Clinic): { points: string; pts: { x: number; y: number; avg: number }[] } | null {
  const buckets = [c.rating_trend.old.avg, c.rating_trend.midterm.avg, c.rating_trend.recent.avg];
  const valid = buckets.every((v) => v !== null);
  if (!valid) return null;
  const W = 56, H = 18;
  const toY = (avg: number) => H - ((avg - 1) / 4) * H;
  const pts = buckets.map((avg, i) => ({
    x: (i / 2) * W,
    y: toY(avg as number),
    avg: avg as number,
  }));
  return {
    points: pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
    pts,
  };
}

function langBar(c: Clinic): { en: number; th: number; ko: number; ja: number; other: number; total: number } | null {
  const l = c.language_breakdown;
  const total = l.en + l.th + l.ko + l.ja + l.other;
  if (total < 5) return null;
  return { ...l, total };
}

function recentReviewCount(c: Clinic): number {
  return c.rating_trend.recent.count;
}

function topServices(c: Clinic, n = 2): { service: string; count: number }[] {
  return Object.entries(c.service_mentions)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([service, count]) => ({ service, count }));
}

function topDoctor(c: Clinic): { name: string; mentions: number; lang?: string } | null {
  if (!c.doctor_stats || c.doctor_stats.length === 0) return null;
  const top = [...c.doctor_stats].sort((a, b) => b.mentions - a.mentions)[0];
  if (top.mentions < 3) return null;
  return { name: top.name, mentions: top.mentions, lang: top.primary_lang };
}

function topHighlights(c: Clinic, n = 3): { topic: string; label: string; emoji: string; count: number }[] {
  return c.mentioned_topics
    .filter((t) => POSITIVE_TOPICS[t.topic] && t.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((t) => ({ topic: t.topic, ...POSITIVE_TOPICS[t.topic], count: t.count }));
}

function topWarnings(c: Clinic): { topic: string; label: string; emoji: string; count: number }[] {
  // 부정 토픽 — count 가 높을 때만 (≥5) warning 표시
  return c.mentioned_topics
    .filter((t) => NEGATIVE_TOPICS[t.topic] && t.count >= 5)
    .sort((a, b) => b.count - a.count)
    .slice(0, 1)
    .map((t) => ({ topic: t.topic, ...NEGATIVE_TOPICS[t.topic], count: t.count }));
}

// 카드용 짧은 리뷰 스니펫 — 4-5점 리뷰 중 적당한 길이 (60-140자) 뽑아 한 줄로.
function pickSnippet(c: Clinic): string | null {
  const all = [
    ...(c.sample_reviews_en ?? []),
    ...(c.sample_reviews_ko ?? []),
    ...(c.sample_reviews_th ?? []),
  ];
  const good = all
    .filter((r) => r.rating >= 4 && r.text.length >= 40 && r.text.length <= 200)
    // 영어 우선 (대부분 유저가 영어 인터페이스 사용 가정)
    .sort((a, b) => {
      const lenScore = (r: typeof a) => -Math.abs(r.text.length - 110); // 110자 근처 최적
      return lenScore(b) - lenScore(a);
    });
  if (good.length === 0) return null;
  const pick = good[0];
  const clean = pick.text.replace(/\s+/g, " ").trim();
  return clean.length > 130 ? clean.slice(0, 127) + "..." : clean;
}

export async function ClinicCard({ clinic, rank }: { clinic: Clinic; rank?: number }) {
  const tier = await sponsoredTier(clinic.id);
  const trendDelta = ratingDelta(clinic);
  const sparkline = sparklinePoints(clinic);
  const lang = langBar(clinic);
  const recentReviews = recentReviewCount(clinic);
  const highlights = topHighlights(clinic);
  const warnings = topWarnings(clinic);
  const services = topServices(clinic);
  const doctor = topDoctor(clinic);
  const snippet = pickSnippet(clinic);
  const trustColor =
    clinic.trust_score >= 80 ? "#059669" :
    clinic.trust_score >= 65 ? "#2563eb" :
    clinic.trust_score >= 50 ? "#d97706" : "#6b7280";

  const tierStyles = tier === "editors_pick"
    ? { wrapper: "shadow-lg shadow-amber-200/40 ring-2 ring-amber-300", corner: "from-amber-400 to-yellow-600" }
    : tier === "recommended"
    ? { wrapper: "shadow-lg shadow-blue-200/40 ring-2 ring-sky-300", corner: "from-sky-500 to-blue-600" }
    : tier === "featured"
    ? { wrapper: "shadow-lg shadow-purple-200/40 ring-2 ring-fuchsia-300", corner: "from-fuchsia-500 to-purple-600" }
    : { wrapper: "", corner: "" };

  return (
    <div className={`group block border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-gray-300 transition relative overflow-hidden ${tierStyles.wrapper}`}>
      {tier && (
        <div className={`absolute top-0 right-0 z-10 bg-gradient-to-r ${tierStyles.corner} text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-md`}>
          {tier === "editors_pick" ? "★ Editor's Pick" : tier === "recommended" ? "✓ Recommended" : "◆ Featured"}
        </div>
      )}

      <a href={`/clinic/${clinic.id}`} className="block p-5 pb-3">
        {/* Top row — rank, district, status, name, rating */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1 flex-wrap">
              {rank !== undefined && <span className="font-bold text-[var(--fg)] tabular-nums">#{rank}</span>}
              {clinic.district && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>📍</span>
                  {clinic.district}
                </span>
              )}
              {clinic.business_status === "Open" && (
                <span className="flex items-center gap-1 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Open
                </span>
              )}
              {trendDelta && (
                <span className={`flex items-center gap-0.5 font-medium ${trendDelta.color}`}>
                  {trendDelta.arrow} {trendDelta.delta > 0 ? "+" : ""}{trendDelta.delta.toFixed(1)} <span className="text-[10px] opacity-70">30d</span>
                </span>
              )}
            </div>
            <h3 className="font-semibold text-base group-hover:text-[var(--accent)] transition truncate">{clinic.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold whitespace-nowrap">★ {clinic.rating.toFixed(1)}</div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">{clinic.total_reviews.toLocaleString()} reviews</div>
            {/* Rating sparkline — visual trend */}
            {sparkline && (
              <svg viewBox="0 0 56 18" className="w-14 h-4 mt-1" aria-label={`Rating trend ${sparkline.pts.map((p) => p.avg.toFixed(1)).join(" → ")}`}>
                <polyline
                  fill="none"
                  stroke={trendDelta?.delta && trendDelta.delta > 0 ? "#16a34a" : trendDelta?.delta && trendDelta.delta < 0 ? "#dc2626" : "#9ca3af"}
                  strokeWidth="1.5"
                  points={sparkline.points}
                />
                {sparkline.pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="1.5"
                    fill={i === 2 ? (trendDelta?.delta && trendDelta.delta > 0 ? "#16a34a" : "#6b7280") : "#9ca3af"}
                  />
                ))}
              </svg>
            )}
          </div>
        </div>

        {/* Trust score bar — visual progress */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Trust Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black tabular-nums" style={{ color: trustColor }}>{clinic.trust_score}</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: trustColor }}>
                {clinic.trust_score >= 80 ? "Excellent" : clinic.trust_score >= 65 ? "Strong" : clinic.trust_score >= 50 ? "Good" : "Fair"}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(clinic.trust_score, 100)}%`, background: trustColor }} />
          </div>
        </div>

        {/* Highlights chips */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {highlights.map((h) => (
              <span key={h.topic} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1" title={`Mentioned ${h.count}× in reviews`}>
                <span>{h.emoji}</span>
                {h.label}
                <span className="text-emerald-600 text-[10px] tabular-nums">×{h.count}</span>
              </span>
            ))}
            {warnings.map((w) => (
              <span key={w.topic} className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1" title={`Mentioned ${w.count}× — context matters`}>
                <span>{w.emoji}</span>
                {w.label}
              </span>
            ))}
          </div>
        )}

        {/* Specialty + doctor row */}
        <div className="text-xs text-[var(--muted)] space-y-0.5 mb-2">
          {services.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[var(--fg)] font-semibold">💉 Specialty:</span>
              {services.map((s, i) => (
                <span key={s.service} className="inline-flex items-center gap-1">
                  <CategoryIcon category={s.service} size={11} />
                  {CATEGORY_LABELS[s.service] ?? s.service}
                  <span className="opacity-60 tabular-nums">({s.count})</span>
                  {i < services.length - 1 && <span className="opacity-40">·</span>}
                </span>
              ))}
            </div>
          )}
          {doctor && (
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--fg)] font-semibold">👨‍⚕️ Top doctor:</span>
              <span>{doctor.name}</span>
              {doctor.lang && doctor.lang !== "en" && (
                <span className="text-[10px] uppercase tracking-wider opacity-80 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                  {doctor.lang}
                </span>
              )}
              <span className="opacity-60 tabular-nums">{doctor.mentions} mentions</span>
            </div>
          )}
        </div>

        {/* Review snippet — 한 줄 정성평 */}
        {snippet && (
          <div className="mb-3 bg-amber-50/60 border-l-2 border-amber-300 rounded-r px-3 py-2">
            <p className="text-xs italic text-gray-700 leading-snug line-clamp-2">
              &ldquo;{snippet}&rdquo;
            </p>
          </div>
        )}

        {/* Language breakdown bar — international clinic indicator */}
        {lang && lang.total >= 5 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">Reviewers</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100 flex">
                {lang.en > 0 && <div style={{ width: `${(lang.en / lang.total) * 100}%`, background: "#3b82f6" }} title={`English ${lang.en}`} />}
                {lang.th > 0 && <div style={{ width: `${(lang.th / lang.total) * 100}%`, background: "#ef4444" }} title={`Thai ${lang.th}`} />}
                {lang.ko > 0 && <div style={{ width: `${(lang.ko / lang.total) * 100}%`, background: "#8b5cf6" }} title={`Korean ${lang.ko}`} />}
                {lang.ja > 0 && <div style={{ width: `${(lang.ja / lang.total) * 100}%`, background: "#10b981" }} title={`Japanese ${lang.ja}`} />}
                {lang.other > 0 && <div style={{ width: `${(lang.other / lang.total) * 100}%`, background: "#9ca3af" }} title={`Other ${lang.other}`} />}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] flex-wrap">
              {lang.en > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />EN {Math.round((lang.en / lang.total) * 100)}%</span>}
              {lang.th > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />TH {Math.round((lang.th / lang.total) * 100)}%</span>}
              {lang.ko > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" />KO {Math.round((lang.ko / lang.total) * 100)}%</span>}
              {lang.ja > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />JA {Math.round((lang.ja / lang.total) * 100)}%</span>}
            </div>
          </div>
        )}

        {/* Bottom row — recent activity, AI verified, local guides */}
        <div className="flex items-center justify-end gap-1.5 flex-wrap mt-2">
          {recentReviews >= 5 && (
            <span className="bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1" title={`${recentReviews} reviews in the last 30 days`}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {recentReviews} new
            </span>
          )}
          <AIVerifiedBadge clinic={clinic} size="sm" />
          {clinic.local_guide_count > 0 && (
            <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {clinic.local_guide_count} Local Guides
            </span>
          )}
        </div>
      </a>

      {/* CTA strip */}
      <div className="px-5 pb-4 flex gap-2">
        <a
          href={`/clinic/${clinic.id}`}
          className="flex-1 text-center py-2 px-3 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
        >
          View details →
        </a>
        <a
          href={clinic.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
          title="View on Google Maps"
          aria-label="View on Google Maps"
        >
          📍
        </a>
        {clinic.phone && (
          <a
            href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
            className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
            title={`Call ${clinic.phone}`}
            aria-label="Call clinic"
          >
            📞
          </a>
        )}
      </div>
    </div>
  );
}
