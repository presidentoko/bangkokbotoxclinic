import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { concernLabel } from "@/lib/i18n";
import { baht } from "@/lib/format";
import { allBrands } from "@/lib/data";
import { priceAsOf } from "@/lib/priceFreshness";
import {
  sharedActives,
  uniqueActives,
  concernDrivers,
  comparableUnitPrice,
  crossBrandQuotes,
  pantipUrl,
  efficacy,
} from "@/lib/compare-evidence";

/**
 * The three sections that make a comparison checkable: what is in each bottle,
 * what each millilitre costs, and what Thai buyers said when they weighed the
 * same two products.
 *
 * The page these join used to carry a score table and nothing else — our own
 * number, with the ingredient that earned it left in the JSON. A reader could
 * not confirm a single claim on it. Each section below names something they
 * can check against the packaging, the receipt, or the thread we link to.
 */

const STRENGTH = ["", "weak", "moderate", "strong"] as const;

function strengthLabel(n: number, isTh: boolean): string {
  const i = Math.max(0, Math.min(3, Math.round(n)));
  if (i === 0) return "";
  if (isTh) return ["", "อ่อน", "ปานกลาง", "แรง"][i];
  return STRENGTH[i];
}

/* ── 1. what is actually in each one ────────────────────────────────────── */

