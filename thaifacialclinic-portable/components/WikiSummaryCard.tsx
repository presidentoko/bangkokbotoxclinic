// LLM-generated bilingual summary — shown above-fold on /clinic/[slug] for SEO + UX.
// Hair site supports 5 langs but wiki data is EN+TH only:
//  - lang=th  → TH primary, EN secondary
//  - lang=en/ko/zh/ar → EN primary, TH secondary

import type { WikiSummary } from "@/lib/wiki";
import type { Lang } from "@/lib/types";

const LABELS: Record<Lang, { heading: string; caption: string; primary: string; secondary: string; attribution: string }> = {
  en: { heading: "About this clinic",            caption: "AI-generated · data-verified",     primary: "English",   secondary: "ภาษาไทย",  attribution: "Generated from Google reviews, Bookimed pricing, Pantip + Reddit + Naver discussions" },
  th: { heading: "เกี่ยวกับคลินิกนี้",            caption: "AI สร้าง · ข้อมูลตรวจสอบแล้ว",       primary: "ภาษาไทย",   secondary: "English",   attribution: "สร้างจาก Google รีวิว ราคา Bookimed และการสนทนาบน Pantip/Reddit/Naver" },
  ko: { heading: "클리닉 정보",                   caption: "AI 생성 · 데이터 검증",              primary: "English",   secondary: "ภาษาไทย",  attribution: "Google 리뷰, Bookimed 가격, Pantip/Reddit/Naver 통합 분석으로 생성" },
  zh: { heading: "关于这家诊所",                  caption: "AI 生成 · 数据验证",                primary: "English",   secondary: "ภาษาไทย",  attribution: "基于 Google 评论、Bookimed 价格、Pantip/Reddit/Naver 讨论生成" },
  ar: { heading: "حول هذه العيادة",               caption: "تم إنشاؤه بالذكاء الاصطناعي",        primary: "English",   secondary: "ภาษาไทย",  attribution: "تم إنشاؤه من مراجعات Google وأسعار Bookimed ونقاشات Pantip/Reddit/Naver" },
};

export default function WikiSummaryCard({
  summary,
  lang = "en",
}: {
  summary: WikiSummary;
  lang?: Lang;
}) {
  const L = LABELS[lang] || LABELS.en;
  const primaryText   = lang === "th" ? summary.summary_th : summary.summary_en;
  const secondaryText = lang === "th" ? summary.summary_en : summary.summary_th;
  const primaryLang   = lang === "th" ? "th" : "en";
  const secondaryLang = lang === "th" ? "en" : "th";

  return (
    <section
      className="rounded-2xl border bg-gradient-to-br from-cream-50 to-gold-50 dark:from-navy-900/40 dark:to-gold-950/20 p-5"
      style={{ borderColor: "rgb(var(--border))" }}
      aria-label="Clinic summary"
    >
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <h2 className="font-display text-lg font-bold tracking-tighter-display flex items-center gap-2">
          <span aria-hidden>📝</span>
          {L.heading}
        </h2>
        <span className="text-[10px] muted uppercase tracking-wider">
          {L.caption}
        </span>
      </div>

      {primaryText && (
        <div className="mb-4" lang={primaryLang}>
          <div className="text-[10px] uppercase tracking-widest font-bold muted mb-1">
            {L.primary}
          </div>
          <p className="text-sm leading-relaxed">{primaryText}</p>
        </div>
      )}

      {secondaryText && (
        <div lang={secondaryLang}>
          <div className="text-[10px] uppercase tracking-widest font-bold muted mb-1">
            {L.secondary}
          </div>
          <p className="text-sm leading-relaxed">{secondaryText}</p>
        </div>
      )}

      <p className="mt-3 text-[10px] muted">
        {L.attribution} · {new Date(summary.generated_at).toLocaleDateString("en-CA")}
      </p>
    </section>
  );
}
