import Anthropic from "@anthropic-ai/sdk";
import { draftReplyStyled, REPLY_CATEGORY_LABELS } from "./replyDrafts";
import type { ReplyStyle } from "./replyDrafts";
import { reviewHash } from "./dashboardStore";
import { rcmd } from "./upstash";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_REPLY_MODEL || "claude-haiku-4-5";
const CACHE_TTL_SEC = 30 * 24 * 3600;

const STYLE_INSTRUCTIONS: Record<ReplyStyle, string> = {
  0: "Formal — respectful, measured, professional. Acknowledge the issue, take responsibility where appropriate, offer a concrete next step.",
  1: "Warm — empathetic, human, conversational. Apologize sincerely if warranted, show you genuinely care, invite the reviewer to reconnect.",
  2: "Brief — concise, direct, two sentences max. Acknowledge + one clear next step. No fluff.",
};

const SYSTEM_PROMPT = `You are a senior reputation manager replying to negative Google reviews on behalf of hair-transplant clinics in Thailand.

Output rules — follow exactly:
- Output ONLY the reply text. No preamble, no labels, no quotes, no markdown.
- Detect the language of the review. Reply in the SAME language (Thai → Thai, English → English, Korean → Korean).
- 2 to 4 sentences. Never longer.
- Address the reviewer by name if provided. Otherwise use a neutral greeting appropriate to the language.
- For hair-transplant complaints about results, acknowledge density develops over 9–12 months and offer a follow-up evaluation.
- Never make legal commitments, never offer refunds, never blame staff by name.
- Avoid generic AI phrases ("Thank you for your feedback", "We value your input"). Be specific to what the reviewer said.
- End with one concrete next step (LINE / phone / manager) or invite a private conversation.`;

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

  const tpl = draftReplyStyled(reviewText, clinicName, authorName ?? "", style);
  const category = tpl.category;

  const hash = reviewHash(reviewText);
  const cacheKey = `ai_reply:${hash}:${style}:${MODEL}`;
  const cached = (await rcmd(["GET", cacheKey])) as string | null;
  if (cached) return { draft: cached, category, source: "cache" };

  if (!ANTHROPIC_API_KEY) {
    return { draft: tpl.draft, category, source: "fallback" };
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
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userText }],
    });

    const block = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    const draft = (block?.text ?? "").trim();
    if (!draft) return { draft: tpl.draft, category, source: "fallback" };

    await rcmd(["SETEX", cacheKey, CACHE_TTL_SEC, draft]);
    return { draft, category, source: "llm", model: MODEL };
  } catch (err) {
    console.error("[ai-reply] LLM call failed:", err instanceof Error ? err.message : String(err));
    return { draft: tpl.draft, category, source: "fallback" };
  }
}

export { REPLY_CATEGORY_LABELS };
