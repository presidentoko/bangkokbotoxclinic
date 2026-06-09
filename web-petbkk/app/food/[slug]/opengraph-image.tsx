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
  if (!food) return new ImageResponse(
    <div style={{ background: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
      ไม่พบสินค้า
    </div>,
    { ...size }
  )

  const grade = getFoodGrade(food)
  const cfg = grade ? GRADE_CFG[grade] : { bg: '#f9fafb', color: '#6b7280' }
  const total = food.green_count + food.yellow_count + food.red_count + food.black_count
  const greenDots = Math.min(food.green_count, 8)
  const yellowDots = Math.min(food.yellow_count, 4)
  const redDots = Math.min(food.red_count, 4)
  const statsText = (total > 0 ? `ส่วนประกอบ ${total} รายการ  ·  ` : '') +
    `โปรตีน ${food.protein_dm}%  ·  AAFCO ${food.aafco_meets ? '✅' : '❌'}`

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
      <div style={{ display: 'flex', fontSize: 22, color: '#374151' }}>
        <span>{statsText}</span>
      </div>

      {/* URL */}
      <div style={{ position: 'absolute', bottom: 40, right: 64, fontSize: 18, color: '#9ca3af' }}>
        petbkk.com
      </div>
    </div>,
    { ...size }
  )
}
