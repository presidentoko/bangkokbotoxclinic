import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getRanking, RANKING_KEYS, RankingKey, ValueModel, usd, pct, VALUE_GENERATED, monthLabel } from '@/lib/value'

const BASE = 'https://www.chicpreowned.com'

interface Props { params: Promise<{ locale: string; ranking: string }> }

export function generateStaticParams() {
  return RANKING_KEYS.flatMap(ranking => ['en', 'th'].map(locale => ({ locale, ranking })))
}

export const dynamicParams = false

const COPY: Record<RankingKey, {
  en: { title: string; h1: string; intro: string; metric: string }
  th: { title: string; h1: string; intro: string; metric: string }
}> = {
  'value-retention': {
    en: {
      title: 'Which Designer Bags Hold Their Value? Resale Retention Index',
      h1: 'Designer resale value retention index',
      intro: 'Every model we track, ranked by what it actually sells for pre-owned as a share of its current US retail price.',
      metric: 'Resale ÷ retail',
    },
    th: {
      title: 'กระเป๋าแบรนด์เนมรุ่นไหนรักษามูลค่าดีที่สุด — ดัชนีมูลค่าขายต่อ',
      h1: 'ดัชนีการรักษามูลค่าของแบรนด์เนมมือสอง',
      intro: 'ทุกรุ่นที่เราติดตาม เรียงตามราคาที่ขายได้จริงเทียบกับราคาป้ายปัจจุบันในสหรัฐ',
      metric: 'ราคาขายต่อ ÷ ราคาป้าย',
    },
  },
  'biggest-depreciation': {
    en: {
      title: 'Designer Bags That Lose the Most Value — Depreciation Index',
      h1: 'Biggest depreciation: designer models that resell furthest below retail',
      intro: 'The same index, read from the other end: the models that lose the largest share of their retail price on the resale market — and therefore the cheapest to buy pre-owned.',
      metric: 'Lost vs retail',
    },
    th: {
      title: 'แบรนด์เนมที่มูลค่าลดลงมากที่สุด — ดัชนีค่าเสื่อม',
      h1: 'รุ่นที่ราคาขายต่อต่ำกว่าราคาป้ายมากที่สุด',
      intro: 'รุ่นที่เสียมูลค่ามากที่สุดเมื่อขายต่อ — จึงคุ้มที่สุดถ้าซื้อมือสอง',
      metric: 'ลดลงจากราคาป้าย',
    },
  },
  'under-retail': {
    en: {
      title: 'Like-New Designer Bags Selling Under Retail — Biggest Savings',
      h1: 'Like-new for less than retail',
      intro: 'Never-worn examples that sold below the boutique price, ranked by the discount. This is condition-matched: the comparison is a new bag from the store against an unused one from a reseller.',
      metric: 'Like-new ÷ retail',
    },
    th: {
      title: 'แบรนด์เนมสภาพเหมือนใหม่ที่ขายต่ำกว่าราคาป้าย',
      h1: 'สภาพเหมือนใหม่ แต่ถูกกว่าราคาป้าย',
      intro: 'ของที่ยังไม่เคยใช้แต่ขายได้ต่ำกว่าราคาในช็อป เรียงตามส่วนลด',
      metric: 'สภาพใหม่ ÷ ราคาป้าย',
    },
  },
}

function metric(key: RankingKey, m: ValueModel): string {
  if (key === 'under-retail') return pct(m.like_new_vs_retail)
  if (key === 'biggest-depreciation') return pct(100 - (m.retention ?? 0))
  return pct(m.retention)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, ranking } = await params
  setRequestLocale(locale)
  if (!RANKING_KEYS.includes(ranking as RankingKey)) return {}
  const c = COPY[ranking as RankingKey][locale === 'th' ? 'th' : 'en']
  const rows = getRanking(ranking as RankingKey)
  const top = rows.slice(0, 3).map(m => `${m.brand} ${m.name} (${metric(ranking as RankingKey, m)})`).join(', ')
  const path = `/index/${ranking}`
  return {
    title: `${c.title} (${monthLabel(VALUE_GENERATED.slice(0, 7), locale)})`,
    description: `${c.intro} ${top}.`.slice(0, 300),
    alternates: {
      canonical: `${BASE}/${locale}${path}`,
      languages: { en: `${BASE}/en${path}`, th: `${BASE}/th${path}`, 'x-default': `${BASE}/en${path}` },
    },
  }
}

