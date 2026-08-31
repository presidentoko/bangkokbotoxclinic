import registry from "@/data/fda_registry.json";
import type { Locale } from "./i18n";

/**
 * Thai FDA cosmetic notification lookup.
 *
 * Thailand requires every cosmetic sold to carry a notification number
 * (เลขที่ใบรับจดแจ้ง), and counterfeits are common enough that "<product> ปลอม"
 * and "อย. เลขที่" are everyday search phrases. No marketplace listing answers
 * them. This is the one check on the site that a Konvy or Shopee page
 * structurally cannot reproduce.
 *
 * Data is joined offline by scripts/build_fda_registry.py against the Thai
 * FDA's own public web service and committed as data/fda_registry.json — there
 * is no request to the FDA at build or request time.
 *
 * IMPORTANT: a product missing from the registry means our name matcher could
 * not confidently resolve it, NOT that the product is unregistered. Callers
 * must render nothing in that case. Never phrase absence as a warning.
 */
export interface FdaRecord {
  /** เลขที่ใบรับจดแจ้ง, e.g. "10-2-6600022165" */
  lcnno: string;
  notified_name_en: string;
  notified_name_th: string;
  /** Licence holder company as recorded by the FDA. */
  holder: string;
  /** Raw Thai status string: "คงอยู่" | "สิ้นอายุ" | "ยกเลิก <date>" */
  status: string;
  /** True only for "คงอยู่" — the notification is still in force. */
  active: boolean;
  /** "ผลิต" (manufactured in Thailand) or "นำเข้า" (imported). */
  type_allow: string;
  /** Link to the FDA's own detail page for this notification. */
  url: string;
  /** How many notifications share this exact notified name (renewals, etc). */
  registrations: number;
}

const REGISTRY = registry as unknown as Record<string, FdaRecord>;

export function fdaRecord(productId: string): FdaRecord | undefined {
  return REGISTRY[productId];
}

export function fdaCoverage(): number {
  return Object.keys(REGISTRY).length;
}

/** "ผลิต" / "นำเข้า" rendered for the reader. */
export function originLabel(typeAllow: string, locale: Locale): string {
  if (locale === "th") return typeAllow;
  if (typeAllow === "ผลิต") return "manufactured in Thailand";
  if (typeAllow === "นำเข้า") return "imported";
  return typeAllow;
}

/**
 * One-line summary used in the FAQ answer and the JSON-LD that mirrors it.
 * The "check the box" caveat is not decoration: the join is on product name,
 * so the authoritative number is the one printed on the physical package.
 */
export function fdaFaqAnswer(
  r: FdaRecord,
  productName: string,
  locale: Locale
): string {
  if (locale === "th") {
    const head = r.active
      ? `เราจับคู่ ${productName} กับใบรับจดแจ้งเครื่องสำอางเลขที่ ${r.lcnno} สถานะ "คงอยู่"`
      : `ใบรับจดแจ้งที่ตรงกับชื่อ ${productName} คือเลขที่ ${r.lcnno} ซึ่งมีสถานะ "${r.status}"`;
    const who = r.holder ? ` ผู้จดแจ้งคือ ${r.holder}` : "";
    const tail = r.active
      ? " ตรวจสอบรายละเอียดได้จากเว็บไซต์ของ อย. โดยตรง และควรเทียบกับเลขที่พิมพ์บนกล่องสินค้าจริงอีกครั้งก่อนซื้อ"
      : " อาจมีการจดแจ้งใหม่ภายใต้เลขอื่น แนะนำให้นำเลขที่พิมพ์บนกล่องไปตรวจสอบกับเว็บไซต์ อย. ก่อนซื้อ";
    return head + who + tail;
  }
  const head = r.active
    ? `${productName} matches Thai FDA cosmetic notification ${r.lcnno}, status "in force"`
    : `The notification matching ${r.lcnno} for ${productName} shows status "${r.status}"`;
  const who = r.holder ? `, held by ${r.holder}` : "";
  const tail = r.active
    ? ". Verify on the FDA's own site, and check it against the number printed on the package."
    : ". It may have been re-notified under a different number — check the number on the package against the FDA site.";
  return head + who + tail;
}
