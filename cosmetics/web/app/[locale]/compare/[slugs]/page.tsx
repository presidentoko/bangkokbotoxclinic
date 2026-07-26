import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONCERNS, getRanking, getProduct, productSlug, productIdFromSlug } from "@/lib/data";
import { LOCALES, STATIC_LOCALES, type Locale, concernLabel, concernLabelShort } from "@/lib/i18n";
import { baht, scoreColor } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { faqLd, breadcrumbLd } from "@/lib/schema";
import type { Product } from "@/lib/types";

const BASE = "https://bangkokfillers.com";
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과 대응. slugs는 상품 조합 전체 공간이라
// 봇이 임의 "A-vs-B" 조합을 찍으면 온디맨드 렌더+캐시 write가 무한히 발생함.
// generateStaticParams가 콘선별 top5 조합을 전부 열거하므로 그 외는 즉시 404.
export const dynamicParams = false;

export function parseCompare(slugs: string): { pA: Product; pB: Product } | null {
  let searchFrom = 0;
  while (true) {
    const idx = slugs.indexOf("-vs-", searchFrom);
    if (idx === -1) return null;
    const idA = productIdFromSlug(slugs.slice(0, idx));
    const idB = productIdFromSlug(slugs.slice(idx + 4));
    const pA = getProduct(idA);
    const pB = getProduct(idB);
    if (pA && pB && idA !== idB) return { pA, pB };
    searchFrom = idx + 1;
  }
}

