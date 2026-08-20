// LLM 생성 양국어 요약 표시 — /clinic/[id] header 직하.
// 데이터 출처: wiki_generator/summary_generator.py → web/data/wiki_summaries/<id>.json
// SEO: 양국어 모두 본문에 노출 → 양 언어 keyword 색인.
// lang prop 에 따라 primary 언어 결정 (TH 페이지에선 TH 우선, EN 페이지에선 EN 우선).
import type { WikiSummary } from "@/lib/wiki";

const LABELS = {
  en: { heading: "About this clinic", caption: "AI-generated · data-verified",
        primary: "English", secondary: "ภาษาไทย",
        attribution: "Auto-generated from Google reviews, HDmall pricing, and Pantip discussions" },
  th: { heading: "เกี่ยวกับคลินิกนี้", caption: "AI สร้าง · ข้อมูลตรวจสอบแล้ว",
        primary: "ภาษาไทย", secondary: "English",
        attribution: "สร้างจาก Google รีวิว ราคา HDmall และการสนทนาบน Pantip" },
};

export function WikiSummaryCard({
  summary,
  lang = "en",
}: {
  summary: WikiSummary;
  lang?: "en" | "th";
}) {
  const L = LABELS[lang];
  const primaryText = lang === "th" ? summary.summary_th : summary.summary_en;
  const secondaryText = lang === "th" ? summary.summary_en : summary.summary_th;
  const primaryLang = lang;
  const secondaryLang = lang === "th" ? "en" : "th";

  return (
    <section
      className="bg-gradient-to-br from-slate-50 to-blue-50 border border-[var(--border)] rounded-xl p-5"
      aria-label="Clinic summary"
    >
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span aria-hidden>📝</span>
          {L.heading}
        </h2>
        <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
          {L.caption}
        </span>
      </div>

      {/* Primary — 현재 페이지 언어 */}
      {primaryText && (
        <div className="mb-4" lang={primaryLang}>
          <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
            {L.primary}
          </div>
          <p className="text-sm leading-relaxed text-[var(--fg)]">{primaryText}</p>
        </div>
      )}

      {/* Secondary — 다른 언어 (양국어 색인 + 사용자 편의) */}
      {secondaryText && (
        <div lang={secondaryLang}>
          <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
            {L.secondary}
          </div>
          <p className="text-sm leading-relaxed text-[var(--fg)]">{secondaryText}</p>
        </div>
      )}

      <p className="mt-3 text-[10px] text-[var(--muted)]">
        {L.attribution} ·{" "}
        {new Date(summary.generated_at).toLocaleDateString("en-CA")}
      </p>
    </section>
  );
}
