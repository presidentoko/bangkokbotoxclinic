import { kvGet, kvSet } from "./kv";

export type LinkStatus = {
  ok: boolean;
  status: number | null;
  checkedAt: string;
};

const KEY = "link-health";

export async function getLinkHealth(): Promise<Record<string, LinkStatus>> {
  const raw = await kvGet(KEY);
  if (!raw) return {};
  try { return JSON.parse(raw as string); } catch { return {}; }
}

export async function checkAndSaveLinkHealth(
  products: { product_id: string; url: string }[]
): Promise<Record<string, LinkStatus>> {
  const results: Record<string, LinkStatus> = {};
  const BATCH = 20;

  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (p) => {
        if (!p.url) { results[p.product_id] = { ok: false, status: null, checkedAt: new Date().toISOString() }; return; }
        try {
          const res = await fetch(p.url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(3000) });
          results[p.product_id] = { ok: res.ok, status: res.status, checkedAt: new Date().toISOString() };
        } catch {
          results[p.product_id] = { ok: false, status: null, checkedAt: new Date().toISOString() };
        }
      })
    );
  }

  await kvSet(KEY, JSON.stringify(results));
  return results;
}
