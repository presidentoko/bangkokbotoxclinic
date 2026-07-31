"use client";

import { usePlanner } from "@/components/PlannerContext";
import type { PlanItem } from "@/lib/planner";
import { plannerStore } from "@/lib/plan/store";
import { planItemTypeToCategory } from "@/lib/planMirror";

export function AddToPlannerButton({ item }: { item: PlanItem }) {
  const { add, remove, has } = usePlanner();
  const added = has(item.id, item.type);

  function toggle() {
    if (added) {
      remove(item.id, item.type);
      plannerStore.removeFromPlan(item.id);
    } else {
      add(item);
      // Mirrors into the other "My Trip" planner (lib/plan/store, used by
      // /[lang]/place pages) — see lib/planMirror.ts. trust_score and
      // localsScore aren't the same scale, so this is a best-effort carry,
      // not an exact conversion.
      plannerStore.addToPlan({
        slug: item.id,
        category: planItemTypeToCategory(item.type),
        name: item.name,
        lat: 0,
        lng: 0,
        localsScore: item.trust_score ?? 0,
      });
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className={`text-xs px-3 py-1.5 rounded-full border font-bold transition ${
        added
          ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
          : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-orange-400 hover:text-orange-600"
      }`}
    >
      {added ? "✓ Added to planner" : "+ Add to planner"}
    </button>
  );
}
