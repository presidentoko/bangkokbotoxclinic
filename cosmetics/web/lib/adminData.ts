// Read-only helpers for admin data — used in server components (not server actions).
import { kvHgetall, kvGet, kvAvailable } from "@/lib/kv";
import { FEATURED_PRODUCTS } from "@/lib/featured";

const KV_FEATURED = "featured";
const KV_BANNER = "banner";

export async function getFeaturedMap(): Promise<Record<string, string>> {
  const dynamic = await kvHgetall(KV_FEATURED);
  return { ...(FEATURED_PRODUCTS as Record<string, string>), ...dynamic };
}

export async function getBanner(): Promise<{ text: string; active: boolean } | null> {
  const raw = await kvGet(KV_BANNER);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export { kvAvailable };
