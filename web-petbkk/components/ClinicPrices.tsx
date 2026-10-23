import { KIND_TH, PRICES_CHECKED, formatPrice, type PriceItem } from '@/lib/clinicPrices'

/**
 * The clinic's own published prices, each with what it includes and a link to
 * where the clinic says it. Shown only for the 42 clinics that publish any.
 */
function thaiDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${Number(m[1]) + 543}`
}

export default function ClinicPrices({ items }: { items: PriceItem[] }) {
  const chain = items.some(i => i.chain)
  return (
    <section className="mb-4 bg-white border rounded-xl p-4">
      <h2 className="text-base font-bold text-gray-900 mb-1">ราคาที่คลินิกประกาศเอง</h2>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        จากเว็บไซต์ของคลินิก ตรวจสอบกับหน้าต้นทางเมื่อ {thaiDate(PRICES_CHECKED)}
        {chain && ' · เป็นราคาที่เครือประกาศ แต่ละสาขาอาจต่างกัน'}
        {' '}· ราคาเปลี่ยนได้ ควรสอบถามก่อนนัด
      </p>
      <ul className="divide-y divide-gray-100">
        {items.map((it, i) => (
          <li key={i} className="py-3 first:pt-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-gray-800">
                {it.service === 'other' && it.note ? it.note : it.service_th}
                {it.service !== 'other' && it.note && <span className="font-normal text-gray-500"> · {it.note}</span>}
              </span>
              <span className="shrink-0 text-right">
                <span className="text-sm font-bold text-gray-900 tabular-nums">{formatPrice(it)}</span>
                {it.regular && (
                  <span className="block text-xs text-gray-400 line-through tabular-nums">{it.regular.toLocaleString('th-TH')} บาท</span>
                )}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="inline-block px-1.5 py-0.5 mr-1.5 rounded bg-gray-100 text-gray-600">{KIND_TH[it.kind]}</span>
              {it.includes && <>รวม: {it.includes}</>}
              {it.includes && it.excludes && ' · '}
              {it.excludes && <span className="text-amber-700">ไม่รวม: {it.excludes}</span>}
            </p>
            <a href={it.url} target="_blank" rel="noopener nofollow" className="text-xs text-blue-600 hover:underline">
              ดูที่หน้าเว็บของคลินิก →
            </a>
          </li>
        ))}
      </ul>
      <a href="/hospital/prices" className="mt-3 inline-block text-xs font-semibold text-orange-700 hover:underline">
        เทียบราคากับคลินิกอื่น →
      </a>
    </section>
  )
}
