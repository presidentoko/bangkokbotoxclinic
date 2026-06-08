import { notFound } from 'next/navigation'
import { getHospitalBySlug, loadHospitals } from '@/lib/hospitals'
import type { Metadata } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return loadHospitals().map(h => ({ slug: h.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const h = getHospitalBySlug(slug)
  return { title: h ? `${h.name_th} — PetBKK` : 'ไม่พบข้อมูล' }
}

function priceRow(label: string, value: number | null) {
  return (
    <tr key={label}>
      <td className="py-2 text-gray-600">{label}</td>
      <td className="py-2">{value != null ? <span className="font-medium">฿{value.toLocaleString()}</span> : <span className="text-gray-400">ไม่ระบุ</span>}</td>
    </tr>
  )
}

export default async function HospitalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const h = getHospitalBySlug(slug)
  if (!h) notFound()

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`

  return (
    <main className="max-w-2xl mx-auto">
      <a href="/hospital" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← กลับ
      </a>

      <div className="flex items-start justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">{h.name_th}</h1>
        {h.is_24h && (
          <span className="shrink-0 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            24 ชม.
          </span>
        )}
      </div>

      <div className="bg-white border rounded-xl p-4 mb-4 space-y-2 text-sm">
        <p>📍 {h.address}</p>
        {h.phone && <p>📞 {h.phone}</p>}
        {h.google_rating != null && (
          <p>⭐ {h.google_rating.toFixed(1)} ({h.google_review_count?.toLocaleString()} รีวิว)</p>
        )}
      </div>

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-3">ราคาโดยประมาณ</h2>
        <table className="w-full text-sm">
          <tbody>
            {priceRow('ค่าตรวจพื้นฐาน', h.price_consult)}
            {priceRow('ค่าฉุกเฉินเพิ่มเติม', h.price_emergency_surcharge)}
            {priceRow('ทำหมัน (ตัวผู้)', h.price_neuter_male)}
            {priceRow('ทำหมัน (ตัวเมีย)', h.price_neuter_female)}
            {priceRow('วัคซีนรวม', h.price_vaccine)}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-gray-400">* ราคาอาจเปลี่ยนแปลงได้ ควรโทรสอบถามก่อนเข้ารับบริการ</p>
      </section>

      <div className="flex gap-3">
        {h.phone && (
          <a
            href={`tel:${h.phone}`}
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            📞 โทรเลย
          </a>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-white hover:bg-gray-50 border-2 font-bold py-3 rounded-xl transition-colors"
        >
          🗺️ นำทาง
        </a>
      </div>
    </main>
  )
}
