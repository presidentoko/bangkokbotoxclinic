// Admin session: random opaque token stored in Upstash, NOT the passcode itself.
// Cookie leak no longer = passcode disclosure.

import { rcmd, makeId } from "./upstash";

const KEY = (token: string) => `admin:session:${token}`;
const TTL_SEC = 60 * 60 * 24; // 1 day

export async function createAdminSession(): Promise<string> {
  const token = makeId(32);
  await rcmd(["SETEX", KEY(token), TTL_SEC, "1"]);
  return token;
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const r = await rcmd(["GET", KEY(token)]);
  return r === "1";
}

export async function revokeAdminSession(token: string | undefined): Promise<void> {
  if (!token) return;
  await rcmd(["DEL", KEY(token)]);
}

// Brute-force protection: max 10 attempts per IP per 10 minutes.
export async function adminLoginRateLimitOk(ip: string): Promise<boolean> {
  const key = `rl:admin:${ip}`;
  const count = (await rcmd(["INCR", key])) as number | null;
  if (count === 1) await rcmd(["EXPIRE", key, 600]);
  return typeof count === "number" ? count <= 10 : true;
}
