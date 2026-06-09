import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', position: 'relative',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        display: 'flex',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        display: 'flex',
      }} />

      <div style={{ fontSize: 100, marginBottom: 20, display: 'flex' }}>🐾</div>
      <div style={{
        fontSize: 80, fontWeight: 900, color: 'white',
        letterSpacing: -2, display: 'flex',
      }}>
        PetBKK
      </div>
      <div style={{
        fontSize: 32, color: 'rgba(255,255,255,0.85)',
        marginTop: 16, textAlign: 'center', display: 'flex',
      }}>
        ตรวจสอบอาหาร · หาโรงพยาบาลสัตว์ · ดูแลน้องครบจบ
      </div>
      <div style={{
        marginTop: 40, padding: '12px 32px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: 50, fontSize: 24, color: 'white', fontWeight: 700,
        border: '2px solid rgba(255,255,255,0.4)',
        display: 'flex',
      }}>
        ThailandPetHub.com — ฟรี 100%
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
