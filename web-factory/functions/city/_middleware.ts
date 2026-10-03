import { cityCandidates, firstExisting } from "../_lib/aliases";

// /city/{old-slug}[/{rest}] → /city/{canonical-slug}[/{rest}] (chonburi, chon-buri → chon_buri).
// 404 일 때만, 그리고 목적지가 실제로 있을 때만 리다이렉트한다.
export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const path = new URL(context.request.url).pathname;
  const [slug, ...rest] = decodeURIComponent(path.replace(/^\/city\//, "").replace(/\/$/, "")).split("/");
  if (!slug) return response;
  const tail = rest.length ? `/${rest.join("/")}` : "";
  const cands = cityCandidates(slug).map((c) => `/city/${c}${tail}`);
  // 2단계(/city/x/{업종})가 없으면 도 페이지로라도 보낸다.
  if (tail) cands.push(...[slug, ...cityCandidates(slug)].map((c) => `/city/${c}`));
  const hit = await firstExisting(context, cands);
  if (hit) return Response.redirect(new URL(hit, context.request.url).toString(), 301);
  return response;
};
