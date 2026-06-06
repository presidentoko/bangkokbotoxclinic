// Thin wrapper around Vercel KV REST API — no package needed.
// Set up: Vercel dashboard → Storage → KV → Create → Connect to project.
// Required env vars (auto-set by Vercel after connection):
//   KV_REST_API_URL, KV_REST_API_TOKEN

const BASE = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

function headers() {
  return { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
}

export function kvAvailable() {
  return !!(BASE && TOKEN);
}

export async function kvHgetall(key: string): Promise<Record<string, string>> {
  if (!kvAvailable()) return {};
  try {
    const res = await fetch(`${BASE}/hgetall/${encodeURIComponent(key)}`, {
      headers: headers(),
      next: { revalidate: 300 }, // 5 min cache — avoids KV call on every ISR revalidation
    });
    const json = await res.json();
    return (json.result as Record<string, string>) ?? {};
  } catch {
    return {};
  }
}

export async function kvHset(key: string, field: string, value: string) {
  if (!kvAvailable()) return;
  await fetch(BASE!, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(["hset", key, field, value]),
  });
}

export async function kvHdel(key: string, field: string) {
  if (!kvAvailable()) return;
  await fetch(BASE!, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(["hdel", key, field]),
  });
}

export async function kvGet(key: string): Promise<string | null> {
  if (!kvAvailable()) return null;
  try {
    const res = await fetch(`${BASE}/get/${encodeURIComponent(key)}`, {
      headers: headers(),
      next: { revalidate: 300 },
    });
    const json = await res.json();
    return (json.result as string) ?? null;
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: string) {
  if (!kvAvailable()) return;
  await fetch(BASE!, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(["set", key, value]),
  });
}
