"use client";

import { useSyncExternalStore, useState } from "react";
import { plannerStore, CATEGORY_COLORS } from "@/lib/plan/store";
import type { PlanItem, TravelSegment } from "@/lib/plan/store";

const TRAVEL_ICON: Record<string, string> = {
  bts: "🚇",
  mrt: "🚇",
  walk: "🚶",
  grab: "🚗",
  estimate: "📍",
};

function SlotCard({ item, onRemove }: { item: PlanItem; onRemove: () => void }) {
  const colors = CATEGORY_COLORS[item.category];
  const scoreColor = item.localsScore >= 80 ? "#0F6E56" : item.localsScore >= 65 ? "#B45309" : "#991B1B";

  return (
    <div className="relative flex gap-3 bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      {/* Time */}
      {item.startTime && (
        <div className="text-xs font-black tabular-nums text-[var(--muted)] w-10 shrink-0 pt-0.5">
          {item.startTime}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Category chip */}
        <span
          className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
        >
          {item.category}
        </span>

        {/* Name + score */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <a
            href={`/en/place/${item.slug}`}
            className="font-black text-sm leading-tight hover:text-orange-700 transition truncate"
          >
            {item.name}
          </a>
          <span className="text-sm font-black shrink-0 tabular-nums" style={{ color: scoreColor }}>
            {item.localsScore}
          </span>
        </div>

        {/* Receipt one-liner */}
        {item.dataSays && (
          <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">{item.dataSays}</p>
        )}

        {/* Duration */}
        <div className="text-[10px] text-[var(--muted)] mt-1">{item.durationMin} min</div>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-400 text-xs flex items-center justify-center transition"
        aria-label="Remove"
      >
        ×
      </button>
    </div>
  );
}

function TravelChip({ segment }: { segment: TravelSegment }) {
  const icon = TRAVEL_ICON[segment.mode] ?? "📍";
  return (
    <div className="flex items-center gap-2 py-1.5 pl-12">
      <span className="text-base">{icon}</span>
      <span className="text-xs text-[var(--muted)]">{segment.label}</span>
    </div>
  );
}

function EmptySlotHint() {
  return (
    <a
      href="/activities"
      className="flex items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] rounded-2xl p-4 text-sm text-[var(--muted)] hover:border-orange-300 hover:text-orange-600 transition"
    >
      <span>+</span>
      <span>Browse activities to add</span>
    </a>
  );
}

export function PlanTimeline() {
  const plan = useSyncExternalStore(
    plannerStore.subscribe,
    plannerStore.getSnapshot,
    plannerStore.getServerSnapshot,
  );
  const [optimized, setOptimized] = useState(false);

  function handleOptimize() {
    plannerStore.optimize();
    setOptimized(true);
    setTimeout(() => setOptimized(false), 2000);
  }

  async function handleShare() {
    const serialized = plannerStore.serialize();
    const encoded = btoa(serialized);
    const url = `${window.location.origin}/en/plan/share?d=${encoded}`;
    try {
      await navigator.share({ title: "My Bangkok Day Plan — Thaigle", url });
    } catch {
      await navigator.clipboard.writeText(url);
      alert("Plan URL copied!");
    }
  }

  if (plan.items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🗓</div>
        <h2 className="font-black text-lg mb-2">Your day plan is empty</h2>
        <p className="text-sm text-[var(--muted)] mb-5">Add places from activity pages to build your Bangkok day.</p>
        <a
          href="/activities"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
        >
          Browse activities →
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Timeline */}
      <div className="relative pl-4">
        {/* Vertical rail */}
        <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-[var(--border)]" />

        <div className="space-y-0">
          {plan.items.map((item, i) => (
            <div key={item.slug}>
              <div className="relative flex items-start gap-3 mb-2">
                {/* Rail dot */}
                <div
                  className="absolute left-3.5 w-3 h-3 rounded-full border-2 border-white shrink-0 mt-4 z-10"
                  style={{ background: CATEGORY_COLORS[item.category].text }}
                />
                <div className="ml-8 w-full">
                  <SlotCard
                    item={item}
                    onRemove={() => plannerStore.removeFromPlan(item.slug)}
                  />
                </div>
              </div>

              {/* Travel segment */}
              {plan.travelSegments[i] && (
                <TravelChip segment={plan.travelSegments[i]} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Empty slot hint */}
      <div className="mt-3 ml-8">
        <EmptySlotHint />
      </div>

      {/* Action bar */}
      <div className="mt-6 flex gap-3 flex-wrap">
        <button
          onClick={handleOptimize}
          className="px-4 py-2.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-orange-400 hover:text-orange-700 transition"
        >
          {optimized ? "✓ Optimized" : "🗺 Optimize route"}
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2.5 rounded-full bg-[#00B900] text-white text-sm font-bold hover:opacity-90 transition"
        >
          Share plan (LINE)
        </button>
        <button
          onClick={() => { if (confirm("Clear plan?")) plannerStore.clear(); }}
          className="px-4 py-2.5 rounded-full text-sm text-[var(--muted)] hover:text-red-600 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
