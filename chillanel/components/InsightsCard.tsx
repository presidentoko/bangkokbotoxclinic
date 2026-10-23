// chillanel 자체 분석 카드 (2026-10-23). 가게의 **수집된 리뷰 전부**를
// scripts/extract-insights.mjs 로 집계한 숫자만 보여준다 — 리뷰 원문 없음.
// 구글 지도에는 없는 정보: 항목별 만족도, 팁 요구 신고, 최근 6개월 추세,
// 리뷰어 신뢰도, 리뷰 언어 분포. 서버 컴포넌트, JS 0.
import type { Lang } from "@/lib/site";
import { localeFor } from "@/lib/site";
import type { AspectKey, Place } from "@/lib/types";

// 한쪽(좋다/나쁘다)으로 이만큼은 언급돼야 비율을 보여준다 — 2건 중 1건 불만 =
// "만족도 50%" 같은 표본 착시를 막는다.
const MIN_MENTIONS = 5;

const COPY: Record<Lang, {
  title: string; lede: string; mentions: string; aspects: Record<AspectKey, string>;
  tipNone: string; tipSome: string; trendTitle: string; trendUp: string; trendDown: string; trendSteady: string;
  guides: string; langs: string; langNames: Record<string, string>; method: string;
}> = {
  en: {
    title: "What {n} reviews add up to",
    lede: "chillanel's own count across every review we collected for this place — not a star average.",
    mentions: "{n} mentions",
    aspects: { cleanliness: "Cleanliness", value: "Value for money", staff: "Staff attitude", skill: "Therapist skill", pressure: "Pressure handled well", english: "English communication" },
    tipNone: "No reviewer reported being pushed for a tip.",
    tipSome: "{n} reviewers reported being pushed for a tip.",
    trendTitle: "Last 6 months",
    trendUp: "★{recent} from {rn} recent reviews, up from ★{before} before — improving.",
    trendDown: "★{recent} from {rn} recent reviews, down from ★{before} before — slipping.",
    trendSteady: "★{recent} from {rn} recent reviews, in line with ★{before} before.",
    guides: "{pct}% of reviewers are Google Local Guides.",
    langs: "Reviews written in",
    langNames: { ko: "Korean", ja: "Japanese", zh: "Chinese", th: "Thai", ru: "Russian" },
    method: "Share of mentions that are positive, counted by keyword across all reviews; shown only with 5+ mentions.",
  },
  th: {
    title: "สรุปจากรีวิว {n} รายการ",
    lede: "chillanel นับจากรีวิวทั้งหมดที่เก็บได้ของร้านนี้ — ไม่ใช่แค่ค่าเฉลี่ยดาว",
    mentions: "กล่าวถึง {n} ครั้ง",
    aspects: { cleanliness: "ความสะอาด", value: "ความคุ้มค่า", staff: "ท่าทีพนักงาน", skill: "ฝีมือหมอนวด", pressure: "น้ำหนักมือพอดี", english: "สื่อสารภาษาอังกฤษ" },
    tipNone: "ไม่มีผู้รีวิวรายงานว่าถูกเร่งให้ทิป",
    tipSome: "มีผู้รีวิว {n} รายรายงานว่าถูกเร่งให้ทิป",
    trendTitle: "6 เดือนล่าสุด",
    trendUp: "★{recent} จากรีวิวล่าสุด {rn} รายการ เพิ่มจาก ★{before} — ดีขึ้น",
    trendDown: "★{recent} จากรีวิวล่าสุด {rn} รายการ ลดจาก ★{before} — แย่ลง",
    trendSteady: "★{recent} จากรีวิวล่าสุด {rn} รายการ ใกล้เคียง ★{before} ก่อนหน้า",
    guides: "ผู้รีวิว {pct}% เป็น Google Local Guide",
    langs: "รีวิวที่เขียนเป็นภาษา",
    langNames: { ko: "เกาหลี", ja: "ญี่ปุ่น", zh: "จีน", th: "ไทย", ru: "รัสเซีย" },
    method: "สัดส่วนการกล่าวถึงเชิงบวก นับจากคีย์เวิร์ดในรีวิวทั้งหมด แสดงเมื่อมีการกล่าวถึง 5 ครั้งขึ้นไป",
  },
  ko: {
    title: "리뷰 {n}건을 모아 보면",
    lede: "이 가게에서 수집한 리뷰 전부를 chillanel이 직접 집계한 결과입니다 — 별점 평균이 아닙니다.",
    mentions: "언급 {n}건",
    aspects: { cleanliness: "청결", value: "가성비", staff: "직원 태도", skill: "마사지사 실력", pressure: "압 조절", english: "영어 소통" },
    tipNone: "팁을 강요받았다는 리뷰가 없습니다.",
    tipSome: "팁을 강요받았다는 리뷰가 {n}건 있습니다.",
    trendTitle: "최근 6개월",
    trendUp: "최근 리뷰 {rn}건 평균 ★{recent}, 이전 ★{before}보다 좋아지는 중입니다.",
    trendDown: "최근 리뷰 {rn}건 평균 ★{recent}, 이전 ★{before}보다 나빠지는 중입니다.",
    trendSteady: "최근 리뷰 {rn}건 평균 ★{recent}, 이전(★{before})과 비슷합니다.",
    guides: "리뷰어의 {pct}%가 구글 로컬가이드입니다.",
    langs: "작성 언어",
    langNames: { ko: "한국어", ja: "일본어", zh: "중국어", th: "태국어", ru: "러시아어" },
    method: "전체 리뷰에서 키워드로 센 긍정 언급 비율입니다. 언급이 5건 이상인 항목만 보여 줍니다.",
  },
};

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

