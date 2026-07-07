import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BREEDS, getBreedBySlug } from '@/lib/breeds'
import RelatedGuides from '@/components/RelatedGuides'

export const dynamicParams = false

export function generateStaticParams() {
  return BREEDS.map(b => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const breed = getBreedBySlug(slug)
  if (!breed) return { title: 'ไม่พบข้อมูลสายพันธุ์' }
  return {
    title: `${breed.name} — นิสัย ราคา และการดูแล`,
    description: `${breed.name} มีนิสัยอย่างไร ราคาเท่าไหร่ เหมาะกับใคร และควรระวังโรคอะไรบ้าง อ่านคู่มือฉบับเต็ม`,
    alternates: { canonical: `https://www.thailandpethub.com/breeds/${slug}` },
    keywords: [breed.name, `${breed.name} ราคา`, `${breed.name} นิสัย`, 'สายพันธุ์สัตว์เลี้ยง'],
    openGraph: {
      title: `${breed.name} — นิสัย ราคา และการดูแล`,
      description: breed.traits,
      url: `https://www.thailandpethub.com/breeds/${slug}`,
    },
  }
}

function BreedJsonLd({ breed, slug }: { breed: ReturnType<typeof getBreedBySlug>; slug: string }) {
  if (!breed) return null
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'สายพันธุ์', item: 'https://www.thailandpethub.com/breeds' },
      { '@type': 'ListItem', position: 3, name: breed.name },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${breed.name} ราคาเท่าไหร่?`,
        acceptedAnswer: { '@type': 'Answer', text: `${breed.name} มีราคาประมาณ ${breed.priceRange} ขึ้นอยู่กับสายเลือดและฟาร์ม` },
      },
      {
        '@type': 'Question',
        name: `${breed.name} เหมาะกับใคร?`,
        acceptedAnswer: { '@type': 'Answer', text: breed.goodFor },
      },
      {
        '@type': 'Question',
        name: `${breed.name} ต้องระวังโรคอะไรบ้าง?`,
        acceptedAnswer: { '@type': 'Answer', text: `ควรเฝ้าระวัง ${breed.watch} เป็นพิเศษ` },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

export default async function BreedDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const breed = getBreedBySlug(slug)
  if (!breed) notFound()

  const animalLabel = breed.animal === 'dog' ? '🐕 สุนัข' : '🐱 แมว'

  return (
    <main className="max-w-2xl mx-auto">
      <BreedJsonLd breed={breed} slug={slug} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/breeds" className="hover:text-orange-600">สายพันธุ์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">{breed.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{breed.icon}</span>
        <h1 className="text-2xl font-black text-gray-900">{breed.name}</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full">{animalLabel}</span>
        <span className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full">📏 ขนาด {breed.size}</span>
        <span className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full">⚡ พลังงาน {breed.energy}</span>
        <span className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full">🪮 ดูแลขน {breed.grooming}</span>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-4">
        <h2 className="font-black text-gray-900 text-base mb-3">ลักษณะนิสัย</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{breed.longDesc}</p>
      </section>

      <section className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4">
        <h2 className="font-black text-red-700 text-base mb-2">⚠️ โรคที่ควรเฝ้าระวัง</h2>
        <p className="text-sm text-red-600">{breed.watch}</p>
      </section>

      <section className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
        <h2 className="font-black text-green-700 text-base mb-2">✅ เหมาะกับใคร</h2>
        <p className="text-sm text-green-700">{breed.goodFor}</p>
      </section>

      <section className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 text-center">
        <p className="text-sm text-gray-500 mb-1">ราคาโดยประมาณ</p>
        <p className="text-2xl font-black text-orange-600">{breed.priceRange}</p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href={breed.animal === 'dog' ? '/food/dog' : '/food/cat'} className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">
          🍖 อาหารที่เหมาะสม
        </a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          🏥 หาโรงพยาบาล
        </a>
        <a href="/breeds" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          ← สายพันธุ์อื่นๆ
        </a>
      </div>

      <RelatedGuides current="breeds" count={4} />
    </main>
  )
}
