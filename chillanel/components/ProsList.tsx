import type { Lang } from "@/lib/site";
import type { ThemeCount } from "@/lib/types";
import { themeLabel } from "@/lib/theme-labels";

// Reframes the top mood keywords (already sorted desc by mention count in
// build-data.mjs) as an explicit "why reviewers like it" bullet list —
// mood keywords are all positive-framed by design (see MOOD_KEYWORDS in
// extract-themes.mjs: Clean, Quiet & relaxing, Good value, etc.), so this
// needs no separate sentiment filtering. Deliberately Pros-only, no Cons:
// there's no negative-sentiment mining in the pipeline, so a Cons list
// isn't honestly buildable from real data yet.
export function ProsList({ items, lang, max = 4 }: { items: ThemeCount[]; lang: Lang; max?: number }) {
  const top = items.slice(0, max);
  if (top.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5 mb-6">
      {top.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-sm">
          <span
            className="flex items-center justify-center w-4 h-4 rounded-full bg-accent/15 text-accent text-[10px] font-bold shrink-0"
            aria-hidden="true"
          >
            ✓
          </span>
          <span>{themeLabel(item.label, lang)}</span>
        </li>
      ))}
    </ul>
  );
}
