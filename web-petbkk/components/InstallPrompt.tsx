'use client'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('pwa-dismissed')) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      // Show after 30s of engagement
      setTimeout(() => setShow(true), 30000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show || dismissed) return null

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
      setDismissed(true)
    }
  }

  function handleDismiss() {
    setDismissed(true)
    setShow(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-orange-100 p-4 flex items-center gap-3">
      <div className="text-3xl flex-shrink-0">🐾</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900">เพิ่ม PetBKK ไปที่หน้าจอหลัก</p>
        <p className="text-xs text-gray-400 mt-0.5">เข้าถึงได้เร็วขึ้น ใช้งานได้แบบออฟไลน์</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={handleDismiss} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1">ไม่ใช่ตอนนี้</button>
        <button onClick={handleInstall} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors">
          ติดตั้ง
        </button>
      </div>
    </div>
  )
}
