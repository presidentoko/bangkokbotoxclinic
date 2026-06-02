import type { IngredientAnalysis } from "@/lib/types";

export function IngredientDecoder({ analysis, concern, locale }:
  { analysis: IngredientAnalysis[]; concern: string; locale: "th" | "en" }) {
  if (!analysis.length) return (
    <p className="text-sm text-neutral-400 italic">
      {locale === "th" ? "ไม่มีข้อมูลส่วนผสม" : "No ingredient data available."}
    </p>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {analysis.map((a) => (
        <div
          key={a.inci}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs shadow-sm"
        >
          <span className="font-medium text-neutral-800">{a.inci}</span>
          {a.concern_efficacy[concern] > 0 && (
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              ★{a.concern_efficacy[concern]}
            </span>
          )}
          {a.safety_flags.map((f) => (
            <span key={f} className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
              ⚠ {f}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
