// lib/plan/store.ts
// useSyncExternalStore-based planner store — SSR-safe (no localStorage on server)

export type Category = "eat" | "train" | "treat" | "learn" | "relax";

export interface PlanItem {
  slug: string;
  category: Category;
  name: string;
  lat: number;
  lng: number;
  localsScore: number;
  dataSays?: string;      // receipt one-liner from verification page
  durationMin: number;    // default by category
  startTime?: string;     // "HH:MM" — set by optimizer or user
  locked?: boolean;       // user manually locked start time
}

export interface TravelSegment {
  fromSlug: string;
  toSlug: string;
  durationMin: number;
  mode: "bts" | "mrt" | "walk" | "grab" | "estimate";
  label: string;         // "BTS 11 min · Thong Lo" or "~12 min walk (est.)"
}

export interface Plan {
  id?: string;           // server-assigned after save
  items: PlanItem[];
  travelSegments: TravelSegment[];
  title?: string;
  createdAt?: string;
}

// Default duration per category (minutes)
export const DEFAULT_DURATION: Record<Category, number> = {
  learn: 180,
  eat: 75,
  treat: 60,
  relax: 90,
  train: 60,
};

// Category chip colors
export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  learn:  { bg: "#F3E8FF", text: "#6B21A8", border: "#D8B4FE" },
  eat:    { bg: "#E1F5EE", text: "#0F6E56", border: "#6EE7B7" },
  treat:  { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  relax:  { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  train:  { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
};

type Listener = () => void;

const PLAN_LS_KEY = "thaigle_place_plan";

function loadPersisted(): Plan {
  if (typeof window === "undefined") return { items: [], travelSegments: [] };
  try {
    const raw = localStorage.getItem(PLAN_LS_KEY);
    if (!raw) return { items: [], travelSegments: [] };
    const parsed = JSON.parse(raw) as { items: PlanItem[] };
    return { items: Array.isArray(parsed.items) ? parsed.items : [], travelSegments: [] };
  } catch {
    return { items: [], travelSegments: [] };
  }
}

let plan: Plan = loadPersisted();
// Restore derived state (travel segments, start times) dropped from the persisted snapshot.
rebuildTravel();
rebuildStartTimes();

const listeners = new Set<Listener>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      PLAN_LS_KEY,
      JSON.stringify({ items: plan.items.map(({ slug, category, name, lat, lng, localsScore, durationMin, dataSays, startTime, locked }) => ({ slug, category, name, lat, lng, localsScore, durationMin, dataSays, startTime, locked })) })
    );
  } catch {}
}

function notify() {
  persist();
  for (const l of listeners) l();
}

// Haversine distance in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Estimate travel time: Bangkok heuristic
function estimateTravel(from: PlanItem, to: PlanItem): TravelSegment {
  // Places with a missing geocode are stored as lat:0/lng:0 — haversine on
  // that pair produces a real-looking (but meaningless) distance, so surface
  // "unknown" instead of a confident wrong estimate.
  const hasCoords = (p: PlanItem) => p.lat !== 0 || p.lng !== 0;
  if (!hasCoords(from) || !hasCoords(to)) {
    return {
      fromSlug: from.slug,
      toSlug: to.slug,
      durationMin: 20,
      mode: "estimate",
      label: "Travel time unknown (est.)",
    };
  }

  const km = haversine(from.lat, from.lng, to.lat, to.lng);
  let durationMin: number;
  let mode: TravelSegment["mode"];
  let label: string;

  if (km < 0.8) {
    durationMin = Math.round(km * 12 + 3);
    mode = "walk";
    label = `~${durationMin} min walk`;
  } else if (km < 5) {
    durationMin = Math.round(km * 4 + 8);
    mode = "bts";
    label = `~${durationMin} min (BTS est.)`;
  } else {
    durationMin = Math.round(km * 3 + 10);
    mode = "grab";
    label = `~${durationMin} min Grab`;
  }

  return {
    fromSlug: from.slug,
    toSlug: to.slug,
    durationMin,
    mode,
    label: label + " (est.)",
  };
}

// Rebuild travel segments after items change
function rebuildTravel() {
  plan.travelSegments = [];
  for (let i = 0; i < plan.items.length - 1; i++) {
    plan.travelSegments.push(estimateTravel(plan.items[i], plan.items[i + 1]));
  }
}

// Auto-assign start times cascading from first slot
function rebuildStartTimes() {
  let cursor = 9 * 60; // Default start: 9:00am in minutes
  for (let i = 0; i < plan.items.length; i++) {
    const item = plan.items[i];
    if (!item.locked) {
      const hh = Math.floor(cursor / 60).toString().padStart(2, "0");
      const mm = (cursor % 60).toString().padStart(2, "0");
      item.startTime = `${hh}:${mm}`;
    } else if (item.startTime) {
      const [h, m] = item.startTime.split(":").map(Number);
      cursor = h * 60 + m;
    }
    cursor += item.durationMin;
    if (i < plan.items.length - 1) {
      cursor += plan.travelSegments[i]?.durationMin ?? 0;
    }
  }
}

