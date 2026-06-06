"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productSlug } from "@/lib/data";
import { scoreColor } from "@/lib/format";

// ── types ────────────────────────────────────────────────────────────────────

type SkinType = "all" | "sensitive" | "oily" | "dry";
type Budget   = "all" | "low" | "mid" | "high";

interface FilterState {
  skinType: SkinType;
  budget: Budget;
}

interface ProductFilterProps {
  products: Product[];   // full ranked pool for the concern
  concern: string;
  locale: string;
}

// ── constants ────────────────────────────────────────────────────────────────

const BUDGET_RANGES: Record<Budget, [number, number]> = {
  all:  [0,    Infinity],
  low:  [0,    300],
  mid:  [300,  700],
  high: [700,  Infinity],
};

// Ingredients that are harsh for sensitive skin
const SENSITIVE_AVOID = new Set(["Alcohol Denat.", "Fragrance", "Benzoyl Peroxide",
  "Tea Tree Oil", "Salicylic Acid", "Adapalene"]);

// Ingredients that help control oil
const OILY_GOOD = new Set(["Salicylic Acid", "Zinc PCA", "Niacinamide",
  "Benzoyl Peroxide", "Adapalene"]);

// ── helpers ──────────────────────────────────────────────────────────────────

function hasFlag(p: Product, flag: string) {
  return p.ingredient_analysis?.some((a) => a.safety_flags?.includes(flag));
}

function hasIngredient(p: Product, set: Set<string>) {
  return p.ingredient_analysis?.some((a) => set.has(a.inci));
}

function filterProducts(products: Product[], f: FilterState, concern: string): Product[] {
  const [minP, maxP] = BUDGET_RANGES[f.budget];
  return products.filter((p) => {
    // budget — use ?? 0 guard; upper boundary is inclusive (mid ends at 700, high starts at 700+)
    const price = p.price_thb ?? 0;
    if (price < minP || (maxP !== Infinity && price > maxP)) return false;
    // skin type
    if (f.skinType === "sensitive") {
      // exclude products with multiple harsh flags
      const harshCount = p.ingredient_analysis?.filter(
        (a) => SENSITIVE_AVOID.has(a.inci)
      ).length ?? 0;
      if (harshCount >= 2) return false;
    }
    if (f.skinType === "oily") {
      // prefer products with oil-control actives — exclude those with zero relevant actives
      const hasOilyActive = hasIngredient(p, OILY_GOOD);
      if (!hasOilyActive && (p.total_score?.[concern] ?? 0) < 60) return false;
    }
    return true;
  });
}

function whyGood(p: Product, concern: string, locale: string): string {
  const actives = (p.ingredient_analysis ?? [])
    .filter((a) => (a.concern_efficacy?.[concern] ?? 0) >= 2)
    .slice(0, 2)
    .map((a) => a.inci);
  const score = Math.round(p.total_score?.[concern] ?? 0);
  const sold = p.sold_count ?? 0;

  if (locale === "th") {
    if (actives.length > 0)
      return `มี ${actives.join(", ")} — ส่วนผสมที่ได้ผลจริง · คะแนน ${score}/100`;
    if (sold > 10000) return `ขายแล้ว ${sold.toLocaleString()} ชิ้น · คะแนน ${score}/100`;
    return `คะแนนรวม ${score}/100 จากส่วนผสมและรีวิว`;
  }
  if (actives.length > 0)
    return `Contains ${actives.join(", ")} — proven actives · Score ${score}/100`;
  if (sold > 10000) return `${sold.toLocaleString()} sold · Score ${score}/100`;
  return `Score ${score}/100 from ingredients + reviews`;
}

// ── chip button ──────────────────────────────────────────────────────────────

