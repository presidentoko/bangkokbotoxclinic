'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_GUIDES } from '@/lib/guides'

export default function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const q = query.trim()
  const matches = q.length > 0
    ? ALL_GUIDES.filter(g => g.title.includes(q) || g.desc.includes(q)).slice(0, 5)
    : []

  const submit = (target: 'food' | 'hospital') => {
    if (!q) return
    router.push(`/${target}?q=${encodeURIComponent(q)}`)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="ค้นหา"
          className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors"
        >
          🔍
        </button>
      ) : (
        <div className="absolute right-0 top-0 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
          <div className="flex items-center gap-2 px-2">
            <span className="text-gray-400">🔍</span>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit('food') }}
              placeholder="ค้นหาอาหาร โรงพยาบาล หรือคู่มือ..."
              className="flex-1 py-2.5 outline-none text-base text-gray-800 placeholder-gray-400 bg-transparent min-w-0"
            />
            <button
              onClick={() => { setOpen(false); setQuery('') }}
              aria-label="ปิด"
              className="flex items-center justify-center w-9 h-9 flex-shrink-0 text-gray-300 hover:text-gray-500"
            >
              ✕
            </button>
          </div>
          {q.length > 0 && (
            <div className="mt-1 border-t border-gray-50 pt-1 max-h-80 overflow-y-auto">
              {matches.map(g => (
                <a
                  key={g.key}
                  href={g.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-sm min-h-[44px]"
                >
                  <span>{g.icon}</span>
                  <span className="text-gray-700">{g.title}</span>
                </a>
              ))}
              <button
                onClick={() => submit('food')}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-sm text-left min-h-[44px]"
              >
                <span>🍖</span><span className="text-gray-600">ค้นหาอาหาร &ldquo;{q}&rdquo;</span>
              </button>
              <button
                onClick={() => submit('hospital')}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-sm text-left min-h-[44px]"
              >
                <span>🏥</span><span className="text-gray-600">ค้นหาโรงพยาบาล &ldquo;{q}&rdquo;</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
