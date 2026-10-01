import { NextResponse } from "next/server";

// /index.php/* 를 410 Gone 으로 돌려준다 (2026-10-01).
//
// GSC 가 "Not found (404)" 26,039건을 Validation Failed 로 보고한다. 표본 1,000건을
// 유형별로 센 결과 **936건(94%)이 `chillanel.com/index.php/...`** 이고, 내용이
// 이 사이트와 아무 상관이 없다:
//   /index.php/Kits-For-Kids-Wooden-Ramadan-Mosque-Kit-662573/
//   /index.php/Max-Load-Adjustable-Squat-Stand-Dipping-Station-Weight-Bench-1030352
//   /index.php/49206-Carbide-Tipped-Roman-Ogee-1-4-Radius-X-1-3-8-Dia-X-13-16-X-580
// 이 도메인의 이전 생애(상품 카탈로그)가 남긴 흔적이다. 전부 apex(www 없음)로
// 들어오고, 실측하면 apex → www 308 → 트레일링슬래시 308 → 404 로 **리다이렉트를
// 두 번 타고 404** 에 도달한다. 구글 입장에선 한 URL 당 요청 3회다.
//
// 404 가 아니라 410 인 이유: 404 는 "지금은 없음"이라 구글이 몇 달~1년을 주기적으로
// 재확인한다. 410 은 "영구 삭제"라 재크롤을 훨씬 빨리 포기한다. 2만 4천 개를
// 반복 크롤당하는 사이트에서 이 차이는 크롤 예산 전부다.
//
// robots.txt 로 막지 않는다 — 막으면 구글이 410 을 **볼 수 없어서** 색인/보고에서
// 영영 안 빠진다. 크롤을 허용해야 지워진다. app/robots.ts 의 disallow 는
// `/api/` 뿐이므로 현재 상태가 맞다(확인함).
//
// matcher 로 경로를 좁혀서 일반 트래픽에는 미들웨어가 실행되지 않는다 —
// Vercel 이 matcher 를 라우팅 계층에서 처리하므로 함수 호출도 발생하지 않는다.

export function middleware() {
  // 본문 없는 410. HEAD/GET 모두 같은 응답.
  return new NextResponse(null, { status: 410 });
}

export const config = {
  matcher: ["/index.php", "/index.php/:path*", "/index.html"],
};
