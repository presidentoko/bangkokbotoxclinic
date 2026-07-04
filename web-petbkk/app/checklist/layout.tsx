import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เช็คลิสต์ดูแลสัตว์เลี้ยงประจำวัน — รายวัน รายสัปดาห์ รายเดือน',
  description: 'เช็คลิสต์ดูแลสัตว์เลี้ยงครบทุกด้าน แบ่งเป็นงานประจำวัน รายสัปดาห์ และรายเดือน ติ๊กถูกได้เลย ไม่ต้องสมัครสมาชิก',
  alternates: {
    canonical: 'https://www.thailandpethub.com/checklist',
  },
  openGraph: {
    title: 'เช็คลิสต์ดูแลสัตว์เลี้ยงประจำวัน',
    description: 'งานประจำวัน รายสัปดาห์ และรายเดือนที่ต้องทำเพื่อสัตว์เลี้ยง ติ๊กถูกได้เลย',
    url: 'https://www.thailandpethub.com/checklist',
    type: 'website',
  },
}

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