export default async function RankingPage({ params }: Props) {
  const { locale, ranking } = await params
  setRequestLocale(locale)
  if (!RANKING_KEYS.includes(ranking as RankingKey)) notFound()
  const key = ranking as RankingKey
  const th = locale === 'th'
  const L = (en: string, thai: string) => (th ? thai : en)
  const c = COPY[key][th ? 'th' : 'en']
  const rows = getRanking(key)
  const url = `${BASE}/${locale}/index/${key}`
  const month = monthLabel(VALUE_GENERATED.slice(0, 7), locale)

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: c.h1,
      description: c.intro,
      url,
      dateModified: VALUE_GENERATED,
      creator: { '@type': 'Organization', name: 'Chic Pre-Owned', url: BASE },
      isBasedOn: 'https://www.vestiairecollective.com',
      variableMeasured: c.metric,
      license: 'https://creativecommons.org/licenses/by/4.0/',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: c.h1,
      itemListElement: rows.slice(0, 50).map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${m.brand} ${m.name}`,
        url: `${BASE}/${locale}/value/${m.slug}`,
      })),
    },
  ]

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{L('Home', 'หน้าแรก')}</Link> › <Link href={`/${locale}/value`}>{L('Resale value', 'มูลค่าขายต่อ')}</Link>
      </p>
      <h1 className="text-3xl sm:text-4xl font-serif mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{c.h1}</h1>
      <p className="text-lg mb-2">{c.intro}</p>
      <p className="text-sm text-[#6B6052] mb-6">
        {L(`${rows.length} models · data for ${month} · updated monthly`, `${rows.length} รุ่น · ข้อมูล ${month} · อัปเดตทุกเดือน`)}
      </p>

      <nav className="flex flex-wrap gap-3 text-sm mb-6">
        {RANKING_KEYS.map(k => (
          <Link key={k} href={`/${locale}/index/${k}`}
            className={`px-3 py-1 rounded-full border ${k === key ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[#E8E2D9]'}`}>
            {COPY[k][th ? 'th' : 'en'].metric}
          </Link>
        ))}
      </nav>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="text-left text-[#6B6052] border-b border-[#E8E2D9]">
            <tr>
              <th className="py-2 pr-2">#</th>
              <th className="pr-2">{L('Model', 'รุ่น')}</th>
              <th className="pr-2">{L('US retail', 'ราคาป้าย')}</th>
              <th className="pr-2">{key === 'under-retail' ? L('Like-new median', 'สภาพใหม่ (กลาง)') : L('Median sold', 'ขายได้ (กลาง)')}</th>
              <th className="pr-2">{c.metric}</th>
              <th>{L('Sales', 'จำนวน')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr key={m.slug} className="border-b border-[#F0EBE3]">
                <td className="py-2 pr-2 text-[#6B6052]">{i + 1}</td>
                <td className="pr-2"><Link className="underline" href={`/${locale}/value/${m.slug}`}>{m.brand} {m.name}</Link></td>
                <td className="pr-2">{usd(m.retail?.usd)}</td>
                <td className="pr-2">{usd(key === 'under-retail' ? m.grades.A?.median : m.resale.median)}</td>
                <td className="pr-2 font-medium">{metric(key, m)}</td>
                <td>{key === 'under-retail' ? m.grades.A?.n : m.resale.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="text-sm text-[#6B6052] mt-10 space-y-2">
        <h2 className="font-medium text-[#1A1A1A]">{L('Method', 'วิธีคำนวณ')}</h2>
        <p>{L(`Resale prices are medians of sold listings on Vestiaire Collective's US marketplace, matched to the exact size of each model; listings that don't state a size, exotic skins and accessories are excluded. A model is ranked only with at least 20 sales and a current US retail price we could source — the source is linked on each model's page. Discontinued models are left out because their last retail price is years old.`,
          'ราคาขายต่อคือค่ากลางของรายการที่ขายแล้วบน Vestiaire Collective สหรัฐ จับคู่ตามขนาดของแต่ละรุ่น จัดอันดับเฉพาะรุ่นที่ขายได้อย่างน้อย 20 ครั้งและมีราคาป้ายที่ยืนยันแหล่งที่มาได้')}</p>
        <p>{L('Free to cite with a link to this page. The table updates monthly; quote the month.', 'อ้างอิงได้โดยลิงก์มาที่หน้านี้ ระบุเดือนของข้อมูล')}</p>
      </section>
    </main>
  )
}
