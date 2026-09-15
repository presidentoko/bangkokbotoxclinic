import { getLicense, LICENSE_CLASS, LICENSE_SOURCE } from '@/lib/licenses'

/**
 * "Is this clinic licensed, and can it keep my animal overnight?"
 *
 * Rendered only when the clinic was matched to the DLD register. There is
 * deliberately no "not found" state: registered names differ from signboard
 * names often enough that a missing match says nothing about the clinic, and
 * printing "not in the register" next to a real business would be both wrong
 * and damaging. See lib/licenses.ts.
 */
export default function LicenseVerification({ hospitalId, displayName }: { hospitalId: string; displayName: string }) {
  const lic = getLicense(hospitalId)
  if (!lic) return null
  const cls = lic.license_class ? LICENSE_CLASS[lic.license_class] : null
  const nameDiffers = lic.registered_name.replace(/\s+/g, '') !== displayName.replace(/\s+/g, '')

  return (
    <section className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <h2 className="text-base font-bold text-emerald-900 mb-1">
        ✅ พบในทะเบียนสถานพยาบาลสัตว์ กรมปศุสัตว์
      </h2>
      <p className="text-xs text-emerald-800 mb-3">
        สถานพยาบาลสัตว์ทุกแห่งในไทยต้องได้รับใบอนุญาตตาม พ.ร.บ.สถานพยาบาลสัตว์ พ.ศ. 2533
      </p>
      <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-sm">
        <dt className="text-gray-500">เลขที่ใบอนุญาต</dt>
        <dd className="font-mono font-semibold text-gray-900">{lic.license_no}</dd>
        {cls && (
          <>
            <dt className="text-gray-500">ประเภท</dt>
            <dd className="text-gray-900">
              <span className="font-semibold">{lic.license_class}</span> · {cls.short}
            </dd>
          </>
        )}
        {nameDiffers && (
          <>
            <dt className="text-gray-500">ชื่อที่จดทะเบียน</dt>
            <dd className="text-gray-900">{lic.registered_name}</dd>
          </>
        )}
      </dl>
      {cls && <p className="mt-3 text-sm text-emerald-900 leading-relaxed">{cls.meaning}</p>}
      <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
        จับคู่จากชื่อและเขต/อำเภอกับ{' '}
        <a href={LICENSE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-700">
          รายชื่อสถานพยาบาลสัตว์ทั่วประเทศ
        </a>{' '}
        ของ{LICENSE_SOURCE.publisher} (ดึงข้อมูลเมื่อ {LICENSE_SOURCE.retrieved}) ·{' '}
        <a href="/hospital/license" className="underline hover:text-emerald-700">ค้นทะเบียนเอง</a> · หากข้อมูลไม่ตรง{' '}
        <a href="/contact" className="underline hover:text-emerald-700">แจ้งเราได้</a>
      </p>
    </section>
  )
}
