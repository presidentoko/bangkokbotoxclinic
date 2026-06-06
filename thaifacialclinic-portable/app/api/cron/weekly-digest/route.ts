// Vercel Cron — runs every Monday 09:00 ICT.
// Iterates active partners with contact email, sends weekly digest.
// Auth: header `Authorization: Bearer ${CRON_SECRET}` (Vercel adds it for cron triggers).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listPartners } from "@/lib/partnerStore";
import { loadClinics } from "@/lib/data";
import { rcmd } from "@/lib/upstash";
import { sendEmail } from "@/lib/sendEmail";
import { weeklyDigestHtml } from "@/lib/emailTemplates";
import { reviewHash } from "@/lib/dashboardStore";
import type { LeadRecord } from "@/lib/leadStore";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const got = req.headers.get("authorization");
  return got === `Bearer ${expected}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const partners = (await listPartners()).filter((p) => p.status === "active" && p.contact_email);
  const { clinics } = loadClinics();
  const byId = new Map(clinics.map((c) => [c.id, c]));

  let sent = 0;
  const errors: string[] = [];

  for (const p of partners) {
    const clinic = byId.get(p.clinic_id);
    if (!clinic || !p.contact_email) continue;

    // Pull last 7 days of leads + reply-done state
    const leadsRaw = (await rcmd(["LRANGE", `clinic:${p.clinic_id}:leads`, 0, 49])) as string[] | null;
    const leads: LeadRecord[] = Array.isArray(leadsRaw)
      ? leadsRaw.map((s) => { try { return JSON.parse(s) as LeadRecord; } catch { return null; } }).filter((x): x is LeadRecord => x !== null)
      : [];
    const last7d = leads.filter((l) => Date.now() - new Date(l.at).getTime() < 7 * 86_400_000);

    const doneHashes = (await rcmd(["SMEMBERS", `clinic:${p.clinic_id}:reply_done`])) as string[] | null;
    const doneSet = new Set(Array.isArray(doneHashes) ? doneHashes : []);
    const negatives = (clinic.reviews_sample || []).filter((r) => (r.rating ?? 5) <= 3);
    const pendingReplies = negatives.filter((r) => !doneSet.has(reviewHash(r.text))).length;

    // Find #1 competitor by city (rough)
    const competitors = clinics
      .filter((c) => c.city === clinic.city && c.id !== clinic.id && c.is_hair_relevant)
      .sort((a, b) => b.trust_score - a.trust_score);
    const top = competitors[0];

    const html = weeklyDigestHtml({
      clinicName: clinic.name,
      newLeads: last7d.length,
      pendingReplies,
      trustScore: clinic.trust_score,
      competitorName: top?.name,
      beatsCompetitor: top ? clinic.trust_score >= top.trust_score : true,
      dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thaifacialclinic.com"}/dashboard/${clinic.id}/`,
    });

    const r = await sendEmail({
      to: p.contact_email,
      subject: `${clinic.name.split(" ").slice(0, 3).join(" ")} — your weekly intel`,
      html,
      text: `Hi ${clinic.name} team — your weekly digest is ready. ${last7d.length} new leads, ${pendingReplies} unanswered reviews. Open dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/${clinic.id}/`,
    });

    if (r.ok) sent++; else errors.push(`${p.clinic_id}: ${r.error}`);
  }

  return NextResponse.json({
    ok: true,
    partners_eligible: partners.length,
    sent,
    errors: errors.slice(0, 10),
  });
}
