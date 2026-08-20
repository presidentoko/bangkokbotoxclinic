import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Cloudflare 이전 (2026-08-08).
//
// 왜 증분 캐시 저장소가 필수인가:
// 처음엔 "변수를 하나씩" 원칙으로 캐시를 비워두고 배포했는데, 그 결과
// 프리렌더된 5,083 페이지가 .open-next/cache (1,615 MB) 에 그대로 남고
// 어디에도 업로드되지 않아 사이트가 / → 500, /clinic/{id} → 404 를 냈다.
// (Worker 자체는 정상이었다 — 404 페이지는 제대로 렌더됐다.)
//
// 왜 R2 가 아니라 static assets 인가:
// R2 를 먼저 시도했으나 막혔다 — populateCache 가
//   403 code 10042 "Please enable R2 through the Cloudflare Dashboard"
// 로 죽었다. Workers 권한이 실제로 확인된 유효한 토큰으로도 같은 응답이
// 나오므로, 메시지 그대로 계정에 R2 가 활성화되어 있지 않다. 무료 티어라도
// 대시보드에서 최초 활성화가 필요하고, 그건 사용자만 할 수 있다.
//
// static assets 캐시는 API 호출이 전혀 없다 — 어댑터가 .open-next/cache 를
// .open-next/assets/cdn-cgi/_next_cache 로 로컬 복사할 뿐이고, 그 다음은
// 평범한 wrangler 자산 업로드다. 토큰 권한 문제를 통째로 우회한다.
// 5,083 파일(평균 317 KB)은 Workers 자산 한도(20,000개 / 파일당 25 MiB) 안이다.
//
// 대가 — 이 캐시는 읽기 전용이다:
//  - revalidatePath() (app/api/admin/sponsored) 가 무효(no-op)가 된다.
//  - revalidate 만료 후에는 요청마다 재렌더된다. clinic/doctor 5,000여 개는
//    revalidate=2592000(30일)이고 주간 전체 재빌드가 있으니 사실상 만료되지
//    않는다. 홈/사이트맵 등 86400(24h) 짜리 소수 라우트만 해당된다.
// 쓰기 가능한 캐시가 필요해지면 R2 권한 있는 토큰을 발급받아
// r2-incremental-cache 로 되돌리면 된다 (import 한 줄 + r2_buckets 바인딩).
//
// 빌드 후 반드시 `opennextjs-cloudflare populateCache local` 을 돌려야 한다 —
// build 만으로는 cache 가 assets 로 복사되지 않는다.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
