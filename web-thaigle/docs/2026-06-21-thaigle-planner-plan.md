# Thaigle 방콕 여행 플래너 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 방콕 여행 플래너 — 레스토랑/클리닉/덴탈을 한 리스트에 담아 URL로 공유

**Architecture:** localStorage 기반 플래너 상태 → URL base64 인코딩으로 공유 링크 생성. 멀티카테고리(레스토랑/클리닉/덴탈)는 각각 JSON 파일로 로드. 서버 없이 완전 정적 동작.

**Tech Stack:** Next.js 16 App Router, React Context, localStorage, base64 URL encoding, Kakao Share SDK

## Global Constraints

- Next.js App Router only — no pages/ directory
- `export const dynamic = "force-static"` 또는 `revalidate` 사용 (SSR 금지, Vercel 비용)
- TypeScript strict — any 금지
- 컴포넌트는 `components/` 에, 데이터 로직은 `lib/` 에
- 스타일은 Tailwind 인라인 (globals.css 추가 금지)
- 클라이언트 컴포넌트는 반드시 `"use client"` 명시

---

## File Map

### 신규 생성
```
lib/planner.ts                          # Plan 타입 + URL encode/decode
lib/clinics.ts                          # 클리닉 데이터 로더
lib/dental.ts                           # 덴탈 데이터 로더
components/PlannerContext.tsx           # "use client" — localStorage 상태
components/PlannerBar.tsx               # "use client" — 하단 고정 바
components/AddToPlannerButton.tsx       # "use client" — 추가/제거 버튼
app/plan/page.tsx                       # 플래너 페이지 (URL decode)
app/plan/opengraph-image.tsx            # OG 이미지 동적 생성
app/clinics/page.tsx                    # 클리닉 브라우저
app/dental/page.tsx                     # 덴탈 브라우저
scripts/export-clinics.mjs             # CSV → data/clinics.json 변환
scripts/export-dental.mjs              # CSV → data/dental.json 변환
data/clinics.json                       # 변환된 클리닉 데이터
data/dental.json                        # 변환된 덴탈 데이터
```

### 수정
```
app/layout.tsx                          # PlannerContext + PlannerBar 추가
components/RestaurantCard.tsx           # AddToPlannerButton 추가
app/sitemap.ts                          # /clinics, /dental, /plan 추가
```

---

## Task 1: Plan 타입 + URL 인코딩 유틸

**Files:**
- Create: `lib/planner.ts`

**Interfaces:**
- Produces: `PlanItem`, `Plan`, `encodePlan(plan: Plan): string`, `decodePlan(str: string): Plan | null`

- [ ] **Step 1: `lib/planner.ts` 작성**

```typescript
// lib/planner.ts

export type PlanItemType = "restaurant" | "clinic" | "dental" | "wellness" | "gym";

export type PlanItem = {
  type: PlanItemType;
  id: string;
  name: string;
  district?: string;
  rating?: number;
  city?: string;
};

export type Plan = {
  title: string;
  items: PlanItem[];
};

export const EMPTY_PLAN: Plan = { title: "내 방콕 트립", items: [] };

export const TYPE_LABELS: Record<PlanItemType, string> = {
  restaurant: "🍜 맛집",
  clinic: "💉 클리닉",
  dental: "🦷 치과",
  wellness: "💆 웰니스",
  gym: "🥊 무에타이",
};

export function encodePlan(plan: Plan): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(plan))));
}

export function decodePlan(str: string): Plan | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(str)))) as Plan;
  } catch {
    return null;
  }
}

export function planUrl(plan: Plan): string {
  return `/plan?d=${encodePlan(plan)}`;
}
```

- [ ] **Step 2: 타입 검증 (tsc)**

