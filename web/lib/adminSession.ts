// Admin session: random opaque token stored in Upstash, NOT the passcode itself.
// Cookie leak no longer = passcode disclosure.
// Upstash 미구성 시 (로컬 dev) in-memory fallback. 프로세스 재시작 시 세션 사라짐.

import { checkRateLimit } from "./rateLimit";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_UPSTASH = !!(UPSTASH_URL && UPSTASH_TOKEN);

async function upstash(cmd: (string | number)[]): Promise<unknown> {
  if (!HAS_UPSTASH) return null;
  const res = await fetch(`${UPSTASH_URL}/${cmd.map((p) => encodeURIComponent(String(p))).join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result?: unknown };
  return data.result ?? null;
}

function makeToken(len = 32): string {
  // crypto.randomUUID twice + slice = ~64 hex chars without hyphens; trim to len.
  const a = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36)).replace(/-/g, "");
  const b = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36)).replace(/-/g, "");
  return (a + b).slice(0, len);
}

const KEY = (token: string) => `admin:session:${token}`;
const TTL_SEC = 60 * 60 * 24 * 7; // 7 days

// In-memory session fallback (dev only). globalThis 에 붙여서 Next.js HMR 시 리셋 방지.
// Rate limit 은 별도 lib/rateLimit.ts 에서 처리.
const g = globalThis as unknown as { __adminAuthSessions?: Map<string, number> };
const stores = { sessions: g.__adminAuthSessions ?? (g.__adminAuthSessions = new Map()) };

export async function createAdminSession(): Promise<string> {
  const token = makeToken(32);
  if (HAS_UPSTASH) {
    await upstash(["SETEX", KEY(token), TTL_SEC, "1"]);
  } else {
    stores.sessions.set(token, Date.now() + TTL_SEC * 1000);
  }
  return token;
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  if (HAS_UPSTASH) {
    const r = await upstash(["GET", KEY(token)]);
    return r === "1";
  }
  const exp = stores.sessions.get(token);
  if (!exp) return false;
  if (exp < Date.now()) {
    stores.sessions.delete(token);
    return false;
  }
  return true;
}

export async function revokeAdminSession(token: string | undefined): Promise<void> {
  if (!token) return;
  if (HAS_UPSTASH) {
    await upstash(["DEL", KEY(token)]);
  } else {
    stores.sessions.delete(token);
  }
}

/**
 * Brute-force protection: 10 attempts per IP per 10 minutes.
 * Admin 로그인이라 Upstash 호출 실패시 fail-CLOSED — 공격자가 Redis 죽이고
 * 무한 시도하는 시나리오 방지.
 */
export async function adminLoginRateLimitOk(ip: string): Promise<boolean> {
  if (!ip || ip === "unknown") return true;
  return checkRateLimit({ key: `admin:${ip}`, limit: 10, windowSec: 600, failOpenOnError: false });
}
