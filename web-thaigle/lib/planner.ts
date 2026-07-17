export type PlanItemType = "restaurant" | "clinic" | "dental" | "wellness" | "gym";

export type SlotKey = "morning" | "lunch" | "afternoon" | "treat" | "dinner" | "evening";

export const SLOT_DEFS: Record<SlotKey, {
  label: string;
  icon: string;
  hint: string;
  deepLink: string;
  suggestedTypes: PlanItemType[];
}> = {
  morning:   { label: "Morning",   icon: "🌅", hint: "Activity · Muay Thai · Yoga",   deepLink: "/activities",      suggestedTypes: ["gym", "wellness"] },
  lunch:     { label: "Lunch",     icon: "🍜", hint: "Restaurant",                    deepLink: "/restaurants/bangkok", suggestedTypes: ["restaurant"] },
  afternoon: { label: "Afternoon", icon: "🥊", hint: "Activity · Cooking · Diving",   deepLink: "/activities",      suggestedTypes: ["gym", "wellness"] },
  treat:     { label: "Treat",     icon: "💆", hint: "Spa · Wellness · Clinic",       deepLink: "/activities/spa",  suggestedTypes: ["wellness", "clinic"] },
  dinner:    { label: "Dinner",    icon: "🍽️", hint: "Restaurant",                   deepLink: "/restaurants/bangkok", suggestedTypes: ["restaurant"] },
  evening:   { label: "Evening",   icon: "🌙", hint: "Bar · Night activity · Relax",  deepLink: "/activities",      suggestedTypes: ["wellness", "gym"] },
};

export const SLOT_ORDER: SlotKey[] = ["morning", "lunch", "afternoon", "treat", "dinner", "evening"];

export type PlanItem = {
  type: PlanItemType;
  id: string;
  name: string;
  district?: string;
  rating?: number;
  city?: string;
  trust_score?: number;
  price_min_thb?: number;
  slot?: SlotKey;
  /** Canonical link to this item, set at add-time. Falls back to a best-guess route if absent. */
  url?: string;
};

export type Plan = {
  title: string;
  items: PlanItem[];
};

export const EMPTY_PLAN: Plan = { title: "My Bangkok Trip", items: [] };

export const TYPE_LABELS: Record<PlanItemType, string> = {
  restaurant: "🍜 Restaurant",
  clinic: "💉 Clinic",
  dental: "🦷 Dental",
  wellness: "💆 Wellness",
  gym: "🥊 Muay Thai",
};

// Rough price estimate for spend summary when price_min_thb is not stored
export const TYPE_PRICE_ESTIMATE: Record<PlanItemType, { min: number; max: number }> = {
  restaurant: { min: 300, max: 800 },
  wellness:   { min: 500, max: 1200 },
  gym:        { min: 300, max: 800 },
  clinic:     { min: 0, max: 0 },
  dental:     { min: 0, max: 0 },
};

export function encodePlan(plan: Plan): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(plan))));
}

const PLAN_ITEM_TYPES: PlanItemType[] = ["restaurant", "clinic", "dental", "wellness", "gym"];

function sanitizePlanItem(it: unknown): PlanItem | null {
  if (!it || typeof it !== "object") return null;
  const raw = it as Record<string, unknown>;
  if (typeof raw.id !== "string" || typeof raw.name !== "string") return null;
  if (typeof raw.type !== "string" || !PLAN_ITEM_TYPES.includes(raw.type as PlanItemType)) return null;
  const item: PlanItem = { id: raw.id, name: raw.name, type: raw.type as PlanItemType };
  if (typeof raw.district === "string") item.district = raw.district;
  if (typeof raw.rating === "number") item.rating = raw.rating;
  if (typeof raw.city === "string") item.city = raw.city;
  if (typeof raw.trust_score === "number") item.trust_score = raw.trust_score;
  if (typeof raw.price_min_thb === "number") item.price_min_thb = raw.price_min_thb;
  if (typeof raw.slot === "string" && (SLOT_ORDER as string[]).includes(raw.slot)) item.slot = raw.slot as SlotKey;
  // Only ever render same-origin paths — a crafted /plan?d= link could
  // otherwise smuggle a javascript:/external href into a trusted-looking
  // "shared trip plan" UI (same class of bug already guarded in wishlist.ts).
  if (typeof raw.url === "string" && raw.url.startsWith("/") && !raw.url.startsWith("//")) {
    item.url = raw.url;
  }
  return item;
}

export function decodePlan(str: string): Plan | null {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(str)))) as unknown;
    if (!data || typeof data !== "object") return null;
    const raw = data as Record<string, unknown>;
    if (typeof raw.title !== "string" || !Array.isArray(raw.items)) return null;
    const items = raw.items.map(sanitizePlanItem).filter((i): i is PlanItem => i !== null);
    return { title: raw.title.slice(0, 200), items };
  } catch {
    return null;
  }
}

export function planUrl(plan: Plan): string {
  return `/plan?d=${encodeURIComponent(encodePlan(plan))}`;
}

export function getSlottedItems(plan: Plan): Record<SlotKey, PlanItem | null> {
  const result: Record<SlotKey, PlanItem | null> = {
    morning: null, lunch: null, afternoon: null, treat: null, dinner: null, evening: null,
  };
  for (const item of plan.items) {
    if (item.slot && item.slot in result) result[item.slot] = item;
  }
  return result;
}

export function getUnslottedItems(plan: Plan): PlanItem[] {
  return plan.items.filter((i) => !i.slot);
}

export function estimateSpend(items: PlanItem[]): { min: number; max: number } {
  let min = 0, max = 0;
  for (const item of items) {
    if (item.price_min_thb) {
      min += item.price_min_thb;
      max += item.price_min_thb * 1.5;
    } else {
      const est = TYPE_PRICE_ESTIMATE[item.type];
      min += est.min;
      max += est.max;
    }
  }
  return { min: Math.round(min), max: Math.round(max) };
}