export function generateStaticParams() {
  const result: { locale: string; slugs: string }[] = [];
  const seen = new Set<string>();

  for (const concern of CONCERNS) {
    const top = getRanking(concern).slice(0, 5);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const pA = getProduct(top[i].product_id);
        const pB = getProduct(top[j].product_id);
        if (!pA || !pB) continue;
        const key = [top[i].product_id, top[j].product_id].sort().join("~");
        if (seen.has(key)) continue;
        seen.add(key);
        const slugs = `${productSlug(pA)}-vs-${productSlug(pB)}`;
        for (const locale of STATIC_LOCALES) {
          result.push({ locale, slugs });
        }
      }
    }
  }
  return result;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slugs: string }>;
}): Promise<Metadata> {
  const { locale, slugs } = await params;
  const loc = locale as Locale;
  const parsed = parseCompare(slugs);
  if (!parsed) return {};
  const { pA, pB } = parsed;
  const isTh = loc === "th";

  const title = isTh
    ? `${pA.brand} vs ${pB.brand} — ${pA.name} vs ${pB.name} เปรียบเทียบ`
    : `${pA.brand} vs ${pB.brand} — ${pA.name} vs ${pB.name} Thailand`;
  const description = isTh
    ? `เปรียบเทียบ ${pA.brand} ${pA.name} กับ ${pB.brand} ${pB.name} — คะแนนส่วนผสม รีวิวจริง ราคา อันไหนดีกว่ากัน?`
    : `Data comparison: ${pA.brand} ${pA.name} vs ${pB.brand} ${pB.name} — ingredient scores, verified reviews, prices. Which is better for acne, brightening, anti-aging?`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/compare/${slugs}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/compare/${slugs}`])),
    },
    openGraph: {
      title, description, url: `${BASE}/${loc}/compare/${slugs}`,
      images: pA.image_url ? [{ url: pA.image_url, alt: `${pA.name} vs ${pB.name}` }] : [],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string; slugs: string }>;
}) {
  const { locale: localeRaw, slugs } = await params;
  const locale = localeRaw as Locale;
  const isTh = locale === "th";

  const parsed = parseCompare(slugs);
  if (!parsed) notFound();

  const { pA, pB } = parsed;

  const verdicts = CONCERNS.map((c) => {
    const sA = pA.total_score[c] ?? 0;
    const sB = pB.total_score[c] ?? 0;
    const diff = sA - sB;
    return {
      concern: c,
      scoreA: sA,
      scoreB: sB,
      winner: diff > 2 ? ("A" as const) : diff < -2 ? ("B" as const) : ("tie" as const),
    };
  });

  const scored = verdicts.filter((v) => v.scoreA > 0 || v.scoreB > 0);
  const winsA = verdicts.filter((v) => v.winner === "A").length;
  const winsB = verdicts.filter((v) => v.winner === "B").length;

  // Suggested comparisons: pA vs other top products in its best concern
  const topConcernA = CONCERNS.reduce(
    (best, c) => ((pA.total_score[c] ?? 0) > (pA.total_score[best] ?? 0) ? c : best),
    CONCERNS[0],
  );
  const suggestions = getRanking(topConcernA)
    .slice(0, 10)
    .map((e) => getProduct(e.product_id))
    .filter((p): p is Product => p != null)
    .filter((p) => p.product_id !== pA.product_id && p.product_id !== pB.product_id)
    .slice(0, 3);

  const faqQas = scored.map(({ concern, scoreA, scoreB, winner }) => {
    const winnerP = winner === "A" ? pA : winner === "B" ? pB : null;
    return {
      q: `Which is better for ${concern}: ${pA.brand} ${pA.name} or ${pB.brand} ${pB.name}?`,
      a:
        winner === "tie"
          ? `Both products score similarly for ${concern}: ${pA.brand} scores ${Math.round(scoreA)}/100 and ${pB.brand} scores ${Math.round(scoreB)}/100.`
          : `${winnerP!.brand} ${winnerP!.name} scores ${Math.round(winner === "A" ? scoreA : scoreB)}/100 vs ${Math.round(winner === "A" ? scoreB : scoreA)}/100 for ${concern} based on ingredient science and verified reviews.`,
    };
  });

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#8a7a76]">
        <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">
          {isTh ? "หน้าหลัก" : "Home"}
        </Link>
        {" / "}
        <span>
          {pA.brand} vs {pB.brand}
        </span>
      </nav>

      {/* Hero */}
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
          {isTh ? "เปรียบเทียบผลิตภัณฑ์" : "Product comparison"}
        </p>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#2b2222] leading-tight">
          {pA.brand}{" "}
          <span className="text-[#c9a86a]">vs</span>{" "}
          {pB.brand}
        </h1>
        <p className="text-base text-[#8a7a76]">
          {pA.name} <span className="font-bold text-[#c9a86a] mx-1">·</span> {pB.name}
        </p>
        <p className="text-sm text-neutral-400">
          {isTh
            ? "คำนวณจากคะแนนส่วนผสม + รีวิวจาก Konvy, Watsons, Boots"
            : "Scored from ingredient science + verified reviews from Konvy, Watsons, Boots"}
        </p>
      </section>

      {/* Product cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        {[pA, pB].map((p, idx) => (
          <Link
            key={p.product_id}
            href={`/${locale}/product/${productSlug(p)}`}
            className="rounded-2xl border border-[#efe1db] bg-white p-4 sm:p-5 space-y-2 hover:shadow-md hover:shadow-rose-100 hover:-translate-y-0.5 transition-all"
          >
            <span className="inline-block rounded-full bg-[#c9a86a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
              {idx === 0 ? "A" : "B"}
            </span>
            <p className="text-xs font-bold text-rose-500">{p.brand}</p>
            <p className="text-sm font-semibold text-[#2b2222] leading-snug">{p.name}</p>
            <p className="font-serif-display text-xl font-black text-[#2b2222]">{baht(p.price_thb)}</p>
            <p className="text-xs text-neutral-400">
              {idx === 0
                ? isTh ? `${winsA} หมวด ชนะ` : `${winsA} wins`
                : isTh ? `${winsB} หมวด ชนะ` : `${winsB} wins`}
            </p>
          </Link>
        ))}
      </section>

      {/* Overall verdict */}
      {winsA !== winsB && (
        <section
          className="rounded-2xl p-5 sm:p-6 text-center space-y-1.5"
          style={{
            background: "linear-gradient(135deg, #fff0f3 0%, #fce4ec 50%, #fff8f0 100%)",
            border: "1.5px solid #f0d9d5",
          }}
        >
          <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
            {isTh ? "ผลโดยรวม" : "Overall winner"}
          </p>
          <p className="font-serif-display text-2xl font-semibold text-[#2b2222]">
            {winsA > winsB ? pA.brand : pB.brand}{" "}
            {isTh ? "ชนะในหลายหมวด" : "wins more categories"}
          </p>
          <p className="text-sm text-[#8a7a76]">
            {pA.brand}: {winsA} {isTh ? "ชนะ" : "wins"}
            {" · "}
            {pB.brand}: {winsB} {isTh ? "ชนะ" : "wins"}
            {" · "}
            {verdicts.filter((v) => v.winner === "tie" && (v.scoreA > 0 || v.scoreB > 0)).length}{" "}
            {isTh ? "เสมอ" : "tied"}
          </p>
        </section>
      )}

      {/* Score comparison table */}
      <section className="space-y-3">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "คะแนนเปรียบเทียบ" : "Score comparison"}
        </h2>
        <div className="rounded-2xl border border-[#efe1db] overflow-hidden bg-white">
          <div className="grid grid-cols-[1fr_64px_64px] sm:grid-cols-[1fr_80px_80px] border-b border-[#efe1db] bg-[#faf5f4] px-4 py-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c9a86a]">
              {isTh ? "ปัญหาผิว" : "Concern"}
            </span>
            <span className="text-xs font-bold text-center text-[#c9a86a] truncate">{pA.brand}</span>
            <span className="text-xs font-bold text-center text-[#c9a86a] truncate">{pB.brand}</span>
          </div>
          {verdicts.map(({ concern, scoreA, scoreB, winner }) => (
            <div
              key={concern}
              className="grid grid-cols-[1fr_64px_64px] sm:grid-cols-[1fr_80px_80px] items-center px-4 py-3 border-b last:border-b-0 border-[#f5ecec]"
            >
              <span className="text-sm text-[#2b2222]">{concernLabel(locale, concern)}</span>
              <span
                className={`text-sm font-bold text-center ${
                  winner === "A" ? "text-emerald-600" : scoreColor(scoreA)
                }`}
              >
                {scoreA > 0 ? Math.round(scoreA) : "—"}
                {winner === "A" && <span className="ml-0.5 text-[10px] text-emerald-500">▲</span>}
              </span>
              <span
                className={`text-sm font-bold text-center ${
                  winner === "B" ? "text-emerald-600" : scoreColor(scoreB)
                }`}
              >
                {scoreB > 0 ? Math.round(scoreB) : "—"}
                {winner === "B" && <span className="ml-0.5 text-[10px] text-emerald-500">▲</span>}
              </span>
            </div>
          ))}
          {/* Price row */}
          <div className="grid grid-cols-[1fr_64px_64px] sm:grid-cols-[1fr_80px_80px] items-center px-4 py-3 bg-[#fdfaf9] border-t border-[#efe1db]">
            <span className="text-sm font-semibold text-[#2b2222]">
              {isTh ? "ราคา" : "Price"}
            </span>
            <span
              className={`text-sm font-bold text-center ${
                pA.price_thb <= pB.price_thb ? "text-emerald-600" : "text-neutral-500"
              }`}
            >
              {baht(pA.price_thb)}
            </span>
            <span
              className={`text-sm font-bold text-center ${
                pB.price_thb <= pA.price_thb ? "text-emerald-600" : "text-neutral-500"
              }`}
            >
              {baht(pB.price_thb)}
            </span>
          </div>
        </div>
        <p className="text-xs text-neutral-400">
          {isTh ? "คะแนน /100 · ▲ ดีกว่าในหมวดนั้น" : "Scores /100 · ▲ wins that category"}
        </p>
      </section>

      {/* FAQ answer blocks */}
      {scored.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
            {isTh ? "อันไหนดีกว่าสำหรับ...?" : "Which is better for...?"}
          </h2>
          <div className="space-y-3">
            {scored.map(({ concern, scoreA, scoreB, winner }) => {
              const winnerP = winner === "A" ? pA : winner === "B" ? pB : null;
              return (
                <div
                  key={concern}
                  className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-1.5"
                >
                  <p className="font-semibold text-sm text-[#2b2222]">
                    {isTh
                      ? `${concernLabel(locale, concern)}: ${pA.brand} หรือ ${pB.brand}?`
                      : `${concernLabel(locale, concern)}: ${pA.brand} or ${pB.brand}?`}
                  </p>
                  <p className="text-sm text-neutral-600 leading-snug">
                    {winner === "tie"
                      ? isTh
                        ? `คะแนนใกล้เคียงกัน — ${pA.brand} ${Math.round(scoreA)}/100 · ${pB.brand} ${Math.round(scoreB)}/100`
                        : `Scores are close — ${pA.brand} ${Math.round(scoreA)}/100 · ${pB.brand} ${Math.round(scoreB)}/100`
                      : isTh
                        ? `${winnerP!.brand} ${winnerP!.name} ได้คะแนนสูงกว่า (${Math.round(winner === "A" ? scoreA : scoreB)}/100 vs ${Math.round(winner === "A" ? scoreB : scoreA)}/100)`
                        : `${winnerP!.brand} ${winnerP!.name} scores higher (${Math.round(winner === "A" ? scoreA : scoreB)}/100 vs ${Math.round(winner === "A" ? scoreB : scoreA)}/100)`}
                  </p>
                  <Link
                    href={`/${locale}/${concern}`}
                    className="inline-block text-xs text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    {isTh
                      ? `ดูอันดับ${concernLabelShort(locale, concern)}ทั้งหมด →`
                      : `See full ${concernLabelShort(locale, concern)} ranking →`}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* More comparisons */}
      {suggestions.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
            {isTh ? "เปรียบเทียบกับตัวอื่น" : "More comparisons"}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((p) => {
              const s = `${productSlug(pA)}-vs-${productSlug(p)}`;
              return (
                <Link
                  key={s}
                  href={`/${locale}/compare/${s}`}
                  className="text-sm px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
                >
                  {pA.brand} vs {p.brand}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* See full rankings */}
      <section className="space-y-3 border-t border-[#efe1db] pt-8">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
          {isTh ? "ดูอันดับเต็ม" : "See full rankings"}
        </p>
        <div className="flex flex-wrap gap-2">
          {CONCERNS.map((c) => (
            <Link
              key={c}
              href={`/${locale}/${c}`}
              className="text-sm px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
            >
              {concernLabelShort(locale, c)} →
            </Link>
          ))}
          <Link
            href={`/${locale}/brand`}
            className="text-sm px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
          >
            {isTh ? "แบรนด์ทั้งหมด" : "All brands"} →
          </Link>
        </div>
      </section>

      <JsonLd data={faqLd(faqQas)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "BangkokFillers", url: `${BASE}/${locale}` },
          { name: `${pA.brand} vs ${pB.brand}`, url: `${BASE}/${locale}/compare/${slugs}` },
        ])}
      />
    </div>
  );
}
