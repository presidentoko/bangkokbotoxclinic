// Redis client using REDIS_URL env var (set automatically by Vercel Redis integration).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient } from "redis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null;
let _connecting = false;

async function getClient(): Promise<any | null> {
  if (!process.env.REDIS_URL) return null;
  if (_client?.isReady) return _client;
  if (_connecting) {
    await new Promise((r) => setTimeout(r, 200));
    return _client?.isReady ? _client : null;
  }
  _connecting = true;
  try {
    const c = createClient({ url: process.env.REDIS_URL });
    c.on("error", () => {});
    await c.connect();
    _client = c;
  } catch {
    _client = null;
  } finally {
    _connecting = false;
  }
  return _client?.isReady ? _client : null;
}

export function kvAvailable() {
  return !!process.env.REDIS_URL;
}

export async function kvHgetall(key: string): Promise<Record<string, string>> {
  const r = await getClient();
  if (!r) return {};
  try {
    return (await r.hGetAll(key)) ?? {};
  } catch {
    return {};
  }
}

export async function kvHset(key: string, field: string, value: string) {
  const r = await getClient();
  if (!r) return;
  try {
    await r.hSet(key, field, value);
  } catch {}
}

export async function kvHdel(key: string, field: string) {
  const r = await getClient();
  if (!r) return;
  try {
    await r.hDel(key, field);
  } catch {}
}

export async function kvGet(key: string): Promise<string | null> {
  const r = await getClient();
  if (!r) return null;
  try {
    return await r.get(key);
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: string) {
  const r = await getClient();
  if (!r) return;
  try {
    await r.set(key, value);
  } catch {}
}
