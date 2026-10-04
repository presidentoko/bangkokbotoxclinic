// 덴탈 허브의 "숫자로 답하는 FAQ" (2026-10-03).
//
// 왜: AI 답변 엔진(ChatGPT 검색·Perplexity)과 구글 요약이 인용하는 건 "숫자가
// 들어간 짧은 답"이다. 기존 CATEGORY_FAQS 는 사람이 쓴 일반론이라 어느 디렉터리에도
// 있을 법한 문장이었다. 여기 답은 전부 master_db 에서 **계산**한다 — 하드코딩
// 숫자는 곧 거짓이 된다(thaifacial 의 "230 클리닉"이 그랬다, site-claims-drift).
//
// 원칙:
// - 계산할 수 없는 건 묻지도 답하지도 않는다(표본 미달 가격, 데이터 없는 주차 등).
// - 개별 클리닉을 부정적으로 지목하지 않는다. 불만 유형은 집계만 낸다.
// - 긍정 목록(사회보장 확인·주말 진료)에만 클리닉 이름을 넣는다 — 인용될 때 근거가
//   되는 고유명사다.
import type { Clinic } from "@/lib/types";

type Band = { n: number; p25: number; median: number; p75: number };
export type FactLang = "en" | "th";
export type Fact = { q: string; a: string; names?: { id: string; name: string }[] };

const PROC: Record<string, Record<FactLang, string>> = {
  clean: { en: "cleaning (scaling)", th: "ขูดหินปูน" },
  filling: { en: "a filling", th: "อุดฟัน" },
  extract: { en: "an extraction", th: "ถอนฟัน" },
  braces: { en: "braces (monthly adjustment)", th: "จัดฟัน (ค่าปรับลวดรายเดือน)" },
  whiten: { en: "whitening", th: "ฟอกสีฟัน" },
};

const SIGNAL: Record<string, Record<FactLang, string>> = {
  billing: { en: "unexpected charges", th: "ค่าใช้จ่ายเกินที่แจ้ง" },
  upsell: { en: "pressure to buy extra treatment", th: "ถูกเชียร์ให้ทำเพิ่ม" },
  redo: { en: "work that had to be redone", th: "ต้องกลับไปแก้งาน" },
  pain: { en: "pain or rough handling", th: "เจ็บ/ทำแรง" },
  wait: { en: "long waits", th: "รอนาน" },
};

