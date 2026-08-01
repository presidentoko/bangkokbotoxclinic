import { CITY_ALIASES } from "../_lib/aliases";

// /city/{old-slug} → /city/{canonical-slug} (e.g. chonburi → chon_buri).
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const path = new URL(context.request.url).pathname;
  const slug = decodeURIComponent(path.replace(/^\/city\//, "").replace(/\/$/, ""));
  const canonical = CITY_ALIASES[slug];
  if (canonical) {
    return Response.redirect(new URL(`/city/${canonical}`, context.request.url).toString(), 301);
  }
  return response;
};
