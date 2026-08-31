"use client";

import { useState } from "react";
import type { FamousVsGoodEntry, CollectionThresholds } from "@/lib/famous-vs-good";
import type { Restaurant } from "@/lib/types";
import { ComparisonCard } from "@/components/ComparisonCard";

const INITIAL_SHOW = 20;

type Tab = "biggest_gaps" | "holds_up" | "in_between" | "hidden_gems";

function HiddenGemCard({ r, rank }: { r: Restaurant; rank: number }) {
  return (
    <article className="bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--muted)]">#{rank}</span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700">
          Hidden gem
        </span>
      </div>
      <h3 className="font-bold text-base mb-1">{r.name}</h3>
      {r.district && <p className="text-xs text-[var(--muted)] mb-3">📍 {r.district}</p>}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-black tabular-nums leading-none" style={{ color: "#16a34a" }}>
          {Math.round(r.trust_score)}
        </span>
        <span className="text-xs text-[var(--muted)]">Trust Score</span>
      </div>
      <p className="text-xs text-[var(--muted)] mb-3">
        {r.total_reviews.toLocaleString()} reviews · ★{r.rating.toFixed(1)}
      </p>
      <p className="text-xs text-[var(--muted)] italic mb-3">Not on your feed. But the data says it&apos;s good.</p>
      <div className="flex gap-2 flex-wrap">
        <a
          href={`/restaurant/${r.id}`}
          className="flex-1 min-w-[100px] text-center text-xs font-bold bg-[#ea580c] text-white px-3 py-2 rounded-lg hover:opacity-90 transition"
        >
          View data →
        </a>
        <a
          href={r.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[100px] text-center text-xs font-medium border border-[var(--border)] bg-white px-3 py-2 rounded-lg hover:border-gray-400 transition"
        >
          Maps ↗
        </a>
      </div>
    </article>
  );
}

function ShowMore({
  shown,
  total,
  onShow,
}: {
  shown: number;
  total: number;
  onShow: () => void;
}) {
  if (shown >= total) return null;
  const remaining = total - shown;
  return (
    <div className="mt-6 text-center col-span-full">
      <button
        onClick={onShow}
        className="px-6 py-2.5 border border-[var(--border)] bg-white rounded-xl text-sm font-medium hover:border-gray-400 transition"
      >
        Show {Math.min(remaining, INITIAL_SHOW)} more
        <span className="ml-1.5 text-[var(--muted)]">({remaining} remaining)</span>
      </button>
    </div>
  );
}

export function GapList({
  entries,
  hiddenGems,
  thresholds,
  hiddenGemThreshold = 85,
}: {
  entries: FamousVsGoodEntry[];
  hiddenGems: Restaurant[];
  thresholds: CollectionThresholds;
  hiddenGemThreshold?: number;
}) {
  const [tab, setTab] = useState<Tab>("biggest_gaps");
  const [shownGaps, setShownGaps] = useState(INITIAL_SHOW);
  const [shownHolds, setShownHolds] = useState(INITIAL_SHOW);
  const [shownBetween, setShownBetween] = useState(INITIAL_SHOW);
  const [shownGems, setShownGems] = useState(INITIAL_SHOW);

  const matched = entries.filter((e) => e.restaurant !== null);
  // Must match the page's own headline/FAQ stat exactly (both derive from
  // trust_score < thresholds.bigGapThreshold) — mixing in "decent" here
  // made the tab badge disagree with the page's own quoted numbers.
  const bigGaps = [...matched]
    .filter((e) => e.gap === "big_gap")
    .sort((a, b) => a.restaurant!.trust_score - b.restaurant!.trust_score);
  const holdsUp = matched
    .filter((e) => e.gap === "holds_up")
    .sort((a, b) => b.restaurant!.trust_score - a.restaurant!.trust_score);
  // Everything between the two thresholds had no tab at all, so it appeared
  // nowhere: 18 of 36 venues on one collection, 11 of 21 on another. The page
  // counted them in its headline stat and then never showed them.
  const inBetween = matched
    .filter((e) => e.gap === "decent")
    .sort((a, b) => b.restaurant!.trust_score - a.restaurant!.trust_score);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "biggest_gaps", label: "Biggest gaps", count: bigGaps.length },
    { id: "holds_up", label: "Hype that holds up", count: holdsUp.length },
    { id: "in_between", label: "In between", count: inBetween.length },
    { id: "hidden_gems", label: "Hidden gems", count: hiddenGems.length },
  ];

  return (
    <section>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 bg-[var(--border)] rounded-xl w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.id
                ? "bg-white text-[var(--fg)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs tabular-nums text-[var(--muted)]">
              ({t.count})
            </span>
          </button>
        ))}
      </div>

      {/* Every panel is rendered and hidden with an attribute rather than
          swapped in and out of the tree. Conditional rendering left only the
          active tab in the prerendered HTML, so a collection of 36 venues
          shipped 5 of them to a crawler and hid the rest behind a click. */}
      <div hidden={tab !== "biggest_gaps"}>
        <div className="grid gap-4 sm:grid-cols-2">
          {bigGaps.length === 0 ? (
            <div className="col-span-2 bg-white border border-[var(--border)] rounded-xl p-6 text-center">
              <p className="text-[var(--muted)] mb-1">
                No credibility gaps in this collection — yet.
              </p>
              <p className="text-xs text-[var(--muted)]">
                With {matched.length} venues, all score above {Math.round(thresholds.bigGapThreshold)}.
              </p>
            </div>
          ) : (
            <>
              {bigGaps.slice(0, shownGaps).map((e, i) => (
                <ComparisonCard key={e.seed.name} entry={e} rank={i + 1} />
              ))}
              <ShowMore
                shown={shownGaps}
                total={bigGaps.length}
                onShow={() => setShownGaps((n) => n + INITIAL_SHOW)}
              />
            </>
          )}
        </div>
      </div>

      <div hidden={tab !== "holds_up"}>
        <div className="grid gap-4 sm:grid-cols-2">
          {holdsUp.length === 0 ? (
            <p className="text-[var(--muted)] col-span-2">No &quot;holds up&quot; entries found.</p>
          ) : (
            <>
              {holdsUp.slice(0, shownHolds).map((e, i) => (
                <ComparisonCard key={e.seed.name} entry={e} rank={i + 1} />
              ))}
              <ShowMore
                shown={shownHolds}
                total={holdsUp.length}
                onShow={() => setShownHolds((n) => n + INITIAL_SHOW)}
              />
            </>
          )}
        </div>
      </div>

      <div hidden={tab !== "in_between"}>
        <p className="text-sm text-[var(--muted)] mb-4">
          Neither a let-down nor a standout. These score between{" "}
          {Math.round(thresholds.bigGapThreshold)} and{" "}
          {Math.round(thresholds.holdsUpThreshold)} — good enough to be worth your
          time, not so good that the queue is the point.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {inBetween.length === 0 ? (
            <p className="text-[var(--muted)] col-span-2">Nothing lands in between here.</p>
          ) : (
            <>
              {inBetween.slice(0, shownBetween).map((e, i) => (
                <ComparisonCard key={e.seed.name} entry={e} rank={i + 1} />
              ))}
              <ShowMore
                shown={shownBetween}
                total={inBetween.length}
                onShow={() => setShownBetween((n) => n + INITIAL_SHOW)}
              />
            </>
          )}
        </div>
      </div>

      <div hidden={tab !== "hidden_gems"}>
        <div>
          <p className="text-sm text-[var(--muted)] mb-4">
            These score {hiddenGemThreshold}+ on Trust Score but rarely appear on your social feed.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hiddenGems.length === 0 ? (
              <p className="text-[var(--muted)] col-span-3">No hidden gems found.</p>
            ) : (
              <>
                {hiddenGems.slice(0, shownGems).map((r, i) => (
                  <HiddenGemCard key={r.id} r={r} rank={i + 1} />
                ))}
                <ShowMore
                  shown={shownGems}
                  total={hiddenGems.length}
                  onShow={() => setShownGems((n) => n + INITIAL_SHOW)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
