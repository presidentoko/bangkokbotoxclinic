import { districtCandidates, firstExisting } from "../_lib/aliases";

// /c/{category}/{old-district-slug} → /c/{category}/{canonical-district-slug}.
// Only fires on an actual 404, so /c/{category} and /c/{category}/{valid} pass through untouched.
// 구 페이지가 없으면 업종 페이지로 보낸다 — 404 보다 낫다.
export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const path = new URL(context.request.url).pathname;
  const m = path.match(/^\/c\/([^/]+)\/([^/]+)\/?$/);
  if (m) {
    const cands = districtCandidates(decodeURIComponent(m[2])).map((c) => `/c/${m[1]}/${c}`);
    cands.push(`/c/${m[1]}`);
    const hit = await firstExisting(context, cands);
    if (hit) return Response.redirect(new URL(hit, context.request.url).toString(), 301);
  }
  return response;
};
