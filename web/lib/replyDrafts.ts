// Template-based 부정 리뷰 응답 초안 생성기.
// MVP — 키워드 매칭으로 5가지 카테고리 분류 → 카테고리별 template.
// 향후 LLM API 연결 시 같은 함수 시그니처 유지하면서 swap 가능.

export type ReplyCategory = "wait_time" | "service" | "price" | "result" | "communication" | "generic";
export type ReplyStyle = 0 | 1 | 2; // 0=formal, 1=warm, 2=brief

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

const TEMPLATES_WARM: Record<ReplyCategory, (clinicName: string, reviewerName: string) => string> = {
  wait_time: (c, r) =>
    `Hi ${r || "there"} 💙 We're really sorry you had to wait so long at ${c} — your time is precious, and we didn't honor that. ` +
    `We've been making changes to our booking flow this month. We'd love to have you back and show you the difference. ` +
    `Drop us a message on LINE — we'll book you in at a quiet time and make sure things are much smoother.`,
  service: (c, r) =>
    `Hi ${r || "there"} 💙 This is genuinely hard to read, because it's the opposite of how we want every patient to feel at ${c}. ` +
    `You deserved so much better, and I'm sorry we let you down. Our manager has already followed up with the team. ` +
    `Please reach out to us on LINE — I'd love to make this right personally.`,
  price: (c, r) =>
    `Hi ${r || "there"} 💙 We completely understand how frustrating price surprises are, and you're right to call it out. ` +
    `At ${c} we aim to be fully transparent before every treatment — if we fell short of that for you, that's on us. ` +
    `Please message us on LINE with your booking details and we'll review your case and make it right.`,
  result: (c, r) =>
    `Hi ${r || "there"} 💙 We're so sorry the result wasn't what you hoped for after visiting ${c}. ` +
    `Your satisfaction genuinely matters to us — all our doctors offer a free touch-up within 14 days if you're not happy. ` +
    `Please come back or message us on LINE — we want to make sure you leave happy.`,
  communication: (c, r) =>
    `Hi ${r || "there"} 💙 We're sorry the language barrier got in the way of your care at ${c}. ` +
    `We have English and Korean speakers on our team — we should have connected you sooner. ` +
    `Next time, just message us on LINE saying "English please" or "한국어 부탁드려요" and we'll make sure the right person looks after you.`,
  generic: (c, r) =>
    `Hi ${r || "there"} 💙 Thank you so much for taking the time to share your experience at ${c}. ` +
    `Every review helps us grow, even the difficult ones. We'd love to hear more about what happened and make things right. ` +
    `Please reach out on LINE anytime — we're always here.`,
};

const TEMPLATES_BRIEF: Record<ReplyCategory, (clinicName: string, reviewerName: string) => string> = {
  wait_time: (c, r) =>
    `${r || "Hi"}, we apologize for the wait at ${c}. We've adjusted scheduling to reduce delays. ` +
    `Please LINE us — we'll give you a priority slot on your next visit.`,
  service: (c, r) =>
    `${r || "Hi"}, that's not the standard we hold ourselves to at ${c}. Manager has been notified. ` +
    `Please LINE us directly so we can resolve this for you.`,
  price: (c, r) =>
    `${r || "Hi"}, pricing should always be confirmed before any procedure. If it wasn't, that's our error at ${c}. ` +
    `Please LINE us with your case — we'll review it and apply a credit.`,
  result: (c, r) =>
    `${r || "Hi"}, we're sorry the result didn't meet expectations. We offer a free touch-up within 14 days — no questions asked. ` +
    `LINE us at ${c} to schedule.`,
  communication: (c, r) =>
    `${r || "Hi"}, apologies for the communication gap at ${c}. We have English and Korean speakers available. ` +
    `LINE us and specify your language — we'll make sure it's seamless.`,
  generic: (c, r) =>
    `${r || "Hi"}, thank you for the feedback. We'd like to understand and make it right at ${c}. ` +
    `Please LINE us directly.`,
};

export function draftReply(text: string, clinicName: string, reviewerName: string): { category: ReplyCategory; draft: string } {
  const category = classifyReview(text);
  return { category, draft: TEMPLATES[category](clinicName, reviewerName) };
}

export function draftReplyStyled(
  text: string, clinicName: string, reviewerName: string, style: ReplyStyle
): { category: ReplyCategory; draft: string } {
  const category = classifyReview(text);
  const tpl = style === 1 ? TEMPLATES_WARM : style === 2 ? TEMPLATES_BRIEF : TEMPLATES;
  return { category, draft: tpl[category](clinicName, reviewerName) };
}

export const REPLY_CATEGORY_LABELS: Record<ReplyCategory, string> = {
  wait_time: "Wait time",
  service: "Service attitude",
  price: "Pricing transparency",
  result: "Procedure result",
  communication: "Language / communication",
  generic: "General concern",
};
