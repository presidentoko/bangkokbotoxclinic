// The site has two independent "My Trip" planners that grew up around
// different page templates: lib/planner (+ PlannerContext, used by
// activities/restaurants) and lib/plan/store (used by /[lang]/place pages).
// An item added on one never showed up on the other. Full unification would
// mean reconciling two different UX models (slot-based day plan vs a
// travel-time-estimated timeline) — a product decision, not a quick fix — so
// this only maps between their two type taxonomies well enough for a
// same-item add/remove to mirror into both stores.
import type { PlanItemType } from "@/lib/planner";
import type { Category } from "@/lib/plan/store";

export function categoryToPlanItemType(category: Category): PlanItemType {
  switch (category) {
    case "eat": return "restaurant";
    case "train": return "gym";
    case "treat": return "wellness";
    case "relax": return "wellness";
    case "learn": return "gym";
  }
}

export function planItemTypeToCategory(type: PlanItemType): Category {
  switch (type) {
    case "restaurant": return "eat";
    case "gym": return "train";
    case "wellness": return "treat";
    // clinic/dental are vestigial types from this codebase's shared origin
    // (bangkok_clinics monorepo) — thaigle itself never produces them, but
    // the switch must stay exhaustive.
    case "clinic": return "treat";
    case "dental": return "treat";
  }
}
