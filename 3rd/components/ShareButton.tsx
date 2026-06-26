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
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

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
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:border-gray-500 flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
        </svg>
        Post
      </a>
    </div>
  )
}
