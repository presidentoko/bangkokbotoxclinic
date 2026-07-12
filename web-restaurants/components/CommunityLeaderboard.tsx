"use client";
import { useEffect, useState } from "react";

type Ranked = { id: string; name: string; flags: number };

export function CommunityLeaderboard() {
  const [ranked, setRanked] = useState<Ranked[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Sitewide leaderboard, not limited to whatever candidate list a page
    // happens to pass in — any restaurant can surface here once flagged.
    fetch(`/api/community?leaderboard=1&limit=5`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.ok) return;
        setRanked(data.leaderboard ?? []);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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
