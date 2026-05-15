// 파트너 클리닉 routing config loader.
// data/clinic_partners.json 읽고 clinic_id → 라우팅 정보 매핑.

import fs from "node:fs";
import path from "node:path";

export type PartnerStatus = "active" | "trial" | "overdue" | "churned";

export type Payment = {
  id: string;                 // unique id (timestamp-based)
  amount_thb: number;
  paid_at: string;            // ISO date (YYYY-MM-DD)
  method: "promptpay" | "bank_transfer" | "card" | "cash" | "other";
  period_start?: string;      // billing period covered
  period_end?: string;
  note?: string;
};

export type ClinicPartner = {
  clinic_id: string;
  contact_email?: string;
  line_user_id?: string;
  line_bot_token?: string;
  plan_tier: "trial" | "pilot" | "paid";
  status?: PartnerStatus;     // manually overridable; defaults computed from payments
  monthly_fee_thb?: number;   // recurring fee (used for MRR)
  monthly_ticket_avg_thb?: number;
  started_at?: string;
  notes?: string;             // free-form admin notes
  payments?: Payment[];
};

type PartnerFile = {
  partners: ClinicPartner[];
};

let cache: PartnerFile | null = null;

function load(): PartnerFile {
  if (cache) return cache;
  try {
    const p = path.join(process.cwd(), "data", "clinic_partners.json");
    const raw = fs.readFileSync(p, "utf-8");
    cache = JSON.parse(raw) as PartnerFile;
    return cache;
  } catch (e) {
    console.error("[partners] load failed", e);
    cache = { partners: [] };
    return cache;
  }
}

export function getPartner(clinicId: string): ClinicPartner | null {
  return load().partners.find((p) => p.clinic_id === clinicId) ?? null;
}

export function isPartner(clinicId: string): boolean {
  return !!getPartner(clinicId);
}

export function allPartners(): ClinicPartner[] {
  return load().partners;
}