```bash
cd web-thaigle && npx tsc --noEmit
```
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add web-thaigle/lib/planner.ts
git commit -m "feat(planner): Plan types + URL encode/decode util"
```

---

## Task 2: PlannerContext (클라이언트 상태)

**Files:**
- Create: `components/PlannerContext.tsx`

**Interfaces:**
- Consumes: `Plan`, `PlanItem`, `EMPTY_PLAN` from `lib/planner.ts`
- Produces:
  - `usePlanner(): { plan: Plan; add(item: PlanItem): void; remove(id: string, type: PlanItemType): void; clear(): void; setTitle(t: string): void; has(id: string, type: PlanItemType): boolean }`
  - `PlannerProvider` (React component)

- [ ] **Step 1: `components/PlannerContext.tsx` 작성**

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Plan, PlanItem, PlanItemType } from "@/lib/planner";
import { EMPTY_PLAN } from "@/lib/planner";

const LS_KEY = "thaigle_plan";

type PlannerCtx = {
  plan: Plan;
  add: (item: PlanItem) => void;
  remove: (id: string, type: PlanItemType) => void;
  clear: () => void;
  setTitle: (t: string) => void;
  has: (id: string, type: PlanItemType) => boolean;
};

const Ctx = createContext<PlannerCtx | null>(null);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Plan>(EMPTY_PLAN);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPlan(JSON.parse(raw));
    } catch {}
  }, []);

  function save(next: Plan) {
    setPlan(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  function add(item: PlanItem) {
    if (has(item.id, item.type)) return;
    save({ ...plan, items: [...plan.items, item] });
  }

  function remove(id: string, type: PlanItemType) {
    save({ ...plan, items: plan.items.filter((i) => !(i.id === id && i.type === type)) });
  }

  function clear() { save(EMPTY_PLAN); }

  function setTitle(t: string) { save({ ...plan, title: t }); }

  function has(id: string, type: PlanItemType) {
    return plan.items.some((i) => i.id === id && i.type === type);
  }

  return <Ctx.Provider value={{ plan, add, remove, clear, setTitle, has }}>{children}</Ctx.Provider>;
}

export function usePlanner() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider");
  return ctx;
}
```

- [ ] **Step 2: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add web-thaigle/components/PlannerContext.tsx
git commit -m "feat(planner): PlannerContext with localStorage persistence"
```

---

## Task 3: layout.tsx에 PlannerProvider 추가

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `PlannerProvider` from `components/PlannerContext.tsx`

- [ ] **Step 1: layout.tsx import 추가**

`app/layout.tsx` 상단에 추가:
```tsx
import { PlannerProvider } from "@/components/PlannerContext";
```

- [ ] **Step 2: body를 PlannerProvider로 감싸기**

```tsx
// 기존:
<body>
  <OrgJsonLd />
  ...
</body>

// 변경:
<body>
  <PlannerProvider>
    <OrgJsonLd />
    ...
  </PlannerProvider>
</body>
```

- [ ] **Step 3: tsc + 빌드 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 4: 커밋**

```bash
git add web-thaigle/app/layout.tsx
git commit -m "feat(planner): wrap layout with PlannerProvider"
```

---

## Task 4: AddToPlannerButton 컴포넌트

**Files:**
- Create: `components/AddToPlannerButton.tsx`

**Interfaces:**
- Consumes: `usePlanner()` from `PlannerContext`, `PlanItem` from `lib/planner.ts`
- Produces: `<AddToPlannerButton item={PlanItem} />` — 추가/제거 토글 버튼

- [ ] **Step 1: `components/AddToPlannerButton.tsx` 작성**

```tsx
"use client";

import { usePlanner } from "@/components/PlannerContext";
import type { PlanItem } from "@/lib/planner";

export function AddToPlannerButton({ item }: { item: PlanItem }) {
  const { add, remove, has } = usePlanner();
  const added = has(item.id, item.type);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        added ? remove(item.id, item.type) : add(item);
      }}
      className={`text-xs px-3 py-1.5 rounded-full border font-bold transition ${
        added
          ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
          : "bg-white text-[var(--muted)] border-[var(--border)] hover:border-orange-400 hover:text-orange-600"
      }`}
    >
      {added ? "✓ 플래너에 추가됨" : "+ 플래너에 추가"}
    </button>
  );
}
```

- [ ] **Step 2: RestaurantCard에 버튼 추가**

`components/RestaurantCard.tsx` 에서 카드 하단에 추가:
```tsx
// 기존 import에 추가:
import { AddToPlannerButton } from "@/components/AddToPlannerButton";
import type { PlanItem } from "@/lib/planner";

