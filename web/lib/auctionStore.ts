// 견적 경매 저장소 — 손님 요청 → 클리닉별 입찰 링크 → 입찰 → 손님 선택 (2026-10-31).
// leadStore 와 같은 Upstash REST 방식. env 없으면 읽기는 빈 값, 쓰기는 no-op.
//
// 키 (모두 60일 TTL):
//   auc:req:{id}        요청 JSON
//   auc:sec:{secret}    → id   (손님 비교 링크 /q/{secret})
//   auc:tok:{token}     초대 JSON (클리닉 입찰 링크 /bid/{token})
//   auc:inv:{id}        hash token → 초대 JSON
//   auc:bids:{id}       hash token → 입찰 JSON
//   auc:list            최근 요청 id 목록 (관리 화면)

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const TTL = 60 * 60 * 24 * 60;

export type Procedure = "botox" | "filler" | "hifu" | "other";
export type ContactMethod = "whatsapp" | "line" | "email" | "instagram";

export type QuoteRequest = {
  id: string;
  secret: string;
  procedure: Procedure;
  details: string;        // 부위·유닛·cc·장비 등 손님이 쓴 그대로
  area: string;           // 선호 지역
  when: string;           // 희망 날짜
  name: string;
  contact_method: ContactMethod;
  contact: string;
  notes: string;
  at: string;
  closes_at: string;      // 이 시각 이후 새 입찰 안 받음
  status: "open" | "chosen" | "closed";
  chosen_token?: string;
  chosen_at?: string;
};

export type Invite = {
  token: string;
  req_id: string;
  clinic_id: string;
  clinic_name: string;
  at: string;
};

export type Bid = {
  token: string;
  clinic_id: string;
  clinic_name: string;
  price_thb: number;
  brand: string;
  quantity: string;       // "50 units", "1 cc", "300 shots"
  includes: string;
  available: string;
  note: string;
  at: string;
  updated_at: string;
};

async function pipeline(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return cmds.map(() => null);
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[auctionStore] upstash err", res.status, await res.text());
      return cmds.map(() => null);
    }
    const arr = (await res.json()) as { result?: unknown }[];
    return arr.map((r) => r?.result ?? null);
  } catch (e) {
    console.error("[auctionStore] upstash failed", e);
    return cmds.map(() => null);
  }
}

async function one(cmd: (string | number)[]): Promise<unknown> {
  return (await pipeline([cmd]))[0];
}

function parse<T>(s: unknown): T | null {
  if (typeof s !== "string") return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}

/** HGETALL 은 [k, v, k, v, ...] 로 온다. */
function hashValues<T>(r: unknown): T[] {
  if (!Array.isArray(r)) return [];
  const out: T[] = [];
  for (let i = 1; i < r.length; i += 2) {
    const v = parse<T>(r[i]);
    if (v) out.push(v);
  }
  return out;
}

/** 링크에 들어가는 추측 불가능한 토큰. */
export function makeToken(len = 24): string {
  const a = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  return a.slice(0, len);
}

export async function createRequest(r: QuoteRequest): Promise<void> {
  await pipeline([
    ["SET", `auc:req:${r.id}`, JSON.stringify(r), "EX", TTL],
    ["SET", `auc:sec:${r.secret}`, r.id, "EX", TTL],
    ["LPUSH", "auc:list", r.id],
    ["LTRIM", "auc:list", 0, 199],
  ]);
}

export async function saveRequest(r: QuoteRequest): Promise<void> {
  await one(["SET", `auc:req:${r.id}`, JSON.stringify(r), "KEEPTTL"]);
}

export async function getRequest(id: string): Promise<QuoteRequest | null> {
  if (!id) return null;
  return parse<QuoteRequest>(await one(["GET", `auc:req:${id}`]));
}

export async function getRequestBySecret(secret: string): Promise<QuoteRequest | null> {
  if (!secret) return null;
  const id = await one(["GET", `auc:sec:${secret}`]);
  return typeof id === "string" ? getRequest(id) : null;
}

export async function listRequests(limit = 50): Promise<QuoteRequest[]> {
  const ids = await one(["LRANGE", "auc:list", 0, limit - 1]);
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const vals = await one(["MGET", ...ids.map((id) => `auc:req:${id}`)]);
  if (!Array.isArray(vals)) return [];
  return vals.map((v) => parse<QuoteRequest>(v)).filter((x): x is QuoteRequest => x !== null);
}

export async function createInvite(inv: Invite): Promise<void> {
  const json = JSON.stringify(inv);
  await pipeline([
    ["SET", `auc:tok:${inv.token}`, json, "EX", TTL],
    ["HSET", `auc:inv:${inv.req_id}`, inv.token, json],
    ["EXPIRE", `auc:inv:${inv.req_id}`, TTL],
  ]);
}

export async function getInvite(token: string): Promise<Invite | null> {
  if (!token) return null;
  return parse<Invite>(await one(["GET", `auc:tok:${token}`]));
}

export async function listInvites(reqId: string): Promise<Invite[]> {
  return hashValues<Invite>(await one(["HGETALL", `auc:inv:${reqId}`]));
}

/** 같은 클리닉이 다시 내면 덮어쓴다. 처음 낸 입찰이면 true. */
export async function putBid(reqId: string, bid: Bid): Promise<boolean> {
  const [isNew] = await pipeline([
    ["HSET", `auc:bids:${reqId}`, bid.token, JSON.stringify(bid)],
    ["EXPIRE", `auc:bids:${reqId}`, TTL],
  ]);
  return isNew === 1;
}

export async function listBids(reqId: string): Promise<Bid[]> {
  return hashValues<Bid>(await one(["HGETALL", `auc:bids:${reqId}`])).sort((a, b) => a.price_thb - b.price_thb);
}

/** 입찰을 받을 수 있는 상태인가. */
export function isOpen(r: QuoteRequest, now = Date.now()): boolean {
  return r.status === "open" && now < Date.parse(r.closes_at);
}
