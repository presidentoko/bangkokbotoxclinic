'use client'
import { useRef } from 'react'
import type { PetFood } from '@/lib/types'
import type { FoodGrade } from '@/lib/types'
import { getFoodGrade } from '@/lib/grading'

const GRADE_CFG: Record<FoodGrade, { bg1: string; bg2: string; color: string; label: string }> = {
  A: { bg1: '#f0fdf4', bg2: '#dcfce7', color: '#16a34a', label: 'ดีเยี่ยม' },
  B: { bg1: '#f7fee7', bg2: '#ecfccb', color: '#65a30d', label: 'ดี' },
  C: { bg1: '#fefce8', bg2: '#fef9c3', color: '#ca8a04', label: 'ปานกลาง' },
  D: { bg1: '#fff7ed', bg2: '#ffedd5', color: '#ea580c', label: 'ระวัง' },
  F: { bg1: '#fef2f2', bg2: '#fee2e2', color: '#dc2626', label: 'อันตราย' },
}

const DEFAULT_CFG = { bg1: '#f9fafb', bg2: '#f3f4f6', color: '#6b7280', label: 'กำลังวิเคราะห์' }

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 2) {
  const chars = text.split('')
  let line = ''
  let currentY = y
  let linesDrawn = 0
  for (const char of chars) {
    if (linesDrawn >= maxLines) break
    const testLine = line + char
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = char
      currentY += lineHeight
      linesDrawn++
    } else {
      line = testLine
    }
  }
  if (linesDrawn < maxLines) {
    ctx.fillText(line, x, currentY)
  }
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
    ctx.fillText(`เกรด ${grade ?? '?'} · ${cfg.label}`, cx, cy + 82)

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
      ctx.fillText(`ส่วนประกอบ ${total}รายการ${total > 20 ? ' (20 อันดับแรก)' : ''}`, cx, 438)
    }

    // 영양 정보
    ctx.fillStyle = '#374151'
    ctx.font = '15px sans-serif'
    ctx.fillText(`โปรตีน ${food.protein_dm}%  ·  AAFCO ${food.aafco_meets ? 'ผ่าน' : 'ไม่ผ่าน'}`, cx, 472)

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
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={download}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
      >
        📸 บันทึกการ์ดผล
      </button>
    </>
  )
}
