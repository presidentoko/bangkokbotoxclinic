import type { Product } from "./types";
import type { Locale } from "./i18n";
import { concernLabel } from "./i18n";
import { productTypeThai, productTypeEnglish, thaiAlias } from "./thai-names";
import { fdaFaqAnswer, type FdaRecord } from "./fda";

/**
 * The "should I actually buy this?" layer.
 *
 * The product page already showed a score, a review module and an ingredient
 * decoder, but nothing on it answered the question a shopper arrives with
 * after seeing a product in an influencer clip: is this worth it, for me?
 * The Thai phrasing of that question — "<product> ดีไหม" — did not appear
 * anywhere in the codebase, so the pages could not match the single highest
 * intent query shape in Thai beauty search.
 *
 * Everything below is composed deterministically from fields already vetted in
 * master_db (score, ingredient_analysis, safety flags, price, volume, Pantip
 * counts). No new factual claims are introduced — same rule as
 * ingredient-narrative.ts. The rendered copy and the FAQ JSON-LD are built
 * from one source so the structured data can never drift from what is on the
 * page.
 */

export interface KeyActive {
  inci: string;
  th_name: string;
  en_name: string;
  mechanism_th: string;
  mechanism_en: string;
}

export interface PricePos {
  perMl: number;
  medianPerMl: number;
  cheaperThanPct: number;
  peerCount: number;
}

export interface VerdictInput {
  p: Product;
  locale: Locale;
  concern: string;
  totalScore: number;
  ingredientScore: number;
  actives: KeyActive[];
  flagLabels: string[];
  pricePos: PricePos | null;
}

export interface ProductVerdict {
  buyIf: string;
  skipIf: string | null;
  priceNote: string | null;
}

const baht = (n: number) => `฿${Math.round(n).toLocaleString()}`;
const perMlStr = (n: number) => (n >= 10 ? Math.round(n).toString() : n.toFixed(1));

/**
 * 24 of 1,003 product names carry a trailing space or a doubled internal space
 * from the Konvy listing. HTML collapses those on render but JSON-LD does not,
 * so the schema string and the visible string stopped matching character for
 * character — exactly what a structured-data check compares.
 */
export const cleanName = (s: string) => s.replace(/\s+/g, " ").trim();

