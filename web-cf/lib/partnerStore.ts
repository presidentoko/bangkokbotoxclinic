// 파트너 CRUD — Upstash Redis 우선, fallback은 clinic_partners.json (읽기 전용).
// Vercel 런타임에서 파일시스템 쓰기 불가 → Redis에만 저장.

import type { ClinicPartner } from "./partners";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "admin:partners";

async function redisGet(): Promise<ClinicPartner[] | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${REDIS_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: string | null };
    if (!j.result) return null;
    return JSON.parse(j.result) as ClinicPartner[];
  } catch {
    return null;
  }
}

async function redisSet(partners: ClinicPartner[]): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", REDIS_KEY, JSON.stringify(partners)]),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function loadJsonFallback(): Promise<ClinicPartner[]> {
  try {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const p = join(process.cwd(), "data", "clinic_partners.json");
    const raw = readFileSync(p, "utf-8");
    const parsed = JSON.parse(raw) as { partners?: ClinicPartner[] };
    return parsed.partners ?? [];
  } catch {
    return [];
  }
}

export async function listPartners(): Promise<ClinicPartner[]> {
  const fromRedis = await redisGet();
  if (fromRedis !== null) return fromRedis;
  return loadJsonFallback();
}

export async function addPartner(p: ClinicPartner): Promise<{ ok: boolean; error?: string }> {
  const all = await listPartners();
  if (all.some((x) => x.clinic_id === p.clinic_id)) {
    return { ok: false, error: "already_exists" };
  }
  const updated = [...all, { ...p, started_at: p.started_at ?? new Date().toISOString().slice(0, 10) }];
  const saved = await redisSet(updated);
  return saved ? { ok: true } : { ok: false, error: "redis_unavailable" };
}

export async function updatePartner(
  clinic_id: string,
  patch: Partial<Omit<ClinicPartner, "clinic_id">>
): Promise<{ ok: boolean; error?: string }> {
  const all = await listPartners();
  const idx = all.findIndex((x) => x.clinic_id === clinic_id);
  if (idx === -1) return { ok: false, error: "not_found" };
  all[idx] = { ...all[idx], ...patch };
  const saved = await redisSet(all);
  return saved ? { ok: true } : { ok: false, error: "redis_unavailable" };
}

export async function removePartner(clinic_id: string): Promise<{ ok: boolean; error?: string }> {
  const all = await listPartners();
  const updated = all.filter((x) => x.clinic_id !== clinic_id);
  if (updated.length === all.length) return { ok: false, error: "not_found" };
  const saved = await redisSet(updated);
  return saved ? { ok: true } : { ok: false, error: "redis_unavailable" };
}
