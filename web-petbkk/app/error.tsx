'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="max-w-lg mx-auto text-center py-16">
      <p className="text-6xl mb-4">😿</p>
      <h1 className="text-xl font-black text-gray-900 mb-2">เกิดข้อผิดพลาดบางอย่าง</h1>
      <p className="text-sm text-gray-400 mb-8">ลองใหม่อีกครั้ง หรือกลับไปหน้าหลัก</p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm"
        >
          🔄 ลองใหม่
        </button>
        <a
          href="/"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          ← หน้าหลัก
        </a>
      </div>
    </main>
  )
}
