"use client";

import { useSyncExternalStore, useState } from "react";
import { plannerStore } from "@/lib/plan/store";
import type { PlanItem } from "@/lib/plan/store";
import { usePlanner } from "@/components/PlannerContext";
import { categoryToPlanItemType } from "@/lib/planMirror";

type Props = {
  item: Omit<PlanItem, "durationMin" | "startTime" | "locked">;
  /** Canonical page path — only used to mirror this add into the other
   * "My Trip" planner (see lib/planMirror.ts) so it's reachable from /plan too. */
  url?: string;
};

export function AddToPlanButton({ item, url }: Props) {
  const plan = useSyncExternalStore(
    plannerStore.subscribe,
    plannerStore.getSnapshot,
    plannerStore.getServerSnapshot,
  );
  const [toast, setToast] = useState(false);
  const { add: addMirror, remove: removeMirror, has: hasMirror } = usePlanner();
  const mirrorType = categoryToPlanItemType(item.category);

  const inPlan = plan.items.some((p) => p.slug === item.slug);

  function handleClick() {
    if (inPlan) {
      plannerStore.removeFromPlan(item.slug);
      if (hasMirror(item.slug, mirrorType)) removeMirror(item.slug, mirrorType);
    } else {
      plannerStore.addToPlan(item);
      addMirror({ type: mirrorType, id: item.slug, name: item.name, url });
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition active:scale-95 ${
          inPlan
            ? "bg-[var(--receipt-data-bg)] text-[var(--receipt-data-text)] border border-[var(--score)]"
            : "bg-[var(--score)] text-white hover:opacity-90"
        }`}
      >
        <span>{inPlan ? "✓" : "+"}</span>
        <span>{inPlan ? "In your plan" : "Add to day plan"}</span>
      </button>
      {toast && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-[var(--score)] text-white text-xs font-bold rounded-full whitespace-nowrap shadow-lg animate-in fade-in">
          Added to your plan
        </div>
      )}
    </div>
  );
}
