'use client'
import { useState, useEffect, useCallback } from 'react'
import { getCompareIds, clearCompare } from '@/lib/compare'

export default function CompareTray() {
  const [ids, setIds] = useState<string[]>([])

  const refresh = useCallback(() => setIds(getCompareIds()), [])

  useEffect(() => {
    refresh()
    window.addEventListener('compareUpdate', refresh)
    return () => window.removeEventListener('compareUpdate', refresh)
  }, [refresh])

  if (ids.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 z-50" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))' }}>
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600 font-medium">
          เปรียบเทียบ: <span className="text-orange-600 font-bold">{ids.length}</span>/3 รายการ
        </p>
        <div className="flex gap-2">
          <a
            href={`/compare?ids=${ids.join(',')}`}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            เปรียบเทียบเลย →
          </a>
          <button
            onClick={() => { clearCompare(); setIds([]) }}
            className="px-3 py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            ล้าง
          </button>
        </div>
      </div>
    </div>
  )
}
