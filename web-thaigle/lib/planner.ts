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
};

export type Plan = {
  title: string;
  items: PlanItem[];
};

export const EMPTY_PLAN: Plan = { title: "내 방콕 트립", items: [] };

export const TYPE_LABELS: Record<PlanItemType, string> = {
  restaurant: "🍜 맛집",
  clinic: "💉 클리닉",
  dental: "🦷 치과",
  wellness: "💆 웰니스",
  gym: "🥊 무에타이",
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

export function decodePlan(str: string): Plan | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(str)))) as Plan;
  } catch {
    return null;
  }
}

export function planUrl(plan: Plan): string {
  return `/plan?d=${encodePlan(plan)}`;
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
