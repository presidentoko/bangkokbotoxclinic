import { loadFoods } from '@/lib/petfood'
import { loadHospitals } from '@/lib/hospitals'

export default function HomePage() {
  const foodCount = loadFoods().length
  const hospitalCount = loadHospitals().length

  return (
    <main className="flex flex-col items-center py-12 text-center">
      <h1 className="text-4xl font-bold mb-3">🐾 PetBKK</h1>
      <p className="text-gray-500 mb-12 text-lg max-w-md">
        ตรวจสอบส่วนประกอบอาหารสัตว์เลี้ยง และค้นหาโรงพยาบาลสัตว์ในกรุงเทพ
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <a
          href="/food"
          className="group bg-white border-2 border-orange-200 hover:border-orange-500 rounded-2xl p-8 transition-all hover:shadow-lg text-left"
        >
          <div className="text-4xl mb-4">🐾</div>
          <h2 className="text-xl font-bold mb-2">ตรวจสอบอาหาร</h2>
          <p className="text-gray-500 text-sm mb-4">
            เช็คส่วนประกอบ สัญญาณไฟ และความคุ้มค่าของอาหารสัตว์เลี้ยง
          </p>
          <p className="text-orange-600 font-semibold text-sm">
            {foodCount} ผลิตภัณฑ์ →
          </p>
        </a>

        <a
          href="/hospital"
          className="group bg-white border-2 border-blue-200 hover:border-blue-500 rounded-2xl p-8 transition-all hover:shadow-lg text-left"
        >
          <div className="text-4xl mb-4">🏥</div>
          <h2 className="text-xl font-bold mb-2">หาโรงพยาบาลสัตว์</h2>
          <p className="text-gray-500 text-sm mb-4">
            โรงพยาบาลสัตว์ 24 ชม. ใกล้คุณ พร้อมข้อมูลราคาเบื้องต้น
          </p>
          <p className="text-blue-600 font-semibold text-sm">
            {hospitalCount > 0 ? `${hospitalCount} โรงพยาบาล →` : 'เร็วๆ นี้ →'}
          </p>
        </a>
      </div>
    </main>
  )
}
