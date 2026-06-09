# PetBKK 사료 상세 + 공유카드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사료 상세 페이지를 등급 히어로 + 성분 신호등 + 비슷한 사료 + Canvas 공유카드 + OG 이미지로 업그레이드해 바이럴 루프를 만든다.

**Architecture:** `lib/petfood.ts`에 `getFoodGrade()` + `getSimilarFoods()` 추가 → 신규 컴포넌트 3개 (`IngredientGroups`, `SimilarFoods`, `ShareCard`) → 상세 페이지 리라이트 → OG 이미지 신규 생성.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4, TypeScript, Canvas 2D API (공유카드), `next/og` ImageResponse (OG 이미지)

**중요 컨텍스트:**
- 50개 사료 중 9개만 성분 데이터(green/yellow/red/black_count) 보유. `total=0`이면 grade=`null` 처리.
- `params`는 Next.js 16에서 `Promise<{ slug: string }>` 타입.
- 현재 `lib/types.ts`에 `Grade = 'green'|'yellow'|'red'|'black'`, `Ingredient = { name, grade, position }` 정의됨.

---

## File Map

| 파일 | 작업 |
|------|------|
| `web-petbkk/lib/petfood.ts` | `getFoodGrade()`, `getSimilarFoods()` 추가 |
| `web-petbkk/lib/types.ts` | `FoodGrade` 타입 추가 |
| `web-petbkk/components/IngredientGroups.tsx` | 신규 — 성분 신호등 그룹핑 (use client) |
| `web-petbkk/components/SimilarFoods.tsx` | 신규 — 비슷한 사료 가로 스크롤 카드 |
| `web-petbkk/components/ShareCard.tsx` | 신규 — Canvas 공유카드 + 다운로드 (use client) |
| `web-petbkk/app/food/[slug]/page.tsx` | 전체 리라이트 |
| `web-petbkk/app/food/[slug]/opengraph-image.tsx` | 신규 — 동적 OG 이미지 |

---

## Task 1: FoodGrade 타입 + lib 함수 추가

**Files:**
- Modify: `web-petbkk/lib/types.ts`
- Modify: `web-petbkk/lib/petfood.ts`

- [ ] **Step 1: `FoodGrade` 타입을 `lib/types.ts`에 추가**

`lib/types.ts` 맨 위에 한 줄 추가:

```ts
export type FoodGrade = 'A' | 'B' | 'C' | 'D' | 'F'
```

- [ ] **Step 2: `getFoodGrade()` 함수를 `lib/petfood.ts`에 추가**

`lib/petfood.ts` import 줄 아래에 추가:

```ts
import type { PetFood, FoodFilters, FoodGrade } from './types'
```

그리고 파일 끝에 추가:

```ts
export function getFoodGrade(food: PetFood): FoodGrade | null {
  const { black_count, red_count, green_count, yellow_count } = food
  const total = green_count + yellow_count + red_count + black_count
  if (total === 0) return null
  if (black_count >= 2) return 'F'
  if (black_count === 1) return 'D'
  if (red_count > 3) return 'D'
  if (red_count > 1) return 'C'
  if (red_count === 1) return 'B'
  const greenRatio = green_count / total
  if (greenRatio >= 0.7) return 'A'
  return 'B'
}
```

- [ ] **Step 3: `getSimilarFoods()` 함수를 `lib/petfood.ts`에 추가**

```ts
export function getSimilarFoods(food: PetFood, count = 3): PetFood[] {
  return loadFoods()
    .filter(f => f.id !== food.id && f.animal === food.animal && f.life_stage === food.life_stage)
    .sort((a, b) => {
      const totalA = Math.max(1, a.green_count + a.yellow_count + a.red_count + a.black_count)
      const totalB = Math.max(1, b.green_count + b.yellow_count + b.red_count + b.black_count)
      return (b.green_count / totalB) - (a.green_count / totalA)
    })
    .slice(0, count)
}
```

- [ ] **Step 4: TypeScript 체크**

```bash
cd web-petbkk && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/petfood.ts
git commit -m "feat(petbkk): add getFoodGrade and getSimilarFoods"
```

---

## Task 2: IngredientGroups 컴포넌트

**Files:**
- Create: `web-petbkk/components/IngredientGroups.tsx`

성분을 grade별로 그룹핑해 신호등 형태로 표시. 각 그룹 최대 5개 + 더보기 토글.

- [ ] **Step 1: 파일 생성**

