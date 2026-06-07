// web-golf/lib/priceMatrix.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PriceEntry, PriceSlot } from "./types";

const PRICE_PATH = path.join(process.cwd(), "data", "price_matrix.json");

export async function loadPriceMatrix(): Promise<PriceEntry[]> {
  try {
    const raw = await fs.readFile(PRICE_PATH, "utf-8");
    return JSON.parse(raw) as PriceEntry[];
  } catch {
    return [];
  }
}

export function totalBaht(slot: PriceSlot): number {
  return slot.greenfee + slot.caddy + slot.cart;
}

export type PriceRow = {
  course_id: string;
  source_agency: string;
  source_url: string;
  weekday_morning_total: number | null;
  weekday_morning_slot: PriceSlot | null;
  weekend_morning_total: number | null;
  weekend_morning_slot: PriceSlot | null;
  scraped_at: string;
};

export function toPriceRows(matrix: PriceEntry[]): PriceRow[] {
  return matrix.map((e) => ({
    course_id: e.course_id,
    source_agency: e.source_agency,
    source_url: e.source_url,
    scraped_at: e.scraped_at,
    weekday_morning_slot: e.weekday.morning ?? null,
    weekday_morning_total: e.weekday.morning ? totalBaht(e.weekday.morning) : null,
    weekend_morning_slot: e.weekend.morning ?? null,
    weekend_morning_total: e.weekend.morning ? totalBaht(e.weekend.morning) : null,
  }));
}
