// Hair-transplant clinic review-reply template fallback (when no AI key).
// Categorizes by keyword → returns 1 of 3 stylistic variants per category.

export type ReplyCategory = "wait_time" | "service" | "price" | "result" | "communication" | "generic";
export type ReplyStyle = 0 | 1 | 2; // formal | warm | brief

const RULES: { keywords: string[]; category: ReplyCategory }[] = [
  { keywords: ["wait", "waiting", "slow", "delay", "long time", "기다", "느리", "오래", "ช้า", "รอ"], category: "wait_time" },
  { keywords: ["rude", "unprofessional", "attitude", "ignored", "staff", "불친", "무례", "친절", "หยาบ", "พนักงาน"], category: "service" },
  { keywords: ["expensive", "overcharg", "price", "cost", "money", "extra fee", "비싸", "가격", "추가요금", "แพง", "ราคา"], category: "price" },
  { keywords: ["didn't work", "no effect", "weak", "no result", "shedding", "fell out", "graft", "효과 없", "안 좋", "ไม่ได้ผล", "ไม่ดี", "หลุด"], category: "result" },
  { keywords: ["english", "korean", "thai only", "communicate", "language", "barrier", "영어", "한국어", "소통", "สื่อสาร", "ภาษา"], category: "communication" },
];

export function classifyReview(text: string): ReplyCategory {
  const low = text.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => low.includes(k))) return rule.category;
  }
  return "generic";
}

type Tpl = (clinic: string, name: string) => string;

const FORMAL: Record<ReplyCategory, Tpl> = {
  wait_time: (c, r) =>
    `Dear ${r || "Valued patient"}, we sincerely apologize for the long wait at ${c}. Our consultation scheduling has been revised this month with additional slots and dedicated post-op rooms. Please contact us on LINE — we will arrange a priority appointment so we can show you the improvement.`,
  service: (c, r) =>
    `Dear ${r || "Valued patient"}, your feedback does not reflect the standard we hold at ${c}. Our clinic manager has been informed and the team has been re-briefed. We would appreciate the chance to make this right — please DM us on LINE so our manager can speak with you personally.`,
  price: (c, r) =>
    `Hello ${r || "Valued patient"}, thank you for raising the pricing concern about ${c}. We always confirm full graft count and total cost in writing before any procedure — if this did not happen on your visit, that is a process gap on our side. Please contact us so we can review and offer a credit toward a follow-up session.`,
  result: (c, r) =>
    `Dear ${r || "Valued patient"}, we are sorry your hair-transplant result at ${c} did not meet expectations. Final density typically requires 9–12 months and a follow-up evaluation; if you are within that window we offer a complimentary consultation, and if past it we still review every case individually. Please DM us on LINE to schedule.`,
  communication: (c, r) =>
    `Dear ${r || "Valued patient"}, we apologize for the language difficulty during your visit to ${c}. We have English- and Korean-speaking coordinators available — for your next appointment we will ensure one of them is your primary contact. Please book via LINE and mention your preferred language.`,
  generic: (c, r) =>
    `Dear ${r || "Valued patient"}, thank you for your honest feedback about ${c}. Every review helps us improve — we would like to understand the specifics of your experience. Please reach out on LINE so a senior team member can address your concerns personally.`,
};

const WARM: Record<ReplyCategory, Tpl> = {
  wait_time: (c, r) =>
    `Hi ${r || "there"} 💙 We're truly sorry for the wait at ${c} — your time matters and we let you down. We've been refining our scheduling. Drop us a message on LINE and we'll book you in at a quiet time so things are smoother.`,
  service: (c, r) =>
    `Hi ${r || "there"} 💙 This is hard to read because it's the opposite of how we want every patient to feel at ${c}. You deserved better. Our manager has spoken with the team. Please reach out on LINE — I'd love to make this right personally.`,
  price: (c, r) =>
    `Hi ${r || "there"} 💙 Price surprises during a hair-transplant journey are stressful and you're right to flag this. At ${c} we aim to confirm graft-by-graft pricing upfront — if we fell short, that's on us. LINE us with your booking ID and we'll review.`,
  result: (c, r) =>
    `Hi ${r || "there"} 💙 We're so sorry the result hasn't been what you hoped for after visiting ${c}. Hair density develops slowly — please come back for a free re-evaluation. Our doctor will look at your case and discuss next steps with no pressure.`,
  communication: (c, r) =>
    `Hi ${r || "there"} 💙 We're sorry the language barrier got in the way at ${c}. We do have English and Korean speakers — we should have connected you sooner. Next time, message us on LINE in your language and we'll route you to the right coordinator.`,
  generic: (c, r) =>
    `Hi ${r || "there"} 💙 Thank you for sharing your experience at ${c}. Every review — especially the difficult ones — helps us grow. Please reach out on LINE anytime; we'd love to hear more.`,
};

const BRIEF: Record<ReplyCategory, Tpl> = {
  wait_time: (c, r) =>
    `${r || "Hi"}, sorry for the wait at ${c}. Scheduling has been revised. LINE us — we'll give you a priority slot.`,
  service: (c, r) =>
    `${r || "Hi"}, that isn't the standard at ${c}. Manager notified. Please LINE us so we can resolve this directly.`,
  price: (c, r) =>
    `${r || "Hi"}, full pricing should always be confirmed before treatment at ${c}. If it wasn't, that's our error. LINE us — we'll review and credit your case.`,
  result: (c, r) =>
    `${r || "Hi"}, we're sorry the result didn't meet expectations. Density takes 9–12 months — please come back for a complimentary re-evaluation. LINE ${c} to schedule.`,
  communication: (c, r) =>
    `${r || "Hi"}, apologies for the language gap at ${c}. English and Korean coordinators available — LINE us and specify your language.`,
  generic: (c, r) =>
    `${r || "Hi"}, thank you for the feedback. We'd like to make it right at ${c}. Please LINE us directly.`,
};

export function draftReplyStyled(
  text: string, clinicName: string, reviewerName: string, style: ReplyStyle
): { category: ReplyCategory; draft: string } {
  const category = classifyReview(text);
  const tpl = style === 1 ? WARM : style === 2 ? BRIEF : FORMAL;
  return { category, draft: tpl[category](clinicName, reviewerName) };
}

export const REPLY_CATEGORY_LABELS: Record<ReplyCategory, string> = {
  wait_time: "Wait time",
  service: "Staff / service",
  price: "Pricing transparency",
  result: "Procedure result",
  communication: "Language / communication",
  generic: "General concern",
};
