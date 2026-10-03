import { districtCandidates, firstExisting } from "../_lib/aliases";

// /d/{old-slug} → /d/{canonical-slug}. See functions/_lib/aliases.ts for why
// this lives in code instead of public/_redirects. 목적지가 실제로 있을 때만.
export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const path = new URL(context.request.url).pathname;
  const slug = decodeURIComponent(path.replace(/^\/d\//, "").replace(/\/$/, ""));
  if (!slug) return response;
  const hit = await firstExisting(context, districtCandidates(slug).map((c) => `/d/${c}`));
  if (hit) return Response.redirect(new URL(hit, context.request.url).toString(), 301);
  return response;
};
