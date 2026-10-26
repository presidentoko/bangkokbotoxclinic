import type { ClinicProvided as Info } from '@/lib/clinicProvided'

/**
 * The clinic's own information, shown as the clinic's: a blue box with the
 * date it was confirmed and the page it came from, never mixed into the
 * measured sections below it.
 */
function thaiDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${Number(m[1]) + 543}`
}

export default function ClinicProvided({ info }: { info: Info }) {
  return (
    <section className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
      <h2 className="text-base font-bold text-gray-900 mb-1">ข้อมูลจากโรงพยาบาล</h2>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        โรงพยาบาลยืนยันข้อมูลกับเราเมื่อ {thaiDate(info.confirmed)} · ที่มา{' '}
        <a href={info.source} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{info.source_label}</a>
      </p>

      {info.summary && <p className="text-sm text-gray-700 leading-relaxed mb-3">{info.summary}</p>}

      {info.centers && info.centers.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1.5">ศูนย์เฉพาะทาง {info.centers.length} ศูนย์</h3>
          <ul className="flex flex-wrap gap-1.5">
            {info.centers.map(c => (
              <li key={c} className="px-2 py-1 bg-white border border-blue-100 rounded-full text-xs text-gray-700">{c}</li>
            ))}
          </ul>
        </div>
      )}

      {((info.equipment?.length ?? 0) > 0 || (info.certifications?.length ?? 0) > 0) && (
        <p className="text-sm text-gray-700 mb-3">
          {info.equipment && info.equipment.length > 0 && <>เครื่องมือ: {info.equipment.join(', ')}</>}
          {info.equipment?.length && info.certifications?.length ? ' · ' : ''}
          {info.certifications && info.certifications.length > 0 && <>มาตรฐาน: {info.certifications.join(', ')}</>}
        </p>
      )}

      {info.specialists && info.specialists.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">สัตวแพทย์เฉพาะทาง (บางส่วน)</h3>
          <ul className="text-sm text-gray-700 space-y-0.5">
            {info.specialists.map(s => <li key={s.name}>{s.name} <span className="text-gray-500">· {s.field}</span></li>)}
          </ul>
        </div>
      )}

      {info.branches && info.branches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">สาขา</h3>
          <ul className="divide-y divide-blue-100">
            {info.branches.map(b => (
              <li key={b.name} className="py-2 text-sm">
                <span className="font-semibold text-gray-800">{b.name}</span>
                {b.hours && <span className="text-gray-500"> · {b.hours}</span>}
                <span className="block text-xs text-gray-500">{b.address}</span>
                <span className="block text-xs mt-0.5">
                  {b.phone && <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} className="text-blue-600 hover:underline">{b.phone}</a>}
                  {b.phone && b.line && ' · '}
                  {b.line && (b.line_url
                    ? <a href={b.line_url} target="_blank" rel="noopener" className="text-green-700 hover:underline">LINE {b.line}</a>
                    : <span>LINE {b.line}</span>)}
                </span>
              </li>
            ))}
          </ul>
          {info.call_center && (
            <p className="text-xs text-gray-500 mt-1">
              คอลเซ็นเตอร์ <a href={`tel:${info.call_center.replace(/[^\d+]/g, '')}`} className="text-blue-600 hover:underline">{info.call_center}</a>
            </p>
          )}
        </div>
      )}
    </section>
  )
}
