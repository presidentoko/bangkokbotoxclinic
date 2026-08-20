import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { setLeadStatus, setLeadNote, type LeadStatus } from "@/lib/dashboardStore";
import { isDashboardAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const VALID_STATUSES: LeadStatus[] = ["new", "contacted", "booked", "no_show", "cancelled"];

export async function POST(req: NextRequest) {
  const { clinic_id, lead_id, status, note } = (await req.json()) as {
    clinic_id?: string;
    lead_id?: string;
    status?: LeadStatus;
    note?: string;
  };

  if (!clinic_id || !lead_id) {
    return NextResponse.json({ error: "clinic_id and lead_id required" }, { status: 400 });
  }
  if (!(await isDashboardAuthed(req, clinic_id))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    const ok = await setLeadStatus(clinic_id, lead_id, status);
    if (!ok) return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  if (note !== undefined) {
    const ok = await setLeadNote(clinic_id, lead_id, note);
    if (!ok) return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
