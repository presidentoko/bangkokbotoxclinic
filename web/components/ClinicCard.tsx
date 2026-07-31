// 클리닉 카드 — rich data 시각화: highlights · specialty · trend.

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { AIVerifiedBadge } from "./Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { formatTrustScore } from "@/lib/utils";
import { loadPhotos } from "@/lib/photos";
import { ClinicPhoto } from "./ClinicPhoto";

type Lang = "en" | "ko" | "th";

// 긍정 시그널 — 신뢰감 주는 topic 만 highlight chip 으로 노출.
const POSITIVE_TOPICS: Record<Lang, Record<string, { label: string; emoji: string }>> = {
  en: {
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
  },
  ko: {
    english_speaking:   { label: "영어가능",    emoji: "🇬🇧" },
    korean_doctor:      { label: "한국인 의사", emoji: "🇰🇷" },
    genuine_brand:      { label: "정품",        emoji: "🛡" },
    clean_facility:     { label: "청결",        emoji: "✨" },
    professional:       { label: "전문적",      emoji: "👔" },
    friendly_staff:     { label: "친절",        emoji: "😊" },
    no_pain:            { label: "안 아픔",     emoji: "🌿" },
    affordable:         { label: "가성비",      emoji: "💰" },
    premium:            { label: "프리미엄",    emoji: "✦" },
    results_satisfied:  { label: "만족스러운 결과", emoji: "✓" },
    recommend:          { label: "추천",        emoji: "👍" },
  },
  th: {
    english_speaking:   { label: "พูดอังกฤษ",   emoji: "🇬🇧" },
    korean_doctor:      { label: "หมอเกาหลี",   emoji: "🇰🇷" },
    genuine_brand:      { label: "ของแท้",      emoji: "🛡" },
    clean_facility:     { label: "สะอาด",       emoji: "✨" },
    professional:       { label: "มืออาชีพ",    emoji: "👔" },
    friendly_staff:     { label: "เป็นกันเอง",  emoji: "😊" },
    no_pain:            { label: "ไม่เจ็บ",     emoji: "🌿" },
    affordable:         { label: "ราคาคุ้มค่า", emoji: "💰" },
    premium:            { label: "พรีเมียม",    emoji: "✦" },
    results_satisfied:  { label: "ผลลัพธ์ดี",   emoji: "✓" },
    recommend:          { label: "แนะนำ",       emoji: "👍" },
  },
};

const NEGATIVE_TOPICS: Record<Lang, Record<string, { label: string; emoji: string }>> = {
  en: { long_wait: { label: "Wait time", emoji: "⏱" }, expensive: { label: "Expensive", emoji: "💸" } },
  ko: { long_wait: { label: "대기시간",   emoji: "⏱" }, expensive: { label: "비쌈",       emoji: "💸" } },
  th: { long_wait: { label: "รอนาน",      emoji: "⏱" }, expensive: { label: "ราคาแพง",   emoji: "💸" } },
};

