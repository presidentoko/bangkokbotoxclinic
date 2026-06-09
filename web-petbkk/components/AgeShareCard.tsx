'use client'
import { useEffect, useRef } from 'react'

interface Props {
  petAge: number
  humanAge: number
  species: 'dog' | 'cat'
  petName?: string
}

export default function AgeShareCard({ petAge, humanAge, species, petName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 600, H = 400
    canvas.width = W
    canvas.height = H

    // Background gradient: warm orange to amber
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#f97316')
    grad.addColorStop(1, '#f59e0b')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Decorative circles (subtle)
    ctx.fillStyle = 'rgba(255,255,255,0.07)'
    ctx.beginPath(); ctx.arc(W - 60, 60, 120, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(60, H - 40, 80, 0, Math.PI * 2); ctx.fill()

    // White card area
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.beginPath()
    const cardX = 40, cardY = 60, cardW = W - 80, cardH = 260
    ;(ctx as CanvasRenderingContext2D & { roundRect: Function }).roundRect(cardX, cardY, cardW, cardH, 24)
    ctx.fill()

    // Pet emoji (large)
    ctx.font = '80px serif'
    ctx.textAlign = 'center'
    ctx.fillText(species === 'dog' ? '🐕' : '🐈', W / 2, 170)

    // Pet name (if provided)
    if (petName) {
      ctx.font = 'bold 24px sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.textAlign = 'center'
      ctx.fillText(petName, W / 2, 210)
    }

    // Age line
    ctx.font = 'bold 20px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.textAlign = 'center'
    ctx.fillText(`อายุ ${petAge} ปี`, W / 2, petName ? 240 : 225)

    // Human age (BIG)
    ctx.font = 'bold 72px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(`${humanAge}`, W / 2, petName ? 310 : 295)

    // "ปีในมนุษย์" label
    ctx.font = '20px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.textAlign = 'center'
    ctx.fillText('ปี ในอายุมนุษย์', W / 2, petName ? 340 : 325)

    // Top label
    ctx.font = 'bold 18px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.textAlign = 'center'
    ctx.fillText('🐾 อายุของน้อง', W / 2, 45)

    // Bottom URL
    ctx.font = '14px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.textAlign = 'center'
    ctx.fillText('ThailandPetHub.com', W / 2, H - 16)

  }, [petAge, humanAge, species, petName])

  function handleShare() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(blob => {
      if (!blob) return
      const file = new File([blob], 'pet-age.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: `อายุน้อง ${petAge} ปี = ${humanAge} ปีในมนุษย์!`,
          text: `น้องของฉันอายุ ${petAge} ปี เทียบได้กับมนุษย์อายุ ${humanAge} ปีเลย! 🐾`,
          url: 'https://www.thailandpethub.com/age',
        }).catch(() => {})
      }
    }, 'image/png')
  }

  function handleCopy() {
    const shareText = `น้องของฉันอายุ ${petAge} ปี เทียบเท่ามนุษย์อายุ ${humanAge} ปีเลย! 🐾\nคำนวณอายุน้องได้ที่ https://www.thailandpethub.com/age`
    navigator.clipboard.writeText(shareText).catch(() => {})
  }

  function handleLine() {
    const text = encodeURIComponent(`น้องของฉันอายุ ${petAge} ปี เทียบเท่ามนุษย์อายุ ${humanAge} ปีเลย! 🐾 คำนวณอายุน้องได้ที่ https://www.thailandpethub.com/age`)
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent('https://www.thailandpethub.com/age')}&text=${text}`, '_blank')
  }

  return (
    <div className="mt-6">
      <p className="text-xs text-gray-400 text-center mb-3 font-medium">📸 บัตรอายุน้อง — แชร์ให้เพื่อน!</p>
      <canvas
        ref={canvasRef}
        className="w-full max-w-sm mx-auto block rounded-2xl shadow-lg"
        style={{ aspectRatio: '600/400' }}
      />
      <div className="flex gap-2 mt-3 max-w-sm mx-auto">
        <button
          onClick={handleLine}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#06C755] text-white font-bold rounded-xl text-sm hover:bg-[#05a847] transition-colors"
        >
          <span>LINE</span>
          <span>แชร์</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors"
        >
          📤 แชร์
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-200 transition-colors"
        >
          📋
        </button>
      </div>
    </div>
  )
}
