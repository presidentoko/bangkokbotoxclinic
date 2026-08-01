import { DISTRICT_ALIASES } from "../_lib/aliases";

// /d/{old-slug} → /d/{canonical-slug}. See functions/_lib/aliases.ts for why
// this lives in code instead of public/_redirects.
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const path = new URL(context.request.url).pathname;
  const slug = decodeURIComponent(path.replace(/^\/d\//, "").replace(/\/$/, ""));
  const canonical = DISTRICT_ALIASES[slug];
  if (canonical) {
    return Response.redirect(new URL(`/d/${canonical}`, context.request.url).toString(), 301);
  }
  return response;
};