// 카드 내부 하단 (rating/reviews 아래):
<div className="mt-3 flex items-center justify-between">
  {/* 기존 태그들 */}
  <AddToPlannerButton item={{
    type: "restaurant",
    id: r.id,
    name: r.name,
    district: r.district,
    rating: r.rating,
    city: r.city,
  }} />
</div>
```

- [ ] **Step 3: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 4: 커밋**

```bash
git add web-thaigle/components/AddToPlannerButton.tsx web-thaigle/components/RestaurantCard.tsx
git commit -m "feat(planner): AddToPlannerButton on restaurant cards"
```

---

## Task 5: PlannerBar (하단 고정 바)

**Files:**
- Create: `components/PlannerBar.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `usePlanner()`, `planUrl()` from `lib/planner.ts`

- [ ] **Step 1: `components/PlannerBar.tsx` 작성**

```tsx
"use client";

import Link from "next/link";
import { usePlanner } from "@/components/PlannerContext";
import { planUrl } from "@/lib/planner";

export function PlannerBar() {
  const { plan } = usePlanner();
  if (plan.items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white px-4 py-3 flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <span className="text-lg">🗺️</span>
        <div>
          <div className="font-bold text-sm">{plan.title}</div>
          <div className="text-xs text-gray-400">{plan.items.length}곳 저장됨</div>
        </div>
      </div>
      <Link
        href="/plan"
        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full transition"
      >
        플래너 보기 →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: layout.tsx에 PlannerBar 추가**

```tsx
import { PlannerBar } from "@/components/PlannerBar";

