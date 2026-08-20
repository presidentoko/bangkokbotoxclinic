// 클리닉 owner dashboard 시크릿 토큰 저장소 (Upstash Redis).
// admin 이 발급 → URL 에 ?k=TOKEN 으로 전달 → 검증 시 httpOnly 쿠키 발급.
// 토큰 1개 / 클리닉. regenerate 하면 기존 토큰 자동 무효화.
// Upstash 미구성 시 (로컬 dev) in-memory fallback — 프로세스 재시작 시 토큰 사라짐.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_UPSTASH = !!(UPSTASH_URL && UPSTASH_TOKEN);

const KEY = (clinicId: string) => `dash:access:${clinicId}`;

// In-memory fallback (dev only). HMR 살아남도록 globalThis 에 매달기.
const g = globalThis as unknown as { __dashAccessStore?: Map<string, string> };
const localStore: Map<string, string> = g.__dashAccessStore ?? (g.__dashAccessStore = new Map());

async function upstash(cmd: (string | number)[]): Promise<unknown> {
  if (!HAS_UPSTASH) return null;
  try {
    const res = await fetch(UPSTASH_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[dashboardAccessStore] upstash err", res.status, await res.text());
      return null;
    }
    const j = (await res.json()) as { result?: unknown };
    return j.result;
  } catch (e) {
    console.error("[dashboardAccessStore] upstash fetch failed", e);
    return null;
  }
}

export function makeToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

export async function createAccess(clinicId: string): Promise<string> {
  const token = makeToken();
  if (HAS_UPSTASH) {
    await upstash(["SET", KEY(clinicId), token]);
  } else {
    localStore.set(clinicId, token);
  }
  return token;
}

export async function getAccess(clinicId: string): Promise<string | null> {
  if (HAS_UPSTASH) {
    const r = await upstash(["GET", KEY(clinicId)]);
    return typeof r === "string" ? r : null;
  }
  return localStore.get(clinicId) ?? null;
}

export async function revokeAccess(clinicId: string): Promise<void> {
  if (HAS_UPSTASH) {
    await upstash(["DEL", KEY(clinicId)]);
  } else {
    localStore.delete(clinicId);
  }
}

export async function verifyAccess(clinicId: string, token: string): Promise<boolean> {
  if (!token) return false;
  const stored = await getAccess(clinicId);
  return stored !== null && stored === token;
}
