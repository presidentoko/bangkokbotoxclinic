import { storeLead, rateLimitOk, makeLeadId, type LeadRecord } from "@/lib/leadStore";
import { listPartners } from "@/lib/partnerStore";
import { notifyNewLead } from "@/lib/notify";

export const runtime = "nodejs";

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL;
const FALLBACK_EMAIL = process.env.FALLBACK_LEAD_EMAIL || "";

// Strip Slack/Discord mention syntax and markdown control chars so attacker-supplied
// lead fields can't ping channels or inject formatting in the webhook message.
function safeForWebhook(s: string): string {
  return s
    .replace(/<!?[@#&][^>]*>/g, "")   // <@user>, <!everyone>, <#channel>, <!here>
    .replace(/@(channel|here|everyone)/gi, "")
    .replace(/[`*_~]/g, "")            // markdown markers
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

function formatSummary(l: LeadRecord): string {
  const s = safeForWebhook;
  return [
    `🆕 New lead — ${s(l.clinic_name) || "general inquiry"}`,
    `Patient: ${s(l.name) || "(no name)"}`,
    `Email: ${s(l.email)}`,
    l.phone ? `Phone/LINE: ${s(l.phone)}` : null,
    l.procedure ? `Procedure: ${s(l.procedure)}` : null,
    l.date ? `Date: ${s(l.date)}` : null,
    l.time_slot ? `Time: ${s(l.time_slot)}` : null,
    l.notes ? `Notes: ${s(l.notes)}` : null,
    `Lead ID: ${l.id} · ${l.at}`,
  ].filter(Boolean).join("\n");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }

  // Honeypot
  if (body._hp && String(body._hp).length > 0) {
    return Response.json({ ok: true });
  }

  // Rate limit
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  if (!(await rateLimitOk(ip))) {
    return new Response("rate limit", { status: 429 });
  }

  const email = String(body.email || "").trim();
  if (!email || !email.includes("@") || email.length > 200) {
    return new Response("invalid email", { status: 400 });
  }

  const clinicId = String(body.clinicId || body.clinic_id || "");
  const clinicName = String(body.clinicName || "");

  const lead: LeadRecord = {
    id: makeLeadId(),
    clinic_id: clinicId,
    clinic_name: clinicName,
    name: String(body.name || "").slice(0, 200),
    email,
    phone: String(body.phone || "").slice(0, 100),
    procedure: String(body.procedure || body.service || "").slice(0, 100),
    date: String(body.date || "").slice(0, 50),
    time_slot: String(body.timeSlot || body.time_slot || "").slice(0, 50),
    notes: String(body.message || body.notes || "").slice(0, 2000),
    context: String(body.context || ""),
    ua: req.headers.get("user-agent")?.slice(0, 300) || "",
    ref: req.headers.get("referer")?.slice(0, 300) || "",
    at: new Date().toISOString(),
  };

  if (clinicId) await storeLead(lead);

  // Fire Discord + Telegram notifications (configured via env, silent skip if not set)
  notifyNewLead(lead);

  const summary = formatSummary(lead);

  // Webhook notification (Slack/Discord)
  if (WEBHOOK_URL) {
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summary, lead }),
    }).catch((e) => console.error("[lead] webhook err", e));
  }

  // Partner email routing (optional — passes recipient hint to logs for manual relay)
  const partner = clinicId ? (await listPartners()).find((p) => p.clinic_id === clinicId) ?? null : null;
  const recipient = partner?.contact_email || FALLBACK_EMAIL;
  console.log(`[lead] ${lead.id} clinic=${clinicId || "-"} → ${recipient || "(no recipient)"}${partner ? " (partner)" : ""}`);
  if (recipient) console.log(formatSummary(lead));

  return Response.json({ ok: true, lead_id: lead.id });
}