// </main> 바로 아래, </PlannerProvider> 위에:
<main>{children}</main>
<PlannerBar />
<footer>...</footer>
```

- [ ] **Step 3: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 4: 커밋**

```bash
git add web-thaigle/components/PlannerBar.tsx web-thaigle/app/layout.tsx
git commit -m "feat(planner): PlannerBar sticky bottom with item count"
```

---

## Task 6: /plan 페이지

**Files:**
- Create: `app/plan/page.tsx`

**Interfaces:**
- Consumes: `decodePlan()`, `Plan`, `TYPE_LABELS`, `planUrl()` from `lib/planner.ts`
- Consumes: `usePlanner()` from `PlannerContext`

- [ ] **Step 1: `app/plan/page.tsx` 작성**

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { decodePlan, TYPE_LABELS, planUrl, encodePlan } from "@/lib/planner";
import type { Plan, PlanItem, PlanItemType } from "@/lib/planner";
import { usePlanner } from "@/components/PlannerContext";

function PlannerContent() {
  const params = useSearchParams();
  const { plan: localPlan, remove, setTitle, clear } = usePlanner();

  const shared = params.get("d") ? decodePlan(params.get("d")!) : null;
  const plan: Plan = shared ?? localPlan;
  const isShared = !!shared;

  const [copied, setCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  const grouped = (Object.keys(TYPE_LABELS) as PlanItemType[]).map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: plan.items.filter((i) => i.type === type),
  })).filter((g) => g.items.length > 0);

  function copyLink() {
    const url = `${window.location.origin}${planUrl(plan)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function kakaoShare() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${planUrl(plan)}`;
    window.open(`https://sharer.kakao.com/talk/friends/picker/link?app_key=&url=${encodeURIComponent(url)}`, "_blank");
  }

  if (plan.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <h1 className="text-2xl font-black mb-3">플래너가 비어있어요</h1>
        <p className="text-[var(--muted)] mb-6">맛집, 클리닉, 웰니스 페이지에서 "+ 플래너에 추가"를 눌러 여행 코스를 만들어보세요.</p>
        <a href="/" className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition">
          맛집 둘러보기 →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 제목 */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">🗺️</span>
        {editingTitle && !isShared ? (
          <input
            autoFocus
            defaultValue={plan.title}
            onBlur={(e) => { setTitle(e.target.value); setEditingTitle(false); }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="text-2xl font-black border-b-2 border-orange-500 outline-none bg-transparent"
          />
        ) : (
          <h1
            className={`text-2xl font-black ${!isShared ? "cursor-pointer hover:text-orange-600 transition" : ""}`}
            onClick={() => !isShared && setEditingTitle(true)}
            title={!isShared ? "클릭해서 제목 편집" : undefined}
          >
            {plan.title}
            {!isShared && <span className="text-sm text-[var(--muted)] font-normal ml-2">✏️</span>}
          </h1>
        )}
      </div>

      {/* 카테고리별 리스트 */}
      <div className="space-y-6 mb-10">
        {grouped.map(({ type, label, items }) => (
          <section key={type}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)] mb-3">
              {label} ({items.length})
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <PlanItemRow key={`${type}-${item.id}`} item={item} isShared={isShared} onRemove={() => remove(item.id, item.type)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 공유 버튼 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-black text-white font-bold px-5 py-3 rounded-full hover:bg-gray-800 transition"
        >
          {copied ? "✓ 복사됨!" : "🔗 링크 복사"}
        </button>
        <button
          onClick={kakaoShare}
          className="flex items-center gap-2 bg-[#FEE500] text-black font-bold px-5 py-3 rounded-full hover:opacity-90 transition"
        >
          💬 카카오톡 공유
        </button>
      </div>

      {!isShared && (
        <button onClick={clear} className="text-sm text-[var(--muted)] hover:text-red-500 transition">
          플래너 초기화
        </button>
      )}
    </div>
  );
}

function PlanItemRow({ item, isShared, onRemove }: { item: PlanItem; isShared: boolean; onRemove: () => void }) {
  const href = item.type === "restaurant"
    ? `/restaurants/${item.city ?? "bangkok"}/${(item.district ?? "other").toLowerCase().replace(/\s+/g, "-")}/${item.id}`
    : item.type === "clinic"
    ? `/clinics/${item.id}`
    : `/dental/${item.id}`;

  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-orange-300 transition">
      <a href={href} className="min-w-0 flex-1">
        <div className="font-bold text-sm truncate">{item.name}</div>
        <div className="text-xs text-[var(--muted)]">
          {item.district && <span>📍 {item.district}</span>}
          {item.rating && <span className="ml-2">★ {item.rating.toFixed(1)}</span>}
        </div>
      </a>
      {!isShared && (
        <button onClick={onRemove} className="text-[var(--muted)] hover:text-red-500 text-xl leading-none transition" aria-label="제거">
          ×
        </button>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense>
      <PlannerContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 3: dev 서버로 /plan 확인**

```bash
cd web-thaigle && npm run dev
```
브라우저에서 `http://localhost:3000` → 레스토랑 카드에서 "+ 플래너에 추가" 클릭 → 하단 바 뜨는지 확인 → "플래너 보기" 클릭 → /plan 페이지 확인

- [ ] **Step 4: 커밋**

```bash
git add web-thaigle/app/plan/page.tsx
git commit -m "feat(planner): /plan page with URL decode + share"
```

---

## Task 7: /plan OG 이미지

**Files:**
- Create: `app/plan/opengraph-image.tsx`

**Interfaces:**
- Consumes: `decodePlan()` from `lib/planner.ts`

- [ ] **Step 1: `app/plan/opengraph-image.tsx` 작성**

```tsx
import { ImageResponse } from "next/og";
import { decodePlan, TYPE_LABELS } from "@/lib/planner";
import type { PlanItemType } from "@/lib/planner";
import { getSiteConfig } from "@/lib/site";

export const alt = "방콕 여행 플래너 — Thaigle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PlanOG({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const { d } = await searchParams;
  const plan = d ? decodePlan(d) : null;
  const cfg = getSiteConfig();

  const counts = plan
    ? (Object.keys(TYPE_LABELS) as PlanItemType[]).map((type) => ({
        label: TYPE_LABELS[type],
        count: plan.items.filter((i) => i.type === type).length,
      })).filter((x) => x.count > 0)
    : [];

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        background: "linear-gradient(135deg, #fff7ed 0%, white 60%)",
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
          {cfg.brand} — 방콕 여행 플래너
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.1, marginBottom: 32 }}>
          {plan?.title ?? "내 방콕 트립"}
        </div>
        {counts.length > 0 && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {counts.map((c) => (
              <div key={c.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#fff7ed", border: "2px solid #fed7aa",
                borderRadius: 100, padding: "10px 20px",
                fontSize: 22, fontWeight: 700, color: "#c2410c",
              }}>
                {c.label} {c.count}
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: "auto", fontSize: 20, color: "#737373", fontWeight: 600 }}>
          thaigle.com
        </div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 2: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 3: 커밋**

```bash
git add web-thaigle/app/plan/opengraph-image.tsx
git commit -m "feat(planner): dynamic OG image for shared plan URLs"
```

---

## Task 8: 클리닉 데이터 export + 로더

**Files:**
- Create: `scripts/export-clinics.mjs`
- Create: `lib/clinics.ts`
- Create: `data/clinics.json` (스크립트 실행 후 생성)

**Interfaces:**
- Produces: `loadClinicDb(): Promise<ClinicDb>`, `Clinic` type

- [ ] **Step 1: `scripts/export-clinics.mjs` 작성**

```javascript
// scripts/export-clinics.mjs
// 실행: node scripts/export-clinics.mjs
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import { createInterface } from "readline";
import path from "path";

const CSV = path.join(process.cwd(), "..", "bangkok_clinics", "output", "clinics.csv");
const OUT = path.join(process.cwd(), "data", "clinics.json");

const rl = createInterface({ input: createReadStream(CSV) });
let headers = null;
const rows = [];

for await (const line of rl) {
  const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g)?.map((c) => c.replace(/^"|"$/g, "").trim()) ?? [];
  if (!headers) { headers = cols; continue; }
  const row = Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? ""]));
  if (!row.place_id || !row.name || row.business_status === "CLOSED_PERMANENTLY") continue;
  rows.push({
    id: row.place_id,
    name: row.name,
    type: row.primary_type || "clinic",
    address: row.formatted_address || "",
    lat: parseFloat(row.latitude) || null,
    lng: parseFloat(row.longitude) || null,
    phone: row.phone || "",
    website: row.website || "",
    rating: parseFloat(row.rating) || 0,
    total_reviews: parseInt(row.total_reviews) || 0,
    maps_url: row.maps_url || "",
  });
}

await writeFile(OUT, JSON.stringify({ generated_at: new Date().toISOString(), clinics: rows }, null, 2));
console.log(`✓ Exported ${rows.length} clinics → data/clinics.json`);
```

- [ ] **Step 2: 스크립트 실행**

```bash
cd web-thaigle && node scripts/export-clinics.mjs
```
Expected: `✓ Exported NNN clinics → data/clinics.json`

- [ ] **Step 3: `lib/clinics.ts` 작성**

```typescript
// lib/clinics.ts
import { promises as fs } from "node:fs";
import path from "node:path";

export type Clinic = {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string;
  rating: number;
  total_reviews: number;
  maps_url: string;
};

export type ClinicDb = {
  generated_at: string;
  clinics: Clinic[];
};

let _cache: ClinicDb | null = null;

export async function loadClinicDb(): Promise<ClinicDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(path.join(process.cwd(), "data", "clinics.json"), "utf-8");
  _cache = JSON.parse(raw) as ClinicDb;
  return _cache;
}

