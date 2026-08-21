import { revalidatePath } from "next/cache";
import type { AdSlot } from "./ads";

/**
 * Push a sold ad slot onto the live site immediately.
 *
 * Every page that renders an ad slot is statically generated: the homepage and
 * the quiz results have no revalidate window at all, and the concern and
 * sponsored pages sit behind a 24h one plus an hour of Cloudflare edge TTL. So
 * a slot saved in the admin was invisible until the next deploy — and deploys
 * are now gated to one per 72 hours to stay inside the ISR write quota. An
 * advertiser could pay for a placement and simply not get it.
 *
 * Worse, `getActiveAdSlots()` compares `startsAt`/`endsAt` against `new Date()`,
 * which on a static page is frozen at *build* time. A campaign dated to start
 * next Monday would never turn itself on, and one dated to end would never turn
 * itself off. The daily cron at /api/cron/ad-slots exists for exactly that: it
 * re-renders the affected pages on the days a campaign's own dates change what
 * should be on screen.
 */

const LOCALES = ["th", "en"] as const;

/**
 * Every path whose rendered output depends on this slot.
 *
 * Quiz results are returned as a route pattern rather than 144 concrete URLs —
 * `revalidatePath(pattern, "page")` invalidates every page of that route in one
 * call, which is both cheaper and impossible to get out of sync with
 * generateStaticParams.
 */
export function pathsForSlot(slot: Pick<AdSlot, "type" | "concern" | "productSlug">): string[] {
  switch (slot.type) {
    case "homepage_featured":
      return LOCALES.map((l) => `/${l}`);
    case "category_takeover":
    case "editors_pick":
      // A concern-scoped slot with no concern set can never match a page, but
      // revalidating all of them is still the safe read of "something changed".
      return slot.concern
        ? LOCALES.map((l) => `/${l}/${slot.concern}`)
        : LOCALES.flatMap((l) =>
            ["acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive"].map(
              (c) => `/${l}/${c}`
            )
          );
    case "quiz_result":
      return ["/[locale]/quiz/result/[skin]/[concern]/[budget]"];
    case "sponsored_review":
      return LOCALES.map((l) => `/${l}/sponsored/${slot.productSlug}`);
    default:
      return [];
  }
}

/** Ask Cloudflare to drop its edge copies of these URLs. No-op without a token. */
async function purgeCloudflare(paths: string[]): Promise<"skipped" | "ok" | "failed"> {
  const token = process.env.CLOUDFLARE_PURGE_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zone) return "skipped";

  // Route patterns are meaningless to a CDN — only concrete URLs can be purged.
  const files = paths
    .filter((p) => !p.includes("["))
    .map((p) => `https://bangkokfillers.com${p}`);
  if (files.length === 0) return "skipped";

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ files }),
    });
    return res.ok ? "ok" : "failed";
  } catch {
    return "failed";
  }
}

export interface RevalidateReport {
  paths: string[];
  cloudflare: "skipped" | "ok" | "failed";
}

export async function revalidateForSlots(
  slots: Pick<AdSlot, "type" | "concern" | "productSlug">[]
): Promise<RevalidateReport> {
  const paths = [...new Set(slots.flatMap(pathsForSlot))];
  for (const path of paths) {
    revalidatePath(path, path.includes("[") ? "page" : undefined);
  }
  const cloudflare = await purgeCloudflare(paths);
  return { paths, cloudflare };
}