export function productVerdict({
  p,
  locale,
  concern,
  totalScore,
  ingredientScore,
  actives,
  flagLabels,
  pricePos,
}: VerdictInput): ProductVerdict {
  const isTh = locale === "th";
  const cl = concernLabel(locale, concern);
  const activeNames = actives
    .slice(0, 3)
    .map((a) => (isTh ? a.th_name : a.en_name))
    .filter(Boolean);

  // ── Buy if ──────────────────────────────────────────────────────────────
  let buyIf: string;
  if (activeNames.length > 0) {
    buyIf = isTh
      ? `คุณกำลังมองหาตัวช่วยเรื่อง${cl} — สูตรนี้มี${activeNames.join(", ")} ซึ่งเป็นสารออกฤทธิ์ที่มีหลักฐานรองรับสำหรับปัญหานี้ และได้คะแนนส่วนผสม ${ingredientScore}/100`
      : `You are shopping for ${cl.toLowerCase()} — this formula contains ${activeNames.join(", ")}, actives with published evidence for that concern, and scores ${ingredientScore}/100 on ingredients`;
  } else {
    buyIf = isTh
      ? `คุณต้องการผลิตภัณฑ์ดูแลผิวพื้นฐานมากกว่าตัวยาออกฤทธิ์แรง — สูตรนี้ได้คะแนนรวม ${totalScore}/100 โดยไม่ได้พึ่งสารออกฤทธิ์เข้มข้น`
      : `You want a basic supporting product rather than a strong active — it scores ${totalScore}/100 without relying on high-strength actives`;
  }

  // ── Skip if ─────────────────────────────────────────────────────────────
  // Flags first (a real formulation caveat), then price (a real trade-off).
  // When neither applies there is nothing honest to warn about, so this stays
  // null rather than inventing a downside to fill the slot.
  let skipIf: string | null = null;
  if (flagLabels.length > 0) {
    skipIf = isTh
      ? `ผิวคุณบอบบางหรือแพ้ง่าย — เราตรวจพบ${flagLabels.join(", ")}ในรายการส่วนผสม`
      : `Your skin is sensitive or reactive — we flagged ${flagLabels.join(", ")} in the ingredient list`;
  } else if (pricePos && pricePos.cheaperThanPct <= 25) {
    const typeName = isTh
      ? productTypeThai(p.name) ?? "ผลิตภัณฑ์"
      : productTypeEnglish(p.name) ?? "products";
    skipIf = isTh
      ? `คุณมีงบจำกัด — ราคาต่อมิลลิลิตรของตัวนี้แพงกว่า ${100 - pricePos.cheaperThanPct}% ของ${typeName}ในฐานข้อมูล`
      : `You are on a budget — its price per ml is higher than ${100 - pricePos.cheaperThanPct}% of ${typeName} in the database`;
  }

  // ── Price note ──────────────────────────────────────────────────────────
  let priceNote: string | null = null;
  if (pricePos && p.price_thb) {
    const typeName = isTh
      ? productTypeThai(p.name) ?? "ผลิตภัณฑ์"
      : productTypeEnglish(p.name) ?? "products";
    priceNote = isTh
      ? `${baht(p.price_thb)} คิดเป็น ฿${perMlStr(pricePos.perMl)}/ml — ถูกกว่า ${pricePos.cheaperThanPct}% ของ${typeName} ${pricePos.peerCount} รายการที่เราเก็บข้อมูล (ค่ากลาง ฿${perMlStr(pricePos.medianPerMl)}/ml)`
      : `${baht(p.price_thb)} works out to ฿${perMlStr(pricePos.perMl)}/ml — cheaper than ${pricePos.cheaperThanPct}% of the ${pricePos.peerCount} ${typeName} we track (median ฿${perMlStr(pricePos.medianPerMl)}/ml)`;
  } else if (p.price_thb) {
    priceNote = isTh
      ? `ราคา ${baht(p.price_thb)}${p.volume ? ` (${p.volume})` : ""}`
      : `Priced at ${baht(p.price_thb)}${p.volume ? ` (${p.volume})` : ""}`;
  }

  return { buyIf, skipIf, priceNote };
}

/**
 * FAQ pairs rendered visibly on the page AND emitted as FAQPage JSON-LD.
 * Question wording deliberately mirrors real Thai search phrasing
 * ("ดีไหม", "ราคาเท่าไหร่", "ปลอม") including the Thai spelling of the brand,
 * so the page can match both the Latin and Thai forms of the same query.
 */
