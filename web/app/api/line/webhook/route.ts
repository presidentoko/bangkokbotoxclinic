// LINE Messaging API Webhook 엔드포인트.
// LINE 친구 추가 (follow) 또는 메시지 받으면 호출됨.
// 자동으로 user_id + 프로필 캡처해서 Redis 에 저장.
// 어드민이 그 리스트 보고 파트너에 수동 매칭.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "node:crypto";
import { saveLineFollower, getLineFollower, fetchLineProfile, type LineFollower } from "@/lib/lineCapture";
import { sendLinePush } from "@/lib/notify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type LineEvent = {
  type: "follow" | "unfollow" | "message" | "postback" | "join" | "leave" | string;
  timestamp: number;
  source: { type: "user" | "group" | "room"; userId?: string };
  replyToken?: string;
  message?: { type: string; text?: string };
};

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac("sha256", secret).update(body).digest("base64");
  return hmac === signature;
}

export async function POST(req: NextRequest) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const botToken = process.env.LINE_DEFAULT_BOT_TOKEN;

  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  // Signature verification — fail-closed. LINE_CHANNEL_SECRET 안 설정되어 있으면
  // verify 자체가 불가하므로 503 반환 (이전엔 verify 스킵하던 fail-open 버그).
  // 로컬 개발 환경에서 webhook 테스트할 일이 있으면 env 에 dummy secret 라도 넣어야 함.
  if (!channelSecret) {
    console.error("[line.webhook] LINE_CHANNEL_SECRET not configured — refusing requests");
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }
  if (!verifySignature(rawBody, signature, channelSecret)) {
    console.warn("[line.webhook] signature mismatch");
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  let payload: { events?: LineEvent[] };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const events = payload.events ?? [];
  console.log(`[line.webhook] received ${events.length} events`);

  for (const event of events) {
    const userId = event.source?.userId;
    if (!userId) continue;

    if (event.type === "follow") {
      // 친구 추가 — 프로필 fetch 해서 저장 + 환영 메시지
      await captureFollower(userId, botToken, "follow");
      if (botToken) {
        const welcomeText = `🙏 안녕하세요!

Bangkok Best Clinic 파트너십 LINE 입니다.

영업팀이 곧 연락드릴 예정입니다. 그 전에 클리닉 이름과 함께 한 마디 보내주시면 매칭이 빨라집니다.

예: "안녕하세요, [클리닉 이름]에서 연락드립니다."`;
        await sendLinePush(undefined, userId, welcomeText);
      }
    } else if (event.type === "message" && event.source.type === "user") {
      // 메시지 받음 — 첫 메시지면 캡처, 아니면 last_message_at 업데이트
      await captureFollower(userId, botToken, "message", event.message?.text);
    } else if (event.type === "unfollow") {
      console.log(`[line.webhook] user ${userId} unfollowed`);
      // 친구 해제 — 기록 유지 (재가입 가능성)
    }
  }

  return NextResponse.json({ ok: true });
}

async function captureFollower(
  userId: string,
  botToken: string | undefined,
  via: "follow" | "message",
  messageText?: string
): Promise<void> {
  const existing = await getLineFollower(userId);
  const now = new Date().toISOString();

  // 프로필 fetch — 토큰 있을 때만
  let profile: Awaited<ReturnType<typeof fetchLineProfile>> | null = null;
  if (botToken) {
    profile = await fetchLineProfile(userId, botToken);
  }

  const rec: LineFollower = {
    user_id: userId,
    display_name: existing?.display_name || profile?.displayName || "(unknown)",
    picture_url: profile?.pictureUrl || existing?.picture_url,
    status_message: profile?.statusMessage || existing?.status_message,
    language: profile?.language || existing?.language,
    followed_at: existing?.followed_at || now,
    last_message_at: via === "message" ? now : existing?.last_message_at,
    matched_clinic_id: existing?.matched_clinic_id,
  };

  await saveLineFollower(rec);

  console.log(`[line.capture] ${via}: ${rec.display_name} (${userId.slice(0, 8)}...) ${messageText ? `said: ${messageText.slice(0, 50)}` : ""}`);
}

// LINE 서버는 GET으로 healthcheck 안 하지만, 사람 손으로 URL 확인하기 좋게:
export async function GET() {
  return NextResponse.json({ status: "LINE webhook active", time: new Date().toISOString() });
}
