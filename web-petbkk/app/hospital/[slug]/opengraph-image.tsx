import { ImageResponse } from 'next/og'
import { getHospitalBySlug, loadHospitals } from '@/lib/hospitals'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return loadHospitals().map(h => ({ slug: h.id }))
}

function getRatingColor(rating: number | null): string {
  if (rating == null) return '#6b7280'
  if (rating >= 4.5) return '#16a34a'
  if (rating >= 4.0) return '#65a30d'
  if (rating >= 3.5) return '#ca8a04'
  return '#6b7280'
}

function getRatingBg(rating: number | null): string {
  if (rating == null) return '#f9fafb'
  if (rating >= 4.5) return '#f0fdf4'
  if (rating >= 4.0) return '#f7fee7'
  if (rating >= 3.5) return '#fefce8'
  return '#f9fafb'
}

export default async function og({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const h = getHospitalBySlug(slug)

  if (!h) {
    return new ImageResponse(
      <div
        style={{
          background: '#fff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex' }}>ไม่พบข้อมูล</div>
      </div>,
      { ...size }
    )
  }

  const ratingColor = getRatingColor(h.google_rating)
  const bgColor = getRatingBg(h.google_rating)
  const ratingText = h.google_rating != null ? h.google_rating.toFixed(1) : 'N/A'
  const showEnName = h.name_en && h.name_en !== h.name_th
  const reviewCountText = h.google_review_count != null
    ? `${h.google_review_count.toLocaleString()} รีวิว`
    : ''

  // Build badge labels as a plain string to avoid conditional children
  const badgeParts: string[] = []
  if (h.is_24h) badgeParts.push('24 ชม.')
  if (h.has_surgery) badgeParts.push('ผ่าตัด')
  const badgeText = badgeParts.join('  ·  ')

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'sans-serif',
        padding: '64px',
        gap: '48px',
      }}
    >
      {/* Left side */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 44,
            fontWeight: 900,
            color: '#111827',
            lineHeight: 1.2,
            marginBottom: '12px',
          }}
        >
          {h.name_th}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: 'rgba(17,24,39,0.65)',
            marginBottom: '12px',
          }}
        >
          {showEnName ? h.name_en : ''}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: 'rgba(17,24,39,0.5)',
            lineHeight: 1.5,
            marginBottom: '28px',
          }}
        >
          {h.address}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: '#374151',
            fontWeight: 600,
            marginBottom: '16px',
          }}
        >
          {badgeText}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: '#9ca3af',
            marginTop: 'auto',
          }}
        >
          ThailandPetHub.com
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexShrink: 0,
          width: '240px',
        }}
      >
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: `6px solid ${ratingColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
            fontWeight: 900,
            color: ratingColor,
          }}
        >
          {ratingText}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 16,
            color: '#6b7280',
            fontWeight: 600,
          }}
        >
          คะแนน Google
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: '#374151',
            fontWeight: 700,
          }}
        >
          {reviewCountText}
        </div>
      </div>
    </div>,
    { ...size }
  )
}
