import { rcmd, rpipeline } from "./upstash";

export type LeadStatus = "new" | "contacted" | "booked" | "no_show" | "cancelled";

function parseHash(result: unknown): Record<string, string> {
  if (!result) return {};
  if (Array.isArray(result)) {
    const obj: Record<string, string> = {};
    for (let i = 0; i < result.length; i += 2) {
      obj[String(result[i])] = String(result[i + 1]);
    }
    return obj;
  }
  return result as Record<string, string>;
}

// ── Lead status / notes ─────────────────────────────────────

export async function getLeadStatusMap(clinicId: string): Promise<Record<string, LeadStatus>> {
  return parseHash(await rcmd(["HGETALL", `clinic:${clinicId}:lead_status`])) as Record<string, LeadStatus>;
}
export async function setLeadStatus(clinicId: string, leadId: string, status: LeadStatus): Promise<boolean> {
  return (await rcmd(["HSET", `clinic:${clinicId}:lead_status`, leadId, status])) !== null;
}
export async function getLeadNotesMap(clinicId: string): Promise<Record<string, string>> {
  return parseHash(await rcmd(["HGETALL", `clinic:${clinicId}:lead_notes`]));
}
export async function setLeadNote(clinicId: string, leadId: string, note: string): Promise<boolean> {
  const cmd = note.trim()
    ? ["HSET", `clinic:${clinicId}:lead_notes`, leadId, note]
    : ["HDEL", `clinic:${clinicId}:lead_notes`, leadId];
  return (await rcmd(cmd)) !== null;
}

// ── Reply done tracking ─────────────────────────────────────

export function reviewHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export async function getReplyDoneSet(clinicId: string): Promise<Set<string>> {
  const r = (await rcmd(["HKEYS", `clinic:${clinicId}:reply_done`])) as unknown;
  return new Set(Array.isArray(r) ? r.map(String) : []);
}
export async function setReplyDone(clinicId: string, hash: string, done: boolean): Promise<boolean> {
  const cmd = done
    ? ["HSET", `clinic:${clinicId}:reply_done`, hash, "1"]
    : ["HDEL", `clinic:${clinicId}:reply_done`, hash];
  return (await rcmd(cmd)) !== null;
}

// ── Profile view counters ───────────────────────────────────

export async function incrementProfileView(clinicId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  await rpipeline([
    ["INCR", `clinic:${clinicId}:views:${today}`],
    ["EXPIRE", `clinic:${clinicId}:views:${today}`, 60 * 60 * 24 * 90],
    ["INCR", `clinic:${clinicId}:views_total`],
  ]);
}

export async function getTotalProfileViews(clinicId: string): Promise<number> {
  const r = (await rcmd(["GET", `clinic:${clinicId}:views_total`])) as string | null;
  return r ? parseInt(r, 10) || 0 : 0;
}

export async function getProfileViewsByDay(clinicId: string, days = 30): Promise<{ date: string; count: number }[]> {
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const cmds = dates.map((d) => ["GET", `clinic:${clinicId}:views:${d}`]);
  const results = await rpipeline(cmds);
  return dates.map((date, i) => ({
    date,
    count: typeof results[i] === "string" ? parseInt(results[i] as string, 10) || 0 : 0,
  }));
}

// ── Revenue per lead (manual entry by owner — THB amount) ──────────

export async function getLeadRevenueMap(clinicId: string): Promise<Record<string, number>> {
  const raw = parseHash(await rcmd(["HGETALL", `clinic:${clinicId}:lead_revenue`]));
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const n = parseInt(v, 10);
    if (Number.isFinite(n) && n > 0) out[k] = n;
  }
  return out;
}

export async function setLeadRevenue(clinicId: string, leadId: string, amount: number): Promise<boolean> {
  if (!Number.isFinite(amount) || amount <= 0) {
    return (await rcmd(["HDEL", `clinic:${clinicId}:lead_revenue`, leadId])) !== null;
  }
  const r = await rcmd(["HSET", `clinic:${clinicId}:lead_revenue`, leadId, String(Math.round(amount))]);
  return r !== null;
}

export const LEAD_STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#2563eb", bg: "#dbeafe" },
  contacted: { label: "Contacted", color: "#7c3aed", bg: "#ede9fe" },
  booked:    { label: "Booked",    color: "#059669", bg: "#d1fae5" },
  no_show:   { label: "No-show",   color: "#dc2626", bg: "#fee2e2" },
  cancelled: { label: "Cancelled", color: "#6b7280", bg: "#f3f4f6" },
};
