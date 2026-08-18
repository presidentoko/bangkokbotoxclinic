import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A1A1A',
          color: '#FAFAF9',
        }}
      >
        <div style={{ fontSize: 76, letterSpacing: 4, color: '#B8954A', display: 'flex' }}>SecondLuxuryItems</div>
        <div style={{ fontSize: 32, marginTop: 24, color: '#E8E2D9', display: 'flex' }}>
          Pre-Owned Luxury Price Guide
        </div>
      </div>
    ),
    { ...size }
  )
}