export function topClinicsByRating(clinics: Clinic[], n: number): Clinic[] {
  return [...clinics]
    .filter((c) => c.total_reviews >= 10)
    .sort((a, b) => b.rating * Math.log10(b.total_reviews + 1) - a.rating * Math.log10(a.total_reviews + 1))
    .slice(0, n);
}
```

- [ ] **Step 4: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 5: 커밋**

```bash
git add web-thaigle/scripts/export-clinics.mjs web-thaigle/lib/clinics.ts web-thaigle/data/clinics.json
git commit -m "feat(clinics): CSV → JSON export + data loader"
```

---

## Task 9: 덴탈 데이터 export + 로더

**Files:**
- Create: `scripts/export-dental.mjs`
- Create: `lib/dental.ts`
- Create: `data/dental.json` (스크립트 실행 후 생성)

**Interfaces:**
- Produces: `loadDentalDb(): Promise<DentalDb>`, `DentalClinic` type

- [ ] **Step 1: `scripts/export-dental.mjs` 작성**

```javascript
// scripts/export-dental.mjs
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import { createInterface } from "readline";
import path from "path";

const CSV = path.join(process.cwd(), "..", "dental_output", "bangkok", "clinics.csv");
const OUT = path.join(process.cwd(), "data", "dental.json");

