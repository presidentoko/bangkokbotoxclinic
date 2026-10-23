// place.insights 를 문장으로 — 메타 설명·FAQ 에 들어가는 "이 가게에만 있는" 숫자 문장.
// 구글 검색 결과 스니펫에 별점·주소 대신 우리 집계가 나가게 하는 게 목적이다.
import type { Lang } from "./site";
import type { AspectKey, Place } from "./types";

const ASPECT_NAMES: Record<Lang, Record<AspectKey, string>> = {
  en: { cleanliness: "cleanliness", value: "value for money", staff: "friendly staff", skill: "skilled therapists", pressure: "well-judged pressure", english: "English communication" },
  th: { cleanliness: "ความสะอาด", value: "ความคุ้มค่า", staff: "พนักงานเป็นมิตร", skill: "ฝีมือหมอนวด", pressure: "น้ำหนักมือพอดี", english: "การสื่อสารภาษาอังกฤษ" },
  ko: { cleanliness: "청결", value: "가성비", staff: "친절한 직원", skill: "마사지사 실력", pressure: "압 조절", english: "영어 소통" },
};

const MIN = 8;

/** 언급 8건 이상·긍정 80% 이상 항목, 언급 많은 순. */
export function praisedAspects(place: Place): { key: AspectKey; pct: number; n: number }[] {
  const a = place.insights?.aspects;
  if (!a) return [];
  return (Object.keys(a) as AspectKey[])
    .map((key) => ({ key, n: a[key].pos + a[key].neg, pos: a[key].pos }))
    .filter((x) => x.n >= MIN && x.pos / x.n >= 0.8)
    .sort((x, y) => y.n - x.n)
    .map((x) => ({ key: x.key, n: x.n, pct: Math.round((100 * x.pos) / x.n) }));
}

/** 한 문장 요약: "Reviewers praise its cleanliness (94% of 52 mentions) and skilled therapists (91% of 40)." */
export function insightSentence(place: Place, lang: Lang): string | null {
  const top = praisedAspects(place).slice(0, 2);
  const tip = place.insights && place.insights.withText >= 30 && place.insights.tipPressure >= 2 ? place.insights.tipPressure : 0;
  if (top.length === 0 && !tip) return null;
  const names = ASPECT_NAMES[lang];
  const parts: string[] = [];
  if (top.length) {
    if (lang === "ko") {
      parts.push(`리뷰 분석: ${top.map((x) => `${names[x.key]} 긍정 ${x.pct}%(언급 ${x.n}건)`).join(", ")}.`);
    } else if (lang === "th") {
      parts.push(`วิเคราะห์รีวิว: ${top.map((x) => `${names[x.key]} เชิงบวก ${x.pct}% (${x.n} ครั้ง)`).join(", ")}`);
    } else {
      const [a, b] = top;
      parts.push(`Reviewers praise its ${names[a.key]} (${a.pct}% of ${a.n} mentions)${b ? ` and ${names[b.key]} (${b.pct}% of ${b.n})` : ""}.`);
    }
  }
  if (tip) {
    parts.push(lang === "ko" ? `팁 강요 신고 ${tip}건.` : lang === "th" ? `มีรายงานถูกเร่งให้ทิป ${tip} ครั้ง` : `${tip} reviewers reported tip pressure.`);
  }
  return parts.join(" ");
}

/** FAQ 한 쌍: "What do reviewers say about X?" — 항목별 숫자로 답한다. */
export function insightFaq(place: Place, lang: Lang): { q: string; a: string } | null {
  const all = praisedAspects(place);
  const ins = place.insights;
  if (!ins || all.length === 0) return null;
  const names = ASPECT_NAMES[lang];
  const list = all.map((x) => (lang === "en" ? `${names[x.key]} ${x.pct}% positive (${x.n} mentions)` : lang === "th" ? `${names[x.key]} เชิงบวก ${x.pct}% (${x.n} ครั้ง)` : `${names[x.key]} 긍정 ${x.pct}%(언급 ${x.n}건)`)).join(", ");
  const tipLine = ins.withText >= 30
    ? ins.tipPressure >= 2
      ? (lang === "ko" ? ` 팁을 강요받았다는 리뷰가 ${ins.tipPressure}건 있습니다.` : lang === "th" ? ` มีรีวิว ${ins.tipPressure} รายการรายงานว่าถูกเร่งให้ทิป` : ` ${ins.tipPressure} reviews report being pushed for a tip.`)
      : (lang === "ko" ? " 팁을 강요받았다는 리뷰는 없습니다." : lang === "th" ? " ไม่มีรีวิวที่รายงานว่าถูกเร่งให้ทิป" : " No review reports being pushed for a tip.")
    : "";
  if (lang === "ko") return { q: `${place.name} 리뷰 평가는 어떤가요?`, a: `리뷰 ${ins.analysed}건을 chillanel이 집계한 결과: ${list}.${tipLine}` };
  if (lang === "th") return { q: `รีวิวของ ${place.name} พูดถึงอะไรบ้าง?`, a: `chillanel นับจากรีวิว ${ins.analysed} รายการ: ${list}${tipLine}` };
  return { q: `What do reviewers say about ${place.name}?`, a: `Across ${ins.analysed} reviews counted by chillanel: ${list}.${tipLine}` };
}
