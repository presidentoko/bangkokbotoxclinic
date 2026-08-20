// Lead 저장소 — Upstash Redis REST API 사용 (SDK 없이 fetch 직접).
// env 설정 안되어 있으면 graceful no-op. dashboard 는 빈 배열 반환.
// 무료 tier 10K commands/day. lead 1건당 ~3 commands (lpush + expire + counter).

import { checkRateLimit } from "./rateLimit";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type LeadRecord = {
  id: string;            // random nanoid-style
  clinic_id: string;
  clinic_name: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time_slot: string;
  notes: string;
  context: string;
  ua: string;
  ref: string;
  at: string;            // ISO timestamp
};

async function upstash(cmd: (string | number)[]): Promise<unknown> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[leadStore] upstash err", res.status, await res.text());
      return null;
    }
    const j = (await res.json()) as { result?: unknown };
    return j.result;
  } catch (e) {
    console.error("[leadStore] upstash fetch failed", e);
    return null;
  }
}

/** Batch 여러 command 1 round-trip — storeLead 같이 atomic 묶음에 사용. */
async function upstashPipeline(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return cmds.map(() => null);
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmds),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[leadStore] upstash pipeline err", res.status, await res.text());
      return cmds.map(() => null);
    }
    const arr = (await res.json()) as { result?: unknown }[];
    return arr.map((r) => r?.result ?? null);
  } catch (e) {
    console.error("[leadStore] upstash pipeline failed", e);
    return cmds.map(() => null);
  }
}

export function makeLeadId(): string {
  // crypto.randomUUID() preferred — collision-resistant + URL-safe after dash strip.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// 2026-08-20: clinic_id 가 빈 리드(지역/서비스 허브 폼, 홈 문의)는 `clinic::leads`
// 라는 키로 들어갔다 — 라우트 주석은 "공용 버킷에 반드시 저장"이라고 적혀 있지만
// getRecentLeads 는 clinicId 를 받아 조회하므로 그 키를 부를 호출자가 없다.
// 저장은 됐는데 아무도 못 읽는 상태였다. 명시적인 "general" 버킷으로 모은다.
const GENERAL_BUCKET = "general";

export async function storeLead(rec: LeadRecord): Promise<void> {
  const bucket = rec.clinic_id || GENERAL_BUCKET;
  const key = `clinic:${bucket}:leads`;
  // 4 commands → 1 round trip (4× faster + 4× cheaper on Upstash quota)
  await upstashPipeline([
    ["LPUSH", key, JSON.stringify(rec)],
    ["LTRIM", key, 0, 199],                  // 최근 200건만 보존
    ["EXPIRE", key, 60 * 60 * 24 * 90],      // 90일 TTL
    ["INCR", `clinic:${bucket}:lead_count`],
  ]);
}

export async function getRecentLeads(clinicId: string, limit = 20): Promise<LeadRecord[]> {
  const key = `clinic:${clinicId}:leads`;
  const result = (await upstash(["LRANGE", key, 0, limit - 1])) as string[] | null;
  if (!Array.isArray(result)) return [];
  return result.map((s) => {
    try { return JSON.parse(s) as LeadRecord; } catch { return null; }
  }).filter((x): x is LeadRecord => x !== null);
}

export async function getLeadCount(clinicId: string): Promise<number> {
  const result = (await upstash(["GET", `clinic:${clinicId}:lead_count`])) as string | null;
  return result ? parseInt(result, 10) || 0 : 0;
}

// Simple per-IP rate limit. 한 IP가 10분에 5건 이상이면 차단.
// Lead 는 form 제출이라 사용자 입장 friction 최소화 — Upstash 호출 자체가 실패하면
// fail-OPEN (정상 사용자가 막히는 케이스를 더 싫어함).
export async function rateLimitOk(ip: string): Promise<boolean> {
  return checkRateLimit({ key: `lead:${ip}`, limit: 5, windowSec: 600, failOpenOnError: true });
}
