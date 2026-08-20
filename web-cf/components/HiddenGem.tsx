// HiddenGem — 오늘의 숨은 보석 클리닉. 매일 deterministic random.
// 기준: trust_score 75+ (품질 보장) AND total_reviews 50–250 (대형 클리닉 묻혀있음).
// Server component — 클라이언트 JS 0.

import type { Clinic } from "@/lib/types";
import { formatTrustScore } from "@/lib/utils";
import { ClinicPhoto } from "./ClinicPhoto";

function dayOfYearSeed(): number {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  return Math.floor((now.getTime() - start) / 86400000);
}

type Lang = "en" | "ko" | "th";
const COPY: Record<Lang, {
  badge: string; todaysPick: string; reviews: string; trustScore: string;
  verifiedReviewer: string; whyClinic: string; whyBody: string; seeProfile: string;
}> = {
  en: {
    badge: "💎 Hidden gem · today", todaysPick: "Today's pick · refreshes daily", reviews: "reviews", trustScore: "Trust Score",
    verifiedReviewer: "Verified reviewer",
    whyClinic: "Why this clinic?", whyBody: "High Trust Score with a smaller review pool — quality is established but it isn't blowing up on social yet. Often a better value than the top-of-list giants.",
    seeProfile: "See full profile",
  },
  ko: {
    badge: "💎 오늘의 숨은 보석", todaysPick: "오늘의 픽 · 매일 갱신", reviews: "리뷰", trustScore: "신뢰도 점수",
    verifiedReviewer: "검증된 리뷰어",
    whyClinic: "왜 이 클리닉인가?", whyBody: "신뢰도는 높은데 아직 리뷰 수는 적은 곳 — 품질은 검증됐지만 아직 입소문이 크게 안 났습니다. 상위권 대형 클리닉보다 가성비가 좋을 때가 많습니다.",
    seeProfile: "전체 프로필 보기",
  },
  th: {
    badge: "💎 อัญมณีที่ซ่อนอยู่ · วันนี้", todaysPick: "ตัวเลือกวันนี้ · อัปเดตทุกวัน", reviews: "รีวิว", trustScore: "คะแนนความน่าเชื่อถือ",
    verifiedReviewer: "ผู้รีวิวที่ยืนยันแล้ว",
    whyClinic: "ทำไมต้องคลินิกนี้?", whyBody: "คะแนนความน่าเชื่อถือสูงแต่มีรีวิวยังไม่มาก — คุณภาพพิสูจน์แล้วแต่ยังไม่ดังบนโซเชียล มักคุ้มค่ากว่าคลินิกอันดับต้นๆ ที่ใหญ่กว่า",
    seeProfile: "ดูโปรไฟล์เต็ม",
  },
};

export function HiddenGem({
  pool,
  accent = "#2563eb",
  photo,
  lang = "en",
}: {
  pool: Clinic[];
  accent?: string;
  photo?: { thumb: string; large: string };
  lang?: Lang;
}) {
  const t = COPY[lang] ?? COPY.en;
  // 후보: high-trust 인데 review_volume 적은 클리닉 → 진짜 숨은 보석
  const candidates = pool.filter(
    (c) => c.trust_score >= 70 && c.total_reviews >= 30 && c.total_reviews <= 250
  );
  if (candidates.length === 0) return null;
  const seed = dayOfYearSeed();
  const pick = candidates[seed % candidates.length];

  const topTopics = (pick.mentioned_topics ?? []).slice(0, 3);
  const sample =
    (pick.sample_reviews_en && pick.sample_reviews_en[0]) ??
    (pick.sample_reviews_th && pick.sample_reviews_th[0]) ??
    null;

  return (
    <section className="my-12">
      <div className="relative overflow-hidden rounded-2xl border-2 shadow-md"
           style={{ borderColor: accent }}>
        {/* Backdrop accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: accent }} />

        <div className="grid md:grid-cols-2 gap-0">
          {/* Photo half — 모바일 16:9, 데스크탑 fill */}
          <div
            className="relative aspect-[16/9] md:aspect-auto md:min-h-[280px] overflow-hidden"
            style={photo ? undefined : { background: `linear-gradient(135deg, ${accent}22, ${accent}08)` }}
          >
            {photo ? (
              <ClinicPhoto
                src={photo.large}
                alt={`${pick.name} exterior`}
                placeholderIcon="💎"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                💎
              </div>
            )}
            {/* Floating badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-[10px] uppercase tracking-widest font-black shadow-md"
                 style={{ background: accent }}>
              {t.badge}
            </div>
          </div>

          {/* Info half */}
          <div className="p-5 md:p-7 bg-white">
            <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: accent }}>
              {t.todaysPick}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2">
              {pick.name}
            </h2>
            <p className="text-sm text-[var(--muted)] mb-3 flex items-center gap-2 flex-wrap">
              <span>📍 {pick.district}</span>
              <span>·</span>
              <span className="text-yellow-700 font-bold">★ {pick.rating.toFixed(1)}</span>
              <span>·</span>
              <span>{pick.total_reviews.toLocaleString()} {t.reviews}</span>
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                 style={{ background: `${accent}15`, color: accent }}>
              <span className="text-lg font-black tabular-nums">{formatTrustScore(pick.trust_score)}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">{t.trustScore}</span>
            </div>

            {sample && (
              <blockquote className="border-l-4 pl-3 mb-4 italic" style={{ borderColor: accent }}>
                <p className="text-sm leading-relaxed line-clamp-3">&ldquo;{sample.text}&rdquo;</p>
                <footer className="text-[10px] text-[var(--muted)] mt-1">— {sample.author || t.verifiedReviewer}</footer>
              </blockquote>
            )}

            {topTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {topTopics.map((t) => (
                  <span key={t.topic} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {t.topic.replace(/_/g, " ")} × {t.count}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[11px] text-[var(--muted)] mb-3 leading-relaxed">
              <strong className="text-[var(--fg)]">{t.whyClinic}</strong> {t.whyBody}
            </p>

            <a
              href={`/clinic/${pick.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold hover:shadow-md hover:-translate-y-0.5 transition-all"
              style={{ background: accent }}
            >
              {t.seeProfile} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