```tsx
'use client'
import { useState } from 'react'
import type { Ingredient } from '@/lib/types'

const GRADE_CONFIG = {
  black:  { emoji: '⚫', label: '사용금지 성분', textCls: 'text-gray-900',   bgCls: 'bg-gray-100',   borderCls: 'border-gray-400' },
  red:    { emoji: '🔴', label: '위험 성분',    textCls: 'text-red-700',    bgCls: 'bg-red-50',     borderCls: 'border-red-200' },
  yellow: { emoji: '🟡', label: '주의 성분',    textCls: 'text-yellow-700', bgCls: 'bg-yellow-50',  borderCls: 'border-yellow-200' },
  green:  { emoji: '🟢', label: '우수 성분',    textCls: 'text-green-700',  bgCls: 'bg-green-50',   borderCls: 'border-green-200' },
} as const

type GradeKey = keyof typeof GRADE_CONFIG

function Group({ grade, items }: { grade: GradeKey; items: Ingredient[] }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = GRADE_CONFIG[grade]
  const visible = expanded ? items : items.slice(0, 5)

  return (
    <div className={`rounded-xl border p-3 ${cfg.bgCls} ${cfg.borderCls}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{cfg.emoji}</span>
        <span className={`text-sm font-semibold ${cfg.textCls}`}>
          {cfg.label} ({items.length}개)
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visible.map(i => (
          <span
            key={i.position}
            className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bgCls} ${cfg.borderCls} ${cfg.textCls}`}
          >
            {i.name}
          </span>
        ))}
      </div>
      {items.length > 5 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className={`mt-2 text-xs underline ${cfg.textCls}`}
        >
          {expanded ? '접기' : `+ ${items.length - 5}개 더보기`}
        </button>
      )}
    </div>
  )
}

interface Props {
  ingredients: Ingredient[]
}

export default function IngredientGroups({ ingredients }: Props) {
  const groups: Record<GradeKey, Ingredient[]> = {
    black:  ingredients.filter(i => i.grade === 'black'),
    red:    ingredients.filter(i => i.grade === 'red'),
    yellow: ingredients.filter(i => i.grade === 'yellow'),
    green:  ingredients.filter(i => i.grade === 'green'),
  }

  return (
    <div className="space-y-3">
      {groups.black.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-sm font-medium text-red-700">
          ⚠️ 사용 금지 성분이 포함되어 있습니다
        </div>
      )}
      {(['black', 'red', 'yellow', 'green'] as const).map(grade =>
        groups[grade].length > 0
          ? <Group key={grade} grade={grade} items={groups[grade]} />
          : null
      )}
    </div>
  )
}
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-petbkk && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add components/IngredientGroups.tsx
git commit -m "feat(petbkk): IngredientGroups component"
```

---

## Task 3: SimilarFoods 컴포넌트

**Files:**
- Create: `web-petbkk/components/SimilarFoods.tsx`

서버 컴포넌트. grade별 색상 적용, 가로 스크롤.

- [ ] **Step 1: 파일 생성**

```tsx
import type { PetFood } from '@/lib/types'
import type { FoodGrade } from '@/lib/types'
import { getFoodGrade } from '@/lib/petfood'

const GRADE_COLOR: Record<FoodGrade, string> = {
  A: 'text-green-600',
  B: 'text-lime-600',
  C: 'text-yellow-600',
  D: 'text-orange-600',
  F: 'text-red-600',
}

interface Props {
  foods: PetFood[]
}

export default function SimilarFoods({ foods }: Props) {
  if (!foods.length) return null

  return (
    <section>
      <h2 className="font-semibold mb-3">비슷한 사료</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {foods.map(f => {
          const grade = getFoodGrade(f)
          return (
            <a
              key={f.id}
              href={`/food/${f.id}`}
              className="flex-shrink-0 w-44 bg-white border rounded-xl p-3 hover:border-orange-300 transition-colors"
            >
              <p className="text-xs text-gray-400 mb-0.5">{f.brand}</p>
              <p className="text-sm font-medium leading-tight line-clamp-2 mb-2">
                {f.name_th || f.name_en}
              </p>
              {grade ? (
                <span className={`text-lg font-bold ${GRADE_COLOR[grade]}`}>{grade}</span>
              ) : (
                <span className="text-sm text-gray-400">분석 중</span>
              )}
            </a>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-petbkk && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add components/SimilarFoods.tsx
git commit -m "feat(petbkk): SimilarFoods component"
```

---

## Task 4: ShareCard 컴포넌트 (Canvas)

**Files:**
- Create: `web-petbkk/components/ShareCard.tsx`

순수 Canvas 2D API로 600×600 PNG 생성. 서버 의존성 없음.

- [ ] **Step 1: 파일 생성**

```tsx
'use client'
import { useRef } from 'react'
import type { PetFood } from '@/lib/types'
import type { FoodGrade } from '@/lib/types'
import { getFoodGrade } from '@/lib/petfood'

const GRADE_CFG: Record<FoodGrade, { bg1: string; bg2: string; color: string; label: string }> = {
  A: { bg1: '#f0fdf4', bg2: '#dcfce7', color: '#16a34a', label: '우수' },
  B: { bg1: '#f7fee7', bg2: '#ecfccb', color: '#65a30d', label: '양호' },
  C: { bg1: '#fefce8', bg2: '#fef9c3', color: '#ca8a04', label: '보통' },
  D: { bg1: '#fff7ed', bg2: '#ffedd5', color: '#ea580c', label: '주의' },
  F: { bg1: '#fef2f2', bg2: '#fee2e2', color: '#dc2626', label: '위험' },
}

const DEFAULT_CFG = { bg1: '#f9fafb', bg2: '#f3f4f6', color: '#6b7280', label: '분석 중' }

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = text.split('')
  let line = ''
  let currentY = y
  for (const char of chars) {
    const testLine = line + char
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = char
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
}

interface Props {
  food: PetFood
}

export default function ShareCard({ food }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grade = getFoodGrade(food)
  const cfg = grade ? GRADE_CFG[grade] : DEFAULT_CFG

  const draw = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = 600, H = 600
    canvas.width = W
    canvas.height = H

    // 배경 그라데이션
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, cfg.bg1)
    grad.addColorStop(1, cfg.bg2)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // PetBKK 로고 (좌상단)
    ctx.fillStyle = '#ea580c'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('🐾 PetBKK', 36, 52)

    // 브랜드
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px sans-serif'
    ctx.fillText(food.brand, 36, 110)

    // 사료 이름 (줄바꿈 처리)
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 22px sans-serif'
    wrapText(ctx, food.name_th || food.name_en, 36, 148, W - 72, 32)

    // 등급 원
    const cx = W / 2, cy = 295, r = 58
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = cfg.color
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.font = 'bold 54px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(grade ?? '?', cx, cy + 19)

    // 등급 레이블
    ctx.fillStyle = cfg.color
    ctx.font = 'bold 17px sans-serif'
    ctx.fillText(`등급 ${grade ?? '?'} · ${cfg.label}`, cx, cy + 82)

    // 성분 도트 (최대 20개)
    const total = food.green_count + food.yellow_count + food.red_count + food.black_count
    const dots = [
      ...Array(food.green_count).fill('#16a34a'),
      ...Array(food.yellow_count).fill('#ca8a04'),
      ...Array(food.red_count).fill('#dc2626'),
      ...Array(food.black_count).fill('#111827'),
    ].slice(0, 20)

    if (dots.length > 0) {
      const dotR = 7, dotGap = 20
      const startX = W / 2 - (dots.length * dotGap) / 2
      dots.forEach((color, i) => {
        ctx.beginPath()
        ctx.arc(startX + i * dotGap + dotR, 408, dotR, 0, Math.PI * 2)
        ctx.fillStyle = color as string
        ctx.fill()
      })
      ctx.fillStyle = '#374151'
      ctx.font = '14px sans-serif'
      ctx.fillText(`성분 ${total}개`, cx, 438)
    }

    // 영양 정보
    ctx.fillStyle = '#374151'
    ctx.font = '15px sans-serif'
    ctx.fillText(`단백질 ${food.protein_dm}%  ·  AAFCO ${food.aafco_meets ? '✅' : '❌'}`, cx, 472)

    // URL
    ctx.fillStyle = '#9ca3af'
    ctx.font = '13px sans-serif'
    ctx.fillText('petbkk.com', cx, 548)
    ctx.textAlign = 'left'
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    draw(canvas)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `petbkk-${food.id}-grade-${grade ?? 'unknown'}.png`
    a.click()
  }

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={download}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
      >
        📸 성적표 카드 저장
      </button>
    </>
  )
}
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-petbkk && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: Commit**

```bash
git add components/ShareCard.tsx
git commit -m "feat(petbkk): ShareCard Canvas component"
```

---

## Task 5: 사료 상세 페이지 리라이트

**Files:**
- Modify: `web-petbkk/app/food/[slug]/page.tsx`

- [ ] **Step 1: 전체 교체**

```tsx
import { notFound } from 'next/navigation'
import { getFoodBySlug, loadFoods, getFoodGrade, getSimilarFoods } from '@/lib/petfood'
import GradeBar from '@/components/GradeBar'
import IngredientGroups from '@/components/IngredientGroups'
import SimilarFoods from '@/components/SimilarFoods'
import ShareCard from '@/components/ShareCard'
import type { Metadata } from 'next'
import type { FoodGrade } from '@/lib/types'

export const dynamicParams = false

export function generateStaticParams() {
  return loadFoods().map(f => ({ slug: f.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) return { title: 'ไม่พบสินค้า' }
  const grade = getFoodGrade(food)
  return {
    title: `${food.brand} ${food.name_en} ${grade ? `— เกรด ${grade}` : ''} | PetBKK`,
    description: `ตรวจสอบส่วนประกอบ ${food.name_th || food.name_en} พร้อมเกรดคุณภาพ`,
  }
}

const GRADE_CONFIG: Record<FoodGrade, { color: string; bgCls: string; label: string }> = {
  A: { color: '#16a34a', bgCls: 'bg-green-500',  label: '우수' },
  B: { color: '#65a30d', bgCls: 'bg-lime-500',   label: '양호' },
  C: { color: '#ca8a04', bgCls: 'bg-yellow-500', label: '보통' },
  D: { color: '#ea580c', bgCls: 'bg-orange-500', label: '주의' },
  F: { color: '#dc2626', bgCls: 'bg-red-500',    label: '위험' },
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) notFound()

  const grade = getFoodGrade(food)
  const gradeCfg = grade ? GRADE_CONFIG[grade] : null
  const similar = getSimilarFoods(food)
  const total = food.green_count + food.yellow_count + food.red_count + food.black_count

  return (
    <main className="max-w-2xl mx-auto">
      <a href="/food" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← กลับ
      </a>

      {/* 등급 히어로 */}
      <div className="bg-white rounded-2xl border p-6 mb-4">
        <p className="text-sm text-gray-500 mb-1">{food.brand}</p>
        <h1 className="text-2xl font-bold mb-4">{food.name_th || food.name_en}</h1>

        <div className="flex items-center gap-5 mb-4">
          {grade && gradeCfg ? (
            <div className={`w-16 h-16 rounded-full ${gradeCfg.bgCls} flex items-center justify-center text-white text-3xl font-black flex-shrink-0`}>
              {grade}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm flex-shrink-0">
              ?
            </div>
          )}
          <div>
            {grade && gradeCfg ? (
              <>
                <p className="font-bold text-lg" style={{ color: gradeCfg.color }}>등급 {grade} · {gradeCfg.label}</p>
                <p className="text-sm text-gray-500">성분 {total}개 중 우수 {food.green_count}개</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">성분 분석 데이터 없음</p>
            )}
          </div>
        </div>

        <GradeBar
          green={food.green_count}
          yellow={food.yellow_count}
          red={food.red_count}
          black={food.black_count}
          size="lg"
        />

        <div className="mt-4">
          <ShareCard food={food} />
        </div>
      </div>

      {/* 영양 분석 */}
      <section className="mb-4 bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">คุณค่าทางโภชนาการ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">รายการ</th>
                <th className="pb-2">ตามฉลาก</th>
                <th className="pb-2">Dry Matter</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2">โปรตีน</td><td>{food.protein_pct}%</td><td className="font-medium">{food.protein_dm}%</td></tr>
              <tr><td className="py-2">ไขมัน</td><td>{food.fat_pct}%</td><td className="font-medium">{food.fat_dm}%</td></tr>
              <tr><td className="py-2">ใยอาหาร</td><td>{food.fiber_pct}%</td><td className="text-gray-400">—</td></tr>
              <tr><td className="py-2">ความชื้น</td><td>{food.moisture_pct}%</td><td className="text-gray-400">—</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-medium">
          AAFCO: {food.aafco_meets ? '✅ ผ่านเกณฑ์' : '❌ ไม่ผ่านเกณฑ์'}
        </p>
      </section>

      {/* 성분 신호등 */}
      {food.ingredients.length > 0 && (
        <section className="mb-4">
          <h2 className="font-semibold mb-3">ส่วนประกอบ ({food.ingredients.length} รายการ)</h2>
          <IngredientGroups ingredients={food.ingredients} />
        </section>
      )}

      {/* 비슷한 사료 */}
      {similar.length > 0 && (
        <div className="mb-4">
          <SimilarFoods foods={similar} />
        </div>
      )}

      {/* 구매 버튼 */}
      {food.buy_url && (
        <a
          href={food.buy_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors text-lg"
        >
          🛒 ซื้อราคาถูกสุด
        </a>
      )}
    </main>
  )
}
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-petbkk && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: dev 서버에서 브라우저 확인**

```bash
cd web-petbkk && npm run dev
```

확인:
- 성분 데이터 있는 사료 (`/food/royal-canin-...` 중 하나) 접속
- 등급 원 + GradeBar 보임
- "📸 성적표 카드 저장" 버튼 클릭 → PNG 다운로드
- 성분 그룹별로 신호등 카드 보임
- 비슷한 사료 가로 스크롤 카드 보임
- 성분 데이터 없는 사료 접속 → 등급 원 `?` + 성분 섹션 없음

- [ ] **Step 4: Commit**

```bash
git add app/food/[slug]/page.tsx
git commit -m "feat(petbkk): food detail page redesign — grade hero + ingredient groups + share card"
```

---

## Task 6: OG 이미지

**Files:**
- Create: `web-petbkk/app/food/[slug]/opengraph-image.tsx`

Next.js `ImageResponse` (서버사이드). 1200×630px.

- [ ] **Step 1: 파일 생성**

```tsx
import { ImageResponse } from 'next/og'
import { getFoodBySlug, loadFoods, getFoodGrade } from '@/lib/petfood'
import type { FoodGrade } from '@/lib/types'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamicParams = false

export function generateStaticParams() {
  return loadFoods().map(f => ({ slug: f.id }))
}

const GRADE_CFG: Record<FoodGrade, { bg: string; color: string }> = {
  A: { bg: '#f0fdf4', color: '#16a34a' },
  B: { bg: '#f7fee7', color: '#65a30d' },
  C: { bg: '#fefce8', color: '#ca8a04' },
  D: { bg: '#fff7ed', color: '#ea580c' },
  F: { bg: '#fef2f2', color: '#dc2626' },
}

export default async function og({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) return new ImageResponse(<div style={{ background: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>ไม่พบสินค้า</div>, { ...size })

  const grade = getFoodGrade(food)
  const cfg = grade ? GRADE_CFG[grade] : { bg: '#f9fafb', color: '#6b7280' }
  const total = food.green_count + food.yellow_count + food.red_count + food.black_count
  const greenDots = Math.min(food.green_count, 8)
  const yellowDots = Math.min(food.yellow_count, 4)
  const redDots = Math.min(food.red_count, 4)

  return new ImageResponse(
    <div
      style={{
        width: '100%', height: '100%',
        backgroundColor: cfg.bg,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '64px',
        fontFamily: 'sans-serif', position: 'relative',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px' }}>
        <span style={{ fontSize: 40, color: '#ea580c', fontWeight: 700 }}>🐾 PetBKK</span>
        {grade && (
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            backgroundColor: cfg.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 42, fontWeight: 900,
          }}>
            {grade}
          </div>
        )}
      </div>

      {/* 브랜드 + 이름 */}
      <div style={{ fontSize: 20, color: '#6b7280', marginBottom: '8px' }}>{food.brand}</div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#111827', marginBottom: '24px', lineHeight: 1.2, maxWidth: '900px' }}>
        {food.name_th || food.name_en}
      </div>

      {/* 성분 도트 */}
      {total > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {Array(greenDots).fill(0).map((_, i) => (
            <div key={`g${i}`} style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#16a34a' }} />
          ))}
          {Array(yellowDots).fill(0).map((_, i) => (
            <div key={`y${i}`} style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#ca8a04' }} />
          ))}
          {Array(redDots).fill(0).map((_, i) => (
            <div key={`r${i}`} style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#dc2626' }} />
          ))}
        </div>
      )}

      {/* 스탯 */}
      <div style={{ fontSize: 22, color: '#374151' }}>
        {total > 0 && `성분 ${total}개  · `}단백질 {food.protein_dm}%  ·  AAFCO {food.aafco_meets ? '✅' : '❌'}
      </div>

      {/* URL */}
      <div style={{ position: 'absolute', bottom: 40, right: 64, fontSize: 18, color: '#9ca3af' }}>
        petbkk.com
      </div>
    </div>,
    { ...size }
  )
}
```

- [ ] **Step 2: TypeScript 체크**

```bash
cd web-petbkk && npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 3: 빌드 확인**

```bash
cd web-petbkk && npm run build
```

Expected: `✓ Compiled successfully`, OG 이미지 포함 빌드 통과

- [ ] **Step 4: Commit**

```bash
git add app/food/[slug]/opengraph-image.tsx
git commit -m "feat(petbkk): dynamic OG image for food detail pages"
```
