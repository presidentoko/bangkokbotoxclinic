import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Species = 'dog' | 'cat'
type Size = 'small' | 'medium' | 'large'

function petAgeToHuman(species: Species, size: Size, ageYears: number): number {
  if (ageYears <= 0) return 0
  if (species === 'cat') {
    if (ageYears <= 2) return Math.round(ageYears * 15)
    return Math.round(2 * 15 + (ageYears - 2) * 4)
  }
  const perYear = size === 'small' ? 4 : size === 'medium' ? 5 : 6
  if (ageYears <= 2) return Math.round(ageYears * 15)
  return Math.round(2 * 15 + (ageYears - 2) * perYear)
}

export default async function OgImage({ searchParams }: { searchParams?: Promise<{ species?: string; size?: string; age?: string; name?: string }> }) {
  const sp = (await searchParams) ?? {}
  const species: Species = sp.species === 'cat' ? 'cat' : 'dog'
  const size: Size = sp.size === 'medium' || sp.size === 'large' ? sp.size : 'small'
  const age = Number(sp.age)

  if (!Number.isFinite(age) || age <= 0) {
    return new ImageResponse(
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ color: 'white', fontSize: 56, fontWeight: 900, display: 'flex' }}>🐾 คำนวณอายุน้อง</div>
      </div>,
      { width: 1200, height: 630 }
    )
  }

  const humanAge = petAgeToHuman(species, size, age)
  const name = sp.name

  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', position: 'relative',
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.9)', display: 'flex', marginBottom: 8 }}>
        🐾 อายุของน้อง
      </div>
      <div style={{ fontSize: 140, display: 'flex' }}>{species === 'dog' ? '🐕' : '🐈'}</div>
      {name && (
        <div style={{ fontSize: 36, fontWeight: 700, color: 'white', display: 'flex', marginTop: 8 }}>{name}</div>
      )}
      <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.8)', display: 'flex', marginTop: 12 }}>
        อายุ {age} ปี
      </div>
      <div style={{ fontSize: 110, fontWeight: 900, color: 'white', display: 'flex', marginTop: 8, lineHeight: 1 }}>
        {humanAge}
      </div>
      <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.85)', display: 'flex' }}>ปี ในอายุมนุษย์</div>
      <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', display: 'flex', position: 'absolute', bottom: 32 }}>
        ThailandPetHub.com
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
