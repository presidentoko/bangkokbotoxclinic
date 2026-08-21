import { kvHgetall, kvHincrby, kvSadd, kvSmembers } from "./kv";

/**
 * Impression and click counters for sold ad slots.
 *
 * The media kit promises advertisers a monthly performance report, and until
 * now nothing on the site produced a single number to put in one — no
 * impression, no click, nowhere. Without this an advertiser can buy a slot but
 * has no way to judge whether it worked, which makes a renewal impossible to
 * ask for.
 *
 * Storage is one Redis hash per slot, fields keyed "YYYY-MM-DD:imp" and
 * "YYYY-MM-DD:clk", incremented with HINCRBY. That keeps a write to a single
 * O(1) command with no read-modify-write, so concurrent page views cannot
 * clobber each other's counts, and a slot's whole history reads back in one
 * HGETALL. A separate set tracks which slot ids have data, so the report can
 * still show counters for a slot that was deleted from the schedule.
 */

export type MetricKind = "imp" | "clk";

const HASH = (slotId: string) => `admetrics:${slotId}`;
const INDEX = "admetrics:slots";

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function recordMetric(slotId: string, kind: MetricKind): Promise<void> {
  await Promise.all([
    kvHincrby(HASH(slotId), `${today()}:${kind}`, 1),
    kvSadd(INDEX, slotId),
  ]);
}

export interface DailyMetric {
  date: string;
  impressions: number;
  clicks: number;
}

export interface SlotMetrics {
  slotId: string;
  days: DailyMetric[];
  totalImpressions: number;
  totalClicks: number;
  /** Click-through rate as a percentage, or null when there is nothing to divide by. */
  ctr: number | null;
}

function parseHash(slotId: string, raw: Record<string, string>): SlotMetrics {
  const byDate = new Map<string, DailyMetric>();
  for (const [field, value] of Object.entries(raw)) {
    const sep = field.lastIndexOf(":");
    if (sep === -1) continue;
    const date = field.slice(0, sep);
    const kind = field.slice(sep + 1);
    const n = Number(value);
    if (!Number.isFinite(n)) continue;
    const entry = byDate.get(date) ?? { date, impressions: 0, clicks: 0 };
    if (kind === "imp") entry.impressions += n;
    else if (kind === "clk") entry.clicks += n;
    byDate.set(date, entry);
  }
  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  const totalImpressions = days.reduce((s, d) => s + d.impressions, 0);
  const totalClicks = days.reduce((s, d) => s + d.clicks, 0);
  return {
    slotId,
    days,
    totalImpressions,
    totalClicks,
    ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : null,
  };
}

export async function getSlotMetrics(slotId: string): Promise<SlotMetrics> {
  return parseHash(slotId, await kvHgetall(HASH(slotId)));
}

export async function getAllSlotMetrics(): Promise<SlotMetrics[]> {
  const ids = await kvSmembers(INDEX);
  const all = await Promise.all(ids.map((id) => getSlotMetrics(id)));
  return all.sort((a, b) => b.totalImpressions - a.totalImpressions);
}
