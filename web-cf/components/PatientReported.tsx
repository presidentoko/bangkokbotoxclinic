import type { Clinic } from "@/lib/types";

// 환자가 리뷰에 직접 적은 사실 — 사회보장 사용 여부, 실제 낸 가격 (2026-10-15).
//
// 왜 페이지 맨 위인가: 이 두 가지는 구글 비즈니스 프로필·다른 디렉터리 어디에도
// 없는, 이 사이트만 가진 정보다. 8/18 스팸 업데이트 강등의 이유가 "숫자만 바뀐
// 템플릿"이었으니 페이지마다 실제로 다른 사실을 첫 화면에 둔다. 지금까지 이
// 데이터는 허브 FAQ(lib/dentalFacts.ts)에만 집계로 나왔다.
//
// 원칙 (dentalFacts 와 같다):
// - 리뷰에 없는 건 말하지 않는다. 블록 자체가 안 뜬다.
// - 사회보장 "확인"은 빌더 기준 그대로 — 2명 이상이 썼다고 했고 반대 증언 0.
//   1명이면 "언급됨, 전화로 확인"으로 낮춰 말한다.
// - 가격은 도시 가격대(price_bands, n>=12)가 있는 시술만. 임플란트·비니어는
//   선금·부분결제가 섞여 숫자가 거짓말을 한다(빌더 _BAND_MAX_SPREAD 주석).
type Band = { n: number; p25: number; median: number; p75: number };
type Lang = "en" | "th";

const PROC: Record<string, Record<Lang, string>> = {
  clean: { en: "Cleaning", th: "ขูดหินปูน" },
  filling: { en: "Filling", th: "อุดฟัน" },
  extract: { en: "Extraction", th: "ถอนฟัน" },
  braces: { en: "Braces (monthly)", th: "จัดฟัน (รายเดือน)" },
  whiten: { en: "Whitening", th: "ฟอกสีฟัน" },
};

const baht = (n: number) => `฿${Math.round(n).toLocaleString("en-US")}`;

const T = {
  en: {
    head: "What patients reported",
    sub: "Taken from what patients wrote in their Google reviews of this clinic.",
    ssoYes: (n: number) => `Social security (ประกันสังคม) accepted — ${n} patients describe using it here, none report a refusal.`,
    ssoOne: "One patient mentions using social security (ประกันสังคม) here — call to confirm before you go.",
    ssoNo: (n: number) => `${n === 1 ? "A patient reports" : `${n} patients report`} social security (ประกันสังคม) was not accepted — call to confirm.`,
    paid: "Prices patients said they paid",
    vs: (m: string, city: string) => `${city} median ${m}`,
    note: "Single reviews can be out of date or describe a special case. Ask the clinic for a written quote.",
  },
  th: {
    head: "สิ่งที่คนไข้เล่าในรีวิว",
    sub: "จากสิ่งที่คนไข้เขียนไว้ในรีวิว Google ของคลินิกนี้",
    ssoYes: (n: number) => `ใช้สิทธิประกันสังคมได้ — คนไข้ ${n} คนเล่าว่าใช้สิทธิที่นี่ ไม่มีใครบอกว่าใช้ไม่ได้`,
    ssoOne: "มีคนไข้ 1 คนเล่าว่าใช้สิทธิประกันสังคมที่นี่ ควรโทรถามก่อนไป",
    ssoNo: (n: number) => `คนไข้ ${n} คนบอกว่าใช้สิทธิประกันสังคมไม่ได้ ควรโทรถามก่อน`,
    paid: "ราคาที่คนไข้บอกว่าจ่ายจริง",
    vs: (m: string, city: string) => `ราคากลาง${city} ${m}`,
    note: "รีวิวเดียวอาจเก่าหรือเป็นกรณีพิเศษ ควรขอใบเสนอราคาจากคลินิก",
  },
} as const;

const CITY: Record<string, Record<Lang, string>> = {
  bangkok: { en: "Bangkok", th: "กรุงเทพฯ" },
  phuket: { en: "Phuket", th: "ภูเก็ต" },
  "chiang-mai": { en: "Chiang Mai", th: "เชียงใหม่" },
  pattaya: { en: "Pattaya", th: "พัทยา" },
};

export function PatientReported({
  clinic,
  bands,
  lang = "en",
}: {
  clinic: Clinic;
  bands?: Record<string, Record<string, Band>>;
  lang?: Lang;
}) {
  const c = clinic as unknown as {
    city_slug?: string;
    social_security?: { pos?: number; neg?: number; confirmed?: boolean };
    price_points?: { proc: string; amt: number }[];
  };
  const t = T[lang];
  const city = c.city_slug ?? "";
  const cityBands = bands?.[city] ?? {};
  const cityName = CITY[city]?.[lang] ?? "";

  const ss = c.social_security;
  let sso: string | null = null;
  if (ss?.neg) sso = t.ssoNo(ss.neg);
  else if (ss?.confirmed && ss.pos) sso = t.ssoYes(ss.pos);
  else if (ss?.pos === 1) sso = t.ssoOne;

  // 시술별 하나로 묶는다 — 같은 시술 여러 건이면 범위로.
  const byProc: Record<string, number[]> = {};
  for (const p of c.price_points ?? []) {
    if (!PROC[p.proc] || !cityBands[p.proc]) continue;
    (byProc[p.proc] ??= []).push(p.amt);
  }
  const prices = Object.entries(byProc).map(([k, amts]) => {
    const lo = Math.min(...amts), hi = Math.max(...amts);
    return {
      key: k,
      label: PROC[k][lang],
      value: lo === hi ? baht(lo) : `${baht(lo)}–${baht(hi)}`,
      n: amts.length,
      median: cityBands[k].median,
    };
  });

  if (!sso && prices.length === 0) return null;

  return (
    <section className="mb-6 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-4">
      <h2 className="text-lg font-bold">{t.head}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t.sub}</p>

      {sso && (
        <p className={`text-[15px] mb-3 ${ss?.neg ? "text-orange-800 dark:text-orange-300" : ""}`}>
          <span aria-hidden className="mr-1.5">{ss?.neg ? "⚠" : ss?.confirmed ? "✓" : "•"}</span>
          {sso}
        </p>
      )}

      {prices.length > 0 && (
        <div>
          <div className="text-sm font-semibold mb-1">{t.paid}</div>
          <ul className="space-y-1">
            {prices.map((p) => (
              <li key={p.key} className="text-[15px] tabular-nums">
                {p.label}: <span className="font-semibold">{p.value}</span>
                {cityName && (
                  <span className="text-gray-500 text-sm"> · {t.vs(baht(p.median), cityName)}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-2">{t.note}</p>
        </div>
      )}
    </section>
  );
}
