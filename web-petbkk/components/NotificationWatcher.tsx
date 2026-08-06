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

      const body = due.map(r => `• ${r.name}`).join('\n')
      const title = '💉 PetBKK — วัคซีนน้องใกล้ถึงกำหนด'
      const opts: NotificationOptions = {
        body: `${body}\n\nไปดูตารางวัคซีนที่ PetBKK`,
        icon: '/icon.svg',
        tag: 'vaccine-reminder',
      }

      // Android Chrome throws on the bare `new Notification()` constructor, so
      // go through the service worker first. Only mark the day as notified once
      // one of the paths actually resolved — otherwise a failure would silently
      // suppress the reminder for the rest of the day.
      const markNotified = () => localStorage.setItem('vaccineNotifiedDate', todayStr)

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then(reg => reg.showNotification(title, opts))
          .then(markNotified)
          .catch(() => {
            try {
              new Notification(title, opts)
              markNotified()
            } catch {}
          })
      } else {
        try {
          new Notification(title, opts)
          markNotified()
        } catch {}
      }
    } catch {}
  }, [])

  return null
}
