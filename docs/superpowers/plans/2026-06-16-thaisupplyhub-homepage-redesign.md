# ThaiSupplyHub Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈페이지를 "나열식 디렉토리"에서 "섹터 카드 + 필터 리스트" 구조로 개편해 공장을 찾는 사업가가 빠르게 원하는 섹터에 도달하게 한다.

**Architecture:** `page.tsx`(서버/빌드타임)에서 섹터별 집계 데이터를 계산해 정적 `SectorCard` 컴포넌트에 전달. 필터 리스트는 `SupplierListWithFilter`("use client")가 클라이언트 사이드에서 처리.

**Tech Stack:** Next.js 16 App Router, static export (`output: export`), Tailwind CSS v4, TypeScript

---

## 파일 맵

| 파일 | 작업 |
|------|------|
| `components/SectorCard.tsx` | 신규 — 섹터 카드 정적 컴포넌트 |
| `components/SupplierListWithFilter.tsx` | 신규 — sticky 필터바 + Top 10 리스트 client component |
| `app/page.tsx` | 수정 — 섹터 데이터 계산, Featured/estates 제거, 섹션 재구성 |

---

## Task 1: SectorCard 컴포넌트 생성

**Files:**
- Create: `web-factory/components/SectorCard.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// web-factory/components/SectorCard.tsx
type SectorCardProps = {
  icon: string;
  label: string;
  href: string;
  supplierCount: number;
  dbdCount: number;
  topCity: string;
};

export function SectorCard({ icon, label, href, supplierCount, dbdCount, topCity }: SectorCardProps) {
  return (
    <a
      href={href}
      className="group block border border-[var(--border)] rounded-2xl bg-white p-5 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-bold text-base group-hover:text-emerald-700 transition">{label}</div>
      <div className="mt-3 space-y-1">
        <div className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--fg)]">{supplierCount.toLocaleString()}</span> suppliers
        </div>
        <div className="text-sm text-emerald-700 font-medium">
          {dbdCount.toLocaleString()} DBD-verified
        </div>
        <div className="text-xs text-[var(--muted)] mt-2">📍 {topCity}</div>
      </div>
    </a>
  );
}
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-factory && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add web-factory/components/SectorCard.tsx
git commit -m "feat(web-factory): add SectorCard component"
```

---

## Task 2: SupplierListWithFilter 컴포넌트 생성

**Files:**
- Create: `web-factory/components/SupplierListWithFilter.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// web-factory/components/SupplierListWithFilter.tsx
"use client";

import { useState, useMemo } from "react";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { computeTrustScore } from "@/lib/trustScore";

export type FilterableSupplier = {
  id: string;
  name: string;
  city_label: string;
  district: string | null;
  categories: string[];
  dbd: boolean;
  trust_score: number;
  rating: number;
  total_reviews: number;
  primary_type: string;
};

type Props = {
  suppliers: FilterableSupplier[];
  categoryOptions: string[];
  cityOptions: string[];
};

export function SupplierListWithFilter({ suppliers, categoryOptions, cityOptions }: Props) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [dbdOnly, setDbdOnly] = useState(false);

  const filtered = useMemo(() => {
    return suppliers
      .filter((s) => !category || s.categories.includes(category))
      .filter((s) => !city || s.city_label === city)
      .filter((s) => !dbdOnly || s.dbd)
      .slice(0, 10);
  }, [suppliers, category, city, dbdOnly]);

  const total = useMemo(() => {
    return suppliers
      .filter((s) => !category || s.categories.includes(category))
      .filter((s) => !city || s.city_label === city)
      .filter((s) => !dbdOnly || s.dbd)
      .length;
  }, [suppliers, category, city, dbdOnly]);

  return (
    <div>
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-sm border border-[var(--border)] rounded-xl px-4 py-3 mb-4 flex flex-wrap gap-2 items-center shadow-sm">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-white hover:border-emerald-400 transition cursor-pointer"
        >
          <option value="">All categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_ICONS[c] ?? "🏭"} {CATEGORY_LABELS[c] ?? c}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-white hover:border-emerald-400 transition cursor-pointer"
        >
          <option value="">All provinces</option>
          {cityOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dbdOnly}
            onChange={(e) => setDbdOnly(e.target.checked)}
            className="rounded border-[var(--border)] accent-emerald-600"
          />
          <span className="font-medium text-emerald-700">DBD Verified only</span>
        </label>

        <span className="ml-auto text-xs text-[var(--muted)] tabular-nums">
          {total.toLocaleString()} results
        </span>
      </div>

      {/* Top 10 list */}
      <div className="grid gap-3">
        {filtered.map((s, i) => (
          <a
            key={s.id}
            href={`/supplier/${s.id}`}
            className="flex items-center gap-4 px-4 py-3 border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-emerald-300 transition"
          >
            <div className="text-sm font-black tabular-nums text-[var(--muted)] w-6 shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{s.name}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">
                {s.district || s.city_label}
                {s.dbd && (
                  <span className="ml-2 text-emerald-700 font-medium">· DBD ✓</span>
                )}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-lg font-black tabular-nums text-emerald-700">{s.trust_score}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-wide">Trust</div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--muted)] text-sm">
          No suppliers match these filters.
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href="/best/highly-recommended"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-emerald-400 hover:text-emerald-700 transition"
        >
          View all {total.toLocaleString()} suppliers →
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-factory && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add web-factory/components/SupplierListWithFilter.tsx
git commit -m "feat(web-factory): add SupplierListWithFilter client component"
```

