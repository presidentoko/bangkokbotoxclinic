import type { NextRequest } from "next/server";
import { loadMasterDb, legacyDoctorSlugMap } from "@/lib/data";
import { legacyDoctorClinicId } from "@/lib/legacyDoctors";
import { getSiteConfig, applySiteFilter, resolveOwnerUrl } from "@/lib/site";

/**
 * Where a pre-2026-07-31 doctor URL should go now.
 *
 * middleware.ts rewrites every `/doctor/<name>-at-<clinic name>` request here —
 * the shape that is no longer generated. It cannot be answered by the doctor
 * page itself: that route pre-renders a fixed param list (dynamicParams=false,
 * to keep bots from burning the ISR write quota on invented slugs), so an
 * unknown slug 404s before any code of ours runs.
 *
 * It sits outside /doctor/ on purpose: a rewrite to a path under it is matched
 * against `/doctor/[slug]` first, and that route's fixed param list answers with
 * NoFallbackError before the handler is reached.
 *
 * Three outcomes, in order:
 *   1. the doctor is still in the data → the URL they live at now;
 *   2. the doctor is gone but the clinic is not → the clinic's page, which is
 *      what someone following a stale link is after (lib/legacyDoctors.ts);
 *   3. the clinic belongs to the other vertical → that site's clinic page.
 * Otherwise 404, and honestly so: 254 of the 905 name a clinic that is on none
 * of these sites — no categories, or hair, which has no site live — and a
 * redirect to a page that does not exist is worse than the 404 it replaces.
 *
 * Doctor pages are noindex (2026-09-15), so none of this is an attempt to rank
 * them — it is about the visitor, and about handing the clinic page the link
 * equity that a 404 throws away.
 */

// 리졸브는 요청마다 slug 가 다르므로 프리렌더 대상이 아니다. 캐시는 엣지에
// 1시간만 — 308 도 CF 가 캐시하므로, 잘못된 목적지를 하루 동안 얼리지 않도록
// 짧게 유지한다 (2026-09 엣지 TTL 사고).
export const dynamic = "force-dynamic";

const CACHE = "public, max-age=0, s-maxage=3600";

function redirect(to: string): Response {
  return new Response(null, { status: 301, headers: { Location: to, "Cache-Control": CACHE } });
}

// The slug comes in as a path segment, not a query value: a rewrite carries the
// path through, but the query string does not survive it — measured, and silent
// when it goes wrong, because the handler then simply 404s everything.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug: raw } = await params;
  let slug = raw ?? "";
  try { slug = decodeURIComponent(slug); } catch { /* malformed — use it as sent */ }
  slug = slug.replace(/\/+$/, "");
  if (!slug) return new Response("Not found", { status: 404 });

  const db = await loadMasterDb();

  // 1. The doctor is still listed, under the current slug shape.
  const current = legacyDoctorSlugMap(db.clinics).get(slug);
  if (current) return redirect(`/doctor/${encodeURI(current)}`);

  // 2/3. The doctor is gone; the clinic the URL named may not be.
  const clinicId = legacyDoctorClinicId(slug);
  if (clinicId) {
    const c = db.clinics.find((x) => x.id === clinicId);
    if (c?.url_slug) {
      const cfg = getSiteConfig();
      if (applySiteFilter([c], cfg).length > 0) return redirect(`/clinic/${encodeURI(c.url_slug)}`);
      const owner = resolveOwnerUrl(c.categories);
      if (owner) return redirect(`${owner}/clinic/${encodeURI(c.url_slug)}`);
    }
  }

  return new Response("Not found", { status: 404, headers: { "Cache-Control": CACHE } });
}
