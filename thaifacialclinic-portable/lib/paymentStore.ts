// Payment receipts — admin marks "QR transfer received". Simple ledger.

import { rcmd, makeId } from "./upstash";

export type Payment = {
  id: string;
  clinic_id: string;
  amount_thb: number;
  paid_at: string;   // ISO
  method: "promptpay" | "bank_transfer" | "cash" | "other";
  note?: string;
  reference?: string; // bank ref number
};

const KEY = "admin:payments";

export async function listPayments(): Promise<Payment[]> {
  const r = (await rcmd(["GET", KEY])) as string | null;
  if (!r) return [];
  try { return JSON.parse(r) as Payment[]; } catch { return []; }
}

export async function recordPayment(p: Omit<Payment, "id" | "paid_at"> & { paid_at?: string }): Promise<{ ok: boolean; payment?: Payment }> {
  const payment: Payment = {
    id: makeId(12),
    paid_at: p.paid_at ?? new Date().toISOString(),
    clinic_id: p.clinic_id,
    amount_thb: p.amount_thb,
    method: p.method,
    note: p.note,
    reference: p.reference,
  };
  const all = await listPayments();
  const next = [payment, ...all].slice(0, 500);
  const ok = (await rcmd(["SET", KEY, JSON.stringify(next)])) !== null;
  return { ok, payment };
}

export async function deletePayment(id: string): Promise<{ ok: boolean }> {
  const all = await listPayments();
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return { ok: false };
  return { ok: (await rcmd(["SET", KEY, JSON.stringify(next)])) !== null };
}

/** Sum payments in last N days */
export async function paymentsSummary(days = 30): Promise<{ count: number; total_thb: number }> {
  const all = await listPayments();
  const cutoff = Date.now() - days * 86_400_000;
  const recent = all.filter((p) => new Date(p.paid_at).getTime() >= cutoff);
  return { count: recent.length, total_thb: recent.reduce((s, p) => s + p.amount_thb, 0) };
}
