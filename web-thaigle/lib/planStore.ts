// lib/planStore.ts
// Planner store interface — useSyncExternalStore based.
// TODO: wire to full planner module

export type PlanItem = {
  slug: string;
  category: string;
  name: string;
  lat: number;
  lng: number;
};

type Listener = () => void;

const listeners = new Set<Listener>();
let planItems: PlanItem[] = [];

function notifyListeners() {
  for (const l of listeners) l();
}

export const planStore = {
  getSnapshot(): PlanItem[] {
    return planItems;
  },
  getServerSnapshot(): PlanItem[] {
    return [];
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  addToPlan(item: PlanItem): void {
    if (planItems.some((p) => p.slug === item.slug)) return;
    planItems = [...planItems, item];
    notifyListeners();
  },
  removeFromPlan(slug: string): void {
    planItems = planItems.filter((p) => p.slug !== slug);
    notifyListeners();
  },
};
