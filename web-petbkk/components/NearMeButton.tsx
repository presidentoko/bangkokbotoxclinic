'use client'
import { useState } from 'react'

interface Props {
  onLocation: (lat: number, lng: number) => void
  active: boolean
  onClear: () => void
}

export default function NearMeButton({ onLocation, active, onClear }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  function handleClick() {
    setError(null)
    if (active) { onClear(); return }
    if (!navigator.geolocation) {
      setError('เบราว์เซอร์ไม่รองรับ GPS')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLoading(false)
        onLocation(pos.coords.latitude, pos.coords.longitude)
      },
      () => {
        setLoading(false)
        setError('ไม่สามารถระบุตำแหน่งได้')
      },
      { timeout: 8000 }
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors disabled:opacity-50 ${
          active
            ? 'bg-green-500 text-white border-green-500'
            : 'bg-white hover:bg-green-50 hover:border-green-300'
        }`}
      >
        {loading ? '...' : '📍'} {loading ? 'กำลังค้นหา...' : active ? 'ใกล้ฉัน ✓' : 'ใกล้ฉัน'}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
