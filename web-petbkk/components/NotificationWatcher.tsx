'use client'
import { useEffect } from 'react'

export default function NotificationWatcher() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    try {
      const raw = localStorage.getItem('vaccineReminders')
      if (!raw) return
      const reminders: Array<{ name: string; dateIso: string }> = JSON.parse(raw)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const due = reminders.filter(r => {
        const d = new Date(r.dateIso)
        d.setHours(0, 0, 0, 0)
        const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000)
        return diffDays >= -3 && diffDays <= 7
      })

      if (due.length === 0) return

      // Only notify once per day
      const lastNotified = localStorage.getItem('vaccineNotifiedDate')
      const todayStr = today.toISOString().split('T')[0]
      if (lastNotified === todayStr) return
      localStorage.setItem('vaccineNotifiedDate', todayStr)

      const body = due.map(r => `• ${r.name}`).join('\n')
      try {
        new Notification('💉 PetBKK — วัคซีนน้องใกล้ถึงกำหนด', {
          body: `${body}\n\nไปดูตารางวัคซีนที่ PetBKK`,
          icon: '/icon.svg',
          tag: 'vaccine-reminder',
        })
      } catch {}
    } catch {}
  }, [])

  return null
}
