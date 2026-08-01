import { unstable_cache, revalidateTag } from "next/cache";
import { kvGet, kvSet } from "./kv";

const KEY = "noindex_locales";

// See lib/adminData.ts's getBanner for why this is tag-cached instead of relying
// on the site-wide revalidate timer that used to live on [locale]/layout.tsx.
// unstable_cache persists its return value (JSON-serialized) between calls, so the
// cached function itself must return a plain array, not a Set — a cached Set comes
// back without any of its methods (breaking every `.has()` call site) once it's
// round-tripped through that storage layer.
const getNoindexLocalesArray = unstable_cache(
  async (): Promise<string[]> => {
    const raw = await kvGet(KEY);
    if (!raw) return [];
    return String(raw).split(",").map((s) => s.trim()).filter(Boolean);
  },
  ["admin-noindex-locales"],
  { tags: ["noindex-locales"] }
);

export async function getNoindexLocales(): Promise<Set<string>> {
  return new Set(await getNoindexLocalesArray());
}

export async function setNoindexLocales(locales: string[]): Promise<void> {
  await kvSet(KEY, locales.join(","));
  // See admin/actions.ts's saveBanner for why the second arg is here.
  revalidateTag("noindex-locales", "max");
}
