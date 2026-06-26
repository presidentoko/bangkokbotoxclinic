import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">This page doesn&apos;t exist yet.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/" className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium">Home</Link>
        <Link href="/handbags" className="border border-gray-300 px-6 py-2.5 rounded text-sm">Handbags</Link>
        <Link href="/watches" className="border border-gray-300 px-6 py-2.5 rounded text-sm">Watches</Link>
      </div>
    </div>
  )
}
