// LLM 기반 부정 리뷰 답글 생성. server-side 전용 (ANTHROPIC_API_KEY 사용).
// Redis 캐시 (review_hash + style) → Claude API → 템플릿 fallback.
//
// Model: Haiku 4.5 (저비용 — 답글 1개 ~$0.001).
// Override: ANTHROPIC_REPLY_MODEL env var.

import Anthropic from "@anthropic-ai/sdk";
import { draftReplyStyled, REPLY_CATEGORY_LABELS } from "@/lib/replyDrafts";
import type { ReplyStyle } from "@/lib/replyDrafts";
import { reviewHash } from "@/lib/dashboardStore";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_REPLY_MODEL || "claude-haiku-4-5";

// 30일 캐시 — 같은 리뷰 + 같은 스타일은 캐시 hit, API 호출 0회.
const CACHE_TTL_SEC = 30 * 24 * 3600;

const STYLE_INSTRUCTIONS: Record<ReplyStyle, string> = {
  0: "Formal — respectful, measured, professional. Acknowledge the issue, take responsibility where appropriate, offer a concrete next step.",
  1: "Warm — empathetic, human, conversational. Apologize sincerely if warranted, show you genuinely care, invite the reviewer to reconnect.",
  2: "Brief — concise, direct, two sentences max. Acknowledge + one clear next step. No fluff.",
};

const SYSTEM_PROMPT = `You are a senior reputation manager replying to negative Google reviews on behalf of medical clinics in Thailand.

Output rules — follow exactly:
- Output ONLY the reply text. No preamble, no labels, no quotes, no markdown.
- Detect the language of the review. Reply in the SAME language (Thai → Thai, English → English, Korean → Korean).
- 2 to 4 sentences. Never longer.
- Address the reviewer by name if provided. Otherwise use a neutral greeting appropriate to the language.
- Never make legal commitments, never offer refunds, never blame staff by name.
- Never use generic AI phrases ("Thank you for your feedback", "We value your input"). Be specific to what the reviewer actually said.
- Sound like a real human manager, not a chatbot. Vary phrasing across replies.
- End with one concrete next step (contact channel, manager name, etc.) — or invite a private conversation.`;

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["GET", key]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: string | null };
    return j.result ?? null;
  } catch { return null; }
}

async function redisSetEx(key: string, ttl: number, value: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    await fetch(UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["SETEX", key, ttl, value]),
      cache: "no-store",
    });
  } catch {}
}

export type AiReplyResult = {
  draft: string;
  category: string;
  source: "cache" | "llm" | "fallback";
  model?: string;
};

export async function generateAiReply(args: {
  reviewText: string;
  clinicName: string;
  authorName?: string;
  style: ReplyStyle;
}): Promise<AiReplyResult> {
  const { reviewText, clinicName, authorName, style } = args;

  // 템플릿으로 카테고리 분류 (회신 본문은 LLM이 새로 생성, 카테고리는 UI 라벨용)
  const templateResult = draftReplyStyled(reviewText, clinicName, authorName ?? "", style);
  const category = templateResult.category;

  // Redis cache lookup
  const hash = reviewHash(reviewText);
  const cacheKey = `ai_reply:${hash}:${style}:${MODEL}`;
  const cached = await redisGet(cacheKey);
  if (cached) {
    return { draft: cached, category, source: "cache" };
  }

  // No API key → 템플릿 fallback (open-source-friendly behavior)
  if (!ANTHROPIC_API_KEY) {
    return { draft: templateResult.draft, category, source: "fallback" };
  }

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const userText = [
      `Clinic: ${clinicName}`,
      `Reviewer: ${authorName || "(name not provided)"}`,
      `Style: ${STYLE_INSTRUCTIONS[style]}`,
      `Review:`,
      reviewText,
    ].join("\n");

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userText }],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    const draft = (textBlock?.text ?? "").trim();
    if (!draft) {
      return { draft: templateResult.draft, category, source: "fallback" };
    }

    await redisSetEx(cacheKey, CACHE_TTL_SEC, draft);
    return { draft, category, source: "llm", model: MODEL };
  } catch (err) {
    // API error → fallback to template, log for debugging
    console.error("[ai-reply] LLM call failed, falling back to template:", err instanceof Error ? err.message : String(err));
    return { draft: templateResult.draft, category, source: "fallback" };
  }
}

export { REPLY_CATEGORY_LABELS };
