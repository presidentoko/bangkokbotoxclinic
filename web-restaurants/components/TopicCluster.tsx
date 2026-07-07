// Mentioned topics visual cluster — size/color scale with mention frequency.

import { TOPIC_LABELS } from "@/lib/types";

const POSITIVE = new Set([
  "fresh", "tasty", "authentic", "fast_service", "affordable", "good_portion",
  "english_menu", "halal_certified", "vegetarian_friendly", "kid_friendly",
  "good_atmosphere", "good_view", "live_music", "korean_friendly",
  "japanese_friendly", "michelin",
]);
const NEGATIVE = new Set(["long_wait", "expensive", "small_portion", "dirty", "long_lines", "tourist_trap"]);

export function TopicCluster({ topics }: { topics: { topic: string; count: number }[] }) {
  if (!topics.length) return null;
  const max = Math.max(...topics.map((t) => t.count));

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">
        What reviewers mention most
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {topics.map((t) => {
          const weight = 0.4 + (t.count / max) * 0.6;
          const isPos = POSITIVE.has(t.topic);
          const isNeg = NEGATIVE.has(t.topic);
          const bg = isNeg ? "#fff7ed" : isPos ? "#f0fdf4" : "#f8fafc";
          const fg = isNeg ? "#9a3412" : isPos ? "#166534" : "#334155";
          return (
            <span
              key={t.topic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium"
              style={{
                fontSize: `${0.75 + weight * 0.4}rem`,
                background: bg,
                color: fg,
                opacity: 0.6 + weight * 0.4,
              }}
            >
              {TOPIC_LABELS[t.topic] ?? t.topic}
              <span className="text-[10px] opacity-60 tabular-nums">×{t.count}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
