import { ImageResponse } from 'next/og'
import { getFoodBySlug, loadFoods, getFoodGrade } from '@/lib/petfood'
import type { FoodGrade } from '@/lib/types'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return loadFoods().map(f => ({ slug: f.id }))
}

const GRADE_BG: Record<FoodGrade, string> = {
  A: '#16a34a',
  B: '#65a30d',
  C: '#ca8a04',
  D: '#ea580c',
  F: '#dc2626',
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = getFoodBySlug(slug)

  if (!food) {
    return new ImageResponse(
      <div style={{
        width: '100%', height: '100%',
        background: '#f97316',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ color: 'white', fontSize: 48, fontWeight: 900, display: 'flex' }}>🐾 PetBKK</div>
      </div>,
      { width: 1200, height: 630 }
    )
  }

  const grade = getFoodGrade(food)
  const gradeBg = grade ? GRADE_BG[grade] : '#6b7280'

  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      padding: '60px', gap: '60px', fontFamily: 'sans-serif',
    }}>
      {/* Grade circle */}
      <div style={{
        width: 200, height: 200, borderRadius: '50%',
        background: gradeBg, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          color: 'white', fontSize: 100, fontWeight: 900, lineHeight: 1, display: 'flex',
        }}>
          {grade ?? '?'}
        </div>
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>
        <div style={{
          fontSize: 22, color: '#9a3412', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, display: 'flex',
        }}>
          {food.brand}
        </div>
        <div style={{
          fontSize: 44, fontWeight: 900, color: '#1c1917', lineHeight: 1.2, display: 'flex',
        }}>
          {food.name_th || food.name_en}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          {food.price_per_kg > 0 && (
            <div style={{ fontSize: 28, color: '#78716c', display: 'flex' }}>
              ฿{food.price_per_kg.toFixed(0)}/กก.
            </div>
          )}
          {food.protein_pct > 0 && (
            <div style={{ fontSize: 28, color: '#78716c', display: 'flex' }}>
              {food.protein_pct}% โปรตีน
            </div>
          )}
        </div>
        <div style={{
          fontSize: 24, color: '#f97316', fontWeight: 700, marginTop: 8, display: 'flex',
        }}>
          ThailandPetHub.com — ตรวจสอบอาหารสัตว์เลี้ยงฟรี
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