export function productFaqs(
  input: VerdictInput,
  verdict: ProductVerdict,
  concernNames: string[],
  fda?: FdaRecord
): { q: string; a: string }[] {
  const { p, locale, totalScore, actives, flagLabels } = input;
  const isTh = locale === "th";
  const name = cleanName(p.name);
  // The Thai spelling belongs in the first question — the one that carries the
  // "ดีไหม" intent — where it does the matching work. Repeating it in all six
  // makes every heading read like a database dump.
  const alias = isTh ? thaiAlias(p) : undefined;
  const label = alias ? `${name} (${alias})` : name;
  const out: { q: string; a: string }[] = [];

  // 1 — the query the whole page exists to answer
  out.push({
    q: isTh ? `${label} ดีไหม?` : `Is ${name} any good?`,
    a: [
      isTh
        ? `${name} ได้คะแนนรวม ${totalScore}/100 จากการให้คะแนนของ BangkokFillers`
        : `${name} scores ${totalScore}/100 in the BangkokFillers rating`,
      isTh ? `ควรซื้อถ้า${verdict.buyIf}` : `Buy it if ${verdict.buyIf}`,
      verdict.skipIf
        ? isTh
          ? `ข้ามไปถ้า${verdict.skipIf}`
          : `Skip it if ${verdict.skipIf}`
        : "",
    ]
      .filter(Boolean)
      .join(" "),
  });

  // 2 — ingredients
  if (actives.length > 0) {
    out.push({
      q: isTh ? `${name} มีส่วนผสมสำคัญอะไรบ้าง?` : `What are the key ingredients in ${name}?`,
      a: actives
        .slice(0, 3)
        .map((a) =>
          isTh
            ? `${a.th_name} (${a.inci}) — ${a.mechanism_th}`
            : `${a.en_name} (${a.inci}) — ${a.mechanism_en}`
        )
        .join(" "),
    });
  }

  // 3 — price / value
  if (verdict.priceNote) {
    out.push({
      q: isTh ? `${name} ราคาเท่าไหร่ คุ้มไหม?` : `How much is ${name} and is it good value?`,
      a: verdict.priceNote,
    });
  }

  // 4 — fit
  if (concernNames.length > 0) {
    out.push({
      q: isTh ? `${name} เหมาะกับปัญหาผิวแบบไหน?` : `What skin concerns is ${name} for?`,
      a: isTh
        ? `เหมาะกับ ${concernNames.join(", ")} ตามผลวิเคราะห์ส่วนผสมของสูตรนี้`
        : `Best suited to ${concernNames.join(", ")}, based on this formula's ingredient analysis.`,
    });
  }

  // 5 — caution. Answered either way: "no flags found" is itself the check a
  // shopper came for, and an absent question reads as an unanswered one.
  out.push({
    q: isTh ? `${name} มีข้อควรระวังอะไรไหม?` : `Any cautions with ${name}?`,
    a:
      flagLabels.length > 0
        ? isTh
          ? `เราตรวจพบ${flagLabels.join(", ")}จากการอ่านรายการส่วนผสม ผู้ที่ผิวแพ้ง่ายควรทดสอบที่ท้องแขนก่อนใช้`
          : `We flagged ${flagLabels.join(", ")} from the ingredient list. Patch-test first if your skin is reactive.`
        : isTh
          ? `จากการอ่านรายการส่วนผสม เราไม่พบธงเตือนเรื่องการอุดตันรูขุมขน น้ำหอม แอลกอฮอล์ หรือสารระคายเคืองที่เราตรวจสอบ`
          : `Reading the ingredient list, we found none of the comedogenic, fragrance, alcohol or irritant flags we check for.`,
  });

  // 6 — Thai FDA notification. This is the "<product> ปลอม" / "อย. เลขที่"
  // query, which no marketplace listing can answer. Only emitted when a
  // notification was actually resolved — silence, never a warning, otherwise.
  if (fda) {
    out.push({
      q: isTh
        ? `${name} มี อย. ไหม เลขที่จดแจ้งอะไร?`
        : `Is ${name} registered with the Thai FDA?`,
      a: fdaFaqAnswer(fda, name, locale),
    });
  }

  // 7 — Pantip. Answers the "<product> pantip" query shape directly.
  const mentions = p.pantip?.mention_count ?? 0;
  const threads = p.pantip?.thread_count ?? 0;
  if (mentions > 0) {
    out.push({
      q: isTh
        ? `คนไทยใน Pantip พูดถึง ${name} ว่าอย่างไร?`
        : `What do Thai users on Pantip say about ${name}?`,
      a: isTh
        ? `เราพบการพูดถึง ${mentions} ครั้งใน ${threads} กระทู้บน Pantip และคัดข้อความจริงมาแสดงไว้ในหน้านี้พร้อมลิงก์ไปยังกระทู้ต้นทาง`
        : `We found ${mentions} mentions across ${threads} Pantip threads; real excerpts are quoted on this page with links back to each thread.`,
    });
  }

  return out;
}
