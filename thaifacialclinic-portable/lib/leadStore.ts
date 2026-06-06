import { rcmd, rpipeline, makeId, upstashEnabled } from "./upstash";

export type LeadRecord = {
  id: string;
  clinic_id: string;
  clinic_name: string;
  name: string;
  email: string;
  phone: string;
  procedure: string;
  date: string;
  time_slot: string;
  notes: string;
  context: string;
  ua: string;
  ref: string;
  at: string;
};

export function makeLeadId(): string {
  return makeId(16);
}

export async function storeLead(rec: LeadRecord): Promise<void> {
  const key = `clinic:${rec.clinic_id}:leads`;
  await rpipeline([
    ["LPUSH", key, JSON.stringify(rec)],
    ["LTRIM", key, 0, 199],
    ["EXPIRE", key, 60 * 60 * 24 * 90],
    ["INCR", `clinic:${rec.clinic_id}:lead_count`],
  ]);
}

export async function getRecentLeads(clinicId: string, limit = 20): Promise<LeadRecord[]> {
  const result = (await rcmd(["LRANGE", `clinic:${clinicId}:leads`, 0, limit - 1])) as string[] | null;
  if (!Array.isArray(result)) return [];
  return result
    .map((s) => {
      try { return JSON.parse(s) as LeadRecord; } catch { return null; }
    })
    .filter((x): x is LeadRecord => x !== null);
}

export async function getLeadCount(clinicId: string): Promise<number> {
  const r = (await rcmd(["GET", `clinic:${clinicId}:lead_count`])) as string | null;
  return r ? parseInt(r, 10) || 0 : 0;
}

/** Per-IP rate limit. 10 min window, 5 leads max. */
export async function rateLimitOk(ip: string): Promise<boolean> {
  if (!upstashEnabled) return true;
  const key = `rl:lead:${ip}`;
  const count = (await rcmd(["INCR", key])) as number | null;
  if (count === 1) await rcmd(["EXPIRE", key, 600]);
  return typeof count === "number" ? count <= 5 : true;
}
