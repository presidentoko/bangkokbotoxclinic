'use client'
import { useState, useEffect } from 'react'
import { isSaved, toggleSaved } from '@/lib/savedHospitals'

interface Props {
  hospitalId: string
  size?: 'sm' | 'md'
}

export default function SaveHospitalButton({ hospitalId, size = 'sm' }: Props) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isSaved(hospitalId))
    const handler = () => setSaved(isSaved(hospitalId))
    window.addEventListener('savedHospitalsUpdate', handler)
    return () => window.removeEventListener('savedHospitalsUpdate', handler)
  }, [hospitalId])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleSaved(hospitalId)
    window.dispatchEvent(new Event('savedHospitalsUpdate'))
  }

  const dim = size === 'sm' ? 'w-7 h-7 text-base' : 'w-9 h-9 text-lg'

  return (
    <button
      onClick={handleClick}
      title={saved ? 'ลบออกจากรายการบันทึก' : 'บันทึกโรงพยาบาล'}
      className={`${dim} rounded-full flex items-center justify-center transition-colors ${
        saved ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 bg-white'
      }`}
    >
      {saved ? '❤️' : '🤍'}
    </button>
  )
}
