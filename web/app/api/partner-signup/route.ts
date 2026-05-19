// Partner signup endpoint.
// 클리닉 owner 가 self-service 등록 → admin (chillanel22) 에게 이메일 알림.
// admin 이 수동으로 clinic_partners.json 에 추가 (production filesystem 은 read-only).
// 향후 Upstash 에 pending 저장하고 admin dashboard 에서 approve 하는 방식 가능.

import { sendEmail, getFallbackEmail } from "@/lib/notify";
import { rateLimitOk } from "@/lib/leadStore";
import { loadMasterDb, getClinicById } from "@/lib/data";

export const runtime = "nodejs";

// Dashboard URL must reflect the deployed site (botox vs dental), not a hardcode.
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

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

  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  if (!(await rateLimitOk(ip))) {
    return new Response("rate limit", { status: 429 });
  }

  const clinicId = String(body.clinicId || "").trim();
  const contactName = String(body.contactName || "").trim().slice(0, 200);
  const contactEmail = String(body.contactEmail || "").trim();
  const lineUserId = String(body.lineUserId || "").trim().slice(0, 100);
  const phone = String(body.phone || "").trim().slice(0, 100);
  const planTier = String(body.planTier || "pilot").trim();
  const monthlyTicketAvg = Number(body.monthlyTicketAvg) || 15000;
  const notes = String(body.notes || "").slice(0, 2000);

  if (!clinicId || !contactEmail || !contactEmail.includes("@")) {
    return new Response("missing required fields", { status: 400 });
  }

  // 클리닉 실제 존재 확인 (master_db)
  const db = await loadMasterDb();
  const clinic = getClinicById(db.clinics, clinicId);
  if (!clinic) {
    return new Response("clinic not found", { status: 404 });
  }

  // admin 에게 알림
  const adminEmail = getFallbackEmail();
  const subject = `🎉 New partner signup: ${clinic.name}`;
  const text = [
    `New B2B partner signup received.`,
    ``,
    `Clinic:     ${clinic.name}`,
    `Clinic ID:  ${clinic.id}`,
    `District:   ${clinic.district || "(unknown)"}`,
    `Trust:      ${clinic.trust_score}/100`,
    ``,
    `Contact:    ${contactName} <${contactEmail}>`,
    phone ? `Phone:      ${phone}` : null,
    lineUserId ? `LINE userId: ${lineUserId}` : null,
    `Plan tier:  ${planTier}`,
    `Avg ticket: ฿${monthlyTicketAvg.toLocaleString()}`,
    notes ? `Notes:      ${notes}` : null,
    ``,
    `━━━ Next steps for admin ━━━`,
    `1. Add to web/data/clinic_partners.json:`,
    ``,
    JSON.stringify({
      clinic_id: clinic.id,
      contact_email: contactEmail,
      line_user_id: lineUserId || undefined,
      plan_tier: planTier,
      monthly_ticket_avg_thb: monthlyTicketAvg,
      started_at: new Date().toISOString().slice(0, 10),
    }, null, 2),
    ``,
    `2. Push commit → Vercel redeploys → partner routing active`,
    `3. Reply to partner: dashboard URL = ${SITE}/dashboard/${clinic.id}`,
  ].filter(Boolean).join("\n");

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
<div style="background:#7c3aed;color:white;padding:16px 20px;border-radius:12px 12px 0 0;">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.9;">🎉 New partner signup</div>
  <div style="font-size:22px;font-weight:800;margin-top:4px;">${escapeHtml(clinic.name)}</div>
</div>
<div style="background:white;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;padding:20px;">
<p><strong>Clinic:</strong> ${escapeHtml(clinic.name)} (${clinic.district || "?"})<br>
<strong>Trust:</strong> ${clinic.trust_score}/100<br>
<strong>Plan tier:</strong> ${escapeHtml(planTier)}</p>
<hr>
<p><strong>Contact:</strong> ${escapeHtml(contactName)} &lt;${escapeHtml(contactEmail)}&gt;<br>
${phone ? `<strong>Phone:</strong> ${escapeHtml(phone)}<br>` : ""}
${lineUserId ? `<strong>LINE userId:</strong> <code>${escapeHtml(lineUserId)}</code><br>` : ""}
<strong>Avg ticket:</strong> ฿${monthlyTicketAvg.toLocaleString()}</p>
${notes ? `<p><strong>Notes:</strong><br>${escapeHtml(notes).replace(/\n/g, "<br>")}</p>` : ""}
<hr>
<p><strong>Add to clinic_partners.json:</strong></p>
<pre style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:12px;overflow-x:auto;">${JSON.stringify({
  clinic_id: clinic.id,
  contact_email: contactEmail,
  line_user_id: lineUserId || undefined,
  plan_tier: planTier,
  monthly_ticket_avg_thb: monthlyTicketAvg,
  started_at: new Date().toISOString().slice(0, 10),
}, null, 2)}</pre>
<p><strong>Dashboard URL:</strong><br>
<a href="${SITE}/dashboard/${clinic.id}">${SITE}/dashboard/${clinic.id}</a></p>
</div></body></html>`;

  await sendEmail(adminEmail, subject, html, text);

  console.log(`[partner-signup] ${clinic.name} (${clinic.id}) → ${contactEmail}`);
  return Response.json({ ok: true, clinic_name: clinic.name });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