function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
        active
          ? "bg-rose-500 border-rose-500 text-white shadow-sm"
          : "bg-white border-[#e8d5d0] text-[#8a7a76] hover:border-rose-300 hover:text-rose-600"
      }`}
    >
      {children}
    </button>
  );
}

// ── product card ─────────────────────────────────────────────────────────────

function FilterCard({
  p, concern, locale, slug,
}: { p: Product; concern: string; locale: string; slug: string }) {
  const score = Math.round(p.total_score?.[concern] ?? 0);
  const reason = whyGood(p, concern, locale);
  const hasDiscount = (p.discount_pct ?? 0) > 0;

  return (
    <Link
      href={`/${locale}/product/${slug}`}
      className="flex gap-3 rounded-2xl border border-[#efe1db] bg-white p-3.5 shadow-sm shadow-rose-50 hover:border-rose-300 hover:shadow-rose-100 transition-all group"
    >
      {/* Thumbnail */}
      <div className="shrink-0 relative rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50" style={{ width: 72, height: 72 }}>
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} width={72} height={72}
            className="object-contain w-full h-full p-1" />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-2xl text-neutral-200">✦</span>
        )}
        {/* Score badge */}
        <span className={`absolute bottom-1 right-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold bg-white border shadow-sm leading-none ${scoreColor(score)}`}>
          {score}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a] truncate">{p.brand}</p>
        <p className="text-xs font-semibold text-[#2b2222] leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
          {p.name}
        </p>
        {/* Why good */}
        <p className="text-[10px] text-[#8a7a76] leading-snug line-clamp-2">{reason}</p>
        {/* Price */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-xs font-bold text-[#2b2222]">฿{Math.round(p.price_thb).toLocaleString()}</span>
          {hasDiscount && (
            <span className="rounded-full bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-semibold text-rose-600">
              -{p.discount_pct}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── main component ───────────────────────────────────────────────────────────

export function ProductFilter({ products, concern, locale }: ProductFilterProps) {
  const [filter, setFilter] = useState<FilterState>({ skinType: "all", budget: "all" });

  const filtered = useMemo(
    () => filterProducts(products, filter, concern).slice(0, 12),
    [products, filter, concern]
  );

  const L = (th: string, en: string) => locale === "th" ? th : en;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-serif-display text-xl sm:text-2xl font-semibold text-neutral-900">
          {L("แนะนำสำหรับคุณ", "Find your match")}
        </h2>
        <p className="text-sm text-neutral-500">
          {L("เลือกผิวและงบประมาณเพื่อดูผลิตภัณฑ์ที่เหมาะกับคุณ",
             "Filter by skin type and budget to find the right product.")}
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-2.5">
        {/* Skin type */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-neutral-400 self-center mr-1 shrink-0">
            {L("ผิว:", "Skin:")}
          </span>
          {(["all","sensitive","oily","dry"] as SkinType[]).map((t) => (
            <Chip key={t} active={filter.skinType === t} onClick={() => setFilter((f) => ({ ...f, skinType: t }))}>
              {t === "all"       ? L("ทุกประเภท", "All types")  :
               t === "sensitive" ? L("ผิวแพ้ง่าย", "Sensitive") :
               t === "oily"     ? L("ผิวมัน", "Oily")          :
                                  L("ผิวแห้ง", "Dry")}
            </Chip>
          ))}
        </div>

        {/* Budget */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-neutral-400 self-center mr-1 shrink-0">
            {L("งบ:", "Budget:")}
          </span>
          {(["all","low","mid","high"] as Budget[]).map((b) => (
            <Chip key={b} active={filter.budget === b} onClick={() => setFilter((f) => ({ ...f, budget: b }))}>
              {b === "all"  ? L("ทั้งหมด", "Any price") :
               b === "low"  ? "≤ ฿300"                  :
               b === "mid"  ? "฿300–700"                :
                              "฿700+"}
            </Chip>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-neutral-400">
        {filtered.length > 0
          ? L(`พบ ${filtered.length} ผลิตภัณฑ์`, `${filtered.length} products found`)
          : L("ไม่พบผลิตภัณฑ์ที่ตรงกัน — ลองปรับตัวกรอง", "No matches — try adjusting the filters")}
      </p>

      {/* Cards grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((p) => (
            <FilterCard
              key={p.product_id}
              p={p}
              concern={concern}
              locale={locale}
              slug={productSlug(p)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