export default function InsightsCard({ place, lang }: { place: Place; lang: Lang }) {
  const ins = place.insights;
  if (!ins || ins.withText < 10) return null;
  const t = COPY[lang] ?? COPY.en;
  const loc = localeFor(lang);

  const aspects = (Object.keys(t.aspects) as AspectKey[])
    .map((k) => ({ k, ...ins.aspects[k], total: ins.aspects[k].pos + ins.aspects[k].neg }))
    .filter((a) => a.total >= MIN_MENTIONS)
    .sort((a, b) => b.total - a.total);
  const trend = ins.trend;
  const delta = trend ? trend.recentAvg - trend.beforeAvg : 0;
  const langs = Object.entries(ins.languages).filter(([, n]) => (n ?? 0) >= 3).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  if (aspects.length === 0 && !trend) return null;

  return (
    <section className="rounded-2xl border border-border bg-bg-elev p-4 sm:p-5 mb-8">
      <h2 className="font-bold text-lg mb-1">📊 {fill(t.title, { n: ins.analysed.toLocaleString(loc) })}</h2>
      <p className="text-xs text-muted mb-4">{t.lede}</p>

      {aspects.length > 0 && (
        <ul className="space-y-2.5 mb-4">
          {aspects.map((a) => {
            const pct = Math.round((100 * a.pos) / a.total);
            return (
              <li key={a.k}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium">{t.aspects[a.k]}</span>
                  <span className="tabular-nums">
                    <strong>{pct}%</strong>{" "}
                    <span className="text-xs text-muted">· {fill(t.mentions, { n: a.total })}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-border/60 overflow-hidden mt-1" aria-hidden="true">
                  <div
                    className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-600" : pct >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ul className="text-sm space-y-1.5">
        {ins.withText >= 30 && (
          <li>{ins.tipPressure >= 2 ? `⚠️ ${fill(t.tipSome, { n: ins.tipPressure })}` : `✓ ${t.tipNone}`}</li>
        )}
        {trend && (
          <li>
            <span className="font-medium">{t.trendTitle}:</span>{" "}
            {fill(delta >= 0.3 ? t.trendUp : delta <= -0.3 ? t.trendDown : t.trendSteady, {
              recent: trend.recentAvg.toFixed(1), rn: trend.recentN, before: trend.beforeAvg.toFixed(1),
            })}
          </li>
        )}
        {ins.reviewers && <li>{fill(t.guides, { pct: ins.reviewers.localGuidePct })}</li>}
        {langs.length > 0 && (
          <li>
            {t.langs}: {langs.map(([l, n]) => `${t.langNames[l] ?? l} ${n}`).join(" · ")}
          </li>
        )}
      </ul>
      <p className="mt-3 text-[11px] text-muted leading-relaxed">{t.method}</p>
    </section>
  );
}
