// Admin-only: payment ledger.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listPayments, recordPayment, deletePayment, paymentsSummary, type Payment } from "@/lib/paymentStore";

export const runtime = "nodejs";

async function ensureAdmin(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ ok: false }, { status: 401 });
  return null;
}

export async function GET(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const payments = await listPayments();
  const summary30 = await paymentsSummary(30);
  const summary90 = await paymentsSummary(90);
  return NextResponse.json({ ok: true, payments, summary_30d: summary30, summary_90d: summary90 });
}

export async function POST(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const body = (await req.json()) as Omit<Payment, "id" | "paid_at"> & { paid_at?: string };
  if (!body.clinic_id || !body.amount_thb) return NextResponse.json({ ok: false, error: "clinic_id + amount_thb required" }, { status: 400 });
  const r = await recordPayment(body);
  return NextResponse.json(r);
}

export async function DELETE(req: NextRequest) {
  const fail = await ensureAdmin(req); if (fail) return fail;
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json(await deletePayment(id));
}
