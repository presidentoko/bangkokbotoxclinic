import { rcmd } from "./upstash";

export type PartnerStatus = "active" | "trial" | "overdue" | "churned";

export type ClinicPartner = {
  clinic_id: string;
  contact_email?: string;
  plan_tier: "trial" | "pilot" | "paid";
  status?: PartnerStatus;
  monthly_fee_thb?: number;
  started_at?: string;
  notes?: string;
};

const REDIS_KEY = "admin:partners";

export async function listPartners(): Promise<ClinicPartner[]> {
  const r = (await rcmd(["GET", REDIS_KEY])) as string | null;
  if (!r) return [];
  try { return JSON.parse(r) as ClinicPartner[]; } catch { return []; }
}

async function saveAll(partners: ClinicPartner[]): Promise<boolean> {
  return (await rcmd(["SET", REDIS_KEY, JSON.stringify(partners)])) !== null;
}

export async function addPartner(p: ClinicPartner): Promise<{ ok: boolean; error?: string }> {
  const all = await listPartners();
  if (all.some((x) => x.clinic_id === p.clinic_id)) return { ok: false, error: "already_exists" };
  const next = [...all, { ...p, started_at: p.started_at ?? new Date().toISOString().slice(0, 10) }];
  return (await saveAll(next)) ? { ok: true } : { ok: false, error: "redis_unavailable" };
}

export async function updatePartner(
  clinic_id: string,
  patch: Partial<Omit<ClinicPartner, "clinic_id">>
): Promise<{ ok: boolean; error?: string }> {
  const all = await listPartners();
  const idx = all.findIndex((x) => x.clinic_id === clinic_id);
  if (idx === -1) return { ok: false, error: "not_found" };
  all[idx] = { ...all[idx], ...patch };
  return (await saveAll(all)) ? { ok: true } : { ok: false, error: "redis_unavailable" };
}

export async function removePartner(clinic_id: string): Promise<{ ok: boolean; error?: string }> {
  const all = await listPartners();
  const next = all.filter((x) => x.clinic_id !== clinic_id);
  if (next.length === all.length) return { ok: false, error: "not_found" };
  return (await saveAll(next)) ? { ok: true } : { ok: false, error: "redis_unavailable" };
}
