import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listPartners, updatePartner } from "@/lib/partnerStore";
import { makePaymentId } from "@/lib/billing";
import type { Payment } from "@/lib/partners";
import { isAdminAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/** POST { clinic_id, amount_thb, paid_at, method, period_start?, period_end?, note? } → add payment */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<Payment> & { clinic_id: string };
  if (!body.clinic_id || !body.amount_thb || !body.paid_at || !body.method) {
    return NextResponse.json({ error: "clinic_id, amount_thb, paid_at, method required" }, { status: 400 });
  }
  const partners = await listPartners();
  const target = partners.find((p) => p.clinic_id === body.clinic_id);
  if (!target) return NextResponse.json({ error: "partner_not_found" }, { status: 404 });

  const pmt: Payment = {
    id: makePaymentId(),
    amount_thb: Number(body.amount_thb),
    paid_at: body.paid_at,
    method: body.method,
    period_start: body.period_start,
    period_end: body.period_end,
    note: body.note,
  };
  const updated = [...(target.payments ?? []), pmt];
  const res = await updatePartner(body.clinic_id, { payments: updated });
  return NextResponse.json({ ok: res.ok, payment: pmt }, { status: res.ok ? 201 : 500 });
}

/** DELETE { clinic_id, payment_id } → remove payment */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { clinic_id, payment_id } = (await req.json()) as { clinic_id?: string; payment_id?: string };
  if (!clinic_id || !payment_id) return NextResponse.json({ error: "clinic_id and payment_id required" }, { status: 400 });
  const partners = await listPartners();
  const target = partners.find((p) => p.clinic_id === clinic_id);
  if (!target) return NextResponse.json({ error: "partner_not_found" }, { status: 404 });
  const updated = (target.payments ?? []).filter((p) => p.id !== payment_id);
  const res = await updatePartner(clinic_id, { payments: updated });
  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 500 });
}