---

## Task 3: page.tsx 데이터 계산 추가

**Files:**
- Modify: `web-factory/app/page.tsx`

- [ ] **Step 1: import 추가 및 헬퍼 함수 + 섹터 데이터 계산 삽입**

`page.tsx` 상단 import에 추가:
```tsx
import { SectorCard } from "@/components/SectorCard";
import { SupplierListWithFilter, type FilterableSupplier } from "@/components/SupplierListWithFilter";
```

기존 `const SITE = ...` 위에(또는 `export default async function HomePage()` 안 `const db = await loadMasterDb();` 바로 아래에) 헬퍼 함수와 상수 추가:

```tsx
// page.tsx 파일 최상단 (import 아래, export default 위)
const FEATURED_CATEGORIES: { key: string; icon: string; label: string }[] = [
  { key: "manufacturer",       icon: "🏭", label: "Manufacturers" },
  { key: "auto_parts",         icon: "🚗", label: "Auto Parts" },
  { key: "warehouse",          icon: "📦", label: "Warehouses" },
  { key: "industrial_estate",  icon: "🏘️", label: "Industrial Estates" },
  { key: "logistics",          icon: "🚚", label: "Logistics" },
  { key: "food_mfg",           icon: "🥫", label: "Food Manufacturers" },
];

function topCityForCategory(suppliers: Awaited<ReturnType<typeof loadMasterDb>>["suppliers"], cat: string): string {
  const counts: Record<string, number> = {};
  for (const s of suppliers) {
    if (s.categories.includes(cat) && s.city_label) {
      counts[s.city_label] = (counts[s.city_label] ?? 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Thailand";
}
```

`HomePage` 함수 안 `const db = await loadMasterDb();` 바로 아래에 추가:

```tsx
  // 섹터 카드 데이터
  const sectorData = FEATURED_CATEGORIES
    .filter(({ key }) => (db.category_counts[key] ?? 0) > 0)
    .map(({ key, icon, label }) => ({
      key,
      icon,
      label,
      supplierCount: db.category_counts[key] ?? 0,
      dbdCount: db.suppliers.filter((s) => s.categories.includes(key) && s.dbd).length,
      topCity: topCityForCategory(db.suppliers, key),
      href: `/c/${key}`,
    }));

  // 필터 컴포넌트용 데이터
  const filterableSuppliers: FilterableSupplier[] = db.suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    city_label: s.city_label,
    district: s.district ?? null,
    categories: s.categories,
    dbd: !!s.dbd,
    trust_score: computeTrustScore(s).overall,
    rating: s.rating,
    total_reviews: s.total_reviews,
    primary_type: s.primary_type,
  })).sort((a, b) => b.trust_score - a.trust_score);

  const categoryOptions = Object.keys(db.category_counts).sort();
  const cityOptions = Object.keys(db.city_counts).sort();
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-factory && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add web-factory/app/page.tsx
git commit -m "feat(web-factory): add sector data calculations to homepage"
```

---

## Task 4: page.tsx JSX 리스트럭처

**Files:**
- Modify: `web-factory/app/page.tsx`

- [ ] **Step 1: Featured 6 섹션 제거**

`{/* FEATURED 6 */}` 블록 전체 삭제:
```tsx
// 이 섹션 전체 삭제
{featuredFinal.length >= 6 && (
  <section className="mb-12">
    ...
  </section>
)}
```

