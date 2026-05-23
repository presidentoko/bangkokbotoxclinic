// LLM 생성 양국어 요약 표시 — /clinic/[id] header 직하.
// 데이터 출처: wiki_generator/summary_generator.py → web/data/wiki_summaries/<id>.json
// SEO: 양국어 모두 본문에 노출 → 양 언어 keyword 색인.
import type { WikiSummary } from "@/lib/wiki";

export function WikiSummaryCard({ summary }: { summary: WikiSummary }) {
  return (
    <section
      className="bg-gradient-to-br from-slate-50 to-blue-50 border border-[var(--border)] rounded-xl p-5"
      aria-label="Clinic summary"
    >
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span aria-hidden>📝</span>
          About this clinic
        </h2>
        <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
          AI-generated · data-verified
        </span>
      </div>

      {/* English summary — default visible. AEO/LLM 인용 친화적 */}
      {summary.summary_en && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
            English
          </div>
          <p className="text-sm leading-relaxed text-[var(--fg)]">{summary.summary_en}</p>
        </div>
      )}

      {/* Thai summary — TH 사용자 노출 + Google 태국어 색인 */}
      {summary.summary_th && (
        <div lang="th">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
            ภาษาไทย
          </div>
          <p className="text-sm leading-relaxed text-[var(--fg)]">{summary.summary_th}</p>
        </div>
      )}

      <p className="mt-3 text-[10px] text-[var(--muted)]">
        Auto-generated from Google reviews, HDmall pricing, and Pantip discussions ·{" "}
        {new Date(summary.generated_at).toLocaleDateString("en-CA")}
      </p>
    </section>
  );
}
