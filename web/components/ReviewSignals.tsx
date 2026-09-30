import type { Clinic } from "@/lib/types";

// 리뷰가 실제로 말하는 것 (2026-09-30).
//
// 이 사이트가 2026-08-18 스팸 업데이트에 강등된 이유는 클리닉 1,825곳이
// 같은 템플릿에 숫자만 바뀐 모양이었기 때문이다 — TrustDonut·RatingChart·
// RelativeRanking 이 전부 별점에서 파생된 값이라, 페이지마다 고유한 게 없었다.
// 리뷰 원문은 93%가 수집돼 있는데 쓰지 않고 있었다.
//
// 여기서 보여주는 건 전부 환자가 직접 쓴 문장이다. 우리 판단은 안 넣는다 —
// 치과는 실명 업체 대상 YMYL 이라 "이 병원은 별로다" 같은 말을 할 자리가 아니고,
// 건수와 원문만 두면 읽는 사람이 판단한다. 구글 비즈니스 프로필에도 없는
// 정보라, 업체명 검색에서 지도팩과 차별화되는 유일한 축이기도 하다.
//
// 커버리지: 불만 신호는 라이브 1,825곳 중 231곳(13%)에만 있다. 나머지는
// 평점 추세(100% 보유)를 보여준다 — "최근 리뷰가 예전보다 나쁘다"는 별점
// 평균이 감추는 정보다.

const LABEL: Record<string, { en: string; th: string }> = {
  billing: { en: "Unexpected charges", th: "ค่าใช้จ่ายที่ไม่ได้แจ้งล่วงหน้า" },
  upsell: { en: "Pushed extra treatment", th: "เสนอขายการรักษาเพิ่ม" },
  redo: { en: "Work had to be redone", th: "ต้องทำซ้ำ" },
  pain: { en: "Painful / heavy-handed", th: "เจ็บ / มือหนัก" },
  wait: { en: "Long wait", th: "รอนาน" },
};

type Signal = { key: string; count: number; quote: string; quote_rating: number };
type Trend = { recent?: { count: number; avg: number }; old?: { count: number; avg: number }; trend?: string };

const T = {
  en: {
    head: "What reviewers raised",
    sub: (n: number) => `Points that came up in the ${n} reviews we read. Quoted from the lowest-rated review mentioning each.`,
    mentions: (n: number) => (n === 1 ? "1 review" : `${n} reviews`),
    none: "No recurring complaints surfaced in the reviews we read.",
    trendDown: (a: number, b: number, n: number) =>
      `Recent reviews average ★${a.toFixed(1)}, down from ★${b.toFixed(1)} earlier — based on ${n} recent reviews.`,
    trendUp: (a: number, b: number, n: number) =>
      `Recent reviews average ★${a.toFixed(1)}, up from ★${b.toFixed(1)} earlier — based on ${n} recent reviews.`,
    note: "Complaints are counted only from reviews rated 3★ or below, and only where the wording is unambiguous. A clinic with none listed is not certified problem-free — it means nothing recurring showed up in what we read.",
  },
  th: {
    head: "สิ่งที่ผู้รีวิวพูดถึง",
    sub: (n: number) => `ประเด็นที่พบในรีวิว ${n} รายการที่เราอ่าน ยกมาจากรีวิวที่ให้คะแนนต่ำสุดในแต่ละหัวข้อ`,
    mentions: (n: number) => `${n} รีวิว`,
    none: "ไม่พบข้อร้องเรียนที่เกิดซ้ำในรีวิวที่เราอ่าน",
    trendDown: (a: number, b: number, n: number) =>
      `รีวิวล่าสุดเฉลี่ย ★${a.toFixed(1)} ลดลงจาก ★${b.toFixed(1)} ก่อนหน้า (จาก ${n} รีวิวล่าสุด)`,
    trendUp: (a: number, b: number, n: number) =>
      `รีวิวล่าสุดเฉลี่ย ★${a.toFixed(1)} เพิ่มขึ้นจาก ★${b.toFixed(1)} ก่อนหน้า (จาก ${n} รีวิวล่าสุด)`,
    note: "นับเฉพาะรีวิว 3 ดาวหรือต่ำกว่า และเฉพาะกรณีที่ข้อความชัดเจน คลินิกที่ไม่มีรายการไม่ได้แปลว่าไม่มีปัญหา",
  },
} as const;

export function ReviewSignals({ clinic, lang = "en" }: { clinic: Clinic; lang?: "en" | "th" }) {
  const c = clinic as unknown as {
    review_signals?: Signal[];
    rating_trend?: Trend;
    scraped_review_count?: number;
  };
  const sigs = (c.review_signals || []).filter((s) => LABEL[s.key]);
  const tr = c.rating_trend;
  const read = c.scraped_review_count || 0;
  const t = T[lang === "th" ? "th" : "en"];

  // 추세는 양쪽 표본이 있어야 말이 된다. 0.3★ 미만 차이는 노이즈로 본다.
  const ra = tr?.recent?.avg, oa = tr?.old?.avg, rc = tr?.recent?.count ?? 0;
  const moved =
    ra != null && oa != null && rc >= 5 && Math.abs(ra - oa) >= 0.3
      ? (ra < oa ? t.trendDown(ra, oa, rc) : t.trendUp(ra, oa, rc))
      : null;

  if (sigs.length === 0 && !moved) return null;
  if (read < 5) return null;

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-1">{t.head}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.sub(read)}</p>

      {moved && (
        <p className="text-sm mb-4 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2">
          {moved}
        </p>
      )}

      {sigs.length > 0 ? (
        <ul className="space-y-3">
          {sigs.map((s) => (
            <li key={s.key} className="border-l-2 border-gray-300 dark:border-gray-700 pl-3">
              <div className="text-sm font-semibold">
                {LABEL[s.key][lang === "th" ? "th" : "en"]}{" "}
                <span className="font-normal text-gray-500">· {t.mentions(s.count)}</span>
              </div>
              <blockquote className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                “{s.quote}”{" "}
                <span className="whitespace-nowrap text-gray-500">— ★{s.quote_rating}</span>
              </blockquote>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">{t.none}</p>
      )}

      <p className="text-xs text-gray-500 mt-3 max-w-2xl">{t.note}</p>
    </section>
  );
}
