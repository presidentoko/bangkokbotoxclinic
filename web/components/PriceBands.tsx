import type { Lang } from "@/lib/i18n";

// 도시 단위 시술별 가격대 (2026-09-23).
//
// 왜 도시 단위인가: 처음엔 클리닉마다 "예상 가격"을 붙이려 했다. 그런데 리뷰
// 원문 1,190건을 직접 읽어보니 한 곳당 금액 표본이 0~1건이고, 스케일링 ฿900 과
// 독감주사 ฿550, "1500밧 이상 사면 키홀더 증정" 이 한 덩어리로 섞여 있었다.
// 그걸 평균내서 "이 치과 ฿500~1,800" 이라고 쓰면 임플란트를 찾는 사람에게
// 거짓말이 된다. 구 단위도 시도했지만 n>=5 를 넘는 구가 하나도 없었다.
//
// 도시 단위로 묶고 금액 주변에 시술어가 있을 때만 채택하니 비로소 말이 되는
// 표본이 나왔다(방콕 스케일링 n=209). 이건 경쟁 디렉터리 어디에도 없는 숫자다 —
// 병원이 내건 정가가 아니라 환자가 실제로 냈다고 적은 금액이기 때문.
//
// 표시 규칙: 표본 12건 미만이거나 사분위 범위가 6배를 넘는 조합은 빌드 단계에서
// 이미 빠져 있다(build_master_db.py 의 build_price_bands). 여기서는 온 것만 그린다.

export type PriceBand = { n: number; p25: number; median: number; p75: number };
export type PriceBands = Record<string, PriceBand>;

const LABELS: Record<string, { en: string; th: string }> = {
  clean: { en: "Scaling / cleaning", th: "ขูดหินปูน" },
  filling: { en: "Filling", th: "อุดฟัน" },
  extract: { en: "Extraction", th: "ถอนฟัน" },
  braces: { en: "Braces / retainer", th: "จัดฟัน / รีเทนเนอร์" },
  root: { en: "Root canal", th: "รักษารากฟัน" },
  whiten: { en: "Whitening", th: "ฟอกสีฟัน" },
  implant: { en: "Implant", th: "รากฟันเทียม" },
  veneer: { en: "Veneer", th: "วีเนียร์" },
};

const T = {
  en: {
    head: (city: string) => `What people report paying in ${city}`,
    sub: "Amounts patients mentioned in their own Google reviews — not clinic list prices. Each row shows the middle half of reports, so a quarter paid less and a quarter paid more.",
    proc: "Treatment",
    range: "Most people paid",
    typical: "Typical",
    reports: "Reports",
    note: "Only treatments with at least 12 reports are shown. Your quote depends on the clinic, the materials and how much work you need — treat these as a sanity check, not a quote.",
  },
  th: {
    head: (city: string) => `คนไข้ใน${city}จ่ายกันเท่าไหร่`,
    sub: "ยอดที่คนไข้ระบุไว้ในรีวิว Google ของตัวเอง ไม่ใช่ราคาป้ายของคลินิก แต่ละแถวคือช่วงกลาง ๆ ของรายงานทั้งหมด",
    proc: "การรักษา",
    range: "ส่วนใหญ่จ่าย",
    typical: "ค่ากลาง",
    reports: "จำนวนรีวิว",
    note: "แสดงเฉพาะรายการที่มีรีวิวอย่างน้อย 12 ครั้ง ราคาจริงขึ้นกับคลินิก วัสดุ และปริมาณงาน ใช้เป็นตัวเทียบคร่าว ๆ ไม่ใช่ใบเสนอราคา",
  },
} as const;

export function PriceBands({
  bands, cityLabel, lang = "en",
}: { bands: PriceBands | undefined; cityLabel: string; lang?: Lang }) {
  if (!bands) return null;
  const rows = Object.entries(bands).filter(([proc]) => LABELS[proc]);
  if (rows.length === 0) return null;
  const t = T[lang === "th" ? "th" : "en"];
  const baht = (n: number) => `฿${n.toLocaleString()}`;

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-1">{t.head(cityLabel)}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">{t.sub}</p>
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm border-collapse min-w-[460px]">
          <thead>
            <tr className="text-left border-b border-gray-300 dark:border-gray-700">
              <th className="py-2 pr-3 font-semibold">{t.proc}</th>
              <th className="py-2 px-3 font-semibold whitespace-nowrap">{t.range}</th>
              <th className="py-2 px-3 font-semibold whitespace-nowrap">{t.typical}</th>
              <th className="py-2 pl-3 font-semibold whitespace-nowrap text-right">{t.reports}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([proc, b]) => (
              <tr key={proc} className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-2 pr-3">{LABELS[proc][lang === "th" ? "th" : "en"]}</td>
                <td className="py-2 px-3 whitespace-nowrap tabular-nums">
                  {baht(b.p25)} – {baht(b.p75)}
                </td>
                <td className="py-2 px-3 whitespace-nowrap tabular-nums font-medium">{baht(b.median)}</td>
                <td className="py-2 pl-3 whitespace-nowrap tabular-nums text-right text-gray-500">{b.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2 max-w-2xl">{t.note}</p>
    </section>
  );
}
