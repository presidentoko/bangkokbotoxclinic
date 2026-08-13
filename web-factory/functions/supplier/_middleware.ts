// Intercepts all /supplier/* requests.
// CF Pages serves static .html files first (step 1 in routing), so existing supplier pages
// are returned before this middleware runs context.next(). Missing IDs reach this and 404.
//
// We used to 301 these to the homepage, but a supplier ID that's gone (delisted in a data
// quality pass, never one Google or a bookmark should keep pointing at) is not "moved" —
// redirecting hundreds of dead /supplier/* URLs to "/" reads to Google as a soft-404 pattern
// ("this site redirects everything broken to its homepage"), which drags down indexing trust
// for the whole domain. A real 410 Gone tells crawlers the resource is intentionally removed
// so they drop it from the index instead of penalizing the domain for it.
const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Listing removed — Thai Supply Hub</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; background:#fafaf7; color:#1c1917; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; }
  .wrap { max-width:640px; margin:0 auto; padding:96px 24px; text-align:center; }
  .code { font-size:14px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#b45309; margin-bottom:16px; }
  h1 { font-size:28px; font-weight:800; margin:0 0 12px; }
  p { color:#57534e; line-height:1.6; margin:0 0 32px; }
  .actions { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }
  a { text-decoration:none; font-weight:700; padding:12px 22px; border-radius:8px; }
  .primary { background:#b45309; color:#fff; }
  .secondary { border:1px solid #e7e5e4; color:#1c1917; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="code">410 — Listing removed</div>
    <h1>This supplier is no longer listed</h1>
    <p>It may have closed, gone unverifiable, or been removed during a data quality review. Here's where to find similar suppliers instead.</p>
    <div class="actions">
      <a class="primary" href="/">Browse all suppliers</a>
      <a class="secondary" href="/c/manufacturer">Manufacturers</a>
      <a class="secondary" href="/c/auto_parts">Auto Parts</a>
    </div>
  </div>
</body>
</html>`;

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  // /supplier/{id}/opengraph-image — 전용 공유 카드는 색인되는 supplier 만 굽는다
  // (app/supplier/[id]/opengraph-image.tsx 의 generateStaticParams 참고: CF Pages
  // 20,000 파일 한도 때문). 굽지 않은 id 도 페이지 메타에는 이 URL 이 박혀 나가므로
  // 사이트 공용 카드로 넘긴다. 여기서 410 HTML 을 주면 공유 카드가 깨진다.
  if (new URL(context.request.url).pathname.endsWith("/opengraph-image")) {
    return Response.redirect(
      new URL("/opengraph-image", context.request.url).toString(), 302,
    );
  }

  // 삭제된 supplier ID — 위 주석대로 301 이 아니라 410.
  return new Response(PAGE, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};
