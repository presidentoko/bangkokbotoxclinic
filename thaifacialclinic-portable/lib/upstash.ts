// Shared Upstash REST helper. All store modules use this.
// If env not set, all calls graceful no-op (returns null / empty array).

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const upstashEnabled = !!(UPSTASH_URL && UPSTASH_TOKEN);

export async function rcmd(cmd: (string | number)[]): Promise<unknown> {
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
      console.error("[upstash] err", res.status, await res.text().catch(() => ""));
      return null;
    }
    const j = (await res.json()) as { result?: unknown };
    return j.result ?? null;
  } catch (e) {
    console.error("[upstash] fetch failed", e);
    return null;
  }
}

export async function rpipeline(cmds: (string | number)[][]): Promise<unknown[]> {
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
    if (!res.ok) return cmds.map(() => null);
    const j = (await res.json()) as { result?: unknown }[];
    return j.map((r) => r?.result ?? null);
  } catch {
    return cmds.map(() => null);
  }
}

export function makeId(bytes = 16): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, bytes);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 2 + bytes)}`;
}
