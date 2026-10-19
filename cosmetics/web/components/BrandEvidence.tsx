import Link from "next/link";
import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { baht } from "@/lib/format";
import { productSlug, productsWithIngredient, ingredientSlug, allBrands } from "@/lib/data";
import { priceAsOf } from "@/lib/priceFreshness";
import { actives, unitPrice, pantipUrl, looksLikeOpinion } from "@/lib/compare-evidence";

/**
 * The sections that give a brand page something to say.
 *
 * /brand is the largest single source of impressions on this site — 577 of
 * 2,436 in the 2026-10-15 Search Console export, ahead of /product's 447 —
 * and 143 of the 394 brands carry exactly one product. Those pages were an
 * H1, a line reading "1 products · avg score 55/100", and one card: a worse
 * copy of the product page, on the URLs that earn the most.
 *
 * So this is not a thin-page cull. The demand is already there and the
 * supply is what is missing. Each section answers a question someone typing a
 * brand name actually has, out of data we hold and competitors do not: what
 * this brand puts in its products, what else contains the same thing, and
 * what Thai buyers said about it.
 */

const MAX_ALTERNATIVES = 6;

/* ── what this brand formulates with ────────────────────────────────────── */

export function BrandActives({
  brand,
  products,
  locale,
}: {
  brand: string;
  products: Product[];
  locale: Locale;
}) {
  const isTh = locale === "th";
  const counts = new Map<string, number>();
  for (const p of products) {
    for (const a of actives(p)) {
      counts.set(a.inci, (counts.get(a.inci) ?? 0) + 1);
    }
  }
  if (counts.size === 0) return null;

  const ranked = [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8);
  const single = products.length === 1;

  return (
    <section className="space-y-3">
      <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
        {isTh ? `${brand} ใช้สารออกฤทธิ์อะไร` : `What ${brand} formulates with`}
      </h2>
      <p className="text-sm text-[#8a7a76]">
        {single
          ? isTh
            ? "สารออกฤทธิ์ตามฉลากของผลิตภัณฑ์นี้"
            : "The actives listed on this product's label."
          : isTh
            ? `สารออกฤทธิ์ที่พบในผลิตภัณฑ์ ${products.length} ชิ้นของแบรนด์นี้`
            : `Actives found across this brand's ${products.length} products.`}
      </p>
      <div className="flex flex-wrap gap-2">
        {ranked.map(([inci, n]) => (
          <Link
            key={inci}
            href={`/${locale}/ingredient/${ingredientSlug(inci)}`}
            className="rounded-full border border-[#efe1db] bg-white px-3 py-1.5 text-xs font-semibold text-[#2b2222] hover:border-rose-300 hover:bg-rose-50 transition-colors"
          >
            {inci}
            {!single && n > 1 && <span className="ml-1.5 text-neutral-400">×{n}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── the same active, from somebody else ────────────────────────────────── */

/**
 * Products from other brands that share this brand's most-used active,
 * cheapest per unit first.
 *
 * For a one-product brand this is the whole reason to keep the page: a reader
 * who searched the brand name and found one item can see what else does the
 * same job, and at what price per millilitre, instead of hitting a dead end.
 */
export function SameActiveElsewhere({
  brand,
  products,
  locale,
}: {
  brand: string;
  products: Product[];
  locale: Locale;
}) {
  const isTh = locale === "th";

  const counts = new Map<string, number>();
  for (const p of products) {
    for (const a of actives(p)) counts.set(a.inci, (counts.get(a.inci) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  const own = new Set(products.map((p) => p.product_id));

  // Pick the brand's most *distinctive* active, not its most common one.
  // Niacinamide is in 561 of 1,836 products, so "everything else with
  // Niacinamide" is a list of the catalogue and tells nobody anything. The
  // rarest active that still has a few alternatives is the one that explains
  // why someone would buy this brand rather than another.
  const candidates = [...counts.keys()]
    .map((inci) => ({
      inci,
      others: productsWithIngredient(inci).filter(
        (q) => !own.has(q.product_id) && q.brand !== brand && unitPrice(q) != null
      ),
    }))
    .filter((c) => c.others.length >= 2)
    .sort((x, y) => x.others.length - y.others.length);

  if (candidates.length === 0) return null;
  const { inci: headline } = candidates[0];

  const others = candidates[0].others
    .map((p) => ({ p, u: unitPrice(p) }))
    .filter((r): r is { p: Product; u: NonNullable<ReturnType<typeof unitPrice>> } => r.u != null)
    .sort((a, b) => a.u.perUnit - b.u.perUnit)
    .slice(0, MAX_ALTERNATIVES);

  if (others.length < 2) return null;

  const mine = products
    .map((p) => unitPrice(p))
    .filter((u): u is NonNullable<typeof u> => u != null)
    .sort((a, b) => a.perUnit - b.perUnit)[0];

  const fmt = (n: number) => (n >= 10 ? n.toFixed(0) : n.toFixed(2));
  const asOf = priceAsOf(others[0].p);

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
          {isTh
            ? `ตัวอื่นที่มี ${headline} เหมือนกัน`
            : `Everything else with ${headline}`}
        </h2>
        <p className="text-sm text-[#8a7a76]">
          {isTh
            ? `${brand} ใช้ ${headline} — นี่คือตัวอื่นที่ใช้เหมือนกัน เรียงตามราคาต่อหน่วย`
            : `${brand} uses ${headline}. These other products do too, cheapest per unit first.`}
        </p>
      </div>
      <ul className="rounded-2xl border border-[#efe1db] bg-white overflow-hidden">
        {others.map(({ p, u }) => (
          <li key={p.product_id}>
            <Link
              href={`/${locale}/product/${productSlug(p)}`}
              className="flex items-baseline gap-3 px-5 py-3.5 border-b last:border-b-0 border-[#f5ecec] hover:bg-rose-50/40 transition-colors"
            >
              <span className="text-xs font-bold text-rose-500 w-24 shrink-0 truncate">
                {p.brand}
              </span>
              <span className="text-sm text-[#2b2222] flex-1 truncate">{p.name}</span>
              <span className="text-xs text-neutral-400 tabular-nums shrink-0">
                {baht(p.price_thb)}
              </span>
              <span className="text-sm font-bold tabular-nums text-[#2b2222] shrink-0 w-20 text-right">
                ฿{fmt(u.perUnit)}/{u.unit}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {mine && (
        <p className="text-sm text-[#8a7a76] leading-snug">
          {isTh ? (
            <>
              {brand} อยู่ที่ ฿{fmt(mine.perUnit)}/{mine.unit}
            </>
          ) : (
            <>
              {brand} itself works out at ฿{fmt(mine.perUnit)}/{mine.unit}.
            </>
          )}
        </p>
      )}
      {asOf && (
        <p className="text-xs text-neutral-400">
          {isTh ? `ราคา ณ ${asOf} อาจเปลี่ยนแปลงแล้ว` : `Prices as of ${asOf}; they may have changed.`}
        </p>
      )}
    </section>
  );
}

/* ── what Thai buyers said about this brand ─────────────────────────────── */

export function BrandPantip({
  brand,
  products,
  locale,
}: {
  brand: string;
  products: Product[];
  locale: Locale;
}) {
  const isTh = locale === "th";
  const seen = new Set<string>();
  const quotes: { text: string; topicId: string }[] = [];
  let threads = 0;
  // Same gate the compare page uses: a snippet that merely names brands is a
  // shopping list, and printing it under "what Thai buyers say" would not be
  // true of the text.
  const brands = allBrands();

  for (const p of products) {
    threads += p.pantip?.thread_count ?? 0;
    for (const s of p.pantip?.snippets ?? []) {
      const text = (s?.text ?? "").trim();
      if (!text || !s?.topic_id || seen.has(s.topic_id)) continue;
      if (!looksLikeOpinion(text, brands)) continue;
      seen.add(s.topic_id);
      quotes.push({ text, topicId: s.topic_id });
      if (quotes.length >= 3) break;
    }
    if (quotes.length >= 3) break;
  }
  if (quotes.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
          {isTh ? `คนไทยพูดถึง ${brand} ว่าอย่างไร` : `What Thai buyers say about ${brand}`}
        </h2>
        <p className="text-sm text-[#8a7a76]">
          {isTh
            ? `ยกมาจากกระทู้ Pantip${threads > 0 ? ` ${threads} กระทู้` : ""} กดเพื่ออ่านต้นฉบับ`
            : `Quoted from Pantip${threads > 0 ? `, across ${threads} threads` : ""}. Tap to read the original.`}
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
            <p className="text-sm text-neutral-700 leading-relaxed">&ldquo;{q.text}&rdquo;</p>
            <footer className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
              <span className="text-[#b08050]">Pantip</span>
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
