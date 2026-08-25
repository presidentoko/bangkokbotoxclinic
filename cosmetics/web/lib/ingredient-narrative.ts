import type { IngredientEntry } from "./types";
import type { Locale } from "./i18n";

// Everything here is composed strictly from fields already vetted in
// ingredient_db.json (mechanism, evidence_note, typical_pct, role,
// alt_th_names) — no new factual claims are introduced. The goal is to turn
// the two-sentence mechanism blurb into a proper multi-paragraph explainer
// (GSC showed 220 impressions / 0 clicks on ingredient "what is X" queries;
// the page was answering in two sentences while competitors write 1,500+
// words) without risking inaccurate per-ingredient medical copy.

const ROLE_LABEL: Record<string, { th: string; en: string }> = {
  active:              { th: "สารออกฤทธิ์หลัก", en: "active ingredient" },
  humectant:           { th: "สารดึงและกักเก็บความชุ่มชื้น (humectant)", en: "humectant" },
  emollient:           { th: "สารเพิ่มความนุ่มลื่นและช่วยล็อกความชุ่มชื้น (emollient)", en: "emollient" },
  solvent:             { th: "ตัวทำละลาย (solvent)", en: "solvent" },
  additive:            { th: "สารเสริมสูตร (additive)", en: "additive" },
  antioxidant:         { th: "สารต้านอนุมูลอิสระ (antioxidant)", en: "antioxidant" },
  soothing:            { th: "สารช่วยสงบผิว (soothing agent)", en: "soothing agent" },
  sunscreen:           { th: "สารกรองแดด (sunscreen filter)", en: "sunscreen filter" },
  "barrier lipid":     { th: "ไขมันเสริมเกราะผิว (barrier lipid)", en: "barrier lipid" },
  mineral:             { th: "แร่ธาตุบำรุงผิว/ผม", en: "mineral" },
  "structural protein":{ th: "โปรตีนโครงสร้างผิว (structural protein)", en: "structural protein" },
  vitamin:             { th: "วิตามินบำรุง", en: "vitamin" },
};

function roleLabel(role: string, locale: Locale): string {
  const l = ROLE_LABEL[role];
  if (!l) return role;
  return locale === "th" ? l.th : l.en;
}

/**
 * Composes 2-3 flowing paragraphs from the ingredient's existing structured
 * fields. Deterministic — same input always produces the same output, so
 * it stays accurate as the underlying data (mechanism, evidence, pct)
 * changes rather than drifting out of sync with hand-written prose.
 */
export function ingredientNarrative(
  ing: IngredientEntry & { inci: string },
  locale: Locale,
  productCount: number,
  concernNames: string[]
): string[] {
  const isTh = locale === "th";
  const name = isTh ? ing.th_name : ing.en_name;
  const mech = isTh ? ing.mechanism_th : ing.mechanism_en;
  const role = roleLabel(ing.role, locale);
  const paras: string[] = [];

  // Paragraph 1 — identity + mechanism, folding in alt spellings so both
  // transliterations appear naturally in the body text.
  if (isTh) {
    const altSentence =
      ing.alt_th_names && ing.alt_th_names.length > 0
        ? ` บางแหล่งสะกดว่า ${ing.alt_th_names.join(" หรือ ")} ซึ่งหมายถึงสารตัวเดียวกัน`
        : "";
    paras.push(
      `${name} (${ing.inci}) จัดอยู่ในกลุ่ม${role}ที่พบได้ทั่วไปในผลิตภัณฑ์สกินแคร์ไทย${altSentence} กลไกการออกฤทธิ์คือ${mech}`
    );
  } else {
    paras.push(
      `${name} (${ing.inci}) is ${/^[aeiou]/i.test(role) ? "an" : "a"} ${role} commonly found in skincare sold in Thailand. ${mech}`
    );
  }

  // Paragraph 2 — evidence + concentration + concern fit, in one connected
  // paragraph rather than three separate stat chips repeating the same facts.
  const evidence = isTh ? ing.evidence_note_th : ing.evidence_note;
  const bits: string[] = [];
  if (evidence) {
    bits.push(isTh ? `หลักฐานทางวิทยาศาสตร์ในปัจจุบัน: ${evidence}` : `Current evidence: ${evidence}`);
  }
  if (ing.typical_pct && ing.typical_pct !== "n/a") {
    bits.push(
      isTh
        ? `ความเข้มข้นที่พบทั่วไปในผลิตภัณฑ์คือ ${ing.typical_pct}`
        : `Typical concentration in finished products is ${ing.typical_pct}`
    );
  }
  if (concernNames.length > 0) {
    bits.push(
      isTh
        ? `เหมาะกับปัญหาผิว: ${concernNames.join(", ")} — พบใน ${productCount} ผลิตภัณฑ์ในฐานข้อมูล BangkokFillers`
        : `Best suited for: ${concernNames.join(", ")} — found in ${productCount} products in the BangkokFillers database`
    );
  }
  if (bits.length > 0) paras.push(bits.join(isTh ? " " : " "));

  return paras;
}
