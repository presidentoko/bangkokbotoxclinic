import { notFound } from 'next/navigation'
import { getFoodBySlug, loadFoods, getFoodGrade, getSimilarFoods, foodSlug } from '@/lib/petfood'
import { getFoodReviews } from '@/lib/petreviews'
import GradeBar from '@/components/GradeBar'
import IngredientGroups from '@/components/IngredientGroups'
import SimilarFoods from '@/components/SimilarFoods'
import ShareCard from '@/components/ShareCard'
import TrackRecentFood from '@/components/TrackRecentFood'
import PantipReviews from '@/components/PantipReviews'
import RelatedGuides from '@/components/RelatedGuides'
import type { Metadata } from 'next'
import type { FoodGrade, PetFood } from '@/lib/types'

export const dynamicParams = false

export function generateStaticParams() {
  return loadFoods().map(f => ({ slug: foodSlug(f) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) return { title: 'ไม่พบสินค้า' }
  const grade = getFoodGrade(food)
  const name = food.name_th || food.name_en
  return {
    // The root layout's title template already appends "| ThailandPetHub";
    // hardcoding a second brand here produced "… | PetBKK | ThailandPetHub",
    // which pushed the product name out of the truncated SERP title.
    title: `${food.brand} ${food.name_en}${grade ? ` — เกรด ${grade}` : ''}`,
    description: `ตรวจสอบส่วนประกอบ ${name} พร้อมเกรดคุณภาพ เปรียบเทียบโปรตีน ไขมัน และส่วนประกอบแต่ละชนิด`,
    alternates: {
      canonical: `https://www.thailandpethub.com/food/${slug}`,
    },
    openGraph: {
      title: `${food.brand} ${name}${grade ? ` — เกรด ${grade}` : ''}`,
      description: `ตรวจสอบส่วนประกอบ ${name} พร้อมเกรดคุณภาพ`,
      url: `https://www.thailandpethub.com/food/${slug}`,
      type: 'website',
    },
  }
}

function FoodProductJsonLd({ food, grade, slug }: { food: PetFood; grade: FoodGrade | null; slug: string }) {
  const gradeScore: Partial<Record<FoodGrade, number>> = { A: 5, B: 4, C: 3, D: 2, F: 1 }
  const ratingValue = grade ? gradeScore[grade] ?? 3 : 3
  const animalTh = food.animal === 'dog' ? 'สุนัข' : 'แมว'
  const stageTh: Record<string, string> = { puppy: 'ลูก', adult: 'ผู้ใหญ่', senior: 'สูงวัย' }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${food.brand} ${food.name_en}`,
    description: `อาหาร${animalTh}วัย${stageTh[food.life_stage] ?? food.life_stage} ${food.name_th || food.name_en} วิเคราะห์ส่วนประกอบโดย ThailandPetHub`,
    brand: { '@type': 'Brand', name: food.brand },
    url: `https://www.thailandpethub.com/food/${slug}`,
    ...(food.price_thb > 0 && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'THB',
        price: food.price_thb.toString(),
        availability: 'https://schema.org/InStock',
      },
    }),
    // This used to be an `aggregateRating` with `reviewCount: 1`. There are no
    // user reviews behind it — the value is this site's own ingredient grade —
    // and Google's review-snippet policy treats a self-assigned score published
    // as an aggregate of reviews as spammy structured markup, which is a manual
    // action risk across all 986 product pages.
    //
    // The same fact is legitimate as a single editorial `review` authored by the
    // publisher, which is what it actually is.
    ...(grade && {
      review: {
        '@type': 'Review',
        author: { '@type': 'Organization', name: 'ThailandPetHub' },
        reviewRating: {
          '@type': 'Rating',
          ratingValue,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: `เกรด ${grade} จากการวิเคราะห์ส่วนประกอบที่ระบุบนฉลาก โดยให้น้ำหนักกับลำดับและชนิดของแหล่งโปรตีน`,
      },
    }),
    ...(food.protein_dm > 0 || food.fat_dm > 0 ? {
      additionalProperty: [
        food.protein_dm > 0 ? { '@type': 'PropertyValue', name: 'โปรตีน (dry matter)', value: `${food.protein_dm.toFixed(1)}%` } : null,
        food.fat_dm > 0 ? { '@type': 'PropertyValue', name: 'ไขมัน (dry matter)', value: `${food.fat_dm.toFixed(1)}%` } : null,
        food.weight_kg > 0 ? { '@type': 'PropertyValue', name: 'น้ำหนักบรรจุ', value: `${food.weight_kg} กก.` } : null,
        food.price_per_kg > 0 ? { '@type': 'PropertyValue', name: 'ราคาต่อกิโลกรัม', value: `${Math.round(food.price_per_kg)} บาท` } : null,
      ].filter(Boolean),
    } : {}),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function BreadcrumbJsonLd({ name }: { name: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'อาหารสัตว์เลี้ยง', item: 'https://www.thailandpethub.com/food' },
      { '@type': 'ListItem', position: 3, name },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function FoodFaqJsonLd({ food, grade }: { food: PetFood; grade: FoodGrade | null }) {
  const name = food.name_th || food.name_en
  const animalTh = food.animal === 'dog' ? 'สุนัข' : 'แมว'
  const stageTh: Record<string, string> = { puppy: 'ลูก', adult: 'ผู้ใหญ่', senior: 'สูงวัย' }
  const topIngredients = food.ingredients.slice(0, 5).map(i => i.name).join(', ')

  const gradeReasons: Partial<Record<FoodGrade, string>> = {
    A: `ส่วนประกอบคุณภาพสูง ${food.green_count} รายการ ไม่มีสารที่เป็นอันตราย เหมาะเป็นอาหารหลัก`,
    B: `ส่วนประกอบดี ${food.green_count} รายการ มีส่วนที่ควรระวัง ${food.yellow_count} รายการ คุณภาพดี`,
    C: `มีส่วนประกอบดี ${food.green_count} ระวัง ${food.yellow_count} และไม่ดี ${food.red_count} รายการ ควรพิจารณาทางเลือกอื่น`,
    D: `มีส่วนประกอบที่ไม่ดี ${food.red_count} และอันตราย ${food.black_count} รายการ ไม่แนะนำเป็นอาหารหลัก`,
    F: `มีส่วนประกอบที่เป็นอันตราย ${food.black_count} รายการ ไม่แนะนำ`,
  }

  const faqs = [
    {
      q: `${name} มีส่วนผสมอะไรบ้าง?`,
      a: food.ingredients.length > 0
        ? `ส่วนผสมหลักของ ${name} ได้แก่ ${topIngredients}${food.ingredients.length > 5 ? ` และอีก ${food.ingredients.length - 5} รายการ` : ''}`
        : `ยังไม่มีข้อมูลส่วนผสมโดยละเอียด กรุณาตรวจสอบที่ฉลากผลิตภัณฑ์`,
    },
    {
      q: `${name} ได้เกรด ${grade ?? '?'} เพราะอะไร?`,
      a: grade && gradeReasons[grade] ? gradeReasons[grade]! : `ยังไม่มีข้อมูลส่วนประกอบเพียงพอสำหรับการให้เกรด`,
    },
    {
      q: `${name} เหมาะสำหรับ${animalTh}วัยอะไร?`,
      a: `${name} ออกแบบมาสำหรับ${animalTh}วัย${stageTh[food.life_stage] ?? food.life_stage}${food.aafco_meets ? ' และผ่านมาตรฐาน AAFCO' : ''}`,
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="mb-4 bg-white border rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">คำถามที่พบบ่อย</h2>
        <div className="space-y-3 divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-3' : ''}>
              <p className="font-semibold text-sm text-gray-800 mb-1">{f.q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function getConditionLinks(food: PetFood): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = []
  if (food.life_stage === 'puppy') {
    links.push(food.animal === 'cat'
      ? { href: '/kitten-care', label: '🐱 เลี้ยงลูกแมว' }
      : { href: '/puppy-care', label: '🐶 เลี้ยงลูกสุนัข' })
  } else if (food.life_stage === 'senior') {
    links.push({ href: '/senior-care', label: '👴 น้องสูงวัย' })
  }
  links.push(food.animal === 'cat'
    ? { href: '/cat-behavior', label: '🐱 พฤติกรรมแมว' }
    : { href: '/dog-behavior', label: '🐕 พฤติกรรมสุนัข' })
  links.push({ href: '/allergy', label: '🤧 แพ้อาหาร' })
  links.push({ href: '/obesity', label: '⚖️ น้องอ้วน' })
  return links
}

const GRADE_CONFIG: Record<FoodGrade, { color: string; bgCls: string; label: string }> = {
  A: { color: '#16a34a', bgCls: 'bg-green-500',  label: 'ดีเยี่ยม' },
  B: { color: '#65a30d', bgCls: 'bg-lime-500',   label: 'ดี' },
  C: { color: '#ca8a04', bgCls: 'bg-yellow-500', label: 'ปานกลาง' },
  D: { color: '#ea580c', bgCls: 'bg-orange-500', label: 'ระวัง' },
  F: { color: '#dc2626', bgCls: 'bg-red-500',    label: 'อันตราย' },
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = getFoodBySlug(slug)
  if (!food) notFound()

  const grade = getFoodGrade(food)
  const gradeCfg = grade ? GRADE_CONFIG[grade] : null
  const similar = getSimilarFoods(food)
  const total = food.green_count + food.yellow_count + food.red_count + food.black_count
  const pantipReview = getFoodReviews(food.id)
  const conditionLinks = getConditionLinks(food)

  return (
    <main className="max-w-2xl mx-auto">
      <FoodProductJsonLd food={food} grade={grade} slug={slug} />
      <TrackRecentFood foodId={food.id} />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-6">
        <a href="/" className="hover:text-orange-600 transition-colors">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href={`/food/${food.animal}`} className="hover:text-orange-600 transition-colors">
          {food.animal === 'cat' ? 'อาหารแมว' : 'อาหารสุนัข'}
        </a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">{food.brand}</span>
      </nav>

      {/* Header card */}
      <div className="bg-white rounded-2xl border p-6 mb-4">
        <p className="text-sm text-gray-500 mb-1">{food.brand}</p>
        <h1 className="text-2xl font-bold mb-4">{food.name_th || food.name_en}</h1>

        <div className="flex items-center gap-5 mb-4">
          {grade && gradeCfg ? (
            <div className={`w-16 h-16 rounded-full ${gradeCfg.bgCls} flex items-center justify-center text-white text-3xl font-black flex-shrink-0`}>
              {grade}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm flex-shrink-0">
              ?
            </div>
          )}
          <div>
            {grade && gradeCfg ? (
              <>
                <p className="font-bold text-lg" style={{ color: gradeCfg.color }}>เกรด {grade} · {gradeCfg.label}</p>
                <p className="text-sm text-gray-500">ส่วนประกอบ {total} รายการ · ดีเยี่ยม {food.green_count} รายการ</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">ยังไม่มีข้อมูลส่วนประกอบ</p>
            )}
          </div>
        </div>

        <GradeBar
          green={food.green_count}
          yellow={food.yellow_count}
          red={food.red_count}
          black={food.black_count}
          size="lg"
        />

        {/* Buy CTA — mirrors the bottom-of-page one so the affiliate link is above the fold */}
        {food.buy_url && (
          <a
            href={food.buy_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-4 w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors shadow-sm text-sm block"
          >
            🛒 ซื้อราคาถูกสุด
          </a>
        )}

        {/* Share section */}
        <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <ShareCard food={food} />
        </div>
      </div>

      {/* Nutrition section */}
      <section className="mb-4 bg-white border rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">คุณค่าทางโภชนาการ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">รายการ</th>
                <th className="pb-2">ตามฉลาก</th>
                <th className="pb-2">Dry Matter</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {/* 0 means the label never listed the value — "0%" would read as a real claim. */}
              <tr><td className="py-2">โปรตีน</td><td>{food.protein_pct > 0 ? `${food.protein_pct}%` : <span className="text-gray-400">—</span>}</td><td className="font-medium">{food.protein_dm > 0 ? `${food.protein_dm}%` : <span className="text-gray-400">—</span>}</td></tr>
              <tr><td className="py-2">ไขมัน</td><td>{food.fat_pct > 0 ? `${food.fat_pct}%` : <span className="text-gray-400">—</span>}</td><td className="font-medium">{food.fat_dm > 0 ? `${food.fat_dm}%` : <span className="text-gray-400">—</span>}</td></tr>
              <tr><td className="py-2">ใยอาหาร</td><td>{food.fiber_pct > 0 ? `${food.fiber_pct}%` : <span className="text-gray-400">—</span>}</td><td className="text-gray-400">—</td></tr>
              <tr><td className="py-2">ความชื้น</td><td>{food.moisture_pct > 0 ? `${food.moisture_pct}%` : <span className="text-gray-400">—</span>}</td><td className="text-gray-400">—</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-medium">
          AAFCO: {food.aafco_meets ? '✅ ผ่านเกณฑ์' : '❌ ไม่ผ่านเกณฑ์'}
        </p>
      </section>

      {/* Ingredients section */}
      {food.ingredients.length > 0 && (
        <section className="mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">ส่วนประกอบ ({food.ingredients.length} รายการ)</h2>
          <IngredientGroups ingredients={food.ingredients} />
        </section>
      )}

      {/* Pantip reviews */}
      {pantipReview && <PantipReviews review={pantipReview} />}

      {/* Similar foods */}
      {similar.length > 0 && (
        <div className="mb-4">
          <SimilarFoods foods={similar} />
        </div>
      )}

      <FoodFaqJsonLd food={food} grade={grade} />

      {/* Buy button */}
      {food.buy_url && (
        <a
          href={food.buy_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-colors shadow-sm text-base block"
        >
          🛒 ซื้อราคาถูกสุด
        </a>
      )}

      {/* Related conditions */}
      <div className="flex flex-wrap gap-2 mt-6">
        {conditionLinks.map(l => (
          <a key={l.href} href={l.href}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">
            {l.label}
          </a>
        ))}
      </div>

      <RelatedGuides current="food" count={4} />

      <BreadcrumbJsonLd name={food.name_th || food.name_en} />
    </main>
  )
}
