// 클리닉 입찰 — 초대 토큰이 곧 인증이다 (클리닉마다 따로 발급, 추측 불가).

import { getInvite, getRequest, isOpen, listBids, putBid, type Bid } from "@/lib/auctionStore";
import { baht, customerMessageLink } from "@/lib/auctionText";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendTelegram, type TelegramButton } from "@/lib/notify";
import { getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }

  const token = str(body.token, 64);
  if (!(await checkRateLimit({ key: `bid:${token}`, limit: 10, windowSec: 3600, failOpenOnError: true }))) {
    return new Response("rate limit", { status: 429 });
  }
  const inv = await getInvite(token);
  if (!inv) return new Response("invalid link", { status: 404 });
  const r = await getRequest(inv.req_id);
  if (!r) return new Response("request expired", { status: 410 });
  if (!isOpen(r)) return new Response("closed", { status: 409 });

  const price = Math.round(Number(body.price_thb));
  if (!Number.isFinite(price) || price < 100 || price > 2_000_000) return new Response("price", { status: 400 });

  const now = new Date().toISOString();
  const prev = (await listBids(r.id)).find((b) => b.token === token);
  const bid: Bid = {
    token,
    clinic_id: inv.clinic_id,
    clinic_name: inv.clinic_name,
    price_thb: price,
    brand: str(body.brand, 100),
    quantity: str(body.quantity, 100),
    includes: str(body.includes, 300),
    available: str(body.available, 200),
    note: str(body.note, 1000),
    at: prev?.at ?? now,
    updated_at: now,
  };
  const isNew = await putBid(r.id, bid);
  const count = (await listBids(r.id)).length;

  const site = getSiteUrl();
  const customerUrl = `${site}/q/${r.secret}`;
  const buttons: TelegramButton[] = [];
  const msgLink = customerMessageLink(
    r,
    `Hi${r.name ? ` ${r.name}` : ""}! You have ${count} quote${count > 1 ? "s" : ""} from Bangkok clinics for your ${r.procedure} request. Compare and pick one here: ${customerUrl}`,
  );
  if (msgLink) buttons.push({ text: "손님에게 링크 보내기", url: msgLink });
  buttons.push({ text: "입찰 현황 보기", url: `${site}/admin/auctions/${r.id}` });

  await sendTelegram(
    [
      isNew ? `💰 입찰 ${count}번째` : "✏️ 입찰 수정",
      `${bid.clinic_name} · ${baht(bid.price_thb)}`,
      [bid.brand, bid.quantity].filter(Boolean).join(" · ") || null,
      bid.includes ? `포함: ${bid.includes}` : null,
      "",
      `요청: ${r.details}`,
      `손님 연락처: ${r.contact_method} ${r.contact}`,
      r.contact_method === "email" ? `손님 링크: ${customerUrl}` : null,
    ].filter((l) => l !== null).join("\n"),
    buttons,
  );

  return Response.json({ ok: true });
}
