import type { IngredientAnalysis } from "@/lib/types";
export function IngredientDecoder({ analysis, concern, locale }:
  { analysis: IngredientAnalysis[]; concern: string; locale: "th" | "en" }) {
  if (!analysis.length) return <p className="text-sm text-gray-500">{locale==="th"?"ไม่มีข้อมูลส่วนผสม":"No ingredient data"}</p>;
  return (
    <ul className="space-y-1 text-sm">
      {analysis.map((a) => (
        <li key={a.inci} className="flex flex-wrap gap-2">
          <span className="font-medium">{a.inci}</span>
          {a.concern_efficacy[concern] > 0 && <span className="text-green-700">★{a.concern_efficacy[concern]}</span>}
          {a.safety_flags.map((f) => <span key={f} className="text-amber-700">⚠{f}</span>)}
        </li>
      ))}
    </ul>
  );
}