const baht = (n: number) => `฿${Math.round(n).toLocaleString("en-US")}`;
// display_name 은 원본 상호가 잘려 괄호가 안 닫힌 채 오기도 한다("…แจ้งวัฒนะ ( ทำฟัน").
// 첫 괄호·구분자 앞까지만 쓴다.
const nameOf = (c: Clinic) => {
  const raw = (c as unknown as { display_name?: string }).display_name || c.name;
  return raw.split(/\s[(|｜\-–]\s?|\s?\(/)[0].trim() || raw;
};

// categories 의 "dental" 은 오염돼 있다(실측: 고깃집 "SURA Korean BBQ" 가 붙어 있었다).
// 덴탈 판정은 primary_type 으로 한다 — 메모 gsc-404-are-intentional 의 기준과 같다.
const DENTAL_TYPE = /dent|orthodont/i;

function topBy(list: Clinic[], k = 5): Clinic[] {
  return [...list].sort((a, b) => b.trust_score - a.trust_score).slice(0, k);
}

export function dentalFacts(
  clinics: Clinic[],
  bands: Record<string, Band> | undefined,
  lang: FactLang,
): Fact[] {
  const bkk = clinics.filter((c) => {
    const x = c as unknown as { city_slug?: string; primary_type?: string };
    return x.city_slug === "bangkok" && DENTAL_TYPE.test(x.primary_type ?? "");
  });
  const n = bkk.length;
  if (n < 20) return [];
  const facts: Fact[] = [];
  const th = lang === "th";

  // 1) 가격 — 리뷰 실측 밴드가 있는 시술만
  const priced = Object.entries(bands ?? {})
    .filter(([k, b]) => PROC[k] && b.n >= 12)
    .sort((a, b) => b[1].n - a[1].n);
  if (priced.length) {
    const parts = priced.map(([k, b]) =>
      th
        ? `${PROC[k].th} ราคากลาง ${baht(b.median)} (ช่วงส่วนใหญ่ ${baht(b.p25)}–${baht(b.p75)}, จาก ${b.n} รีวิว)`
        : `${PROC[k].en}: median ${baht(b.median)} (most paid ${baht(b.p25)}–${baht(b.p75)}; ${b.n} reviews)`,
    );
    facts.push(th
      ? { q: "ทำฟันในกรุงเทพฯ ราคาเท่าไหร่?",
          a: `จากรีวิว Google ที่คนไข้ระบุราคาที่จ่ายจริง: ${parts.join(" · ")}. งานที่ไม่อยู่ในรายการ (เช่น รากเทียม วีเนียร์) มีคนระบุราคาน้อยเกินไปที่จะสรุปได้ ควรขอใบเสนอราคาเป็นลายลักษณ์อักษร` }
      : { q: "How much does a dentist cost in Bangkok?",
          a: `From Google reviews where patients state what they paid: ${parts.join(" · ")}. Implants and veneers are not listed because too few patients state a price to give a reliable figure — ask for a written quote.` });
  }

  // 2) 사회보장 — 확인된 곳
  const sso = bkk.filter((c) => (c as unknown as { social_security?: { confirmed?: boolean } }).social_security?.confirmed);
  if (sso.length >= 5) {
    const top = topBy(sso);
    facts.push({
      ...(th
        ? { q: "คลินิกทำฟันที่ใช้สิทธิประกันสังคมได้ในกรุงเทพฯ มีที่ไหนบ้าง?",
            a: `มี ${sso.length} จาก ${n.toLocaleString()} คลินิก ที่คนไข้อย่างน้อย 2 คนเล่าในรีวิวว่าใช้สิทธิประกันสังคมได้ และไม่มีใครบอกว่าใช้ไม่ได้ คะแนนสูงสุด: ${top.map(nameOf).join(", ")}. คลินิกอื่นอาจรับได้แต่ไม่มีใครพูดถึง ควรโทรถามก่อน` }
        : { q: "Which Bangkok dental clinics accept Thai social security?",
            a: `${sso.length} of ${n.toLocaleString()} clinics have at least two patients describing using their social security (ประกันสังคม) benefit there and none reporting a refusal. Highest rated: ${top.map(nameOf).join(", ")}. Others may accept it too — nobody mentioned it — so call to confirm.` }),
      names: top.map((c) => ({ id: c.url_slug ?? c.id, name: nameOf(c) })),
    });
  }

  // 3) 주말 진료 — 뺐다(2026-10-03). 실측 1,602/1,636(98%)이 "주말 영업"이라 변별력이
  //    없고, days_open 4 인데 open_weekend 인 사례가 있어 값 자체를 믿기 어렵다.

  // 4) 불만 유형 — 집계만, 이름 없음
  const sig: Record<string, number> = {};
  let withSignals = 0;
  for (const c of bkk) {
    const s = (c as unknown as { review_signals?: { key: string }[] }).review_signals;
    if (!s?.length) continue;
    withSignals++;
    for (const k of new Set(s.map((x) => x.key))) sig[k] = (sig[k] ?? 0) + 1;
  }
  const ranked = Object.entries(sig).filter(([k]) => SIGNAL[k]).sort((a, b) => b[1] - a[1]);
  if (withSignals >= 20 && ranked.length) {
    const parts = ranked.map(([k, v]) => (th ? `${SIGNAL[k].th} ${v} คลินิก` : `${SIGNAL[k].en} (${v} clinics)`));
    facts.push(th
      ? { q: "คนไข้ทำฟันในกรุงเทพฯ บ่นเรื่องอะไรมากที่สุด?",
          a: `จากรีวิว 1–3 ดาวของ ${withSignals} คลินิก: ${parts.join(" · ")}. หน้าของแต่ละคลินิกแสดงรีวิวต้นฉบับ` }
      : { q: "What do patients complain about most at Bangkok dental clinics?",
          a: `Across 1–3 star reviews at ${withSignals} clinics: ${parts.join(" · ")}. Each clinic's page quotes the original review.` });
  }

  // 5) 구별 분포
  const dist: Record<string, number> = {};
  for (const c of bkk) {
    const d = (c as unknown as { district?: string }).district;
    if (d) dist[d] = (dist[d] ?? 0) + 1;
  }
  const topD = Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (topD.length >= 3) {
    const parts = topD.map(([d, v]) => `${d} (${v})`);
    facts.push(th
      ? { q: "ย่านไหนในกรุงเทพฯ และปริมณฑล มีคลินิกทำฟันมากที่สุด?", a: `${parts.join(", ")} — จากทั้งหมด ${n.toLocaleString()} คลินิกที่เราจัดอันดับ` }
      : { q: "Which districts in the Bangkok area have the most dental clinics?", a: `${parts.join(", ")} — out of ${n.toLocaleString()} clinics we rank.` });
  }

  return facts;
}
