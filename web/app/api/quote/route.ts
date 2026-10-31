// 견적 요청 접수 — 저장하고 텔레그램으로 알린다. 클리닉 초대는 관리 화면에서 사람이 한다.

import { createRequest, makeToken, type ContactMethod, type Procedure, type QuoteRequest } from "@/lib/auctionStore";
import { BID_WINDOW_HOURS, procedureLabel } from "@/lib/auctionText";
import { makeLeadId } from "@/lib/leadStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendTelegram } from "@/lib/notify";
import { getSiteConfig, getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";

const PROCS: Procedure[] = ["botox", "filler", "hifu", "other"];
const METHODS: ContactMethod[] = ["whatsapp", "line", "email", "instagram"];

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  if (getSiteConfig().focus !== "botox") return new Response("not found", { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }
  if (body._hp && String(body._hp).length > 0) return Response.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  if (!(await checkRateLimit({ key: `quote:${ip}`, limit: 3, windowSec: 3600, failOpenOnError: true }))) {
    return new Response("rate limit", { status: 429 });
  }

  const procedure = str(body.procedure, 20) as Procedure;
  const contact_method = str(body.contact_method, 20) as ContactMethod;
  const contact = str(body.contact, 120);
  const details = str(body.details, 500);
  if (!PROCS.includes(procedure)) return new Response("procedure", { status: 400 });
  if (!METHODS.includes(contact_method) || contact.length < 3) return new Response("contact", { status: 400 });
  if (contact_method === "email" && !contact.includes("@")) return new Response("contact", { status: 400 });
  if (details.length < 2) return new Response("details", { status: 400 });

  const now = new Date();
  const r: QuoteRequest = {
    id: makeLeadId(),
    secret: makeToken(24),
    procedure,
    details,
    area: str(body.area, 100),
    when: str(body.when, 100),
    name: str(body.name, 100),
    contact_method,
    contact,
    notes: str(body.notes, 1000),
    at: now.toISOString(),
    closes_at: new Date(now.getTime() + BID_WINDOW_HOURS * 3600_000).toISOString(),
    status: "open",
  };
  await createRequest(r);

  const site = getSiteUrl();
  await sendTelegram(
    [
      "🔨 새 견적 요청",
      `시술: ${procedureLabel(r.procedure)}`,
      `내용: ${r.details}`,
      r.area ? `지역: ${r.area}` : null,
      r.when ? `날짜: ${r.when}` : null,
      `손님: ${r.name || "(이름 없음)"} · ${r.contact_method} ${r.contact}`,
      r.notes ? `메모: ${r.notes}` : null,
      "",
      "👉 관리 화면에서 클리닉을 골라 입찰 링크를 인스타 DM으로 보내세요.",
    ].filter((l) => l !== null).join("\n"),
    [{ text: "클리닉 고르기", url: `${site}/admin/auctions/${r.id}` }],
  );

  return Response.json({ ok: true, url: `${site}/q/${r.secret}`, secret: r.secret });
}
