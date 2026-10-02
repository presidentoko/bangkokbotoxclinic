import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import {
  getValueModels,
  getValueModel,
  GRADE_LABEL,
  Grade,
  ValueModel,
  usd,
  pct,
  soldWindow,
  siblings,
  retentionRank,
  pairsFor,
  monthLabel,
} from '@/lib/value'
import { getItemBySlug } from '@/lib/data'
import { getThaiEntry } from '@/lib/thai-market'
import { formatPriceTHB } from '@/lib/data'
import { MonthlyChart, GradeBars, StatTile } from '@/components/ValueCharts'

const BASE = 'https://www.chicpreowned.com'
const TOOLS = 'https://www.secondluxuryitems.com'

interface Props { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return getValueModels().flatMap(m => ['en', 'th'].map(locale => ({ locale, slug: m.slug })))
}

export const dynamicParams = false

function fullName(m: ValueModel) {
  return `${m.brand} ${m.name}`
}

/** One sentence that answers the query on its own — what a snippet or an
 *  answer engine lifts. Every figure in it is on the page below. */
function answer(m: ValueModel, locale: string): string {
  const th = locale === 'th'
  const win = soldWindow(m, locale)
  if (m.basis === 'asking') {
    return th
      ? `${fullName(m)} มือสองตั้งราคาขายกลางที่ ${usd(m.resale.median)} บน Vestiaire Collective (${m.resale.n} รายการที่ยังขายอยู่) — ยังมียอดขายจริงไม่พอจะสรุปราคาที่ขายได้`
      : `Pre-owned ${fullName(m)} listings ask a median ${usd(m.resale.median)} on Vestiaire Collective (${m.resale.n} live listings). Too few have sold yet to state what they actually fetch.`
  }
  const base = th
    ? `${fullName(m)} มือสองขายได้ราคากลาง ${usd(m.resale.median)} จากการขายจริง ${m.resale.n} ครั้งบน Vestiaire Collective${win ? ` (ลงขาย ${win})` : ''}`
    : `A pre-owned ${fullName(m)} sold for a median ${usd(m.resale.median)} across ${m.resale.n} sales on Vestiaire Collective${win ? ` listed ${win}` : ''}`
  if (m.retention != null && m.retail) {
    return th
      ? `${base} — คิดเป็น ${pct(m.retention)} ของราคาป้ายในสหรัฐ ${usd(m.retail.usd)}`
      : `${base} — ${pct(m.retention)} of its ${usd(m.retail.usd)} US retail price.`
  }
  return base + (th ? '' : '.')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const m = getValueModel(slug)
  if (!m) return {}
  const th = locale === 'th'
  const title = th
    ? `${fullName(m)} มือสอง ขายต่อได้เท่าไหร่ — มูลค่าขายต่อ ${m.generated.slice(0, 4)}`
    : `${fullName(m)} Resale Value${m.retention != null ? ` — ${pct(m.retention)} of Retail` : ''} (${m.generated.slice(0, 4)})`
  const description = answer(m, locale).slice(0, 300)
  const path = `/value/${slug}`
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}${path}`,
      languages: { en: `${BASE}/en${path}`, th: `${BASE}/th${path}`, 'x-default': `${BASE}/en${path}` },
    },
    openGraph: { title, description, type: 'website', url: `${BASE}/${locale}${path}` },
  }
}

export default async function ValuePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const m = getValueModel(slug)
  if (!m) notFound()
  const th = locale === 'th'
  const L = (en: string, thai: string) => (th ? thai : en)

  const item = getItemBySlug(...(m.item_slug.split('/') as [string, string]))
  const thai = getThaiEntry(m.item_slug)
  const rank = retentionRank(m.slug)
  const sibs = siblings(m)
  const pairs = pairsFor(m)
  const gradeRows = (['A', 'B', 'C'] as Grade[])
    .filter(g => m.grades[g])
    .map(g => ({ label: th ? GRADE_LABEL[g].th : GRADE_LABEL[g].en, median: m.grades[g]!.median, n: m.grades[g]!.n, g }))
  const askGap = m.sold?.median && m.live?.median ? Math.round((m.live.median / m.sold.median - 1) * 100) : null
  const months = m.monthly.filter(x => x.median != null)

  const faqs: { q: string; a: string }[] = []
  faqs.push({
    q: L(`How much does a ${fullName(m)} resell for?`, `${fullName(m)} มือสองขายต่อได้เท่าไหร่?`),
    a: answer(m, locale) + (m.resale.p25 && m.resale.p75
      ? L(` The middle half of sales fell between ${usd(m.resale.p25)} and ${usd(m.resale.p75)}.`,
          ` ครึ่งหนึ่งของการขายอยู่ระหว่าง ${usd(m.resale.p25)} ถึง ${usd(m.resale.p75)}`)
      : ''),
  })
  if (m.retention != null && m.retail) {
    faqs.push({
      q: L(`Does the ${fullName(m)} hold its value?`, `${fullName(m)} รักษามูลค่าได้ดีไหม?`),
      a: rank
        ? L(`It resells at ${pct(m.retention)} of retail, which ranks #${rank.rank} of ${rank.of} models we track for value retention.`,
            `ขายต่อได้ ${pct(m.retention)} ของราคาป้าย อันดับที่ ${rank.rank} จาก ${rank.of} รุ่นที่เราติดตาม`)
        : L(`It resells at ${pct(m.retention)} of its ${usd(m.retail.usd)} retail price.`,
            `ขายต่อได้ ${pct(m.retention)} ของราคาป้าย ${usd(m.retail.usd)}`),
    })
  }
  if (m.grades.A && m.retail) {
    const save = m.retail.usd - m.grades.A.median
    faqs.push({
      q: L(`Is it cheaper to buy a ${fullName(m)} pre-owned?`, `ซื้อ ${fullName(m)} มือสองถูกกว่าไหม?`),
      a: save > 0
        ? L(`Yes. Like-new examples (never worn) sold for a median ${usd(m.grades.A.median)} — ${usd(save)} under the ${usd(m.retail.usd)} retail price, from ${m.grades.A.n} sales.`,
            `ใช่ สภาพเหมือนใหม่ขายได้ราคากลาง ${usd(m.grades.A.median)} ถูกกว่าราคาป้าย ${usd(save)} (จาก ${m.grades.A.n} การขาย)`)
        : L(`No. Even like-new examples sold for a median ${usd(m.grades.A.median)}, above the ${usd(m.retail.usd)} retail price — buyers pay to skip the boutique.`,
            `ไม่ สภาพเหมือนใหม่ขายได้ราคากลาง ${usd(m.grades.A.median)} สูงกว่าราคาป้าย ${usd(m.retail.usd)}`),
    })
  }

  const url = `${BASE}/${locale}/value/${slug}`
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: fullName(m),
      brand: { '@type': 'Brand', name: m.brand },
      url,
      ...(m.live?.p10 && m.live?.p90 && m.live?.n
        ? {
            offers: {
              '@type': 'AggregateOffer',
              lowPrice: m.live.p10,
              highPrice: m.live.p90,
              priceCurrency: 'USD',
              offerCount: m.live.n,
              itemCondition: 'https://schema.org/UsedCondition',
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}` },
        { '@type': 'ListItem', position: 2, name: L('Resale value', 'มูลค่าขายต่อ'), item: `${BASE}/${locale}/value` },
        { '@type': 'ListItem', position: 3, name: fullName(m), item: url },
      ],
    },
  ]

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href={`/${locale}`}>{L('Home', 'หน้าแรก')}</Link> ›{' '}
        <Link href={`/${locale}/value`}>{L('Resale value', 'มูลค่าขายต่อ')}</Link> › {fullName(m)}
      </p>
      <h1 className="text-3xl sm:text-4xl font-serif mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        {th ? `${fullName(m)} มือสอง ขายต่อได้เท่าไหร่` : `${fullName(m)} Resale Value`}
      </h1>
      <p className="text-lg leading-relaxed mb-6">{answer(m, locale)}</p>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile
          label={L('US retail', 'ราคาป้าย (สหรัฐ)')}
          value={m.retail ? usd(m.retail.usd) : '—'}
          note={m.retail
            ? <>{m.retail.discontinued ? L('Last retail · discontinued', 'ราคาสุดท้าย · เลิกผลิต') : m.retail.as_of}{m.retail.source_url ? <> · <a href={m.retail.source_url} rel="nofollow noopener" target="_blank" className="underline">{L('source', 'ที่มา')}</a></> : null}</>
            : L('No sourced price', 'ไม่มีราคาที่ยืนยันได้')}
        />
        <StatTile
          label={m.basis === 'sold' ? L('Median sold', 'ราคาขายจริง (กลาง)') : L('Median asking', 'ราคาตั้งขาย (กลาง)')}
          value={usd(m.resale.median)}
          note={`n=${m.resale.n}`}
        />
        <StatTile
          label={L('Of retail', 'เทียบราคาป้าย')}
          value={pct(m.retention)}
          note={rank ? L(`#${rank.rank} of ${rank.of} for retention`, `อันดับ ${rank.rank}/${rank.of}`) : undefined}
        />
        <StatTile
          label={m.retention != null && m.retention >= 100 ? L('Above retail', 'สูงกว่าราคาป้าย') : L('Depreciation', 'ค่าเสื่อม')}
          value={m.retention != null ? pct(Math.abs(100 - m.retention)) : '—'}
        />
      </section>

      {gradeRows.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {L('Price by condition', 'ราคาตามสภาพ')}
          </h2>
          <GradeBars rows={gradeRows} retail={m.retail?.usd} />
          <table className="w-full text-sm mt-4">
            <thead className="text-left text-[#6B6052]">
              <tr><th className="py-2">{L('Condition', 'สภาพ')}</th><th>{L('Sales', 'จำนวน')}</th><th>{L('Median', 'กลาง')}</th><th>{L('Middle 50%', 'ช่วงกลาง 50%')}</th></tr>
            </thead>
            <tbody>
              {gradeRows.map(r => {
                const s = m.grades[r.g as Grade]!
                return (
                  <tr key={r.g} className="border-t border-[#E8E2D9]">
                    <td className="py-2">{r.label} <span className="text-[#9C8B7A]">({GRADE_LABEL[r.g as Grade].detail})</span></td>
                    <td>{s.n}</td>
                    <td>{usd(s.median)}</td>
                    <td>{s.p25 && s.p75 ? `${usd(s.p25)} – ${usd(s.p75)}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}

      {months.length >= 2 && (
        <section className="mb-10">
          <h2 className="text-2xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {L('Price trend', 'แนวโน้มราคา')}
          </h2>
          <p className="text-sm text-[#6B6052]">
            {L('Median sold price by the month each listing went up. Months with fewer than five sales are left out.',
               'ราคาขายกลางตามเดือนที่ลงขาย ไม่รวมเดือนที่ขายได้น้อยกว่า 5 ครั้ง')}
          </p>
          <MonthlyChart months={months} retail={m.retail?.usd} locale={locale} />
          <table className="w-full text-sm">
            <thead className="text-left text-[#6B6052]"><tr><th className="py-1">{L('Month', 'เดือน')}</th><th>{L('Sales', 'จำนวน')}</th><th>{L('Median', 'กลาง')}</th></tr></thead>
            <tbody>
              {months.map(x => (
                <tr key={x.month} className="border-t border-[#E8E2D9]"><td className="py-1">{monthLabel(x.month, locale)}</td><td>{x.n}</td><td>{usd(x.median)}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-2xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
          {L('Supply and asking prices', 'จำนวนของในตลาดและราคาตั้งขาย')}
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-[15px]">
          {m.family_stock != null && (
            <li>{L(`Vestiaire Collective lists ${m.family_stock.toLocaleString('en-US')} ${m.brand} items under this model family right now — every size and colour, not only this one.`,
                   `ตอนนี้ Vestiaire Collective มีของในตระกูลรุ่นนี้ ${m.family_stock.toLocaleString('en-US')} ชิ้น (ทุกขนาด ทุกสี)`)}</li>
          )}
          {m.live?.median && (
            <li>{L(`Live listings for this exact model ask a median ${usd(m.live.median)} (${m.live.n} listings${m.live.p10 && m.live.p90 ? `, ${usd(m.live.p10)}–${usd(m.live.p90)}` : ''}).`,
                   `รายการที่ยังขายอยู่ของรุ่นนี้ตั้งราคากลาง ${usd(m.live.median)} (${m.live.n} รายการ)`)}</li>
          )}
          {askGap != null && (
            <li>{askGap > 0
              ? L(`Asking prices sit ${askGap}% above what this model actually sells for — room to negotiate.`, `ราคาตั้งขายสูงกว่าราคาที่ขายได้จริง ${askGap}% — ต่อราคาได้`)
              : L(`Asking prices sit at or below recent sale prices — sellers are pricing to move.`, `ราคาตั้งขายต่ำกว่าหรือเท่ากับราคาที่ขายได้จริง`)}</li>
          )}
          {m.stock_history.length >= 2 && (
            <li>{L('Supply history: ', 'ประวัติจำนวนของ: ')}{m.stock_history.map(s => `${s.date}: ${s.family_stock.toLocaleString('en-US')}`).join(' · ')}</li>
          )}
        </ul>
      </section>

      {(thai || item) && (
        <section className="mb-10 border border-[#E8E2D9] rounded-lg p-5 bg-white">
          <h2 className="text-xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {L('Buying or selling in Thailand?', 'ซื้อหรือขายในไทย?')}
          </h2>
          {thai?.variant && (
            <p className="mb-2">{L(`Thai dealers list this model at a median ${formatPriceTHB(thai.variant.median)} (${thai.variant.n} listings).`,
              `ร้านในไทยตั้งราคากลาง ${formatPriceTHB(thai.variant.median)} (${thai.variant.n} รายการ)`)}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            {item && <Link className="underline" href={`/${locale}/${m.item_slug}`}>{L('Thai prices', 'ราคาในไทย')} →</Link>}
            {thai && <Link className="underline" href={`/${locale}/sell/${m.item_slug}`}>{L('What a Thai dealer pays', 'ขายได้เท่าไหร่ในไทย')} →</Link>}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{L('Run your own numbers', 'คำนวณเอง')}</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><a className="underline" href={`${TOOLS}/calculator/resale-value?model=${m.slug}`}>{L('Resale value calculator', 'เครื่องคำนวณราคาขายต่อ')}</a></li>
          <li><a className="underline" href={`${TOOLS}/calculator/retail-vs-resale?model=${m.slug}`}>{L('New vs pre-owned: which costs less to own', 'ซื้อใหม่หรือมือสองคุ้มกว่า')}</a></li>
          <li><a className="underline" href={`${TOOLS}/calculator/depreciation?model=${m.slug}`}>{L('What is mine worth now?', 'ของฉันตอนนี้มีมูลค่าเท่าไหร่')}</a></li>
        </ul>
      </section>

      {(pairs.length > 0 || sibs.length > 0) && (
        <section className="mb-10">
          <h2 className="text-xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{L('Compare', 'เปรียบเทียบ')}</h2>
          <ul className="list-disc pl-5 space-y-1">
            {pairs.map(p => {
              const other = p.a.slug === m.slug ? p.b : p.a
              return <li key={p.slug}><Link className="underline" href={`/${locale}/value/compare/${p.slug}`}>{fullName(m)} vs {fullName(other)}</Link></li>
            })}
            {sibs.filter(s => !pairs.some(p => p.a.slug === s.slug || p.b.slug === s.slug)).map(s => (
              <li key={s.slug}><Link className="underline" href={`/${locale}/value/${s.slug}`}>{fullName(s)} {L('resale value', 'มูลค่าขายต่อ')}</Link></li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            <Link className="underline" href={`/${locale}/index/value-retention`}>{L('Which designer bags hold value best', 'กระเป๋าแบรนด์ไหนรักษามูลค่าดีที่สุด')}</Link> ·{' '}
            <Link className="underline" href={`/${locale}/index/biggest-depreciation`}>{L('Biggest depreciation', 'ค่าเสื่อมมากที่สุด')}</Link> ·{' '}
            <Link className="underline" href={`/${locale}/index/under-retail`}>{L('Like-new under retail', 'สภาพเหมือนใหม่ถูกกว่าป้าย')}</Link>
          </p>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-serif mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{L('FAQ', 'คำถามที่พบบ่อย')}</h2>
        {faqs.map(f => (
          <div key={f.q} className="mb-4">
            <h3 className="font-medium">{f.q}</h3>
            <p className="text-[15px] leading-relaxed">{f.a}</p>
          </div>
        ))}
      </section>

      <section className="text-sm text-[#6B6052] border-t border-[#E8E2D9] pt-6">
        <h2 className="font-medium text-[#1A1A1A] mb-1">{L('How these numbers are made', 'ที่มาของตัวเลข')}</h2>
        <p className="mb-2">
          {L(`Sold and live listings from Vestiaire Collective's US marketplace, in US dollars, collected ${m.generated}. A listing counts toward this model only if it is filed under the model on Vestiaire and its title or description names this size and no other. Listings that do not state a size, exotic skins, and accessories sold under the model's name (organisers, straps, charms) are left out. Medians, not averages, so one exceptional sale does not move the figure.`,
             `ข้อมูลรายการที่ขายแล้วและที่ยังขายอยู่จาก Vestiaire Collective สหรัฐ (ดอลลาร์) เก็บเมื่อ ${m.generated} นับเฉพาะรายการที่ระบุขนาดนี้ ไม่รวมหนังสัตว์แปลกและอุปกรณ์เสริม ใช้ค่ากลาง (median) ไม่ใช่ค่าเฉลี่ย`)}
        </p>
        <p className="mb-2">
          {m.retail
            ? L(`Retail is the US boutique price for the standard version${m.retail.config ? ` (${m.retail.config})` : ''}, ${m.retail.confidence === 'official' ? "read from the brand's own listing" : 'as reported by a price tracker'}${m.retail.as_of ? `, ${m.retail.as_of}` : ''}. Retail moves; resale percentages are against today's price, not what an owner originally paid.`,
                `ราคาป้ายคือราคาบูติกในสหรัฐของรุ่นมาตรฐาน${m.retail.as_of ? ` (${m.retail.as_of})` : ''} เปอร์เซ็นต์เทียบกับราคาปัจจุบัน ไม่ใช่ราคาที่เจ้าของซื้อมา`)
            : L('No retail price could be sourced for this model, so no retention figure is shown and it is not ranked.', 'ไม่พบราคาป้ายที่ยืนยันได้ จึงไม่แสดงเปอร์เซ็นต์และไม่จัดอันดับ')}
        </p>
        <p>{L('Updated monthly.', 'อัปเดตทุกเดือน')}</p>
      </section>
    </main>
  )
}
