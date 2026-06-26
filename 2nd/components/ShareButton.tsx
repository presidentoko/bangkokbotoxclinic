'use client'

import { useState } from 'react'

interface ShareButtonProps {
  title: string
  text: string
  url: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // user cancelled or error — fall through to clipboard
        await copyToClipboard()
      }
    } else {
      await copyToClipboard()
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <button
        onClick={handleShare}
        className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:border-gray-500 flex items-center gap-1.5"
        type="button"
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Link copied!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 1V9M7 1L4.5 3.5M7 1L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 8V11.5C2 11.7761 2.22386 12 2.5 12H11.5C11.7761 12 12 11.7761 12 11.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Share
          </>
        )}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:border-gray-500 flex items-center gap-1.5"
      >
        {/* X/Twitter icon */}
        <svg width="14" height="14" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
        </svg>
        Post
      </a>
    </div>
  )
}
