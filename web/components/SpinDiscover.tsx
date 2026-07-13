"use client";
// SpinDiscover — Top N 중 랜덤 클리닉 reveal. 사용자가 SPIN 클릭 → 슬롯 머신처럼
// 이름이 빠르게 돌다가 한 개로 멈춤 → 카드 등장. 다시 spin 가능.
// 머무는 시간 ↑ + serendipity discovery. 모든 사용자 다른 결과.

import { useState, useEffect, useRef } from "react";
import { formatTrustScore } from "@/lib/utils";

type Mini = {
  id: string;
  name: string;
  district: string;
  rating: number;
  trust_score: number;
  total_reviews: number;
  photo?: string; // optional thumb url
};

type Lang = "en" | "ko" | "th";

const COPY: Record<Lang, {
  eyebrow: string; heading: string; sub: string; spinsSoFar: string;
  spinningLabel: string; idlePrompt: string; pickedNow: string; reviews: string; trust: string;
  spin: string; spinAgain: string; spinning: string; seeProfile: string; seenOf: string;
}> = {
  en: {
    eyebrow: "🎰 Discover · don't scroll, spin", heading: "Pick me a clinic",
    sub: "Random Top-50 reveal. Click again for another — no two spins repeat until you've seen them all.",
    spinsSoFar: "spins so far", spinningLabel: "spinning...", idlePrompt: "Press the button and meet a clinic you might have missed.",
    pickedNow: "✨ Picked just now", reviews: "reviews", trust: "Trust",
    spin: "🎲 Spin", spinAgain: "🎲 Spin again", spinning: "Spinning...", seeProfile: "See full profile →",
    seenOf: "spins — you've seen {n} of {total}.",
  },
  ko: {
    eyebrow: "🎰 랜덤 발견 · 스크롤 대신 돌려보세요", heading: "클리닉 뽑기",
    sub: "TOP 50 중 무작위 공개. 다시 클릭하면 다른 곳 — 다 볼 때까지 중복 없음.",
    spinsSoFar: "회 돌림", spinningLabel: "돌아가는 중...", idlePrompt: "버튼을 눌러 놓쳤을 수도 있는 클리닉을 만나보세요.",
    pickedNow: "✨ 방금 선택됨", reviews: "리뷰", trust: "신뢰도",
    spin: "🎲 돌리기", spinAgain: "🎲 다시 돌리기", spinning: "돌아가는 중...", seeProfile: "전체 프로필 보기 →",
    seenOf: "회 돌림 — {total}곳 중 {n}곳 확인.",
  },
  th: {
    eyebrow: "🎰 ค้นพบ · หมุนแทนการเลื่อน", heading: "สุ่มคลินิกให้ฉัน",
    sub: "สุ่มเปิดจาก TOP 50 กดอีกครั้งเพื่อดูอันใหม่ — ไม่ซ้ำจนกว่าจะเห็นครบทุกที่",
    spinsSoFar: "ครั้งที่หมุนแล้ว", spinningLabel: "กำลังหมุน...", idlePrompt: "กดปุ่มเพื่อพบคลินิกที่คุณอาจพลาดไป",
    pickedNow: "✨ เพิ่งถูกเลือก", reviews: "รีวิว", trust: "ความน่าเชื่อถือ",
    spin: "🎲 หมุน", spinAgain: "🎲 หมุนอีกครั้ง", spinning: "กำลังหมุน...", seeProfile: "ดูโปรไฟล์เต็ม →",
    seenOf: "ครั้ง — คุณเห็นแล้ว {n} จาก {total}",
  },
};

