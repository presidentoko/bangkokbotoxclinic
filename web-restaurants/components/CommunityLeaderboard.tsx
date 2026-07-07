"use client";
import { useEffect, useState } from "react";

type Candidate = { id: string; name: string };
type Ranked = Candidate & { flags: number };

export function CommunityLeaderboard({ candidates }: { candidates: Candidate[] }) {
  const [ranked, setRanked] = useState<Ranked[] | null>(null);

  useEffect(() => {
    const ids = candidates.map((c) => c.id);
    if (ids.length === 0) return;
    let cancelled = false;
    fetch(`/api/community?ids=${ids.map(encodeURIComponent).join(",")}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.counts) return;
        const withFlags = candidates
          .map((c) => ({ ...c, flags: data.counts[c.id]?.flags ?? 0 }))
          .filter((c) => c.flags > 0)
          .sort((a, b) => b.flags - a.flags)
          .slice(0, 5);
        setRanked(withFlags);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [candidates]);

  if (!ranked || ranked.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Flag data is accumulating. Hit 🚩 on any restaurant card to report suspected SNS inflation.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {ranked.map((r, i) => (
        <li key={r.id}>
          <a
            href={`/restaurant/${r.id}`}
            className="flex items-center justify-between gap-3 text-sm hover:text-[var(--accent)] transition"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-[var(--muted)] tabular-nums">#{i + 1}</span>
              <span className="truncate">{r.name}</span>
            </span>
            <span className="shrink-0 text-red-500 font-medium">🚩 {r.flags}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
