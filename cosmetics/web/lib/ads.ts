import { kvGet, kvSet } from "./kv";

export type AdType =
  | "homepage_featured"
  | "category_takeover"
  | "editors_pick"
  | "quiz_result"
  | "sponsored_review";

export interface AdSlot {
  id: string;                   // nanoid-style unique ID
  type: AdType;
  productSlug: string;          // e.g. "la-roche-posay-bt_29472"
  productId: string;            // e.g. "bt_29472" for data lookup
  concern?: string;             // "acne" | "whitening" | etc. (for category types)
  startsAt: string;             // "YYYY-MM-DD"
  endsAt: string;               // "YYYY-MM-DD"
  advertiserName: string;       // e.g. "L'Oréal Thailand"
  priceTHB: number;
  active: boolean;
}

const KEY = "ads";

export async function getAdSlots(): Promise<AdSlot[]> {
  const raw = await kvGet(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw as string) as AdSlot[]; } catch { return []; }
}

export async function getActiveAdSlots(): Promise<AdSlot[]> {
  const today = new Date().toISOString().slice(0, 10);
  const all = await getAdSlots();
  return all.filter(
    (s) => s.active && s.startsAt <= today && s.endsAt >= today
  );
}

export async function saveAdSlots(slots: AdSlot[]): Promise<void> {
  await kvSet(KEY, JSON.stringify(slots));
}

export function makeAdId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Convenience selectors
export async function getActiveByType(type: AdType, concern?: string): Promise<AdSlot[]> {
  const active = await getActiveAdSlots();
  return active.filter(
    (s) => s.type === type && (concern === undefined || s.concern === concern)
  );
}
