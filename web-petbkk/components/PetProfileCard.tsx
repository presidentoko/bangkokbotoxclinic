'use client'
import { useEffect, useRef, useState } from 'react'
import type { PetProfile } from '@/lib/types'

const SPECIES_EMOJI: Record<string, string> = { dog: '🐕', cat: '🐈' }
const STAGE_LABEL: Record<string, string> = { puppy: 'วัยเด็ก', adult: 'วัยผู้ใหญ่', senior: 'วัยชรา' }
const STAGE_COLOR: Record<string, string> = { puppy: '#f97316', adult: '#16a34a', senior: '#7c3aed' }

interface Props {
  profile: PetProfile
}

export default function PetProfileCard({ profile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 600, H = 400
    canvas.width = W
    canvas.height = H

    // Background: warm gradient
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#fff7ed')   // orange-50
    grad.addColorStop(0.5, '#ffedd5') // orange-100
    grad.addColorStop(1, '#fed7aa')   // orange-200
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Decorative circles
    ctx.fillStyle = 'rgba(249, 115, 22, 0.08)'
    ctx.beginPath(); ctx.arc(W - 80, 80, 140, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(80, H - 60, 90, 0, Math.PI * 2); ctx.fill()

    // Top banner strip
    const bannerGrad = ctx.createLinearGradient(0, 0, W, 0)
    bannerGrad.addColorStop(0, '#f97316')
    bannerGrad.addColorStop(1, '#fb923c')
    ctx.fillStyle = bannerGrad
    ctx.fillRect(0, 0, W, 56)

    // Banner text
    ctx.font = 'bold 18px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.fillText('🐾 บัตรประจำตัวน้อง', 24, 36)

    // Pet emoji (large)
    ctx.font = '120px serif'
    ctx.textAlign = 'center'
    ctx.fillText(SPECIES_EMOJI[profile.species] ?? '🐾', 150, 230)

    // Pet name
    ctx.font = 'bold 52px sans-serif'
    ctx.fillStyle = '#1c1917'
    ctx.textAlign = 'left'
    const displayName = profile.name || (profile.species === 'dog' ? 'น้องหมา' : 'น้องแมว')
    ctx.fillText(displayName, 260, 180)

    // Stage badge (rounded pill background)
    const stageLabel = STAGE_LABEL[profile.lifeStage] ?? profile.lifeStage
    const stageColor = STAGE_COLOR[profile.lifeStage] ?? '#f97316'
    ctx.font = 'bold 16px sans-serif'
    const stageW = ctx.measureText(stageLabel).width + 28
    ctx.fillStyle = stageColor
    ctx.beginPath()
    ;(ctx as CanvasRenderingContext2D & { roundRect: Function }).roundRect(260, 198, stageW, 30, 15)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.fillText(stageLabel, 274, 218)

    // Species line
    ctx.font = '22px sans-serif'
    ctx.fillStyle = '#78716c'
    ctx.textAlign = 'left'
    ctx.fillText(profile.species === 'dog' ? '🐕 สุนัข' : '🐈 แมว', 260, 262)

    // Divider
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(260, 280); ctx.lineTo(560, 280); ctx.stroke()

    // CTA
    ctx.font = '15px sans-serif'
    ctx.fillStyle = '#a8a29e'
    ctx.textAlign = 'left'
    ctx.fillText('ดูแลน้องด้วยเครื่องมือฟรีที่', 260, 310)

    ctx.font = 'bold 15px sans-serif'
    ctx.fillStyle = '#f97316'
    ctx.fillText('ThailandPetHub.com', 260, 333)

    // Bottom watermark
    ctx.font = '13px sans-serif'
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.textAlign = 'center'
    ctx.fillText('สร้างบัตรน้องของคุณได้ที่ www.thailandpethub.com', W / 2, H - 14)

  }, [profile])

  const shareText = `น้องของฉันชื่อ ${profile.name || (profile.species === 'dog' ? 'น้องหมา' : 'น้องแมว')} 🐾 ดูแลน้องครบจบที่ https://www.thailandpethub.com`

  function handleLine() {
    // LINE's lineit/share endpoint only reads `url` — it silently drops any `text` param.
    const url = encodeURIComponent('https://www.thailandpethub.com')
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank', 'noopener')
  }

  async function handleNativeShare() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(async blob => {
      if (!blob) return
      const file = new File([blob], 'pet-card.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `บัตรน้อง — ${profile.name || 'PetBKK'}`, text: shareText }).catch(() => {})
      }
    }, 'image/png')
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareText + '\n' + 'https://www.thailandpethub.com').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-sm mx-auto mt-4">
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl shadow-lg border border-orange-100"
        style={{ aspectRatio: '600/400' }}
      />
      <div className="flex gap-2 mt-3">
        <button onClick={handleLine} className="flex-1 py-2.5 bg-[#06C755] text-white font-bold rounded-xl text-sm hover:bg-[#05a847] transition-colors">
          LINE แชร์
        </button>
        <button onClick={handleNativeShare} className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors">
          📤 แชร์
        </button>
        <button onClick={handleCopy} className="px-4 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-200 transition-colors min-w-[52px]">
          {copied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  )
}
