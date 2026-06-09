'use client'
import { useState, useEffect } from 'react'

export default function HospitalShareButtons() {
  const [copied, setCopied] = useState(false)
  const [href, setHref] = useState('')

  useEffect(() => {
    setHref(window.location.href)
  }, [])

  const lineUrl = href ? `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(href)}` : '#'

  const copyLink = async () => {
    if (!href) return
    try {
      await navigator.clipboard.writeText(href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="flex gap-2 mt-3">
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-center bg-[#06C755] hover:bg-[#05b34b] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        LINE แชร์
      </a>
      <button
        onClick={copyLink}
        className="flex-1 text-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        {copied ? '✓ คัดลอกแล้ว' : '🔗 คัดลอกลิงก์'}
      </button>
    </div>
  )
}
