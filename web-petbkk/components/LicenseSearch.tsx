'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Search box over the DLD animal-clinic register.
 *
 * The data (≈560 KB raw, a fraction of that compressed) is fetched only when
 * this page is open, from public/data/vet-registry-search.json, which
 * scripts/build-registry-search.ts regenerates on every build.
 */

type Row = [name: string, province: string, district: string, cls: string, licence: string, slug: string]

const CLASS_SHORT: Record<string, string> = {
  '01': 'ไม่มีที่พักค้างคืน',
  '02': 'ค้างคืนได้ ≤10 ตัว',
  '03': 'ค้างคืนได้ >10 ตัว',
  '04': 'ไม่มีที่พักค้างคืน (สัตวแพทย์ชั้น 2)',
  gov: 'ของทางราชการ',
}

const MAX_RESULTS = 60

/** Spaces and dots vary between the register and signboards; ignore both. */
function fold(s: string): string {
  return s.toLowerCase().replace(/[\s.\-()]/g, '')
}

export default function LicenseSearch({ provinces }: { provinces: string[] }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [q, setQ] = useState('')
  const [province, setProvince] = useState('')

  useEffect(() => {
    let alive = true
    fetch('/data/vet-registry-search.json')
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { rows: Row[] }) => { if (alive) setRows(d.rows) })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [])

  const results = useMemo(() => {
    if (!rows) return []
    const needle = fold(q)
    if (needle.length < 2 && !province) return []
    return rows.filter(r =>
      (!province || r[1] === province) &&
      (needle.length < 2 || fold(r[0]).includes(needle) || fold(r[4]).includes(needle)),
    )
  }, [rows, q, province])

  return (
    <div className="bg-white border rounded-xl p-4 mb-6">
      <label htmlFor="lic-q" className="block text-sm font-semibold text-gray-800 mb-2">
        พิมพ์ชื่อคลินิก/โรงพยาบาลสัตว์ หรือเลขที่ใบอนุญาต
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="lic-q"
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="เช่น ทองหล่อ, 03-381/2567"
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          autoComplete="off"
        />
        <select
          value={province}
          onChange={e => setProvince(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
          aria-label="จังหวัด"
        >
          <option value="">ทุกจังหวัด</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="mt-4" aria-live="polite">
        {failed && <p className="text-sm text-red-600">โหลดข้อมูลทะเบียนไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง</p>}
        {!rows && !failed && <p className="text-sm text-gray-400">กำลังโหลดทะเบียน…</p>}
        {rows && results.length === 0 && (fold(q).length >= 2 || province) && (
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-medium">ไม่พบชื่อนี้ในทะเบียน</p>
            <p className="mt-1 text-gray-500">
              ชื่อที่จดทะเบียนมักต่างจากชื่อบนป้ายหรือบน Google Maps (เช่น ชื่อบริษัท หรือไม่มีคำว่า “โรงพยาบาลสัตว์”)
              ลองค้นด้วยคำที่สั้นลง หรือเลือกจังหวัดแล้วไล่ดู — การไม่พบในการค้นหาไม่ได้แปลว่าไม่มีใบอนุญาต
            </p>
          </div>
        )}
        {results.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-2">
              พบ {results.length.toLocaleString()} แห่ง{results.length > MAX_RESULTS ? ` · แสดง ${MAX_RESULTS} แห่งแรก` : ''}
            </p>
            <ul className="divide-y">
              {results.slice(0, MAX_RESULTS).map(r => (
                <li key={`${r[4]}|${r[0]}`} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{r[0]}</p>
                    <p className="text-xs text-gray-500">
                      {r[2]} · {r[1]} · {CLASS_SHORT[r[3]] ?? '—'}
                    </p>
                    {r[5] && (
                      <a href={`/hospital/${r[5]}`} className="text-xs text-emerald-700 hover:underline">
                        ดูเวลาทำการ เบอร์โทร และรีวิว →
                      </a>
                    )}
                  </div>
                  <span className="flex-shrink-0 font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-2 py-1">
                    {r[4]}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
