import Link from "next/link";
import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { concernLabel } from "@/lib/i18n";
import { baht } from "@/lib/format";
import { allProducts, productSlug } from "@/lib/data";
import { priceAsOf } from "@/lib/priceFreshness";
import { actives, unitPrice } from "@/lib/compare-evidence";

/**
 * Where a brand sits on price, for the brands that have nothing else to show.
 *
 * 64 of 394 brands carry neither a parsed ingredient list nor a Pantip quote,
 * so the three evidence sections above render nothing and their 128 URLs stay
 * as thin as they were. They are not cut, because /brand is the largest source
 * of impressions on this site and cutting a page class on a thinness judgment
 * is how this site lost 80% of its impressions in August 2026.
 *
 * What they do have is a price and a size: 97 of their 107 products. That is
 * enough to answer the question a reader actually arrives with — is this
 * expensive for what it is — against every other product aimed at the same
 * concern. The comparison is arithmetic over published prices, each carrying
 * the date it was collected, so a reader can check it.
 *
 * It renders only as a fallback. When a brand has ingredients or quotes, those
 * say more, and stacking a price table under them would pad the page rather
 * than inform it.
 */

const MIN_PEERS = 8;
const CHEAPER_SHOWN = 4;

export function BrandPricePosition({
  brand,
  products,
  locale,
}: {
  brand: string;
  products: Product[];
  locale: Locale;
}) {
  const isTh = locale === "th";

  // Only a fallback: anything with real ingredient or forum evidence is
  // better served by the sections that show it.
  const hasBetterEvidence =
    products.some((p) => actives(p).length > 0) ||
    products.some((p) => (p.pantip?.snippets ?? []).length > 0);
  if (hasBetterEvidence) return null;

  const mine = products
    .map((p) => ({ p, u: unitPrice(p) }))
    .filter((r): r is { p: Product; u: NonNullable<typeof r.u> } => r.u != null)
    .sort((a, b) => a.u.perUnit - b.u.perUnit);
  if (mine.length === 0) return null;

  // The concern this brand is actually sold against.
  const concern =
    products.flatMap((p) => p.concern_seeds ?? [])[0] ??
    Object.entries(products[0].total_score ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!concern) return null;

  const unit = mine[0].u.unit;
  const own = new Set(products.map((p) => p.product_id));
  const peers = allProducts()
    .filter((q) => !own.has(q.product_id) && (q.concern_seeds ?? []).includes(concern))
    .map((q) => ({ q, u: unitPrice(q) }))
    .filter((r): r is { q: Product; u: NonNullable<typeof r.u> } => r.u != null && r.u.unit === unit)
    .sort((a, b) => a.u.perUnit - b.u.perUnit);

  if (peers.length < MIN_PEERS) return null;

  const median = peers[Math.floor(peers.length / 2)].u.perUnit;
  const ours = mine[0].u.perUnit;
  const ratio = ours / median;
  const cheaper = peers.filter((r) => r.u.perUnit < ours).slice(0, CHEAPER_SHOWN);
  const fmt = (n: number) => (n >= 10 ? n.toFixed(0) : n.toFixed(2));
  const asOf = priceAsOf(mine[0].p);

  const verdict = isTh
    ? ratio >= 1.25
      ? `แพงกว่าค่ากลางของกลุ่มนี้ ${ratio.toFixed(1)} เท่า`
      : ratio <= 0.8
        ? `ถูกกว่าค่ากลางของกลุ่มนี้`
        : `อยู่ราว ๆ ค่ากลางของกลุ่มนี้`
    : ratio >= 1.25
      ? `${ratio.toFixed(1)}× the median for this group`
      : ratio <= 0.8
        ? `below the median for this group`
        : `about the median for this group`;

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
          {isTh ? `${brand} แพงไหมเมื่อเทียบกับตัวอื่น` : `Is ${brand} expensive for what it is?`}
        </h2>
        <p className="text-sm text-[#8a7a76]">
          {isTh
            ? `เทียบราคาต่อหน่วยกับผลิตภัณฑ์อีก ${peers.length} ชิ้นที่ขายสำหรับ${concernLabel(locale, concern)}`
            : `Price per unit against the other ${peers.length} products sold for ${concernLabel(locale, concern)}.`}
        </p>
      </div>

      <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-1.5">
        <p className="text-sm text-[#2b2222]">
          <span className="font-semibold">{brand}</span>
          {" — "}
          <span className="font-bold tabular-nums">
            ฿{fmt(ours)}/{unit}
          </span>
          <span className="text-[#8a7a76]">
            {isTh ? " · ค่ากลาง " : " · median "}
            <span className="tabular-nums">
              ฿{fmt(median)}/{unit}
            </span>
          </span>
        </p>
        <p className="text-sm font-semibold text-[#2b2222]">{verdict}</p>
      </div>

      {cheaper.length > 0 && (
        <>
          <p className="text-sm text-[#8a7a76]">
            {isTh ? "ที่ถูกกว่าในกลุ่มเดียวกัน" : "Cheaper per unit, same purpose"}
          </p>
          <ul className="rounded-2xl border border-[#efe1db] bg-white overflow-hidden">
            {cheaper.map(({ q, u }) => (
              <li key={q.product_id}>
                <Link
                  href={`/${locale}/product/${productSlug(q)}`}
                  className="flex items-baseline gap-3 px-5 py-3 border-b last:border-b-0 border-[#f5ecec] hover:bg-rose-50/40 transition-colors"
                >
                  <span className="text-xs font-bold text-rose-500 w-24 shrink-0 truncate">
                    {q.brand}
                  </span>
                  <span className="text-sm text-[#2b2222] flex-1 truncate">{q.name}</span>
                  <span className="text-xs text-neutral-400 tabular-nums shrink-0">
                    {baht(q.price_thb)}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-[#2b2222] shrink-0 w-20 text-right">
                    ฿{fmt(u.perUnit)}/{u.unit}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {asOf && (
        <p className="text-xs text-neutral-400">
          {isTh ? `ราคา ณ ${asOf} อาจเปลี่ยนแปลงแล้ว` : `Prices as of ${asOf}; they may have changed.`}
        </p>
      )}
    </section>
  );
}
