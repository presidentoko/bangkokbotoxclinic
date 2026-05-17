// Cold outreach tracking — Redis hash per clinic_id.
// 직원이 어드민에서 직접 outcome 입력 → Google Sheet 대체.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "admin:outreach";

export type OutreachOutcome =
  | "sent"
  | "read_no_reply"
  | "REPLIED_EN"
  | "HANDOFF_TO_THAI_TEAM"
  | "MEETING_SCHEDULED"
  | "SIGNED"
  | "dead_not_interested"
  | "dead_no_reply"
  | "dead_hostile"
  | "ghosted";

export type OutreachRecord = {
  clinic_id: string;
  clinic_name: string;
  staff?: string;             // who sent it
  channel: "LINE" | "FB_MESSENGER" | "WEBSITE_FORM" | "EMAIL" | "OTHER";
  template: "T1" | "T2" | "T3" | "T4" | "T5";
  outcome: OutreachOutcome;
  sent_at: string;            // ISO date
  replied_at?: string;
  next_action?: string;
  note?: string;
  last_updated: string;
};

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

export async function listOutreach(): Promise<OutreachRecord[]> {
  const result = (await rcmd(["HGETALL", REDIS_KEY])) as unknown;
  if (!result) return [];
  const records: OutreachRecord[] = [];
  if (Array.isArray(result)) {
    for (let i = 0; i < result.length; i += 2) {
      try {
        const rec = JSON.parse(String(result[i + 1])) as OutreachRecord;
        records.push(rec);
      } catch {/* skip */}
    }
  } else if (typeof result === "object") {
    for (const v of Object.values(result as Record<string, string>)) {
      try { records.push(JSON.parse(v) as OutreachRecord); } catch {/* skip */}
    }
  }
  return records.sort((a, b) => b.last_updated.localeCompare(a.last_updated));
}

export async function upsertOutreach(rec: Omit<OutreachRecord, "last_updated">): Promise<boolean> {
  const full: OutreachRecord = { ...rec, last_updated: new Date().toISOString() };
  const r = await rcmd(["HSET", REDIS_KEY, rec.clinic_id, JSON.stringify(full)]);
  // Webhook on positive outcomes — staff get pinged even when they're not watching admin.
  // Set OUTREACH_WEBHOOK_URL to a Telegram bot, Slack incoming hook, or anything that
  // accepts a JSON POST. Skipped silently if env var unset.
  const POSITIVE: OutreachOutcome[] = ["REPLIED_EN", "MEETING_SCHEDULED", "SIGNED"];
  if (POSITIVE.includes(rec.outcome) && process.env.OUTREACH_WEBHOOK_URL) {
    const emoji = rec.outcome === "SIGNED" ? "🎉" : rec.outcome === "MEETING_SCHEDULED" ? "📅" : "💬";
    const text = `${emoji} ${rec.outcome}: ${rec.clinic_name} (${rec.template}, ${rec.channel})${rec.staff ? ` — by ${rec.staff}` : ""}`;
    fetch(process.env.OUTREACH_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, ...full }),
    }).catch(() => {/* fire-and-forget */});
  }
  return r !== null;
}

export async function deleteOutreach(clinic_id: string): Promise<boolean> {
  const r = await rcmd(["HDEL", REDIS_KEY, clinic_id]);
  return r !== null;
}

export function outreachStats(records: OutreachRecord[]): {
  total: number;
  by_outcome: Record<OutreachOutcome, number>;
  signed: number;
  reply_rate: number;
  sign_rate: number;
} {
  const by_outcome: Record<OutreachOutcome, number> = {
    sent: 0, read_no_reply: 0, REPLIED_EN: 0, HANDOFF_TO_THAI_TEAM: 0,
    MEETING_SCHEDULED: 0, SIGNED: 0,
    dead_not_interested: 0, dead_no_reply: 0, dead_hostile: 0, ghosted: 0,
  };
  for (const r of records) by_outcome[r.outcome]++;

  const total = records.length;
  const replied = by_outcome.REPLIED_EN + by_outcome.HANDOFF_TO_THAI_TEAM
    + by_outcome.MEETING_SCHEDULED + by_outcome.SIGNED + by_outcome.dead_not_interested
    + by_outcome.ghosted;
  const signed = by_outcome.SIGNED;

  return {
    total,
    by_outcome,
    signed,
    reply_rate: total > 0 ? replied / total : 0,
    sign_rate: total > 0 ? signed / total : 0,
  };
}

export const OUTCOME_META: Record<OutreachOutcome, { label: string; color: string; bg: string }> = {
  sent:                 { label: "Sent",           color: "text-gray-300",   bg: "bg-gray-800" },
  read_no_reply:        { label: "Read, no reply", color: "text-gray-400",   bg: "bg-gray-700" },
  REPLIED_EN:           { label: "Replied (EN)",   color: "text-blue-300",   bg: "bg-blue-900/40" },
  HANDOFF_TO_THAI_TEAM: { label: "Handoff → Thai", color: "text-amber-300",  bg: "bg-amber-900/40" },
  MEETING_SCHEDULED:    { label: "Meeting set",    color: "text-purple-300", bg: "bg-purple-900/40" },
  SIGNED:               { label: "✓ Signed",       color: "text-green-300",  bg: "bg-green-900/50" },
  dead_not_interested:  { label: "Dead — declined",color: "text-gray-500",   bg: "bg-gray-900" },
  dead_no_reply:        { label: "Dead — silent",  color: "text-gray-600",   bg: "bg-gray-900" },
  dead_hostile:         { label: "Dead — hostile", color: "text-red-400",    bg: "bg-red-900/30" },
  ghosted:              { label: "Ghosted",        color: "text-orange-300", bg: "bg-orange-900/30" },
};
