'use client'

import { useState } from 'react'

interface ShareButtonProps {
  title: string
  text: string
  url: string
  lineText?: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (_) {
        // user cancelled or API failed — silently ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (_) {}
    }
  }

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`

  return (
    <div className="flex flex-row gap-2 mb-6">
      <button
        onClick={handleShare}
        className="border border-gray-300 text-gray-700 text-sm rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
      >
        {copied ? 'Copied!' : 'Share'}
      </button>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#06C755] text-white text-sm font-medium rounded px-3 py-1.5 hover:bg-[#05b04c] transition-colors"
      >
        LINE
      </a>
    </div>
  )
}
