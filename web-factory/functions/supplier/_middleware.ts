// Intercepts all /supplier/* requests.
// CF Pages serves static .html files first (step 1 in routing), so existing supplier pages
// are returned before this middleware runs context.next(). Missing IDs reach this and 404 →
// we redirect permanently to the homepage rather than serving a broken page.
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  if (response.status === 404) {
    return new Response(null, {
      status: 301,
      headers: { Location: new URL("/", context.request.url).toString() },
    });
  }
  return response;
};
