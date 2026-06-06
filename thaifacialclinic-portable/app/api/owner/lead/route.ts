// Owner mutations on a clinic's leads (status / note / revenue).
// Auth: clinic_id + access_token (owner via ?k=) OR admin cookie.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { verifyAccess } from "@/lib/dashboardAccessStore";
import { setLeadStatus, setLeadNote, setLeadRevenue, type LeadStatus } from "@/lib/dashboardStore";

export const runtime = "nodejs";

const STATUSES: LeadStatus[] = ["new", "contacted", "booked", "no_show", "cancelled"];

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    clinic_id?: string;
    access_token?: string;
    lead_id?: string;
    status?: string;
    note?: string;
    revenue_thb?: number;
  };

  if (!body.clinic_id || !body.lead_id) {
    return NextResponse.json({ ok: false, error: "clinic_id + lead_id required" }, { status: 400 });
  }

  // Auth: staff OR per-clinic token
  const staff = await isAdminAuthed(req);
  const tokenOk = body.access_token ? await verifyAccess(body.clinic_id, body.access_token) : false;
  if (!staff && !tokenOk) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const results: Record<string, boolean> = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ ok: false, error: "invalid status" }, { status: 400 });
    }
    results.status = await setLeadStatus(body.clinic_id, body.lead_id, body.status as LeadStatus);
  }

  if (body.note !== undefined) {
    const noteStr = String(body.note).slice(0, 1000);
    results.note = await setLeadNote(body.clinic_id, body.lead_id, noteStr);
  }

  if (body.revenue_thb !== undefined) {
    const amt = Number(body.revenue_thb);
    if (!Number.isFinite(amt) || amt < 0 || amt > 10_000_000) {
      return NextResponse.json({ ok: false, error: "invalid revenue" }, { status: 400 });
    }
    results.revenue = await setLeadRevenue(body.clinic_id, body.lead_id, amt);
  }

  return NextResponse.json({ ok: true, updated: results });
}
