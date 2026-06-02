"use client";
import { useState } from "react";
import Link from "next/link";
type Row = { rank: number; id: string; slug: string; name: string; brand: string;
  score: number; keyIngredient: string; price: number; rating: number; reviews: number };
type Key = "score" | "price" | "rating" | "reviews";
export function ComparisonTable({ rows, locale, labels }:
  { rows: Row[]; locale: string; labels: Record<string,string> }) {
  const [sort, setSort] = useState<Key>("score");
  const sorted = [...rows].sort((a, b) => sort === "price" ? a.price - b.price : (b as any)[sort] - (a as any)[sort]);
  const Th = ({ k, children }: { k: Key; children: any }) =>
    <th onClick={() => setSort(k)} className="cursor-pointer px-2 py-1 text-left underline-offset-2 hover:underline">{children}</th>;
  return (
    <table className="w-full text-sm border-collapse">
      <thead><tr className="border-b">
        <th className="px-2 py-1 text-left">{labels.rank}</th>
        <th className="px-2 py-1 text-left">{labels.product}</th>
        <Th k="score">{labels.score}</Th>
        <th className="px-2 py-1 text-left">{labels.key_ingredient}</th>
        <Th k="price">{labels.price}</Th>
        <Th k="rating">{labels.rating}</Th>
      </tr></thead>
      <tbody>
        {sorted.map((r, i) => (
          <tr key={r.id} className="border-b">
            <td className="px-2 py-1">{i + 1}</td>
            <td className="px-2 py-1"><Link href={`/${locale}/product/${r.slug}`} className="text-pink-700">{r.brand} {r.name}</Link></td>
            <td className="px-2 py-1 font-medium">{r.score.toFixed(1)}</td>
            <td className="px-2 py-1">{r.keyIngredient}</td>
            <td className="px-2 py-1">฿{Math.round(r.price).toLocaleString()}</td>
            <td className="px-2 py-1">{r.rating ? `${r.rating}★ (${r.reviews})` : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
