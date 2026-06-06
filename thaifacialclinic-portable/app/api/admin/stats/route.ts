// Admin-only: site-wide overview stats.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { rcmd } from "@/lib/upstash";
import { loadClinics } from "@/lib/data";
import { listPartners } from "@/lib/partnerStore";
import { listOutreach } from "@/lib/outreachStore";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ ok: false }, { status: 401 });

  const bundle = loadClinics();
  const partners = await listPartners();
  const outreach = await listOutreach();
  const newsletter = (await rcmd(["LLEN", "newsletter:subscribers"])) as number | null;

  // MRR from partners
  const mrr = partners.filter((p) => p.status === "active").reduce((s, p) => s + (p.monthly_fee_thb ?? 0), 0);
  const trialing = partners.filter((p) => p.status === "trial" || p.plan_tier === "trial").length;

  // Sample 30 top clinics for lead counts
  const sample = bundle.clinics
    .filter((c) => c.is_hair_relevant)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 30);

  let totalLeads = 0;
  for (const c of sample) {
    const n = (await rcmd(["GET", `clinic:${c.id}:lead_count`])) as string | null;
    if (n) totalLeads += parseInt(n, 10) || 0;
  }

  return NextResponse.json({
    ok: true,
    clinics_total: bundle.total,
    clinics_hair: bundle.clinics.filter((c) => c.is_hair_relevant).length,
    avg_trust: bundle.avg_trust,
    partners_total: partners.length,
    partners_active: partners.filter((p) => p.status === "active").length,
    partners_trial: trialing,
    mrr_thb: mrr,
    outreach_open: outreach.filter((o) => o.stage !== "won" && o.stage !== "lost").length,
    outreach_won: outreach.filter((o) => o.stage === "won").length,
    newsletter_subscribers: newsletter ?? 0,
    leads_sampled: totalLeads,
    generated_at: bundle.generated_at,
  });
}
