import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BREEDS: Record<string, { name: string; icon: string; desc: string }> = {
  'shih-tzu':          { name: 'ชิห์สึ', icon: '🐕', desc: 'เงียบ รักการนอน เหมาะคอนโดมาก' },
  'golden-retriever':  { name: 'โกลเด้น รีทรีฟเวอร์', icon: '🐕', desc: 'ฉลาด เป็นมิตร ต้องการพื้นที่และออกกำลัง' },
  'toy-poodle':        { name: 'พูเดิล (ทอย)', icon: '🐩', desc: 'ฉลาด ฝึกง่าย ขนหลุดน้อย เหมาะมือใหม่' },
  'pomeranian':        { name: 'ปอมเมอเรเนียน', icon: '🐕', desc: 'น่ารัก สดใส คอนโดได้ แต่ต้องดูแลขน' },
  'thai-cat':          { name: 'แมวไทย/วิเชียรมาศ', icon: '🐱', desc: 'เป็นอิสระ ดูแลง่าย เหมาะคนยุ่ง' },
  'persian':           { name: 'เปอร์เซีย', icon: '🐱', desc: 'เงียบ สงบ สวยงาม แต่ต้องดูแลขนทุกวัน' },
  'british-shorthair': { name: 'บริติช ชอร์ตแฮร์', icon: '🐱', desc: 'สงบ เป็นอิสระ เลี้ยงง่าย เหมาะมือใหม่' },
  'scottish-fold':     { name: 'สก็อตติช โฟลด์', icon: '🐱', desc: 'หน้าตาน่ารัก สงบ ปรับตัวดี' },
  'rescue-cat':        { name: 'แมวรับเลี้ยง (Rescue)', icon: '💚', desc: 'รับเลี้ยงแมวบ้านจากมูลนิธิ' },
}

export default async function OgImage({ searchParams }: { searchParams?: Promise<{ b?: string }> }) {
  const sp = (await searchParams) ?? {}
  const breed = sp.b ? BREEDS[sp.b] : null

  if (!breed) {
    return new ImageResponse(
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ color: 'white', fontSize: 56, fontWeight: 900, display: 'flex' }}>🐾 สายพันธุ์ไหนเหมาะกับคุณ?</div>
      </div>,
      { width: 1200, height: 630 }
    )
  }

  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', position: 'relative', padding: '40px',
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'rgba(255,255,255,0.9)', display: 'flex', marginBottom: 8 }}>
        น้องที่เหมาะกับคุณ
      </div>
      <div style={{ fontSize: 150, display: 'flex' }}>{breed.icon}</div>
      <div style={{ fontSize: 56, fontWeight: 900, color: 'white', display: 'flex', marginTop: 8 }}>{breed.name}</div>
      <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.85)', display: 'flex', marginTop: 16, textAlign: 'center' }}>{breed.desc}</div>
      <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', display: 'flex', position: 'absolute', bottom: 32 }}>
        ThailandPetHub.com — แบบทดสอบสายพันธุ์
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
