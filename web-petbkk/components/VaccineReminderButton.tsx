'use client'
import { useState } from 'react'

interface ReminderItem {
  name: string
  dateIso: string
}

interface Props {
  items: Array<{ name: string; dueDate: Date; status: string }>
}

export default function VaccineReminderButton({ items }: Props) {
  const [state, setState] = useState<'idle' | 'saved' | 'denied'>('idle')

  const upcoming = items.filter(i => i.status === 'due-soon' || i.status === 'upcoming')
  if (upcoming.length === 0) return null

  async function handleClick() {
    if (!('Notification' in window)) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      setState('denied')
      return
    }

    const reminders: ReminderItem[] = upcoming.map(i => ({
      name: i.name,
      dateIso: i.dueDate.toISOString(),
    }))
    try {
      localStorage.setItem('vaccineReminders', JSON.stringify(reminders))
    } catch {}

    // Show confirmation notification
    try {
      new Notification('PetBKK — บันทึกการแจ้งเตือนแล้ว 🐾', {
        body: `บันทึก ${reminders.length} รายการวัคซีนแล้ว เราจะแจ้งเตือนเมื่อใกล้ถึงกำหนด`,
        icon: '/icon.svg',
        tag: 'vaccine-saved',
      })
    } catch {}

    setState('saved')
  }

  if (state === 'saved') {
    return (
      <p className="text-green-600 text-sm font-medium text-center py-2">
        ✅ บันทึกแจ้งเตือน {upcoming.length} รายการแล้ว
      </p>
    )
  }

  if (state === 'denied') {
    return (
      <p className="text-red-500 text-xs text-center py-2">
        กรุณาเปิดอนุญาตการแจ้งเตือนในการตั้งค่าเบราว์เซอร์
      </p>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="w-full mt-3 px-4 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
    >
      🔔 แจ้งเตือนวัคซีน ({upcoming.length} รายการ)
    </button>
  )
}