const COPY: Record<Lang, {
  open: string; day30: string; editorsPick: string; recommended: string; featured: string; verifiedPartner: string;
  reviews: string; trustScore: string; excellent: string; strong: string; good: string; fair: string;
  mentioned: string; contextMatters: string; specialty: string; topDoctor: string; mentions: string;
  reviewers: string; recentDays: string; new_: string; localGuides: string;
  bookConsultation: string; viewDetails: string; viewOnMaps: string; call: string;
}> = {
  en: {
    open: "Open", day30: "30d", editorsPick: "★ Editor's Pick", recommended: "✓ Recommended", featured: "◆ Featured", verifiedPartner: "🏅 Verified Partner",
    reviews: "reviews", trustScore: "Trust Score", excellent: "Excellent", strong: "Strong", good: "Good", fair: "Fair",
    mentioned: "Mentioned {n}× in reviews", contextMatters: "Mentioned {n}× — context matters", specialty: "💉 Specialty:", topDoctor: "👨‍⚕️ Top doctor:", mentions: "mentions",
    reviewers: "Reviewers", recentDays: "{n} reviews in the last 30 days", new_: "new", localGuides: "Local Guides",
    bookConsultation: "Book Consultation →", viewDetails: "View details →", viewOnMaps: "View on Google Maps", call: "Call clinic",
  },
  ko: {
    open: "영업중", day30: "30일", editorsPick: "★ 에디터 픽", recommended: "✓ 추천", featured: "◆ 주목", verifiedPartner: "🏅 인증 파트너",
    reviews: "리뷰", trustScore: "신뢰도 점수", excellent: "매우 우수", strong: "우수", good: "양호", fair: "보통",
    mentioned: "리뷰에서 {n}회 언급", contextMatters: "{n}회 언급 — 맥락 확인 필요", specialty: "💉 전문 분야:", topDoctor: "👨‍⚕️ 대표 의사:", mentions: "회 언급",
    reviewers: "리뷰어", recentDays: "최근 30일간 리뷰 {n}건", new_: "신규", localGuides: "Local Guides",
    bookConsultation: "상담 예약 →", viewDetails: "상세 보기 →", viewOnMaps: "구글맵에서 보기", call: "전화하기",
  },
  th: {
    open: "เปิด", day30: "30วัน", editorsPick: "★ ตัวเลือกบรรณาธิการ", recommended: "✓ แนะนำ", featured: "◆ เด่น", verifiedPartner: "🏅 พาร์ตเนอร์ที่ยืนยันแล้ว",
    reviews: "รีวิว", trustScore: "คะแนนความน่าเชื่อถือ", excellent: "ยอดเยี่ยม", strong: "ดีมาก", good: "ดี", fair: "พอใช้",
    mentioned: "ถูกกล่าวถึง {n}× ในรีวิว", contextMatters: "ถูกกล่าวถึง {n}× — ควรพิจารณาบริบท", specialty: "💉 ความเชี่ยวชาญ:", topDoctor: "👨‍⚕️ แพทย์เด่น:", mentions: "ครั้งที่ถูกกล่าวถึง",
    reviewers: "ผู้รีวิว", recentDays: "{n} รีวิวใน 30 วันที่ผ่านมา", new_: "ใหม่", localGuides: "Local Guides",
    bookConsultation: "จองคำปรึกษา →", viewDetails: "ดูรายละเอียด →", viewOnMaps: "ดูบน Google Maps", call: "โทรหาคลินิก",
  },
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

function topHighlights(c: Clinic, uiLang: Lang, n = 3): { topic: string; label: string; emoji: string; count: number }[] {
  const topics = POSITIVE_TOPICS[uiLang] ?? POSITIVE_TOPICS.en;
  return c.mentioned_topics
    .filter((t) => topics[t.topic] && t.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((t) => ({ topic: t.topic, ...topics[t.topic], count: t.count }));
}

function topWarnings(c: Clinic, uiLang: Lang): { topic: string; label: string; emoji: string; count: number }[] {
  const topics = NEGATIVE_TOPICS[uiLang] ?? NEGATIVE_TOPICS.en;
  // 부정 토픽 — count 가 높을 때만 (≥5) warning 표시
  return c.mentioned_topics
    .filter((t) => topics[t.topic] && t.count >= 5)
    .sort((a, b) => b.count - a.count)
    .slice(0, 1)
    .map((t) => ({ topic: t.topic, ...topics[t.topic], count: t.count }));
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

export async function ClinicCard({ clinic, rank, lang = "en" }: { clinic: Clinic; rank?: number; lang?: Lang }) {
  const t = COPY[lang] ?? COPY.en;
  // /th, /ko 페이지에서 카드를 눌러도 항상 영어 /clinic/[id]로 빠지던 문제 —
  // /th/clinic/[id], /ko/clinic/[id] 모두 EN과 동일 클리닉 set으로 이미
  // 존재하는데(parentGSP 재사용) 링크만 lang 무시하고 하드코딩돼 있었음
  // (2026-07-31 감사).
  const clinicHref = `${lang === "en" ? "" : `/${lang}`}/clinic/${clinic.id}`;
  const tier = await sponsoredTier(clinic.id);
  // 카드 목록(허브/best/홈)이 텍스트만 있어서 사진 있는 구글 로컬팩 대비
  // 이탈률이 높았을 가능성 — 이미 스크랩된 사진(1,395개 클리닉)을 카드에도
  // 노출 (2026-07-17 감사). loadPhotos 자체 캐시라 반복 호출 저렴.
  const photoData = await loadPhotos(clinic.id);
  const photo = photoData?.photos[0];
  const trendDelta = ratingDelta(clinic);
  const sparkline = sparklinePoints(clinic);
  const reviewLangs = langBar(clinic);
  const recentReviews = recentReviewCount(clinic);
  const highlights = topHighlights(clinic, lang);
  const warnings = topWarnings(clinic, lang);
  const services = topServices(clinic);
  const doctor = topDoctor(clinic);
  const snippet = pickSnippet(clinic);
  // TrustBadge/TrustDonut/clinic 상세페이지와 동일 임계값(75/60/40)+색상으로
  // 통일 — 예전엔 이 카드만 80/65/50 + 파랑 배색이라 같은 68점이 페이지마다
  // 다른 등급/색으로 보였음 (2026-07-17 감사).
  const trustColor =
    clinic.trust_score >= 75 ? "#16a34a" :
    clinic.trust_score >= 60 ? "#059669" :
    clinic.trust_score >= 40 ? "#ca8a04" : "#94a3b8";

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
          {tier === "editors_pick" ? t.editorsPick : tier === "recommended" ? t.recommended : t.featured}
        </div>
      )}

      <a href={clinicHref} className="block p-5 pb-3">
        {/* Top row — rank, district, status, name, rating */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {photo && (
            <ClinicPhoto
              src={photo.thumb}
              alt={clinic.name}
              className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
            />
          )}
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
                  {t.open}
                </span>
              )}
              {trendDelta && (
                <span className={`flex items-center gap-0.5 font-medium ${trendDelta.color}`}>
                  {trendDelta.arrow} {trendDelta.delta > 0 ? "+" : ""}{trendDelta.delta.toFixed(1)} <span className="text-[10px] opacity-70">{t.day30}</span>
                </span>
              )}
            </div>
            {/* truncate였던 걸 line-clamp-2로 — 360px에서 사진·평점 빼면 이름 칸이
                ~130px라 "Bangkok International Dental Center" 같은 이름이
                "Bangkok Interna…"로 잘려 목록에서 식별 불가였음 (2026-07-31 감사). */}
            <h3 className="font-semibold text-base group-hover:text-[var(--accent)] transition line-clamp-2 break-words">{clinic.name}</h3>
            {tier && (
              <div className="mt-1">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-sm"
                  style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
                >
                  {t.verifiedPartner}
                </span>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold whitespace-nowrap">★ {clinic.rating.toFixed(1)}</div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">{clinic.total_reviews.toLocaleString()} {t.reviews}</div>
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{t.trustScore}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black tabular-nums" style={{ color: trustColor }}>{formatTrustScore(clinic.trust_score)}</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: trustColor }}>
                {clinic.trust_score >= 75 ? t.excellent : clinic.trust_score >= 60 ? t.strong : clinic.trust_score >= 40 ? t.good : t.fair}
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
              <span key={h.topic} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1" title={t.mentioned.replace("{n}", String(h.count))}>
                <span>{h.emoji}</span>
                {h.label}
                <span className="text-emerald-600 text-[10px] tabular-nums">×{h.count}</span>
              </span>
            ))}
            {warnings.map((w) => (
              <span key={w.topic} className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1" title={t.contextMatters.replace("{n}", String(w.count))}>
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
              <span className="text-[var(--fg)] font-semibold">{t.specialty}</span>
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
              <span className="text-[var(--fg)] font-semibold">{t.topDoctor}</span>
              <span>{doctor.name}</span>
              {doctor.lang && doctor.lang !== "en" && (
                <span className="text-[10px] uppercase tracking-wider opacity-80 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                  {doctor.lang}
                </span>
              )}
              <span className="opacity-60 tabular-nums">{doctor.mentions} {t.mentions}</span>
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
        {reviewLangs && reviewLangs.total >= 5 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">{t.reviewers}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100 flex">
                {reviewLangs.en > 0 && <div style={{ width: `${(reviewLangs.en / reviewLangs.total) * 100}%`, background: "#3b82f6" }} title={`English ${reviewLangs.en}`} />}
                {reviewLangs.th > 0 && <div style={{ width: `${(reviewLangs.th / reviewLangs.total) * 100}%`, background: "#ef4444" }} title={`Thai ${reviewLangs.th}`} />}
                {reviewLangs.ko > 0 && <div style={{ width: `${(reviewLangs.ko / reviewLangs.total) * 100}%`, background: "#8b5cf6" }} title={`Korean ${reviewLangs.ko}`} />}
                {reviewLangs.ja > 0 && <div style={{ width: `${(reviewLangs.ja / reviewLangs.total) * 100}%`, background: "#10b981" }} title={`Japanese ${reviewLangs.ja}`} />}
                {reviewLangs.other > 0 && <div style={{ width: `${(reviewLangs.other / reviewLangs.total) * 100}%`, background: "#9ca3af" }} title={`Other ${reviewLangs.other}`} />}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] flex-wrap">
              {reviewLangs.en > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />EN {Math.round((reviewLangs.en / reviewLangs.total) * 100)}%</span>}
              {reviewLangs.th > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />TH {Math.round((reviewLangs.th / reviewLangs.total) * 100)}%</span>}
              {reviewLangs.ko > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" />KO {Math.round((reviewLangs.ko / reviewLangs.total) * 100)}%</span>}
              {reviewLangs.ja > 0 && <span className="inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />JA {Math.round((reviewLangs.ja / reviewLangs.total) * 100)}%</span>}
            </div>
          </div>
        )}

        {/* Bottom row — recent activity, AI verified, local guides */}
        <div className="flex items-center justify-end gap-1.5 flex-wrap mt-2">
          {recentReviews >= 5 && (
            <span className="bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1" title={t.recentDays.replace("{n}", String(recentReviews))}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {recentReviews} {t.new_}
            </span>
          )}
          <AIVerifiedBadge clinic={clinic} size="sm" />
          {clinic.local_guide_count > 0 && (
            <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {clinic.local_guide_count} {t.localGuides}
            </span>
          )}
        </div>
      </a>

      {/* CTA strip */}
      <div className="px-5 pb-4 flex gap-2">
        {tier && clinic.website ? (
          <a
            href={clinic.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 px-3 rounded-lg text-white text-xs font-bold transition"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
          >
            {t.bookConsultation}
          </a>
        ) : (
          <a
            href={clinicHref}
            className="flex-1 text-center py-2 px-3 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
          >
            {t.viewDetails}
          </a>
        )}
        <a
          href={clinic.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
          title={t.viewOnMaps}
          aria-label={t.viewOnMaps}
        >
          📍
        </a>
        {clinic.phone && (
          <a
            href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
            className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
            title={`Call ${clinic.phone}`}
            aria-label={t.call}
          >
            📞
          </a>
        )}
      </div>
    </div>
  );
}
