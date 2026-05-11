// 파트너 클리닉 routing config loader.
// data/clinic_partners.json 읽고 clinic_id → 라우팅 정보 매핑.

import fs from "node:fs";
import path from "node:path";

export type ClinicPartner = {
  clinic_id: string;
  contact_email?: string;
  line_user_id?: string;
  line_bot_token?: string;
  plan_tier: "trial" | "pilot" | "paid";
  monthly_ticket_avg_thb?: number;
  started_at?: string;
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
