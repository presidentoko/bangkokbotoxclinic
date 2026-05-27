// 통합 rate limit 헬퍼.
// - Upstash 설정시: 정상 INCR/EXPIRE 사용.
// - Upstash 설정됐는데 호출 실패시: failOpenOnError 옵션에 따라 (기본 fail-CLOSED).
// - Upstash 미설정시: in-memory fallback (dev 단일 프로세스 한정).
//
// 사용 예:
//   if (!(await checkRateLimit({ key: `lead:${ip}`, limit: 5, windowSec: 600 }))) {
//     return new Response("rate limit", { status: 429 });
//   }

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_UPSTASH = !!(UPSTASH_URL && UPSTASH_TOKEN);

type LocalEntry = { count: number; resetAt: number };
const g = globalThis as unknown as { __rateLimitStore?: Map<string, LocalEntry> };
const local: Map<string, LocalEntry> = g.__rateLimitStore ?? (g.__rateLimitStore = new Map());

export type RateLimitOptions = {
  key: string;              // unique identifier — typically `${bucket}:${ip}` 또는 `${bucket}:${ip}:${resource}`
  limit: number;            // 윈도우 내 최대 요청수
  windowSec: number;        // 윈도우 길이 (초)
  /**
   * Upstash 호출 자체가 실패했을 때 (네트워크 에러, 5xx 등) 어떻게 처리할지.
   * - false (기본): fail-CLOSED — 막음. 민감한 경로 (admin 로그인, 결제 클레임) 권장.
   * - true: fail-OPEN — 통과. 비핵심 경로 (view tracking 등) 권장.
   */
  failOpenOnError?: boolean;
};

/** true → 허용, false → 차단 */
export async function checkRateLimit(opts: RateLimitOptions): Promise<boolean> {
  const { key, limit, windowSec, failOpenOnError = false } = opts;
  if (HAS_UPSTASH) {
    const fullKey = `rl:${key}`;
    try {
      const incrUrl = `${UPSTASH_URL}/INCR/${encodeURIComponent(fullKey)}`;
      const res = await fetch(incrUrl, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (!res.ok) return failOpenOnError;
      const data = (await res.json()) as { result?: number };
      const count = data.result;
      if (typeof count !== "number") return failOpenOnError;
      if (count === 1) {
        // best-effort EXPIRE — 실패해도 다음 INCR 시 어차피 count 가 누적되므로
        // 잠시 더 엄격하게 막힐 뿐 정확성 문제는 아님.
        const expUrl = `${UPSTASH_URL}/EXPIRE/${encodeURIComponent(fullKey)}/${windowSec}`;
        await fetch(expUrl, {
          headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        }).catch(() => undefined);
      }
      return count <= limit;
    } catch {
      return failOpenOnError;
    }
  }
  // Dev fallback — in-memory
  const now = Date.now();
  const e = local.get(key);
  if (!e || e.resetAt < now) {
    local.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  e.count++;
  return e.count <= limit;
}
