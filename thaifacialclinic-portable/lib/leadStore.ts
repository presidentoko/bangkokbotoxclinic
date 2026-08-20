import { rcmd, rpipeline, makeId, upstashEnabled } from "./upstash";

export type LeadRecord = {
  id: string;
  clinic_id: string;
  clinic_name: string;
  name: string;
  email: string;
  phone: string;
  procedure: string;
  date: string;
  time_slot: string;
  notes: string;
  context: string;
  ua: string;
  ref: string;
  at: string;
};

export function makeLeadId(): string {
  return makeId(16);
}

// 2026-08-20: clinic_id 가 빈 리드(홈 히어로 폼, 광고주 문의, 온보딩, 후기)는
// 예전엔 `clinic::leads` 라는 아무도 조회하지 않는 키로 들어갔다. 사실상 유실이라
// "general" 버킷으로 모아 관리 UI 가 읽을 수 있게 한다.
const GENERAL_BUCKET = "general";

export async function storeLead(rec: LeadRecord): Promise<void> {
  const bucket = rec.clinic_id || GENERAL_BUCKET;
  const key = `clinic:${bucket}:leads`;
  await rpipeline([
    ["LPUSH", key, JSON.stringify(rec)],
    ["LTRIM", key, 0, 199],
    ["EXPIRE", key, 60 * 60 * 24 * 90],
    ["INCR", `clinic:${rec.clinic_id}:lead_count`],
  ]);
}

export async function getRecentLeads(clinicId: string, limit = 20): Promise<LeadRecord[]> {
  const result = (await rcmd(["LRANGE", `clinic:${clinicId}:leads`, 0, limit - 1])) as string[] | null;
  if (!Array.isArray(result)) return [];
  return result
    .map((s) => {
      try { return JSON.parse(s) as LeadRecord; } catch { return null; }
    })
    .filter((x): x is LeadRecord => x !== null);
}

export async function getLeadCount(clinicId: string): Promise<number> {
  const r = (await rcmd(["GET", `clinic:${clinicId}:lead_count`])) as string | null;
  return r ? parseInt(r, 10) || 0 : 0;
}

/** Per-IP rate limit. 10 min window, 5 leads max. */
export async function rateLimitOk(ip: string): Promise<boolean> {
  if (!upstashEnabled) return true;
  const key = `rl:lead:${ip}`;
  const count = (await rcmd(["INCR", key])) as number | null;
  if (count === 1) await rcmd(["EXPIRE", key, 600]);
  return typeof count === "number" ? count <= 5 : true;
}
