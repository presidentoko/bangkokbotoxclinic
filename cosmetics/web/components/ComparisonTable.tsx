"use client";
import { useState } from "react";
import Link from "next/link";
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
};
type Key = "score" | "price" | "rating" | "reviews";

function RankBadge({ n }: { n: number }) {
  const top3 =
    n === 1
      ? "bg-teal-600 text-white font-bold"
      : n === 2
        ? "bg-emerald-500 text-white font-bold"
        : n === 3
          ? "bg-emerald-400 text-white font-bold"
          : "bg-neutral-200 text-neutral-600";
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs leading-none ${top3}`}
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
        ? "bg-teal-50"
        : "bg-neutral-100";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${color} ${bg}`}
    >
      {(Math.round(score * 10) / 10).toFixed(1)}
    </span>
  );
}

function SortIndicator({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <span className="ml-0.5 text-neutral-300">⇅</span>;
  return (
    <span className="ml-0.5 text-teal-600">{dir === "desc" ? "▼" : "▲"}</span>
  );
}

function productDisplayName(brand: string, name: string): string {
  if (name.toLowerCase().startsWith(brand.toLowerCase())) return name;
  return `${brand} ${name}`;
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

  const sortDir = (k: Key): "asc" | "desc" => (k === "price" ? "asc" : "desc");

  const sorted = [...rows].sort((a, b) =>
    sort === "price" ? a.price - b.price : (b as any)[sort] - (a as any)[sort]
  );

  function handleSort(k: Key) {
    setSort(k);
  }

  const ThSortable = ({ k, children }: { k: Key; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(k)}
      className={`cursor-pointer px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide select-none whitespace-nowrap ${
        sort === k ? "text-teal-700" : "text-neutral-500 hover:text-neutral-700"
      }`}
    >
      {children}
      <SortIndicator active={sort === k} dir={sortDir(k)} />
    </th>
  );

  const ThPlain = ({ children }: { children: React.ReactNode }) => (
    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 whitespace-nowrap">
      {children}
    </th>
  );

  return (
    <>
      {/* Desktop table — hidden on small screens */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-neutral-200 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 sticky top-0 z-10">
              <ThPlain>{labels.rank}</ThPlain>
              <ThPlain>{labels.product}</ThPlain>
              <ThSortable k="score">{labels.score}</ThSortable>
              <ThPlain>{labels.key_ingredient}</ThPlain>
              <ThSortable k="price">{labels.price}</ThSortable>
              <ThSortable k="rating">{labels.rating}</ThSortable>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-neutral-200 transition-colors hover:bg-teal-50/40 ${
                  i % 2 === 0 ? "bg-white" : "bg-neutral-50"
                }`}
              >
                <td className="px-3 py-2.5">
                  <RankBadge n={i + 1} />
                </td>
                <td className="px-3 py-2.5 max-w-[240px]">
                  <Link
                    href={`/${locale}/product/${r.slug}`}
                    className="text-teal-700 hover:text-teal-900 hover:underline underline-offset-2 font-medium leading-snug"
                  >
                    {productDisplayName(r.brand, r.name)}
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  <ScorePill score={r.score} />
                </td>
                <td className="px-3 py-2.5 text-neutral-600 text-xs">
                  {r.keyIngredient}
                </td>
                <td className="px-3 py-2.5 text-neutral-700 whitespace-nowrap">
                  ฿{Math.round(r.price).toLocaleString("en-US")}
                </td>
                <td className="px-3 py-2.5 text-neutral-600 whitespace-nowrap">
                  {r.rating ? `${r.rating}★ (${r.reviews})` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards — shown only below sm breakpoint */}
      <div className="sm:hidden space-y-3">
        {sorted.map((r, i) => (
          <div
            key={r.id}
            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-2">
              <RankBadge n={i + 1} />
              <Link
                href={`/${locale}/product/${r.slug}`}
                className="flex-1 text-teal-700 hover:text-teal-900 font-medium leading-snug"
              >
                {productDisplayName(r.brand, r.name)}
              </Link>
              <ScorePill score={r.score} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 mt-1">
              {r.keyIngredient !== "—" && (
                <span>
                  <span className="font-medium text-neutral-700">
                    {labels.key_ingredient}:
                  </span>{" "}
                  {r.keyIngredient}
                </span>
              )}
              <span>
                <span className="font-medium text-neutral-700">
                  {labels.price}:
                </span>{" "}
                ฿{Math.round(r.price).toLocaleString("en-US")}
              </span>
              {r.rating ? (
                <span>
                  {r.rating}★ ({r.reviews})
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
