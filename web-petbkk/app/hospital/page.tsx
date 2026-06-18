import HospitalListClient from '@/components/HospitalListClient'

export default async function HospitalPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>
}) {
  const sp = await searchParams

  const filterParam = sp.filter
  const initialFilter =
    filterParam === '24h' || filterParam === 'emergency' || filterParam === 'surgery'
      ? (filterParam as '24h' | 'emergency' | 'surgery')
      : undefined

  return (
    <main>
      <h1 className="text-2xl font-black text-gray-900 mb-1">🏥 โรงพยาบาลสัตว์</h1>
      <p className="text-sm text-gray-400 mb-6">ค้นหาโรงพยาบาลสัตว์เลี้ยงใกล้คุณในกรุงเทพและปริมณฑล</p>
      <HospitalListClient initialFilter={initialFilter} initialQuery={sp.q ?? ''} />
    </main>
  )
}
