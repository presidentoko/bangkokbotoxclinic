"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { citySlugFromDisplay } from "@/lib/cityNorm";

export type FilterableSupplier = {
  id: string;
  name: string;
  city_label: string;
  district: string | null;
  categories: string[];
  dbd: boolean;
  trust_score: number;
};

type Props = {
  suppliers: FilterableSupplier[];
  categoryOptions: string[];
  cityOptions: string[];
  totalSuppliers: number;
  viewAllHref?: string;
};

// Filter selections live in the URL (?cat=&city=&dbd=1) so a filtered result
// can be shared or bookmarked — wrapped in Suspense because useSearchParams
// opts this subtree into client-side rendering.
export function SupplierListWithFilter(props: Props) {
  return (
    <Suspense fallback={<SupplierListWithFilterInner {...props} />}>
      <SupplierListWithFilterUrlSynced {...props} />
    </Suspense>
  );
}

function SupplierListWithFilterUrlSynced(props: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlCategory = searchParams.get("cat") ?? "";
  const urlCity = searchParams.get("city") ?? "";
  const urlDbd = searchParams.get("dbd") === "1";

  const updateUrl = useCallback(
    (next: { category?: string; city?: string; dbdOnly?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      const category = next.category ?? urlCategory;
      const city = next.city ?? urlCity;
      const dbdOnly = next.dbdOnly ?? urlDbd;
      if (category) params.set("cat", category); else params.delete("cat");
      if (city) params.set("city", city); else params.delete("city");
      if (dbdOnly) params.set("dbd", "1"); else params.delete("dbd");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, urlCategory, urlCity, urlDbd, router, pathname],
  );

  return (
    <SupplierListWithFilterInner
      {...props}
      initialCategory={props.categoryOptions.includes(urlCategory) ? urlCategory : ""}
      initialCity={props.cityOptions.includes(urlCity) ? urlCity : ""}
      initialDbdOnly={urlDbd}
      onFilterChange={updateUrl}
    />
  );
}

type InnerProps = Props & {
  initialCategory?: string;
  initialCity?: string;
  initialDbdOnly?: boolean;
  onFilterChange?: (next: { category?: string; city?: string; dbdOnly?: boolean }) => void;
};

function SupplierListWithFilterInner({
  suppliers, categoryOptions, cityOptions, totalSuppliers, viewAllHref = "/best/highly-recommended",
  initialCategory = "", initialCity = "", initialDbdOnly = false, onFilterChange,
}: InnerProps) {
  const [category, setCategoryState] = useState(initialCategory);
  const [city, setCityState] = useState(initialCity);
  const [dbdOnly, setDbdOnlyState] = useState(initialDbdOnly);

  const setCategory = (v: string) => { setCategoryState(v); onFilterChange?.({ category: v }); };
  const setCity = (v: string) => { setCityState(v); onFilterChange?.({ city: v }); };
  const setDbdOnly = (v: boolean) => { setDbdOnlyState(v); onFilterChange?.({ dbdOnly: v }); };

  const filtered = useMemo(() => {
    return suppliers
      .filter((s) => !category || s.categories.includes(category))
      .filter((s) => !city || s.city_label === city)
      .filter((s) => !dbdOnly || s.dbd);
  }, [suppliers, category, city, dbdOnly]);

  const top10 = filtered.slice(0, 10);
  const total = filtered.length;

  // categoryOptions=[] means the caller (e.g. a /c/[cuisine] page) already
  // pre-filtered `suppliers` to one implicit category and hid the dropdown —
  // `category` state is then permanently "", which must NOT be read as "no
  // category filter is active." Neither /c/{category} nor /city/{slug}
  // supports a second filter dimension (no combined route exists), so on a
  // category-locked page we only trust the caller's own viewAllHref/
  // totalSuppliers (already scoped to the locked category) rather than
  // overriding it with a city-only link that would silently drop that scope.
  const categoryLocked = categoryOptions.length === 0;

  // /c/{category} and /city/{slug} show every supplier in that category/city —
  // neither supports a dbdOnly filter, so only offer the smart link when
  // exactly one of category/city is active AND dbdOnly is off (otherwise the
  // count shown wouldn't match what the destination page actually displays).
  const viewAll = (() => {
    if (!dbdOnly && category && !city) {
      return { href: `/c/${category}`, label: `View all ${total.toLocaleString()} ${category.replace(/_/g, " ")} suppliers →` };
    }
    if (!dbdOnly && !categoryLocked && city && !category) {
      return { href: `/city/${citySlugFromDisplay(city)}`, label: `View all ${total.toLocaleString()} suppliers in ${city} →` };
    }
    return { href: viewAllHref, label: `View all ${totalSuppliers.toLocaleString()} suppliers →` };
  })();

  return (
    <div>
      {/* Sticky filter bar */}
      {/* top-28 accounts for the mobile 2-row sticky header (logo row + search row); md:top-14 for the 1-row desktop header. */}
      <div className="sticky top-28 md:top-14 z-20 bg-white border border-[var(--border)] rounded-xl px-4 py-3 mb-4 flex flex-wrap gap-2 items-center shadow-sm">
        {categoryOptions.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm border border-[var(--border)] rounded-lg px-3 py-2.5 min-h-11 bg-white hover:border-[var(--gold-light)] transition cursor-pointer"
          >
            <option value="">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_ICONS[c] ?? "🏭"} {CATEGORY_LABELS[c] ?? c}
              </option>
            ))}
          </select>
        )}

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-sm border border-[var(--border)] rounded-lg px-3 py-2.5 min-h-11 bg-white hover:border-[var(--gold-light)] transition cursor-pointer"
        >
          <option value="">All provinces</option>
          {cityOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none min-h-11 px-1">
          <input
            type="checkbox"
            checked={dbdOnly}
            onChange={(e) => setDbdOnly(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border)] accent-[var(--gold)]"
          />
          <span className="font-medium text-[var(--gold-deep)]">DBD Verified only</span>
        </label>

        <span className="ml-auto text-xs text-[var(--muted)] tabular-nums">
          {total.toLocaleString()} results
        </span>
      </div>

      {/* Top 10 list */}
      <div className="grid gap-3">
        {top10.map((s, i) => (
          <a
            key={s.id}
            href={`/supplier/${s.id}`}
            className="flex items-center gap-4 px-4 py-3 border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-[var(--gold-light)] transition"
          >
            <div className="text-sm font-black tabular-nums text-[var(--muted)] w-6 shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{s.name}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">
                {s.district || s.city_label}
                {s.dbd && (
                  <span className="ml-2 text-[var(--gold-deep)] font-medium">· DBD ✓</span>
                )}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-lg font-black tabular-nums text-[var(--gold-deep)]">{s.trust_score}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-wide">Trust</div>
            </div>
          </a>
        ))}
      </div>

      {top10.length === 0 && (
        <div className="text-center py-12 text-[var(--muted)] text-sm">
          No suppliers match these filters.
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href={viewAll.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-[var(--gold-light)] hover:text-[var(--gold-deep)] transition"
        >
          {viewAll.label}
        </a>
      </div>
    </div>
  );
}
