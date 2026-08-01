import { CITY_ALIASES } from "../../_lib/aliases";

// /ko/city/{old-slug} → /ko/city/{canonical-slug}.
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const path = new URL(context.request.url).pathname;
  const slug = decodeURIComponent(path.replace(/^\/ko\/city\//, "").replace(/\/$/, ""));
  const canonical = CITY_ALIASES[slug];
  if (canonical) {
    return Response.redirect(new URL(`/ko/city/${canonical}`, context.request.url).toString(), 301);
  }
  return response;
};
