"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Plan, PlanItem, PlanItemType, SlotKey } from "@/lib/planner";
import { EMPTY_PLAN } from "@/lib/planner";

const LS_KEY = "thaigle_plan";

type PlannerCtx = {
  plan: Plan;
  add: (item: PlanItem) => void;
  remove: (id: string, type: PlanItemType) => void;
  assignSlot: (id: string, type: PlanItemType, slot: SlotKey | null) => void;
  clear: () => void;
  setTitle: (t: string) => void;
  has: (id: string, type: PlanItemType) => boolean;
};

const Ctx = createContext<PlannerCtx | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>(EMPTY_PLAN);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPlan(JSON.parse(raw));
    } catch {}
  }, []);

  function save(next: Plan) {
    setPlan(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  }

  function add(item: PlanItem) {
    if (has(item.id, item.type)) return;
    save({ ...plan, items: [...plan.items, item] });
  }

  function remove(id: string, type: PlanItemType) {
    save({ ...plan, items: plan.items.filter((i) => !(i.id === id && i.type === type)) });
  }

  function assignSlot(id: string, type: PlanItemType, slot: SlotKey | null) {
    save({
      ...plan,
      items: plan.items.map((i) => {
        // Clear the target slot if another item already occupies it
        if (slot && i.slot === slot && !(i.id === id && i.type === type)) {
          return { ...i, slot: undefined };
        }
        if (i.id === id && i.type === type) return { ...i, slot: slot ?? undefined };
        return i;
      }),
    });
  }

  function clear() {
    save(EMPTY_PLAN);
  }

  function setTitle(t: string) {
    save({ ...plan, title: t });
  }

  function has(id: string, type: PlanItemType) {
    return plan.items.some((i) => i.id === id && i.type === type);
  }

  return (
    <Ctx.Provider value={{ plan, add, remove, assignSlot, clear, setTitle, has }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider");
  return ctx;
}
