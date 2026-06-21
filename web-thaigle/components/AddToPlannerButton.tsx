"use client";

import { usePlanner } from "@/components/PlannerContext";
import type { PlanItem } from "@/lib/planner";

export function AddToPlannerButton({ item }: { item: PlanItem }) {
  const { add, remove, has } = usePlanner();
  const added = has(item.id, item.type);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        added ? remove(item.id, item.type) : add(item);
      }}
      className={`text-xs px-3 py-1.5 rounded-full border font-bold transition ${
        added
          ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
          : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-orange-400 hover:text-orange-600"
      }`}
    >
      {added ? "✓ 플래너에 추가됨" : "+ 플래너에 추가"}
    </button>
  );
}