관련 변수도 삭제 (`featuredVerified`, `featuredFinal` 계산 코드).

- [ ] **Step 2: Industrial estates spotlight 섹션 제거**

`{/* Industrial estates spotlight */}` 블록 전체 삭제:
```tsx
// 이 섹션 전체 삭제
{estatesTop.length >= 3 && (
  <section className="mb-12 border ...">
    ...
  </section>
)}
```

관련 변수도 삭제 (`estatesTop` 계산 코드).

- [ ] **Step 3: By Type 카테고리 필 섹션 → 섹터 카드 그리드로 교체**

기존 `{/* Browse by type */}` 섹션 삭제:
```tsx
// 삭제
{categories.length > 0 && (
  <section className="mb-10">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
    <div className="flex flex-wrap gap-2">
      {categories.map(([cat, count]) => ( ... ))}
    </div>
  </section>
)}
```

`{/* MANIFESTO */}` 섹션 바로 위에 섹터 카드 그리드 추가:
```tsx
{/* SECTOR CARDS */}
<section className="mb-10">
  <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">
    Find by industry
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {sectorData.map((s) => (
      <SectorCard
        key={s.key}
        icon={s.icon}
        label={s.label}
        href={s.href}
        supplierCount={s.supplierCount}
        dbdCount={s.dbdCount}
        topCity={s.topCity}
      />
    ))}
  </div>
</section>
```

- [ ] **Step 4: Top 50 리스트 → SupplierListWithFilter로 교체**

기존 `<section>` (Top 50 by Trust Score) 전체 교체:
```tsx
// 삭제
<section>
  <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Top {Math.min(top.length, 50)} by Trust Score</h2>
  <div className="grid gap-3">
    {top.slice(0, 10).map((r, i) => (
      <SupplierCard key={r.id} r={r} rank={i + 1} />
    ))}
  </div>
  <AffiliateInline />
  <div className="grid gap-3 mt-3">
    {top.slice(10).map((r, i) => (
      <SupplierCard key={r.id} r={r} rank={i + 11} />
    ))}
  </div>
</section>
```

대체:
```tsx
{/* FILTERED LIST */}
<section className="mb-12">
  <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">
    Top suppliers by trust score
  </h2>
  <SupplierListWithFilter
    suppliers={filterableSuppliers}
    categoryOptions={categoryOptions}
    cityOptions={cityOptions}
  />
</section>
```

- [ ] **Step 5: 불필요한 import 정리**

`SupplierCard` import는 유지 (다른 곳에서 쓸 수 있음). `AffiliateInline`이 더 이상 사용 안 되면 삭제.

- [ ] **Step 6: 빌드 확인**

```bash
cd web-factory && npm run build
```

Expected: 마지막 줄 `EXIT: 0`, `out/` 디렉토리 생성됨

- [ ] **Step 7: 커밋**

```bash
git add web-factory/app/page.tsx
git commit -m "feat(web-factory): homepage redesign — sector cards + filter list"
```

---

## Task 5: 배포

- [ ] **Step 1: `out/` 정리 (배포 전 필수 — Cloudflare 20k 파일 제한)**

```powershell
$out = "web-factory\out"
Get-ChildItem -Recurse $out -File | Where-Object { $_.Name -like "__next*" } | Remove-Item -Force
Get-ChildItem -Recurse $out -File -Filter "*.txt" | Where-Object { $_.Name -ne "llms.txt" -and $_.Name -ne "llms-full.txt" } | Remove-Item -Force
(Get-ChildItem -Recurse $out -File).Count
```

Expected: 9,000~10,000 범위

- [ ] **Step 2: Cloudflare Pages 배포**

```powershell
$env:CLOUDFLARE_API_TOKEN="cfut_qP36bRfaCO9VtAAuhvC17I6FqeJ1Z4Jsbq6CflSLfe7dd6ec"
cd web-factory
npx wrangler pages deploy out/ --project-name=thaisupplyhub --branch=main --commit-dirty=true
```

Expected: `✨ Deployment complete! Take a peek over at https://...thaisupplyhub.pages.dev`

- [ ] **Step 3: 라이브 확인**

```bash
curl -s https://thaisupplyhub.com | grep -o "Find by industry\|sector\|DBD-verified"
```

Expected: `DBD-verified` 또는 관련 텍스트 출력

- [ ] **Step 4: 최종 커밋 (git push)**

```bash
git push origin main
```
