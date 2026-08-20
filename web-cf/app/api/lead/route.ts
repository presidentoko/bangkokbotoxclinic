// Lead capture endpoint.
// Flow: validate → honeypot → rate-limit → store → notify (email + Telegram) → respond.
// 파트너 클리닉이면 클리닉 직접 라우팅, 아니면 fallback (우리 inbox).
// 모든 리드는 항상 중앙 Telegram 봇으로도 알림 — 웹사이트 고객 컨택 채널을
// LINE/WhatsApp에서 컨택폼 → Telegram으로 통일 (2026-07-20).

import { storeLead, rateLimitOk, makeLeadId, type LeadRecord } from "@/lib/leadStore";
import { listPartners } from "@/lib/partnerStore";
import { sendEmail, sendTelegram, getFallbackEmail } from "@/lib/notify";

export const runtime = "nodejs";
export const maxDuration = 30;

const LEGACY_WEBHOOK = process.env.LEAD_WEBHOOK_URL;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }

  // Honeypot — bot이 채우는 필드. 채워져 있으면 silent drop (200 반환해서 봇 학습 차단)
  if (body._hp && String(body._hp).length > 0) {
    console.log("[lead] honeypot tripped, dropping silently");
    return Response.json({ ok: true });
  }

  // Rate limit per IP
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
    service: String(body.service || "").slice(0, 100),
    date: String(body.date || "").slice(0, 50),
    time_slot: String(body.timeSlot || "").slice(0, 50),
    notes: String(body.message || body.notes || "").slice(0, 2000),
    context: String(body.context || ""),
    ua: req.headers.get("user-agent")?.slice(0, 300) || "",
    ref: req.headers.get("referer")?.slice(0, 300) || "",
    at: new Date().toISOString(),
  };

  // 저장 — clinicId 없는(지역/서비스 허브 폼) 리드도 공용 버킷에 반드시 저장.
  // 예전엔 clinicId 있을 때만 저장해서, notify 실패 시(이메일 미설정 등) 완전 유실됐음.
  await storeLead(lead);

  // 알림 라우팅: 파트너 클리닉이면 그 클리닉으로, 아니면 fallback
  // (Redis 우선, JSON 파일 fallback — partnerStore.listPartners 가 처리)
  const partner = clinicId
    ? (await listPartners()).find((p) => p.clinic_id === clinicId) ?? null
    : null;
  const recipientEmail = partner?.contact_email || getFallbackEmail();
  const subject = `New lead · ${clinicName || "general"} · ${lead.service || "consultation"}`;
  const text = formatTextSummary(lead);
  const html = formatHtmlSummary(lead);

  // 병렬 전송 — 파트너/fallback 이메일 + 중앙 Telegram 봇, 항상 둘 다.
  const tasks: Promise<unknown>[] = [
    sendEmail(recipientEmail, subject, html, text),
    sendTelegram(`📩 New lead\n${text}`),
  ];
  // Legacy Slack-style webhook (fallback notification 채널)
  if (LEGACY_WEBHOOK) {
    tasks.push(
      fetch(LEGACY_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lead }),
      }).catch((e) => console.error("[lead] legacy webhook err", e))
    );
  }
  // 2026-08-20: 예전엔 allSettled 결과를 버리고 무조건 ok:true 를 돌려줬다.
  // 이메일과 Telegram 이 둘 다 실패해도(키 만료, Resend 장애 등) 방문자에겐
  // 성공으로 보이고 클리닉은 문의가 온 사실 자체를 모른다 — 리드는 Redis 에
  // 남으니 유실은 아니지만, 누가 보기 전까진 없는 것과 같다.
  // 응답은 200 을 유지한다: 저장은 실제로 성공했으므로 "실패했다"고 알리면
  // 방문자가 멀쩡히 접수된 문의를 다시 넣거나 경쟁 사이트로 간다.
  // 대신 채널 전멸은 눈에 띄는 한 줄로 남겨 추적/알림을 걸 수 있게 한다.
  const results = await Promise.allSettled(tasks);
  const delivered = results.some((r) => r.status === "fulfilled");
  if (!delivered) {
    console.error(
      `[lead][NOTIFY-ALL-FAILED] ${lead.id} clinic=${clinicId || "(none)"} email=${recipientEmail} — ` +
        `저장은 됨(clinic:${clinicId || "general"}:leads), 알림 채널 전멸`,
      results.map((r) => (r.status === "rejected" ? r.reason : null)).filter(Boolean),
    );
  }

  console.log(`[lead] ${lead.id} clinic=${clinicId || "(none)"} → ${recipientEmail}${partner ? " (partner)" : ""}${delivered ? "" : " [NOTIFY FAILED]"}`);
  return Response.json({ ok: true, lead_id: lead.id, notified: delivered });
}

function formatTextSummary(l: LeadRecord): string {
  return [
    `New lead — ${l.clinic_name || "general inquiry"}`,
    ``,
    `Patient:  ${l.name || "(no name)"}`,
    `Email:    ${l.email}`,
    l.phone ? `Phone/LINE: ${l.phone}` : null,
    l.service ? `Service:  ${l.service}` : null,
    l.date ? `Date:     ${l.date}` : null,
    l.time_slot ? `Time:     ${l.time_slot}` : null,
    l.notes ? `Notes:    ${l.notes}` : null,
    ``,
    `Submitted: ${l.at}`,
    `Source:    ${l.ref}`,
    `Lead ID:   ${l.id}`,
    ``,
    `⚡ Reply within 15 min for best conversion.`,
  ].filter(Boolean).join("\n");
}

function formatHtmlSummary(l: LeadRecord): string {
  const row = (label: string, val: string) => val
    ? `<tr><td style="padding:6px 12px 6px 0;color:#737373;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:14px;font-weight:500;">${escapeHtml(val)}</td></tr>`
    : "";
  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#0a0a0a;max-width:600px;margin:0 auto;padding:24px;">
<div style="background:#10b981;color:white;padding:16px 20px;border-radius:12px 12px 0 0;">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.9;">New lead received</div>
  <div style="font-size:20px;font-weight:800;margin-top:4px;">${escapeHtml(l.clinic_name || "General inquiry")}</div>
</div>
<div style="background:white;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;padding:20px;">
<table style="width:100%;border-collapse:collapse;">
${row("Patient", l.name || "(no name)")}
${row("Email", l.email)}
${row("Phone/LINE", l.phone)}
${row("Service", l.service)}
${row("Date", l.date)}
${row("Time", l.time_slot)}
${row("Notes", l.notes)}
</table>
<div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:11px;color:#737373;">
  Submitted ${l.at}<br>
  Lead ID: ${l.id}<br>
  Source: ${escapeHtml(l.ref || "direct")}
</div>
<div style="margin-top:16px;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;">
  ⚡ Reply within 15 min for best conversion rate.
</div>
</div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
