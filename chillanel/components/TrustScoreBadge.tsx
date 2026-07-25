import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { trustScore } from "@/lib/trust-score";

export function TrustScoreBadge({
  place,
  lang,
}: {
  place: Pick<Place, "rating" | "reviewCount" | "serviceThemes" | "moodKeywords">;
  lang: Lang;
}) {
  const t = tFor(lang);
  const result = trustScore(place);
  return (
    <div
      className="flex items-center gap-1 rounded-full bg-bg-elev border border-border shadow-sm text-sm font-bold px-2.5 py-1"
      title={`${t.trustScore.title}: ${result.score}`}
      aria-label={`${t.trustScore.title}: ${result.score} ${t.trustScore[result.label]}`}
    >
      <span className="text-accent">{result.score}</span>
      <span className="text-muted text-xs font-medium">{t.trustScore[result.label]}</span>
    </div>
  );
}
