// 클리닉 대시보드 상태 저장소 — Redis hash.
// - clinic:<id>:lead_status      : { <lead_id>: "new"|"contacted"|"booked"|"no_show"|"cancelled" }
// - clinic:<id>:lead_notes       : { <lead_id>: "<note>" }
// - clinic:<id>:reply_done       : { <review_hash>: "1" }
// - clinic:<id>:profile_views    : INCR counter (per day key: profile_views:<id>:<YYYY-MM-DD>)

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type LeadStatus = "new" | "contacted" | "booked" | "no_show" | "cancelled";

async function rpipeline(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return cmds.map(() => null);
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
      cache: "no-store",
    });
    if (!res.ok) return cmds.map(() => null);
    const j = (await res.json()) as { result?: unknown }[];
    return j.map((r) => r?.result ?? null);
  } catch {
    return cmds.map(() => null);
  }
}

async function rcmd(cmd: (string | number)[]): Promise<unknown> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: unknown };
    return j.result ?? null;
  } catch {
    return null;
  }
}

// ── Lead status ─────────────────────────────────────────────────────────

export async function getLeadStatusMap(clinicId: string): Promise<Record<string, LeadStatus>> {
  const result = (await rcmd(["HGETALL", `clinic:${clinicId}:lead_status`])) as unknown;
  if (!result) return {};
  // Upstash HGETALL returns [field, value, field, value, ...] OR { field: value }
  if (Array.isArray(result)) {
    const obj: Record<string, LeadStatus> = {};
    for (let i = 0; i < result.length; i += 2) {
      obj[String(result[i])] = String(result[i + 1]) as LeadStatus;
    }
    return obj;
  }
  return result as Record<string, LeadStatus>;
}

export async function setLeadStatus(clinicId: string, leadId: string, status: LeadStatus): Promise<boolean> {
  const result = await rcmd(["HSET", `clinic:${clinicId}:lead_status`, leadId, status]);
  return result !== null;
}

export async function getLeadNotesMap(clinicId: string): Promise<Record<string, string>> {
  const result = (await rcmd(["HGETALL", `clinic:${clinicId}:lead_notes`])) as unknown;
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

export async function setLeadNote(clinicId: string, leadId: string, note: string): Promise<boolean> {
  if (!note.trim()) {
    const r = await rcmd(["HDEL", `clinic:${clinicId}:lead_notes`, leadId]);
    return r !== null;
  }
  const r = await rcmd(["HSET", `clinic:${clinicId}:lead_notes`, leadId, note]);
  return r !== null;
}

// ── Reply done tracking ─────────────────────────────────────────────────

/** 리뷰 텍스트 → 짧은 해시. 깊지 않은 해시여도 충돌 거의 없음 (per-clinic scope). */
export function reviewHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

export async function getReplyDoneSet(clinicId: string): Promise<Set<string>> {
  const result = (await rcmd(["HKEYS", `clinic:${clinicId}:reply_done`])) as unknown;
  if (!Array.isArray(result)) return new Set();
  return new Set(result.map(String));
}

export async function setReplyDone(clinicId: string, hash: string, done: boolean): Promise<boolean> {
  if (done) {
    const r = await rcmd(["HSET", `clinic:${clinicId}:reply_done`, hash, "1"]);
    return r !== null;
  }
  const r = await rcmd(["HDEL", `clinic:${clinicId}:reply_done`, hash]);
  return r !== null;
}

// ── Profile view counter ─────────────────────────────────────────────────

export async function incrementProfileView(clinicId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  await rpipeline([
    ["INCR", `clinic:${clinicId}:views:${today}`],
    ["EXPIRE", `clinic:${clinicId}:views:${today}`, 60 * 60 * 24 * 90],  // 90일 보존
    ["INCR", `clinic:${clinicId}:views_total`],
  ]);
}

/** 최근 N일 일별 뷰 카운트. */
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

export async function getTotalProfileViews(clinicId: string): Promise<number> {
  const r = (await rcmd(["GET", `clinic:${clinicId}:views_total`])) as string | null;
  return r ? parseInt(r, 10) || 0 : 0;
}

// ── Email weekly digest signups ─────────────────────────────────────────
// Stored as LIST `email_signups` of JSON records {email, clinic_id, at}.
// Capped at 5,000 entries via LTRIM to bound Redis usage.

export type EmailSignup = { email: string; clinic_id: string; at: string };

export async function addEmailSignup(email: string, clinicId: string): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  const rec: EmailSignup = { email, clinic_id: clinicId, at: new Date().toISOString() };
  await rpipeline([
    ["LPUSH", "email_signups", JSON.stringify(rec)],
    ["LTRIM", "email_signups", 0, 4999],
  ]);
  return true;
}

export const LEAD_STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#2563eb", bg: "#dbeafe" },
  contacted: { label: "Contacted", color: "#7c3aed", bg: "#ede9fe" },
  booked:    { label: "Booked",    color: "#059669", bg: "#d1fae5" },
  no_show:   { label: "No-show",   color: "#dc2626", bg: "#fee2e2" },
  cancelled: { label: "Cancelled", color: "#6b7280", bg: "#f3f4f6" },
};