export function SpinDiscover({
  pool,
  accent = "#2563eb",
  lang = "en",
}: {
  pool: Mini[];
  accent?: string;
  lang?: Lang;
}) {
  const t = COPY[lang] ?? COPY.en;
  const [phase, setPhase] = useState<"idle" | "spinning" | "revealed">("idle");
  const [current, setCurrent] = useState<Mini | null>(null);
  const [tick, setTick] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0); // 사용자가 SPIN 몇 번 했는지
  const seenIdsRef = useRef<Set<string>>(new Set());
  const tickerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, []);

  function spin() {
    if (phase === "spinning" || pool.length === 0) return;
    setPhase("spinning");
    let i = 0;
    tickerRef.current = setInterval(() => {
      setTick(i++);
    }, 70);
    // 2-3초 후 멈춤
    const duration = 1800 + Math.random() * 800;
    setTimeout(() => {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      // 아직 안 본 것 우선 (없으면 그냥 랜덤)
      let candidates = pool.filter((c) => !seenIdsRef.current.has(c.id));
      if (candidates.length === 0) candidates = pool;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      seenIdsRef.current.add(pick.id);
      setCurrent(pick);
      setRevealedCount((n) => n + 1);
      setPhase("revealed");
    }, duration);
  }

  // 슬롯 ticker 현재 표시 (spin 중)
  const tickerName = phase === "spinning"
    ? pool[tick % pool.length]?.name ?? ""
    : "";

  return (
    <section className="my-10 relative">
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden border-2"
        style={{ borderColor: `${accent}40`, background: `linear-gradient(135deg, ${accent}08, ${accent}15)` }}
      >
        {/* deco circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: accent }} />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10 pointer-events-none" style={{ background: accent }} />

        <div className="relative flex items-baseline justify-between gap-3 flex-wrap mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: accent }}>
              {t.eyebrow}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              {t.heading}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              {t.sub}
            </p>
          </div>
          {revealedCount > 0 && (
            <div className="text-right">
              <div className="text-2xl font-black tabular-nums" style={{ color: accent }}>
                {revealedCount}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">{t.spinsSoFar}</div>
            </div>
          )}
        </div>

        {/* Reveal area */}
        <div className="relative min-h-[140px]">
          {phase === "idle" && !current && (
            <div className="bg-white rounded-xl border border-dashed border-[var(--border)] p-8 flex flex-col items-center gap-3 text-center">
              <div className="text-4xl">🎰</div>
              <p className="text-sm text-[var(--muted)]">{t.idlePrompt}</p>
            </div>
          )}

          {phase === "spinning" && (
            <div className="bg-white rounded-xl border border-[var(--border)] p-5 md:p-6 shadow-sm">
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">{t.spinningLabel}</div>
              <div className="text-base md:text-xl font-bold truncate transition-all" style={{ color: accent }} title={tickerName}>
                {tickerName || "—"}
              </div>
              <div className="mt-3 h-1 rounded-full overflow-hidden bg-gray-100">
                <div className="h-full animate-pulse" style={{ background: accent, width: "70%" }} />
              </div>
            </div>
          )}

          {phase === "revealed" && current && (
            <a
              href={`/clinic/${current.id}`}
              className="block bg-white rounded-xl border-2 p-4 md:p-5 shadow-md hover:shadow-xl transition-shadow group"
              style={{ borderColor: accent }}
            >
              <div className="flex items-start gap-3 md:gap-4">
                {current.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.photo}
                    alt={current.name}
                    loading="lazy"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg shrink-0 flex items-center justify-center text-2xl md:text-3xl"
                    style={{ background: `${accent}20` }}
                  >
                    🏥
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: accent }}>
                    {t.pickedNow}
                  </div>
                  <h3 className="font-bold text-base md:text-lg leading-tight mt-1 mb-1 group-hover:opacity-80 transition line-clamp-2">
                    {current.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2 text-[11px] md:text-xs text-[var(--muted)]">
                    <span>📍 {current.district || "—"}</span>
                    <span>·</span>
                    <span className="text-yellow-700 font-bold whitespace-nowrap">★ {current.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span className="whitespace-nowrap">{current.total_reviews.toLocaleString()} {t.reviews}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                       style={{
                         background: current.trust_score >= 75 ? "#dcfce7" : current.trust_score >= 60 ? "#fef9c3" : "#fee2e2",
                         color: current.trust_score >= 75 ? "#15803d" : current.trust_score >= 60 ? "#a16207" : "#b91c1c"
                       }}>
                    {t.trust} {formatTrustScore(current.trust_score)}
                  </div>
                </div>
              </div>
            </a>
          )}
        </div>

        {/* SPIN button */}
        <div className="relative mt-5 flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={spin}
            disabled={phase === "spinning"}
            className="px-7 py-3 rounded-full text-white text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: accent }}
          >
            {phase === "spinning" ? t.spinning : current ? t.spinAgain : t.spin}
          </button>
          {current && (
            <a
              href={`/clinic/${current.id}`}
              className="text-sm font-bold hover:underline"
              style={{ color: accent }}
            >
              {t.seeProfile}
            </a>
          )}
        </div>

        {revealedCount >= 5 && (
          <p className="relative text-[10px] text-center text-[var(--muted)] mt-4">
            🔥 {revealedCount} {t.seenOf
              .replace("{n}", String(Math.min(revealedCount, pool.length)))
              .replace("{total}", String(pool.length))}
          </p>
        )}
      </div>
    </section>
  );
}
