import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">หน้านี้ไม่มีอยู่ / Page not found</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/en" className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium">English</Link>
        <Link href="/th" className="bg-black text-white px-5 py-2.5 rounded text-sm font-medium">ภาษาไทย</Link>
      </div>
    </div>
  )
}
