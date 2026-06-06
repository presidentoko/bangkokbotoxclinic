// Client-safe quiz constants — no data imports, safe to use in client components

export type SkinType = "oily" | "dry" | "combo" | "sensitive";
export type Budget = "low" | "mid" | "high";

export const VALID_SKINS = ["oily", "dry", "combo", "sensitive"] as const;
export const VALID_BUDGETS = ["low", "mid", "high"] as const;

export const SKIN_LABELS: Record<SkinType, { th: string; en: string; emoji: string; desc_th: string; desc_en: string }> = {
  oily:      { th: "ผิวมัน",      en: "Oily",        emoji: "✨", desc_th: "หน้ามันตลอดวัน",     desc_en: "Shiny throughout the day" },
  dry:       { th: "ผิวแห้ง",     en: "Dry",         emoji: "💧", desc_th: "ตึง ลอก บางครั้งแดง", desc_en: "Tight, flaky, sometimes red" },
  combo:     { th: "ผิวผสม",      en: "Combination", emoji: "🌿", desc_th: "มันที่ T-zone แห้งที่แก้ม", desc_en: "Oily T-zone, dry cheeks" },
  sensitive: { th: "ผิวแพ้ง่าย",  en: "Sensitive",   emoji: "🌸", desc_th: "แพ้ง่าย แดง คัน",    desc_en: "Reacts easily, redness, itching" },
};

export const BUDGET_LABELS: Record<Budget, { th: string; en: string; desc_th: string; desc_en: string }> = {
  low:  { th: "ประหยัด",  en: "Budget",    desc_th: "ไม่เกิน ฿280",   desc_en: "Under ฿280" },
  mid:  { th: "ปานกลาง",  en: "Mid-range", desc_th: "฿280 – ฿700",    desc_en: "฿280 – ฿700" },
  high: { th: "พรีเมียม", en: "Premium",   desc_th: "฿700 ขึ้นไป",    desc_en: "฿700 and up" },
};

export const CONCERN_QUIZ_META: Record<string, { th: string; en: string; emoji: string }> = {
  acne:       { th: "สิว",               en: "Acne",           emoji: "🫧" },
  whitening:  { th: "ฝ้า กระ ผิวกระจ่าง", en: "Brightening",   emoji: "🌟" },
  antiaging:  { th: "ริ้วรอย",            en: "Anti-aging",    emoji: "⏳" },
  pores:      { th: "รูขุมขนกว้าง",       en: "Pores",         emoji: "🔍" },
  oilcontrol: { th: "หน้ามัน",            en: "Oil control",   emoji: "🛡️" },
  sensitive:  { th: "ผิวแพ้ง่าย",         en: "Sensitive skin", emoji: "🌿" },
};
