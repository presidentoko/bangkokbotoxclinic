import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { trustScore } from "@/lib/trust-score";

// Same zero-JS expand/collapse pattern as components/Faq.tsx: a native
// <details>/<summary> element needs no client component. The whole
// score+label line is the toggle target — no separate "how is this
// calculated?" prompt text needed, matching how Faq.tsx uses the question
// itself as the summary.
export function TrustScoreDetail({
  place,
  lang,
}: {
  place: Pick<Place, "rating" | "reviewCount" | "serviceThemes" | "moodKeywords">;
  lang: Lang;
}) {
  const t = tFor(lang);
  const result = trustScore(place);
  return (
    <details className="group rounded-xl border border-border bg-bg-elev p-4 mb-6">
      <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-4">
        <span>
          {t.trustScore.title}: <span className="text-accent">{result.score}</span>{" "}
          <span className="text-muted font-medium">{t.trustScore[result.label]}</span>
        </span>
        <span className="shrink-0 text-muted transition-transform group-open:rotate-45 text-lg leading-none" aria-hidden="true">
          +
        </span>
      </summary>
      <ul className="text-sm text-muted leading-relaxed mt-3 space-y-1">
        <li>
          {t.trustScore.breakdownRating}: {result.breakdown.ratingPoints}/50
        </li>
        <li>
          {t.trustScore.breakdownVolume}: {result.breakdown.volumePoints}/35
        </li>
        <li>
          {t.trustScore.breakdownDiversity}: {result.breakdown.diversityPoints}/15
        </li>
      </ul>
      <p className="text-xs text-muted leading-relaxed mt-3 pt-3 border-t border-border">{t.trustScore.explainer}</p>
    </details>
  );
}
