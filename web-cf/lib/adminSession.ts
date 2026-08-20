// Admin session: random opaque token stored in Upstash when available.
// Upstash 미구성 시 → HMAC-SHA256 서명 기반 stateless 토큰 (serverless 재시작에도 유효).
// Cookie leak 시 passcode 복원 불가 (두 방식 모두).

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

// HMAC-SHA256 stateless fallback — works across serverless instances, no Redis needed.
// Token format: "<nonce>.<hmac_hex>"  where hmac = HMAC(nonce, ADMIN_PASSCODE)
async function hmacSign(nonce: string): Promise<string> {
  const secret = process.env.ADMIN_PASSCODE ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(nonce));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacVerify(token: string): Promise<boolean> {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const nonce = token.slice(0, dot);
  const provided = token.slice(dot + 1);
  const expected = await hmacSign(nonce);
  // Constant-time compare to prevent timing attacks.
  if (expected.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  return diff === 0;
}

function makeNonce(len = 32): string {
  const a = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36)).replace(/-/g, "");
  const b = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36)).replace(/-/g, "");
  return (a + b).slice(0, len);
}

const KEY = (token: string) => `admin:session:${token}`;
const TTL_SEC = 60 * 60 * 24 * 7; // 7 days

export async function createAdminSession(): Promise<string> {
  const nonce = makeNonce(32);
  if (HAS_UPSTASH) {
    await upstash(["SETEX", KEY(nonce), TTL_SEC, "1"]);
    return nonce;
  }
  // Stateless: embed HMAC signature so any serverless instance can verify.
  const sig = await hmacSign(nonce);
  return `${nonce}.${sig}`;
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  if (HAS_UPSTASH) {
    const r = await upstash(["GET", KEY(token)]);
    return r === "1";
  }
  return hmacVerify(token);
}

export async function revokeAdminSession(token: string | undefined): Promise<void> {
  if (!token) return;
  if (HAS_UPSTASH) {
    await upstash(["DEL", KEY(token)]);
  }
  // Stateless tokens cannot be revoked — expiry is enforced by cookie maxAge.
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