export function IngredientEvidence({
  pA,
  pB,
  concern,
  locale,
}: {
  pA: Product;
  pB: Product;
  concern: string;
  locale: Locale;
}) {
  const isTh = locale === "th";
  const shared = sharedActives(pA, pB);
  const onlyA = uniqueActives(pA, pB, concern);
  const onlyB = uniqueActives(pB, pA, concern);

  if (!shared.length && !onlyA.length && !onlyB.length) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "ในขวดมีอะไรต่างกัน" : "What is actually different"}
        </h2>
        <p className="text-sm text-[#8a7a76]">
          {isTh
            ? "สารออกฤทธิ์ตามที่ระบุบนฉลาก — ตรวจสอบเองได้ที่ข้างกล่อง"
            : "Active ingredients as listed on the label — you can check these on the box."}
        </p>
      </div>

      {shared.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 space-y-1.5">
          <p className="text-xs uppercase tracking-widest font-bold text-emerald-700">
            {isTh ? "มีเหมือนกันทั้งคู่" : "Both contain"}
          </p>
          <p className="text-sm font-semibold text-[#2b2222]">{shared.join(" · ")}</p>
          <p className="text-sm text-emerald-800/80 leading-snug">
            {isTh
              ? "สารออกฤทธิ์หลักตรงกัน ส่วนที่เหลือคือราคาและเนื้อสัมผัส"
              : "They share the active doing the work. What is left to choose on is price and texture."}
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { p: pA, only: onlyA },
          { p: pB, only: onlyB },
        ].map(({ p, only }) => (
          <div
            key={p.product_id}
            className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-2"
          >
            <p className="text-xs font-bold text-rose-500">
              {isTh ? `มีเฉพาะใน ${p.brand}` : `Only in ${p.brand}`}
            </p>
            {only.length === 0 ? (
              <p className="text-sm text-neutral-400">
                {isTh ? "ไม่มีสารออกฤทธิ์ที่อีกตัวไม่มี" : "No active the other one lacks."}
              </p>
            ) : (
              <ul className="space-y-1.5">
                {only.slice(0, 5).map((i) => {
                  const e = efficacy(i, concern);
                  return (
                    <li key={i.inci} className="text-sm text-[#2b2222] leading-snug">
                      <span className="font-semibold">{i.inci}</span>
                      {e > 0 && (
                        <span className="text-xs text-[#8a7a76]">
                          {" — "}
                          {concernLabel(locale, concern)} {strengthLabel(e, isTh)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 2. what a millilitre costs ─────────────────────────────────────────── */

export function UnitPriceEvidence({
  pA,
  pB,
  locale,
}: {
  pA: Product;
  pB: Product;
  locale: Locale;
}) {
  const isTh = locale === "th";
  const up = comparableUnitPrice(pA, pB);
  if (!up) return null;

  const cheaper = up.a.perUnit <= up.b.perUnit ? pA : pB;
  const ratio =
    Math.max(up.a.perUnit, up.b.perUnit) / Math.min(up.a.perUnit, up.b.perUnit);
  const asOf = [priceAsOf(pA), priceAsOf(pB)].filter(Boolean).sort().pop();

  const fmt = (n: number) => (n >= 10 ? n.toFixed(0) : n.toFixed(2));

  return (
    <section className="space-y-3">
      <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
        {isTh ? "ราคาต่อหน่วย" : "What a unit costs"}
      </h2>
      <div className="rounded-2xl border border-[#efe1db] bg-white overflow-hidden">
        {[
          { p: pA, u: up.a },
          { p: pB, u: up.b },
        ].map(({ p, u }) => (
          <div
            key={p.product_id}
            className="flex items-baseline gap-3 px-5 py-3.5 border-b last:border-b-0 border-[#f5ecec]"
          >
            <span className="text-sm text-[#2b2222] flex-1 truncate">{p.brand}</span>
            <span className="text-xs text-neutral-400 tabular-nums">
              {baht(p.price_thb)} / {u.amount}
              {u.unit}
            </span>
            <span
              className={`text-sm font-bold tabular-nums ${
                p === cheaper ? "text-emerald-600" : "text-neutral-500"
              }`}
            >
              ฿{fmt(u.perUnit)}/{u.unit}
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm text-[#8a7a76] leading-snug">
        {ratio >= 1.15 ? (
          isTh ? (
            <>
              <span className="font-semibold text-[#2b2222]">{cheaper.brand}</span> ถูกกว่าต่อหน่วย{" "}
              {ratio.toFixed(1)} เท่า
            </>
          ) : (
            <>
              <span className="font-semibold text-[#2b2222]">{cheaper.brand}</span> costs{" "}
              {ratio.toFixed(1)}× less per {up.a.unit}
            </>
          )
        ) : isTh ? (
          "ราคาต่อหน่วยใกล้เคียงกัน"
        ) : (
          "Per-unit prices are within a few percent of each other."
        )}
      </p>
      {asOf && (
        <p className="text-xs text-neutral-400">
          {isTh ? `ราคา ณ ${asOf} อาจเปลี่ยนแปลงแล้ว` : `Prices as of ${asOf}; they may have changed.`}
        </p>
      )}
    </section>
  );
}

/* ── 3. Thai buyers who weighed the same two ────────────────────────────── */

export function CrossBrandQuotes({
  pA,
  pB,
  locale,
}: {
  pA: Product;
  pB: Product;
  locale: Locale;
}) {
  const isTh = locale === "th";
  // The brand list is what tells a shopping list apart from an opinion;
  // see looksLikeOpinion in lib/compare-evidence.ts.
  const quotes = crossBrandQuotes(pA, pB, 3, allBrands());
  if (quotes.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "กระทู้ Pantip ที่พูดถึงทั้งสองแบรนด์" : "Pantip threads that mention both brands"}
        </h2>
        <p className="text-sm text-[#8a7a76]">
          {isTh
            ? "ยกมาจากกระทู้จริง ไม่ใช่ข้อความที่เราเขียนเอง กดเพื่ออ่านต้นฉบับ"
            : "Quoted from the threads themselves, not written by us. Tap to read the original."}
        </p>
      </div>
      <div className="space-y-3">
        {quotes.map((q) => (
          <a
            key={q.topicId}
            href={pantipUrl(q.topicId)}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-[#f5e6d3] bg-[#fffaf5] px-5 py-4 shadow-sm hover:border-amber-300 hover:bg-amber-50 transition-colors group"
          >
            <p className="text-sm text-neutral-700 leading-relaxed">
              &ldquo;{q.text}&rdquo;
            </p>
            <footer className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
              <span className="text-[#b08050]">
                {isTh ? `กระทู้เกี่ยวกับ ${q.fromBrand}` : `A thread about ${q.fromBrand}`}
              </span>
              <span className="ml-auto text-amber-500 group-hover:text-amber-600 transition-colors">
                {isTh ? "อ่านต่อ →" : "Read thread →"}
              </span>
            </footer>
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * One sentence naming the ingredient behind a concern verdict, for the FAQ.
 * Returns null when there is no ingredient to name — better to say nothing
 * than to assert a reason we cannot show.
 */
export function driverSentence(
  winner: Product,
  loser: Product,
  concern: string,
  locale: Locale
): string | null {
  const drivers = concernDrivers(winner, concern);
  if (drivers.length === 0) return null;
  const names = drivers.slice(0, 2).map((d) => d.inci);
  const shared = sharedActives(winner, loser);
  const isTh = locale === "th";

  if (shared.length > 0) {
    return isTh
      ? `ทั้งคู่มี ${shared.join(" และ ")} เหมือนกัน ต่างกันที่ ${winner.brand} ยังมี ${names.join(" และ ")} ด้วย`
      : `Both contain ${shared.join(" and ")}; ${winner.brand} also has ${names.join(" and ")}.`;
  }
  return isTh
    ? `${winner.brand} ใช้ ${names.join(" และ ")} ซึ่งเป็นสารออกฤทธิ์สำหรับ${concernLabel(locale, concern)}`
    : `${winner.brand} uses ${names.join(" and ")}, actives that work on ${concernLabel(locale, concern)}.`;
}
