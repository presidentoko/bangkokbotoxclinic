import { getClinicInsights, type ClinicAspect } from "@/lib/clinicInsights";

/**
 * "What N reviews add up to" — the positive side that ReviewSignals (complaints
 * only) does not show. Counts across every review we collected, by keyword, in
 * English and Thai. Only aspects with 5+ mentions; numbers only, no quotes.
 * This is information neither the Google listing nor any other directory has.
 */

const MIN_MENTIONS = 5;

const COPY = {
  en: {
    title: (n: number) => `What ${n.toLocaleString("en")} reviews add up to`,
    lede: "Our own count across every review we collected for this clinic — share of mentions that are positive.",
    mentions: (n: number) => `${n} mentions`,
    aspects: {
      painless: "Little or no pain", explanation: "Explains treatment clearly", staff: "Staff attitude",
      cleanliness: "Cleanliness", value: "Fair pricing", english: "English communication",
    } as Record<ClinicAspect, string>,
    method: "Counted by keyword in English and Thai reviews; a mention preceded by a negation (\"not painful\") counts the other way. Shown only with 5+ mentions.",
  },
  th: {
    title: (n: number) => `สรุปจากรีวิว ${n.toLocaleString("th")} รายการ`,
    lede: "เรานับจากรีวิวทั้งหมดที่เก็บได้ของคลินิกนี้ — สัดส่วนการกล่าวถึงเชิงบวก",
    mentions: (n: number) => `กล่าวถึง ${n} ครั้ง`,
    aspects: {
      painless: "ไม่ค่อยเจ็บ", explanation: "อธิบายการรักษาชัดเจน", staff: "ท่าทีพนักงาน",
      cleanliness: "ความสะอาด", value: "ราคาเหมาะสม", english: "สื่อสารภาษาอังกฤษ",
    } as Record<ClinicAspect, string>,
    method: "นับจากคีย์เวิร์ดในรีวิวภาษาอังกฤษและไทย แสดงเฉพาะหัวข้อที่ถูกกล่าวถึง 5 ครั้งขึ้นไป",
  },
  ko: {
    title: (n: number) => `리뷰 ${n.toLocaleString("ko")}건을 모아 보면`,
    lede: "이 클리닉에서 수집한 리뷰 전부를 직접 집계한 긍정 언급 비율입니다.",
    mentions: (n: number) => `언급 ${n}건`,
    aspects: {
      painless: "통증 적음", explanation: "치료 설명 친절", staff: "직원 태도",
      cleanliness: "청결", value: "가격 적정", english: "영어 소통",
    } as Record<ClinicAspect, string>,
    method: "영어·태국어 리뷰에서 키워드로 집계했습니다. 언급이 5건 이상인 항목만 보여 줍니다.",
  },
};

export function ClinicInsights({ clinicId, lang = "en" }: { clinicId: string; lang?: "en" | "th" | "ko" }) {
  const ins = getClinicInsights(clinicId);
  if (!ins) return null;
  const t = COPY[lang] ?? COPY.en;
  const rows = (Object.keys(t.aspects) as ClinicAspect[])
    .map((k) => ({ k, ...ins.aspects[k], total: ins.aspects[k].pos + ins.aspects[k].neg }))
    .filter((r) => r.total >= MIN_MENTIONS)
    .sort((a, b) => b.total - a.total);
  if (rows.length === 0) return null;

  return (
    <section className="bg-white border border-[var(--border)] rounded-xl p-5">
      <h2 className="text-lg font-bold mb-1">📊 {t.title(ins.analysed)}</h2>
      <p className="text-xs text-[var(--muted)] mb-4">{t.lede}</p>
      <ul className="space-y-2.5">
        {rows.map((r) => {
          const pct = Math.round((100 * r.pos) / r.total);
          return (
            <li key={r.k}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{t.aspects[r.k]}</span>
                <span className="tabular-nums">
                  <strong>{pct}%</strong> <span className="text-xs text-[var(--muted)]">· {t.mentions(r.total)}</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden mt-1" aria-hidden="true">
                <div
                  className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-600" : pct >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] text-[var(--muted)] leading-relaxed">{t.method}</p>
    </section>
  );
}
