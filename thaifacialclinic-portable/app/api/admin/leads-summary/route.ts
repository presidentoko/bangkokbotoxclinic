// Admin-only: cross-clinic leads aggregation.
// Returns top N most-recent leads across all clinics + per-clinic counts.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { rcmd } from "@/lib/upstash";
import { loadClinics } from "@/lib/data";
import type { LeadRecord } from "@/lib/leadStore";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ ok: false }, { status: 401 });

  const { clinics } = loadClinics();
  const limit = Math.min(200, parseInt(req.nextUrl.searchParams.get("limit") || "50"));

  // Pull recent leads from a sample of clinics (top by trust + recent activity)
  const sample = clinics
    .filter((c) => c.is_hair_relevant)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 50);

  const allLeads: LeadRecord[] = [];
  const perClinic: Record<string, number> = {};

  for (const c of sample) {
    const arr = (await rcmd(["LRANGE", `clinic:${c.id}:leads`, 0, 9])) as string[] | null;
    if (!Array.isArray(arr)) continue;
    perClinic[c.id] = arr.length;
    for (const raw of arr) {
      try {
        const lead = JSON.parse(raw) as LeadRecord;
        allLeads.push(lead);
      } catch { /* skip */ }
    }
  }

  // Sort newest first
  allLeads.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const total = allLeads.length;
  const last7d = allLeads.filter((l) => Date.now() - new Date(l.at).getTime() < 7 * 86_400_000).length;
  const last30d = allLeads.filter((l) => Date.now() - new Date(l.at).getTime() < 30 * 86_400_000).length;

  return NextResponse.json({
    ok: true,
    leads: allLeads.slice(0, limit),
    stats: { total, last7d, last30d, clinics_with_leads: Object.keys(perClinic).length },
    per_clinic: perClinic,
  });
}
