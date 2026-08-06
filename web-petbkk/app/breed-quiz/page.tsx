import type { Metadata } from 'next'
import BreedQuiz from '@/components/BreedQuiz'

// Reads `b` so a shared result URL gets the matching breed card from the
// /breed-quiz/og route handler — a file-convention opengraph-image never
// receives searchParams, so it could only ever emit the generic fallback.
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ b?: string }> }
): Promise<Metadata> {
  const { b } = await searchParams
  const ogUrl = b
    ? `https://www.thailandpethub.com/breed-quiz/og?b=${encodeURIComponent(b)}`
    : 'https://www.thailandpethub.com/breed-quiz/og'

  return {
    title: 'สายพันธุ์ไหนเหมาะกับคุณ? — แบบทดสอบ 4 คำถาม',
    description: 'แบบทดสอบหาสายพันธุ์สุนัขหรือแมวที่เหมาะกับไลฟ์สไตล์ของคุณ ตอบ 4 คำถาม รู้ผลทันที',
    alternates: { canonical: 'https://www.thailandpethub.com/breed-quiz' },
    keywords: ['แบบทดสอบสายพันธุ์', 'สายพันธุ์ที่เหมาะกับฉัน', 'ควรเลี้ยงอะไร', 'breed finder'],
    openGraph: {
      title: 'สายพันธุ์ไหนเหมาะกับคุณ? — แบบทดสอบ 4 คำถาม',
      description: 'ตอบ 4 คำถาม รู้ว่าน้องตัวไหนเหมาะกับคุณ แชร์ให้เพื่อน!',
      url: 'https://www.thailandpethub.com/breed-quiz',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
  }
}

export default function BreedQuizPage() {
  return (
    <main className="max-w-xl mx-auto">
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ค้นหาสายพันธุ์</span>
      </nav>
      <h1 className="text-3xl font-black text-gray-900 mb-2">🐾 สายพันธุ์ไหนเหมาะกับคุณ?</h1>
      <p className="text-gray-500 text-sm mb-8">ตอบ 4 คำถาม — เราจะแนะนำน้องที่ใช่สำหรับไลฟ์สไตล์ของคุณ</p>
      <BreedQuiz />
    </main>
  )
}
