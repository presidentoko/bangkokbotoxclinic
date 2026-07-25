"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { getCompareIds, clearCompare } from "@/lib/compare";
import { themeLabel } from "@/lib/theme-labels";
import { priceMedian } from "@/lib/summary";

export function CompareClient({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [places, setPlaces] = useState<Place[] | null>(null);

  useEffect(() => {
    const ids = getCompareIds();
    if (ids.length === 0) {
      setPlaces([]);
      return;
    }
    fetch("/places-index.json")
      .then((res) => res.json())
      .then((all: Place[]) => {
        const byId = new Map(all.map((p) => [p.id, p]));
        setPlaces(ids.map((id) => byId.get(id)).filter((p): p is Place => Boolean(p)));
      })
      .catch(() => setPlaces([]));
  }, []);

  if (places === null) return null;

  if (places.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">{t.compare.empty}</p>
        <Link href={`/${lang}`} className="inline-block text-sm font-semibold text-accent hover:underline">
          {t.compare.browseCta} →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => {
            clearCompare();
            setPlaces([]);
          }}
          className="text-xs text-muted hover:text-red-500 font-medium"
        >
          {t.compare.clearAll}
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full border-collapse text-sm min-w-[480px]">
          <tbody>
            <Row values={places.map((p) => <div className="font-display font-semibold text-base">{p.name}</div>)} />
            <Row label={t.place.ratingLabel} values={places.map((p) => (p.rating != null ? `★ ${p.rating.toFixed(1)}` : "—"))} />
            <Row label={t.place.reviewCountLabel} values={places.map((p) => String(p.reviewCount))} />
            <Row
              label={t.compare.priceLabel}
              values={places.map((p) => {
                const median = priceMedian(p.priceMentions);
                return median != null ? `~${median.toLocaleString()}฿` : t.priceFilter.noPriceData;
              })}
            />
            <Row
              label={t.compare.themesLabel}
              values={places.map((p) => p.serviceThemes.slice(0, 3).map((s) => themeLabel(s.label, lang)).join(", ") || "—")}
            />
            <Row
              label={t.compare.moodsLabel}
              values={places.map((p) => p.moodKeywords.slice(0, 3).map((m) => themeLabel(m.label, lang)).join(", ") || "—")}
            />
            <Row
              values={places.map((p) => (
                <Link href={`/${lang}/place/${p.id}`} className="inline-block text-xs font-semibold text-accent hover:underline">
                  {t.compare.viewButton} →
                </Link>
              ))}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, values }: { label?: string; values: ReactNode[] }) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 pl-4 pr-4 text-xs uppercase tracking-wide text-muted font-semibold align-top whitespace-nowrap bg-bg-elev">
        {label}
      </td>
      {values.map((v, i) => (
        // Fixed-length row (one cell per compared place, max MAX_COMPARE=3),
        // not a reorderable list, so an index key is fine here.
        // eslint-disable-next-line react/no-array-index-key
        <td key={i} className="py-3 px-3 align-top">
          {v}
        </td>
      ))}
    </tr>
  );
}
