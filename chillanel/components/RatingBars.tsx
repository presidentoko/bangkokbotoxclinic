import type { RatingDistribution } from "@/lib/types";

const STARS = [5, 4, 3, 2, 1] as const;

export function RatingBars({
  distribution,
  size = "default",
}: {
  distribution: RatingDistribution;
  size?: "compact" | "default";
}) {
  const total = STARS.reduce((sum, star) => sum + distribution[star], 0);
  if (total === 0) return null;
  const compact = size === "compact";

  return (
    <div className={`flex flex-col gap-1 ${compact ? "w-28" : "w-full max-w-xs"}`}>
      {STARS.map((star) => {
        const count = distribution[star];
        const pct = (count / total) * 100;
        return (
          <div key={star} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 text-muted tabular-nums shrink-0">{star}</span>
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-accent-warm rounded-full" style={{ width: `${pct}%` }} />
            </div>
            {!compact && <span className="w-6 text-right text-muted tabular-nums shrink-0">{count}</span>}
          </div>
        );
      })}
    </div>
  );
}
