"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { scoreColor } from "@/lib/format";

type Row = {
  rank: number;
  id: string;
  slug: string;
  name: string;
  brand: string;
  score: number;
  keyIngredient: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
};
type Key = "score" | "price" | "reviews";

function RankBadge({ n }: { n: number }) {
  const top3 =
    n === 1
      ? "bg-rose-500 text-white font-bold"
      : n === 2
        ? "bg-emerald-500 text-white font-bold"
        : n === 3
          ? "bg-emerald-400 text-white font-bold"
          : "bg-rose-50 text-[#8a7a76]";
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs leading-none shrink-0 ${top3}`}
    >
      {n}
    </span>
  );
}

function ScorePill({ score }: { score: number }) {
  const color = scoreColor(score);
  const bg =
    score >= 85
      ? "bg-emerald-50"
      : score >= 70
        ? "bg-amber-50"
        : "bg-rose-50";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${color} ${bg}`}
    >
      {(Math.round(score * 10) / 10).toFixed(1)}
    </span>
  );
}

function SortIndicator({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <span className="ml-0.5 text-rose-200">⇅</span>;
  return (
    <span className="ml-0.5 text-rose-500">{dir === "desc" ? "▼" : "▲"}</span>
  );
}

function productDisplayName(brand: string, name: string): string {
  if (name.toLowerCase().startsWith(brand.toLowerCase())) return name;
  return `${brand} ${name}`;
}

function thSortDir(k: Key): "asc" | "desc" {
  return k === "price" ? "asc" : "desc";
}

function ThSortable({
  k,
  sort,
  onSort,
  children,
}: {
  k: Key;
  sort: Key;
  onSort: (k: Key) => void;
  children: React.ReactNode;
}) {
  const active = sort === k;
  return (
    <th
      role="button"
      tabIndex={0}
      aria-sort={active ? (thSortDir(k) === "asc" ? "ascending" : "descending") : "none"}
      onClick={() => onSort(k)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSort(k);
        }
      }}
      className={`cursor-pointer px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide select-none whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400 ${
        active ? "text-rose-600" : "text-[#8a7a76] hover:text-[#2b2222]"
      }`}
    >
      {children}
      <SortIndicator active={active} dir={thSortDir(k)} />
    </th>
  );
}

function ThPlain({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#8a7a76] whitespace-nowrap">
      {children}
    </th>
  );
}

export function ComparisonTable({
  rows,
  locale,
  labels,
}: {
  rows: Row[];
  locale: string;
  labels: Record<string, string>;
}) {
  const [sort, setSort] = useState<Key>("score");

  const sorted = [...rows].sort((a, b) =>
    sort === "price" ? a.price - b.price : (b[sort] as number) - (a[sort] as number)
  );

  function handleSort(k: Key) {
    setSort(k);
  }

  // Mobile sort chip labels: Thai / English toggle via locale labels
  const sortChips: { key: Key; labelTh: string; labelEn: string }[] = [
    { key: "score", labelTh: "คะแนน", labelEn: "Score" },
    { key: "price", labelTh: "ราคา", labelEn: "Price" },
    { key: "reviews", labelTh: "รีวิว", labelEn: "Reviews" },
  ];

  return (
    <>
      {/* ── Mobile sort chips — hidden on sm+ ── */}
      <div className="sm:hidden flex gap-2 mb-3 flex-wrap">
        {sortChips.map(({ key, labelTh, labelEn }) => {
          const active = sort === key;
          return (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                active
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white text-[#8a7a76] border-[#efe1db] hover:border-rose-300"
              }`}
            >
              {labelTh}/{labelEn}
              {active && (
                <span className="ml-1 text-xs opacity-80">
                  {thSortDir(key) === "desc" ? "▼" : "▲"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Desktop table — hidden on small screens ── */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[#efe1db] shadow-sm shadow-rose-100">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-rose-50/60 border-b border-[#efe1db] sticky top-0 z-10">
              <ThPlain>{labels.rank}</ThPlain>
              <ThPlain>{labels.product}</ThPlain>
              <ThSortable k="score" sort={sort} onSort={handleSort}>{labels.score}</ThSortable>
              <ThPlain>{labels.key_ingredient}</ThPlain>
              <ThSortable k="price" sort={sort} onSort={handleSort}>{labels.price}</ThSortable>
              <ThSortable k="reviews" sort={sort} onSort={handleSort}>{labels.rating}</ThSortable>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-[#efe1db] transition-colors hover:bg-rose-50/40 ${
                  i % 2 === 0 ? "bg-white" : "bg-rose-50/20"
                }`}
              >
                <td className="px-3 py-2.5">
                  <RankBadge n={i + 1} />
                </td>
                <td className="px-3 py-2.5 max-w-[240px]">
                  <Link
                    href={`/${locale}/product/${r.slug}`}
                    className="text-rose-600 hover:text-rose-800 hover:underline underline-offset-2 font-medium leading-snug line-clamp-2 block"
                  >
                    {productDisplayName(r.brand, r.name)}
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  <ScorePill score={r.score} />
                </td>
                <td className="px-3 py-2.5 text-[#8a7a76] text-xs">
                  {r.keyIngredient}
                </td>
                <td className="px-3 py-2.5 text-[#2b2222] whitespace-nowrap">
                  ฿{Math.round(r.price).toLocaleString("en-US")}
                </td>
                <td className="px-3 py-2.5 text-[#8a7a76] whitespace-nowrap">
                  {r.rating ? `${r.rating}★ (${r.reviews})` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card feed — shown only below sm breakpoint ── */}
      <div className="sm:hidden space-y-3">
        {sorted.map((r, i) => {
          const rank = i + 1;
          const isTop3 = rank <= 3;
          return (
            <Link
              key={r.id}
              href={`/${locale}/product/${r.slug}`}
              className="block rounded-2xl border border-[#efe1db] bg-white shadow-sm shadow-rose-100 active:bg-rose-50/30 transition-colors"
            >
              <div className="flex items-center gap-3 p-3 min-h-[72px]">
                {/* Rank badge */}
                <div className="shrink-0">
                  <RankBadge n={rank} />
                </div>

                {/* Thumbnail */}
                {r.image ? (
                  <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-rose-50 border border-[#efe1db]">
                    <Image
                      src={r.image}
                      alt={productDisplayName(r.brand, r.name)}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-rose-50" />
                )}

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium leading-snug text-rose-600 ${
                      isTop3 ? "font-semibold" : ""
                    } line-clamp-2`}
                  >
                    {productDisplayName(r.brand, r.name)}
                  </p>
                  {r.keyIngredient !== "—" && (
                    <p className="text-xs text-[#8a7a76] mt-0.5 truncate">
                      {r.keyIngredient}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <ScorePill score={r.score} />
                    <span className="text-sm font-bold text-[#2b2222]">
                      ฿{Math.round(r.price).toLocaleString("en-US")}
                    </span>
                    {r.rating ? (
                      <span className="text-xs text-[#8a7a76]">
                        {r.rating}★ ({r.reviews})
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Buy affordance */}
                <div className="shrink-0 text-rose-300 text-lg leading-none pl-1">▸</div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
