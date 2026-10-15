// bangkokbestclinic.com (apex) → www 301 (2026-10-15).
//
// 왜 별도 Worker 인가: 메인 Worker 는 www 라우트만 받는다. apex 는 Vercel 오리진이
// www 로 307 을 내주던 것에 기대고 있었는데, Vercel 덴탈 배포가 사라져
// apex 의 모든 URL 이 404(x-vercel-error: DEPLOYMENT_NOT_FOUND)가 됐다.
// 메인 앱의 middleware 로 처리하면 모든 요청에 미들웨어가 돌아 Workers Free 10ms
// CPU 한도(error 1102)를 압박한다 — 여기선 문자열 치환 하나뿐이다.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = "www.bangkokbestclinic.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  },
};
