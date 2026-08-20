import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listPartners, addPartner } from "@/lib/partnerStore";
import type { ClinicPartner } from "@/lib/partners";
import { isAdminAuthed } from "@/lib/adminAuth";

export const maxDuration = 30;

export const dynamic = "force-dynamic";

type BulkRow = {
  clinic_id: string;
  plan_tier?: "trial" | "pilot" | "paid";
  contact_email?: string;
  line_user_id?: string;
  monthly_fee_thb?: number;
  monthly_ticket_avg_thb?: number;
  started_at?: string;
  notes?: string;
};

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as { rows?: BulkRow[] };
  if (!Array.isArray(body.rows) || body.rows.length === 0) {
    return NextResponse.json({ error: "rows required" }, { status: 400 });
  }
  if (body.rows.length > 200) {
    return NextResponse.json({ error: "too many rows (max 200)" }, { status: 400 });
  }

  const existing = new Set((await listPartners()).map((p) => p.clinic_id));
  const results: { clinic_id: string; ok: boolean; reason?: string }[] = [];

  for (const row of body.rows) {
    if (!row.clinic_id || typeof row.clinic_id !== "string") {
      results.push({ clinic_id: row.clinic_id ?? "?", ok: false, reason: "missing clinic_id" });
      continue;
    }
    if (existing.has(row.clinic_id)) {
      results.push({ clinic_id: row.clinic_id, ok: false, reason: "already exists" });
      continue;
    }
    const partner: ClinicPartner = {
      clinic_id: row.clinic_id,
      plan_tier: row.plan_tier ?? "trial",
      contact_email: row.contact_email,
      line_user_id: row.line_user_id,
      monthly_fee_thb: row.monthly_fee_thb,
      monthly_ticket_avg_thb: row.monthly_ticket_avg_thb,
      started_at: row.started_at,
      notes: row.notes,
    };
    const res = await addPartner(partner);
    if (res.ok) existing.add(row.clinic_id);
    results.push({ clinic_id: row.clinic_id, ok: res.ok, reason: res.error });
  }

  const ok = results.filter((r) => r.ok).length;
  return NextResponse.json({ imported: ok, total: results.length, results });
}
