"use client";

import { useSyncExternalStore, useState } from "react";
import { plannerStore } from "@/lib/plan/store";
import type { PlanItem } from "@/lib/plan/store";

type Props = {
  item: Omit<PlanItem, "durationMin" | "startTime" | "locked">;
};

export function AddToPlanButton({ item }: Props) {
  const plan = useSyncExternalStore(
    plannerStore.subscribe,
    plannerStore.getSnapshot,
    plannerStore.getServerSnapshot,
  );
  const [toast, setToast] = useState(false);

  const inPlan = plan.items.some((p) => p.slug === item.slug);

  function handleClick() {
    if (inPlan) {
      plannerStore.removeFromPlan(item.slug);
    } else {
      plannerStore.addToPlan(item);
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
