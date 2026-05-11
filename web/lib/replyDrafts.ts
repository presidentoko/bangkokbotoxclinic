// Template-based 부정 리뷰 응답 초안 생성기.
// MVP — 키워드 매칭으로 5가지 카테고리 분류 → 카테고리별 template.
// 향후 LLM API 연결 시 같은 함수 시그니처 유지하면서 swap 가능.

type ReplyCategory = "wait_time" | "service" | "price" | "result" | "communication" | "generic";

const RULES: { keywords: string[]; category: ReplyCategory }[] = [
  { keywords: ["wait", "waiting", "slow", "delay", "long time", "기다", "느리", "오래", "ช้า", "รอ"], category: "wait_time" },
  { keywords: ["rude", "unprofessional", "attitude", "ignored", "staff", "service", "불친", "무례", "친절", "หยาบ", "พนักงาน"], category: "service" },
  { keywords: ["expensive", "overcharg", "price", "cost", "money", "extra fee", "비싸", "가격", "추가요금", "แพง", "ราคา"], category: "price" },
  { keywords: ["didn't work", "no effect", "weak", "no result", "ineffective", "효과 없", "안 좋", "ไม่ได้ผล", "ไม่ดี"], category: "result" },
  { keywords: ["english", "korean", "thai only", "communicate", "language", "barrier", "영어", "한국어", "소통", "สื่อสาร", "ภาษา"], category: "communication" },
];

const TEMPLATES: Record<ReplyCategory, (clinicName: string, reviewerName: string) => string> = {
  wait_time: (c, r) =>
    `Dear ${r || "Valued patient"}, we sincerely apologize for the long wait you experienced at ${c}. ` +
    `We've reviewed our appointment scheduling and added an additional consultation room during peak hours this month. ` +
    `Please contact us directly on LINE — we'd like to offer you a priority booking on your next visit so we can demonstrate the improvement.`,

  service: (c, r) =>
    `Dear ${r || "Valued patient"}, thank you for your honest feedback — this is not the experience we want any patient to have at ${c}. ` +
    `Our manager has been notified and the team member involved is being retrained. ` +
    `We'd appreciate the chance to make this right. Please DM us on LINE so our manager can speak with you personally.`,

  price: (c, r) =>
    `Hi ${r || "Valued patient"}, thank you for your feedback about pricing at ${c}. ` +
    `We always confirm full pricing in writing before any procedure to avoid surprises — if this didn't happen for your visit, that's a process gap on our side. ` +
    `Please contact us so we can review your specific case and offer a credit toward your next visit.`,

  result: (c, r) =>
    `Dear ${r || "Valued patient"}, we're sorry the result didn't meet your expectations at ${c}. ` +
    `Most reputable Bangkok clinics offer a free touch-up within 14 days for botox / filler / HIFU procedures, and we honor this too. ` +
    `Please come back so our doctor can assess and provide a complimentary correction. DM us on LINE to schedule.`,

  communication: (c, r) =>
    `Dear ${r || "Valued patient"}, we apologize for the communication difficulty during your visit to ${c}. ` +
    `We have English- and Korean-speaking staff available — we'll ensure one of them is your primary contact for your next appointment. ` +
    `Please book via LINE and mention "English (or Korean) speaker requested" so we route you correctly.`,

  generic: (c, r) =>
    `Dear ${r || "Valued patient"}, thank you for your honest review of ${c}. ` +
    `We take every piece of feedback seriously — we'd like to understand the specifics of your experience so we can improve. ` +
    `Please reach out to us directly on LINE so a senior team member can address your concerns personally.`,
};

export function classifyReview(text: string): ReplyCategory {
  const low = text.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => low.includes(k))) return rule.category;
  }
  return "generic";
}

export function draftReply(text: string, clinicName: string, reviewerName: string): { category: ReplyCategory; draft: string } {
  const category = classifyReview(text);
  return { category, draft: TEMPLATES[category](clinicName, reviewerName) };
}

export const REPLY_CATEGORY_LABELS: Record<ReplyCategory, string> = {
  wait_time: "Wait time",
  service: "Service attitude",
  price: "Pricing transparency",
  result: "Procedure result",
  communication: "Language / communication",
  generic: "General concern",
};
