// LINE webhook 자동 캡처 — 친구 추가하거나 메시지 보낸 사용자의 user_id 저장.
// 클리닉이 직접 user_id 안 알려줘도 우리가 자동으로 캡처해서 어드민에서 사용.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "admin:line_followers";

export type LineFollower = {
  user_id: string;            // U-로 시작하는 33자
  display_name: string;       // LINE 프로필 이름
  picture_url?: string;
  status_message?: string;
  language?: string;
  followed_at: string;        // ISO timestamp — 친구 추가 시점
  last_message_at?: string;
  matched_clinic_id?: string; // 어드민에서 수동 매칭
};

async function rcmd(cmd: (string | number)[]): Promise<unknown> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: unknown };
    return j.result ?? null;
  } catch {
    return null;
  }
}

export async function listLineFollowers(): Promise<LineFollower[]> {
  const result = (await rcmd(["HGETALL", REDIS_KEY])) as unknown;
  if (!result) return [];
  const out: LineFollower[] = [];
  if (Array.isArray(result)) {
    for (let i = 0; i < result.length; i += 2) {
      try { out.push(JSON.parse(String(result[i + 1])) as LineFollower); } catch {/* skip */}
    }
  } else if (typeof result === "object") {
    for (const v of Object.values(result as Record<string, string>)) {
      try { out.push(JSON.parse(v) as LineFollower); } catch {/* skip */}
    }
  }
  return out.sort((a, b) => b.followed_at.localeCompare(a.followed_at));
}

export async function saveLineFollower(rec: LineFollower): Promise<boolean> {
  const r = await rcmd(["HSET", REDIS_KEY, rec.user_id, JSON.stringify(rec)]);
  return r !== null;
}

export async function getLineFollower(user_id: string): Promise<LineFollower | null> {
  const r = (await rcmd(["HGET", REDIS_KEY, user_id])) as string | null;
  if (!r) return null;
  try { return JSON.parse(r) as LineFollower; } catch { return null; }
}

/** LINE Profile API — user_id 로 display name / 사진 조회. */
export async function fetchLineProfile(userId: string, botToken: string): Promise<{
  displayName?: string;
  pictureUrl?: string;
  statusMessage?: string;
  language?: string;
} | null> {
  try {
    const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: { Authorization: `Bearer ${botToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