const rl = createInterface({ input: createReadStream(CSV) });
let headers = null;
const rows = [];

for await (const line of rl) {
  const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g)?.map((c) => c.replace(/^"|"$/g, "").trim()) ?? [];
  if (!headers) { headers = cols; continue; }
  const row = Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? ""]));
  if (!row.place_id || !row.name || row.business_status === "CLOSED_PERMANENTLY") continue;
  rows.push({
    id: row.place_id,
    name: row.name,
    address: row.formatted_address || "",
    lat: parseFloat(row.latitude) || null,
    lng: parseFloat(row.longitude) || null,
    phone: row.phone || "",
    website: row.website || "",
    rating: parseFloat(row.rating) || 0,
    total_reviews: parseInt(row.total_reviews) || 0,
    maps_url: row.maps_url || "",
  });
}

await writeFile(OUT, JSON.stringify({ generated_at: new Date().toISOString(), clinics: rows }, null, 2));
console.log(`✓ Exported ${rows.length} dental clinics → data/dental.json`);
```

- [ ] **Step 2: 스크립트 실행**

```bash
cd web-thaigle && node scripts/export-dental.mjs
```

- [ ] **Step 3: `lib/dental.ts` 작성**

```typescript
// lib/dental.ts
import { promises as fs } from "node:fs";
import path from "node:path";

export type DentalClinic = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string;
  rating: number;
  total_reviews: number;
  maps_url: string;
};

export type DentalDb = {
  generated_at: string;
  clinics: DentalClinic[];
};

let _cache: DentalDb | null = null;

export async function loadDentalDb(): Promise<DentalDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(path.join(process.cwd(), "data", "dental.json"), "utf-8");
  _cache = JSON.parse(raw) as DentalDb;
  return _cache;
}

export function topDentalByRating(clinics: DentalClinic[], n: number): DentalClinic[] {
  return [...clinics]
    .filter((c) => c.total_reviews >= 5)
    .sort((a, b) => b.rating * Math.log10(b.total_reviews + 1) - a.rating * Math.log10(a.total_reviews + 1))
    .slice(0, n);
}
```

- [ ] **Step 4: tsc 확인 + 커밋**

```bash
cd web-thaigle && npx tsc --noEmit
git add web-thaigle/scripts/export-dental.mjs web-thaigle/lib/dental.ts web-thaigle/data/dental.json
git commit -m "feat(dental): CSV → JSON export + data loader"
```

---

## Task 10: /clinics 브라우저 페이지

**Files:**
- Create: `app/clinics/page.tsx`

**Interfaces:**
- Consumes: `loadClinicDb()`, `topClinicsByRating()` from `lib/clinics.ts`
- Consumes: `AddToPlannerButton` from `components/AddToPlannerButton.tsx`

- [ ] **Step 1: `app/clinics/page.tsx` 작성**

```tsx
import { loadClinicDb, topClinicsByRating } from "@/lib/clinics";
import { AddToPlannerButton } from "@/components/AddToPlannerButton";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Clinics — Aesthetic & Beauty",
  description: "Top-rated aesthetic clinics in Bangkok ranked by Google reviews. Botox, fillers, facials — verified ratings.",
};

