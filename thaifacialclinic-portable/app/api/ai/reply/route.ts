import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateAiReply } from "@/lib/aiReply";
import type { ReplyStyle } from "@/lib/replyDrafts";
import { isAdminAuthed } from "@/lib/adminAuth";
import { verifyAccess } from "@/lib/dashboardAccessStore";
import { rcmd } from "@/lib/upstash";

export const runtime = "nodejs";

const MAX_REVIEW_TEXT_BYTES = 4000;          // ~4 KB review text cap
const PER_TOKEN_DAILY_LIMIT = 100;            // 100 AI calls per clinic per day
const PER_IP_DAILY_LIMIT = 50;                // 50 AI calls per IP per day (anti-billing-attack)

function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
}

async function rateLimitOk(key: string, max: number): Promise<boolean> {
  const count = (await rcmd(["INCR", key])) as number | null;
  if (count === 1) await rcmd(["EXPIRE", key, 60 * 60 * 24]);
  return typeof count === "number" ? count <= max : true;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    clinic_id?: string;
    access_token?: string;
    review_text?: string;
    clinic_name?: string;
    author_name?: string;
    style?: number;
  };

  const staff = await isAdminAuthed(req);
  const tokenOk = !!(body.clinic_id && body.access_token && await verifyAccess(body.clinic_id, body.access_token));
  if (!staff && !tokenOk) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!body.review_text || !body.clinic_name) {
    return NextResponse.json({ ok: false, error: "review_text + clinic_name required" }, { status: 400 });
  }

  if (body.review_text.length > MAX_REVIEW_TEXT_BYTES) {
    return NextResponse.json({ ok: false, error: "review_text too long" }, { status: 413 });
  }

  // Quota: per-clinic + per-IP daily cap
  const today = new Date().toISOString().slice(0, 10);
  const ip = clientIp(req);
  const clinicKey = `rl:ai:clinic:${body.clinic_id || "staff"}:${today}`;
  const ipKey = `rl:ai:ip:${ip}:${today}`;
  if (!(await rateLimitOk(clinicKey, PER_TOKEN_DAILY_LIMIT))) {
    return NextResponse.json({ ok: false, error: "daily clinic quota" }, { status: 429 });
  }
  if (!(await rateLimitOk(ipKey, PER_IP_DAILY_LIMIT))) {
    return NextResponse.json({ ok: false, error: "daily ip quota" }, { status: 429 });
  }

  const style = (body.style ?? 1) as ReplyStyle;
  const result = await generateAiReply({
    reviewText: body.review_text,
    clinicName: body.clinic_name.slice(0, 200),
    authorName: body.author_name?.slice(0, 100),
    style: style >= 0 && style <= 2 ? style : 1,
  });

  return NextResponse.json({ ok: true, ...result });
}
