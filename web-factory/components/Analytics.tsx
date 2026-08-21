// Cloudflare Web Analytics — 사이트에 분석 도구가 하나도 없어서 넣는다.
//
// 광고를 파는 사이트인데 "월 방문자 몇 명입니까" 에 답할 방법이 없었다.
// ViewTracker 는 localStorage 기반 "최근 본 목록" 이라 소유자가 볼 수 없고,
// /for-suppliers 의 "클릭률 3-5배" 같은 문구는 측정 수단 자체가 없었다.
//
// Cloudflare 를 고른 이유: 쿠키를 쓰지 않아 동의 배너가 필요 없고(개인정보
// 처리방침만 있으면 된다), 정적 export 와 Pages 호스팅에 스크립트 한 줄로 붙고,
// 무료다. GA4 는 쿠키 동의 배너가 필요해서 전환율을 깎는다.
//
// 토큰 발급: Cloudflare 대시보드 → Web Analytics → 사이트 추가 → 토큰 복사 →
// Pages 프로젝트 환경변수에 NEXT_PUBLIC_CF_BEACON_TOKEN 으로 넣는다.
// 토큰이 없으면 이 컴포넌트는 아무것도 렌더하지 않는다.

const TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "";

export function Analytics() {
  if (!TOKEN) return null;
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: TOKEN })}
    />
  );
}

// AdSense 로더. client ID 가 없으면 렌더되지 않는다.
// AdSlot 의 <ins> 만으로는 광고가 절대 채워지지 않는다 — 이 스크립트가 필요하다.
// (지금은 미사용: AdSense 신청 전이고, 색인 회복 후 재검토 대상.)
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

export function AdSenseLoader() {
  if (!ADSENSE_CLIENT) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