export default async function ClinicsPage() {
  const db = await loadClinicDb();
  const top = topClinicsByRating(db.clinics, 50);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-widest mb-4">
          💉 Bangkok Clinics
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          Best Aesthetic Clinics in Bangkok
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          {db.clinics.length.toLocaleString()} clinics ranked by Google review rating and volume.
          Botox, fillers, facials, skin care — verified from real patient reviews.
        </p>
      </div>

      <div className="grid gap-3">
        {top.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between gap-4 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-pink-300 transition">
            <div className="flex items-center gap-4 min-w-0">
              <div className="text-2xl font-black tabular-nums text-[var(--muted)] shrink-0">#{i + 1}</div>
              <div className="min-w-0">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-xs text-[var(--muted)] truncate">{c.address.split(",").slice(-3, -1).join(",")}</div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-yellow-700 font-bold">★ {c.rating.toFixed(1)}</span>
                  <span className="text-[var(--muted)]">({c.total_reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
            <AddToPlannerButton item={{
              type: "clinic",
              id: c.id,
              name: c.name,
              rating: c.rating,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 3: 커밋**

```bash
git add web-thaigle/app/clinics/page.tsx
git commit -m "feat(clinics): /clinics browse page with planner integration"
```

---

## Task 11: /dental 브라우저 페이지

**Files:**
- Create: `app/dental/page.tsx`

**Interfaces:**
- Consumes: `loadDentalDb()`, `topDentalByRating()` from `lib/dental.ts`
- Consumes: `AddToPlannerButton`

- [ ] **Step 1: `app/dental/page.tsx` 작성**

```tsx
import { loadDentalDb, topDentalByRating } from "@/lib/dental";
import { AddToPlannerButton } from "@/components/AddToPlannerButton";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Dental Clinics — Top Rated",
  description: "Top-rated dental clinics in Bangkok. Implants, crowns, whitening — verified from real Google reviews.",
};

export default async function DentalPage() {
  const db = await loadDentalDb();
  const top = topDentalByRating(db.clinics, 50);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest mb-4">
          🦷 Bangkok Dental
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          Best Dental Clinics in Bangkok
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          {db.clinics.length.toLocaleString()} dental clinics ranked by Google review rating.
          Implants, crowns, whitening — significantly cheaper than Korea or Japan.
        </p>
      </div>

      <div className="grid gap-3">
        {top.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between gap-4 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-blue-300 transition">
            <div className="flex items-center gap-4 min-w-0">
              <div className="text-2xl font-black tabular-nums text-[var(--muted)] shrink-0">#{i + 1}</div>
              <div className="min-w-0">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-xs text-[var(--muted)] truncate">{c.address.split(",").slice(-3, -1).join(",")}</div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-yellow-700 font-bold">★ {c.rating.toFixed(1)}</span>
                  <span className="text-[var(--muted)]">({c.total_reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
            <AddToPlannerButton item={{
              type: "dental",
              id: c.id,
              name: c.name,
              rating: c.rating,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 3: 네비게이션에 클리닉/덴탈 링크 추가**

`app/layout.tsx` 네비 부분에 추가:
```tsx
// 기존 nav 링크들 사이에:
<a href="/clinics" className="hover:text-black hidden md:inline">Clinics</a>
<a href="/dental" className="hover:text-black hidden md:inline">Dental</a>
```

- [ ] **Step 4: sitemap.ts에 /clinics, /dental, /plan 추가**

`app/sitemap.ts` items 배열에:
```typescript
{ url: `${SITE}/clinics`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
{ url: `${SITE}/dental`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
{ url: `${SITE}/plan`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
```

- [ ] **Step 5: tsc 확인**

```bash
cd web-thaigle && npx tsc --noEmit
```

- [ ] **Step 6: 최종 커밋**

```bash
git add web-thaigle/app/dental/page.tsx web-thaigle/app/layout.tsx web-thaigle/app/sitemap.ts
git commit -m "feat(dental): /dental browse page + nav links + sitemap update"
```

---

## Task 12: 배포

- [ ] **Step 1: 데이터 파일 확인**

```bash
ls web-thaigle/data/
```
Expected: `master_db.json`, `slug-map.json`, `clinics.json`, `dental.json`

- [ ] **Step 2: 빌드 확인**

```bash
cd web-thaigle && npm run build
```
Expected: 에러 없음

- [ ] **Step 3: 프로덕션 배포**

```bash
cd web-thaigle && vercel --prod
```

---

## 다음 단계 (별도 플랜)

- **한국어 SEO 가이드** — `/ko/guide/방콕-4박5일`, `/ko/guide/방콕-클리닉` 등 6개 페이지
- **AEO 강화** — llms.txt 멀티카테고리, Structured data schema
- **웰니스/무에타이 데이터** — 내일 데이터 도착 후 Task 8-9 패턴 반복
- **Phase 2: 단축 URL** — `/p/ABC123` (Upstash Redis)
- **Phase 3: 계정** — 영구 플래너 저장
