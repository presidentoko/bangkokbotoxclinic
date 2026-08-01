import { DISTRICT_ALIASES } from "../_lib/aliases";

// /c/{category}/{old-district-slug} → /c/{category}/{canonical-district-slug}.
// Only fires on an actual 404, so /c/{category} and /c/{category}/{valid} pass through untouched.
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const path = new URL(context.request.url).pathname;
  const m = path.match(/^\/c\/([^/]+)\/([^/]+)\/?$/);
  if (m) {
    const canonical = DISTRICT_ALIASES[decodeURIComponent(m[2])];
    if (canonical) {
      return Response.redirect(new URL(`/c/${m[1]}/${canonical}`, context.request.url).toString(), 301);
    }
  }
  return response;
};
