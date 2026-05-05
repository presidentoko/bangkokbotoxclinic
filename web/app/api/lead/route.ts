// Lead capture endpoint.
// Phase 1: append to Vercel KV / file. Phase 2: 클리닉 dashboard 에서 조회.
// 현재는 webhook (Slack/Discord) 또는 stdout 로그 fallback.

export const runtime = "nodejs";

const WEBHOOK = process.env.LEAD_WEBHOOK_URL;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid body", { status: 400 });
  }

  const email = String(body.email || "").trim();
  if (!email || !email.includes("@")) {
    return new Response("invalid email", { status: 400 });
  }

  const payload = {
    email,
    message: String(body.message || "").slice(0, 1000),
    clinic: String(body.clinicName || ""),
    service: String(body.service || ""),
    context: String(body.context || ""),
    ua: req.headers.get("user-agent") || "",
    ref: req.headers.get("referer") || "",
    at: new Date().toISOString(),
  };

  // Webhook 으로 즉시 통지 (Slack incoming webhook 호환)
  if (WEBHOOK) {
    try {
      await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New lead: ${payload.email}\nClinic: ${payload.clinic}\nService: ${payload.service}\nContext: ${payload.context}\nMessage: ${payload.message}`,
          ...payload,
        }),
      });
    } catch (e) {
      console.error("[lead] webhook failed", e);
    }
  } else {
    console.log("[lead]", JSON.stringify(payload));
  }

  return Response.json({ ok: true });
}
