// 사라진 /estate/* 페이지 처리.
//
// estate_slug 는 구글 주소 문자열에서 뽑은 값이라 절반이 단지 이름이 아니라
// 주소 조각이었다(/estate/3, /estate/37 = "ถนน สุขุมวิท กม 37", /estate/101-90 …).
// 2026-08-21 에 lib/estates.ts 의 isRealEstateSlug() 로 16개를 걸러냈고, 그 URL 들은
// 이미 사이트맵에 올라가 색인 대기 중이었다.
//
// functions/supplier/_middleware.ts 와 같은 판단: 홈으로 301 하면 구글이
// soft-404 패턴으로 읽어 도메인 신뢰도를 깎는다. 의도적으로 없앤 리소스이므로
// 410 Gone 을 준다 — 크롤러가 색인에서 바로 뺀다.
const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Estate page removed — Thai Supply Hub</title>
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
    <div class="code">410 — Page removed</div>
    <h1>This industrial estate page no longer exists</h1>
    <p>It was generated from an incomplete address fragment rather than a real estate name, and has been removed in a data quality review.</p>
    <div class="actions">
      <a class="primary" href="/estate">All industrial estates</a>
      <a class="secondary" href="/c/manufacturer">Manufacturers</a>
    </div>
  </div>
</body>
</html>`;

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  if (response.status !== 404) return response;
  return new Response(PAGE, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};
