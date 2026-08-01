// Read-only helpers for admin data — used in server components (not server actions).
import { unstable_cache } from "next/cache";
import { kvHgetall, kvGet, kvAvailable } from "@/lib/kv";
import { FEATURED_PRODUCTS } from "@/lib/featured";

const KV_FEATURED = "featured";
const KV_BANNER = "banner";

export async function getFeaturedMap(): Promise<Record<string, string>> {
  const dynamic = await kvHgetall(KV_FEATURED);
  return { ...(FEATURED_PRODUCTS as Record<string, string>), ...dynamic };
}

// [locale]/layout.tsx (which calls this on every page) used to force a blanket
// `revalidate = 86400` across the entire site just so this one Redis-backed value
// could go stale after at most a day — 5,878+ routes re-rendering daily for
// content that's otherwise 100% static build-time data. Tagged on-demand caching
// means the banner only actually re-fetches when admin/actions.ts's saveBanner()
// calls revalidateTag("banner"), and every other page stays fully static.
export const getBanner = unstable_cache(
  async (): Promise<{ text: string; active: boolean } | null> => {
    const raw = await kvGet(KV_BANNER);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  ["admin-banner"],
  { tags: ["banner"] }
);

export { kvAvailable };