// Places with a missing geocode (lat:0/lng:0) — same guard estimateTravel
// uses. Without it, haversine() from a real anchor to (0,0) computes a
// real-looking ~8,700km distance that always "loses" the nearest-neighbor
// comparison, silently and confidently shoving the item to the route's end
// instead of surfacing that its position is actually unknown.
const hasCoords = (p: PlanItem) => p.lat !== 0 || p.lng !== 0;
function planDistance(a: PlanItem, b: PlanItem): number {
  if (!hasCoords(a) || !hasCoords(b)) return Infinity;
  return haversine(a.lat, a.lng, b.lat, b.lng);
}

// Nearest-neighbor optimizer (heuristic TSP) — reorders unlocked items only;
// locked items keep their original array position so nothing is ever dropped.
function optimizeRoute(): void {
  if (plan.items.length < 3) return;

  const original = plan.items;
  const locked = original.filter((it) => it.locked);
  const free = original.filter((it) => !it.locked);
  if (free.length === 0) return;

  // Greedy nearest-neighbor over the unlocked items, starting from the first
  // locked item (if any) so the walk flows naturally from a fixed anchor.
  const anchor = locked[0] ?? free[0];
  const remaining = locked[0] ? [...free] : free.filter((it) => it.slug !== anchor.slug);
  const orderedFree: PlanItem[] = locked[0] ? [] : [anchor];

  let current = anchor;
  while (remaining.length > 0) {
    let nearest = remaining[0];
    let minDist = planDistance(current, nearest);
    for (const item of remaining.slice(1)) {
      const d = planDistance(current, item);
      if (d < minDist) {
        minDist = d;
        nearest = item;
      }
    }
    orderedFree.push(nearest);
    remaining.splice(remaining.indexOf(nearest), 1);
    current = nearest;
  }

  // Re-insert locked items at their original positions; fill the remaining
  // slots with the newly-ordered free items.
  const lockedSlugs = new Set(locked.map((it) => it.slug));
  const ordered: PlanItem[] = [];
  let freeCursor = 0;
  for (const it of original) {
    if (lockedSlugs.has(it.slug)) ordered.push(it);
    else ordered.push(orderedFree[freeCursor++]);
  }

  plan = { ...plan, items: ordered };
  rebuildTravel();
  rebuildStartTimes();
  notify();
}

export const plannerStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): Plan {
    return plan;
  },
  getServerSnapshot(): Plan {
    return { items: [], travelSegments: [] };
  },

  addToPlan(item: Omit<PlanItem, "durationMin" | "startTime">): void {
    if (plan.items.some((p) => p.slug === item.slug)) return;
    const newItem: PlanItem = {
      ...item,
      durationMin: DEFAULT_DURATION[item.category],
    };
    plan = { ...plan, items: [...plan.items, newItem] };
    rebuildTravel();
    rebuildStartTimes();
    notify();
  },

  removeFromPlan(slug: string): void {
    plan = { ...plan, items: plan.items.filter((p) => p.slug !== slug) };
    rebuildTravel();
    rebuildStartTimes();
    notify();
  },

  setDuration(slug: string, durationMin: number): void {
    plan = {
      ...plan,
      items: plan.items.map((p) => p.slug === slug ? { ...p, durationMin } : p),
    };
    rebuildStartTimes();
    notify();
  },

  lockTime(slug: string, startTime: string): void {
    plan = {
      ...plan,
      items: plan.items.map((p) => p.slug === slug ? { ...p, startTime, locked: true } : p),
    };
    // Unlike setDuration, this was skipping the cascade — later stops kept
    // showing their pre-lock times until some unrelated action happened to
    // trigger a rebuild, so the itinerary displayed contradictory times.
    rebuildStartTimes();
    notify();
  },

  optimize(): void {
    optimizeRoute();
  },

  serialize(): string {
    return JSON.stringify({ items: plan.items.map(({ slug, category, name, lat, lng, localsScore, durationMin, dataSays }) => ({ slug, category, name, lat, lng, localsScore, durationMin, dataSays })) });
  },

  hydrate(data: string): void {
    try {
      const parsed = JSON.parse(data) as { items: PlanItem[] };
      if (!Array.isArray(parsed.items)) return;
      plan = { items: parsed.items, travelSegments: [] };
      rebuildTravel();
      rebuildStartTimes();
      notify();
    } catch {
      // ignore invalid data
    }
  },

  clear(): void {
    plan = { items: [], travelSegments: [] };
    notify();
  },

  getItemCount(): number {
    return plan.items.length;
  },
};
