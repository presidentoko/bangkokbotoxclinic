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
    const res = await fetch(`${UPSTASH_URL}/get/${REDIS_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
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
