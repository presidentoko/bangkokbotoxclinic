export type PlanItemType = "restaurant" | "clinic" | "dental" | "wellness" | "gym";

export type PlanItem = {
  type: PlanItemType;
  id: string;
  name: string;
  district?: string;
  rating?: number;
  city?: string;
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
