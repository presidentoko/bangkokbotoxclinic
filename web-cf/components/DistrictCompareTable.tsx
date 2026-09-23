import Link from "next/link";
import type { Clinic } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

// 구별 허브 비교표 (2026-09-23).
//
// 왜: 이 사이트에서 실제로 먹히던 쿼리는 "คลินิกทำฟันใกล้ฉัน"(치과 near-me)
// 같은 지역 의도 검색이었는데, 허브가 클리닉 카드를 나열만 해서 "여러 곳을
// 한눈에 비교"라는 그 의도의 핵심을 못 채우고 있었다. 사회보장·영업시간·언어는
// 방문 전에 실제로 갈리는 조건이라, 이걸 한 표에 모으면 허브 자체가 목적지가
// 된다 (경쟁 디렉터리 대부분이 이름+별점만 보여준다).
//
// 데이터 출처는 전부 기존 수집분이다 — 새 스크래핑 없음:
//   사회보장 = 리뷰에서 ประกันสังคม 사용 증언 2건 이상(방콕 덴탈 94곳)
//   영업  = clinic_hours.csv 요약(hours, 덴탈 1,750곳)
//   영어  = language_breakdown 의 영어 리뷰 비율(30%+ 를 "영어 가능"으로)
// 값이 없는 칸은 "—" 로 비운다. 모르는 걸 지어내면 이 표의 존재 이유가 없다.
//
// 가격 칸은 뺐다(2026-09-23). 클리닉당 금액 표본이 0~1건이고 시술이 섞여 있어서
// 범위를 내면 스케일링 가격이 그 병원의 시술가처럼 읽힌다. 가격은 도시 단위로만
// 통계가 서므로 PriceBands 가 표 위에서 따로 보여준다.

function englishShare(c: Clinic): number | null {
  const lb = (c as unknown as { language_breakdown?: Record<string, number> }).language_breakdown;
  if (!lb) return null;
  const total = Object.values(lb).reduce((a, b) => a + (b || 0), 0);
  if (!total) return null;
  return (lb.en || 0) / total;
}

const T = {
  en: {
    head: "Compare clinics in this area",
    sub: "Hours and language come from Google listings and the reviews themselves.",
    clinic: "Clinic", rating: "Rating", hours: "Hours", english: "English",
    weekend: "Weekends", evening: "Open late", yes: "Yes", reviews: "reviews",
    sso: "Social security",
    note: "Open late = closes 7pm or later. English = 30%+ of reviews written in English. Social security = at least two patients described using their ประกันสังคม benefit here and nobody reported being refused. A dash means no reviewer mentioned it, which is not the same as refused — call the clinic to confirm either way.",
  },
  th: {
    head: "เปรียบเทียบคลินิกในย่านนี้",
    sub: "เวลาเปิดและภาษามาจากข้อมูล Google และตัวรีวิวเอง",
    clinic: "คลินิก", rating: "คะแนน", hours: "เวลาเปิด", english: "อังกฤษ",
    weekend: "เสาร์-อาทิตย์", evening: "เปิดถึงค่ำ", yes: "มี", reviews: "รีวิว",
    sso: "ประกันสังคม",
    note: "เปิดถึงค่ำ = ปิด 19:00 เป็นต้นไป · อังกฤษ = รีวิวภาษาอังกฤษ 30% ขึ้นไป · ประกันสังคม = มีคนไข้อย่างน้อย 2 คนเล่าว่าใช้สิทธิที่นี่ได้ และไม่มีใครบอกว่าใช้ไม่ได้ · เครื่องหมาย — แปลว่าไม่มีใครพูดถึง ไม่ได้แปลว่าใช้ไม่ได้ ควรโทรเช็กกับคลินิกก่อนไป",
  },
} as const;

export function DistrictCompareTable({
  clinics, lang = "en",
}: { clinics: Clinic[]; lang?: Lang }) {
  const t = T[lang === "th" ? "th" : "en"];
  const rows = clinics.slice(0, 20);
  if (rows.length < 3) return null; // 2곳 이하면 표가 비교가 아니다

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-1">{t.head}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.sub}</p>
      {/* 좁은 화면에서 표가 페이지를 가로로 밀지 않도록 자체 스크롤 */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm border-collapse min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-gray-300 dark:border-gray-700">
              <th className="py-2 pr-3 font-semibold">{t.clinic}</th>
              <th className="py-2 px-3 font-semibold whitespace-nowrap">{t.rating}</th>
              <th className="py-2 px-3 font-semibold whitespace-nowrap">{t.sso}</th>
              <th className="py-2 px-3 font-semibold whitespace-nowrap">{t.weekend}</th>
              <th className="py-2 px-3 font-semibold whitespace-nowrap">{t.evening}</th>
              <th className="py-2 pl-3 font-semibold whitespace-nowrap">{t.english}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const hours = (c as unknown as { hours?: { open_weekend?: boolean; open_evening?: boolean } }).hours;
              const sso = (c as unknown as { social_security?: { confirmed?: boolean } }).social_security;
              const en = englishShare(c);
              return (
                <tr key={c.id} className="border-b border-gray-200 dark:border-gray-800 align-top">
                  <td className="py-2 pr-3">
                    <Link
                      href={`${lang === "en" ? "" : `/${lang}`}/clinic/${c.id}`}
                      className="font-medium text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      {c.display_name || c.name}
                    </Link>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap tabular-nums">
                    ★{c.rating.toFixed(1)}{" "}
                    <span className="text-gray-500">({c.total_reviews.toLocaleString()})</span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{sso?.confirmed ? t.yes : "—"}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{hours?.open_weekend ? t.yes : "—"}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{hours?.open_evening ? t.yes : "—"}</td>
                  <td className="py-2 pl-3 whitespace-nowrap">
                    {en != null && en >= 0.3 ? `${Math.round(en * 100)}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">{t.note}</p>
    </section>
  );
}
