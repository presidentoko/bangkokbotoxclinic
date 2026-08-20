// Sponsored slot CRUD — Redis 기반. env var는 부트스트랩용 fallback.
// 어드민이 즉시 변경 가능, 재배포 필요 없음.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "admin:sponsored";

export type SponsoredTier = "editors_pick" | "recommended" | "featured";
export type SponsoredMap = Record<SponsoredTier, string[]>;

function parseList(s: string | undefined): string[] {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}

function envFallback(): SponsoredMap {
  return {
    editors_pick: parseList(process.env.SPONSORED_EDITORS_PICK),
    recommended:  parseList(process.env.SPONSORED_RECOMMENDED),
    featured:     parseList(process.env.SPONSORED_FEATURED || process.env.SPONSORED_IDS),
  };
}

async function redisGet(): Promise<SponsoredMap | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    // cache: "no-store" 였던 걸 revalidate로 교체 — 이 fetch가 clinic/[id]와
    // 홈페이지 render path에 있어서, no-store 하나가 Next.js 전체 라우트를
    // 강제로 동적 렌더링(ƒ)시켜 6,900+ 클리닉 페이지 + 홈페이지가 매 요청마다
    // 캐싱 없이 풀 렌더링되던 중 (Vercel Hobby Fluid CPU/Origin Transfer 한도
    // 초과 원인, 2026-07-22 감사). 어드민 스폰서 변경은 5분 내 반영되면 충분.
    const res = await fetch(`${UPSTASH_URL}/get/${REDIS_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: string | null };
    if (!j.result) return null;
    return JSON.parse(j.result) as SponsoredMap;
  } catch {
    return null;
  }
}

async function redisSet(m: SponsoredMap): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["SET", REDIS_KEY, JSON.stringify(m)]),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function listSponsored(): Promise<SponsoredMap> {
  const fromRedis = await redisGet();
  return fromRedis ?? envFallback();
}

export async function saveSponsored(m: SponsoredMap): Promise<{ ok: boolean; error?: string }> {
  // Normalize: trim, dedupe, drop empty
  const clean: SponsoredMap = {
    editors_pick: Array.from(new Set(m.editors_pick.map((x) => x.trim()).filter(Boolean))),
    recommended:  Array.from(new Set(m.recommended.map((x) => x.trim()).filter(Boolean))),
    featured:     Array.from(new Set(m.featured.map((x) => x.trim()).filter(Boolean))),
  };
  const saved = await redisSet(clean);
  return saved ? { ok: true } : { ok: false, error: "redis_unavailable" };
}
