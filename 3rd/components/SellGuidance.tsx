import { formatPriceTHB } from '@/lib/data'
import { getThaiSources } from '@/lib/thai-market'

/**
 * The three ways to turn a bag into money in Thailand, and what each costs you.
 *
 * The temptation on a page like this is to publish a number — "dealers pay
 * 70% of their asking price". No Thai dealer publishes their buy-side margin,
 * for the obvious reason that it is their negotiating position, and inventing
 * a coefficient to fill the gap would be exactly the kind of confident
 * fabrication this site is supposed to be the antidote to.
 *
 * So this section publishes the mechanism instead of a made-up multiplier,
 * and hands the reader the one number that genuinely helps them: the shelf
 * price, which is the ceiling every quote they receive is measured against.
 */
export function SellGuidance({ locale }: { locale: string }) {
  const th = locale === 'th'
  const sources = getThaiSources()
  const buyers = sources.filter(s => s.buys)
  const consigners = sources.filter(s => s.consigns)

  const routes = [
    {
      title: th ? 'ขายขาดให้ร้าน' : 'Sell outright to a dealer',
      speed: th ? 'ได้เงินวันนี้' : 'paid today',
      body: th
        ? 'เร็วที่สุดและแน่นอนที่สุด แต่ได้น้อยที่สุด ร้านต้องนำไปตั้งขายในราคาข้างบนแล้วยังต้องเหลือกำไร ส่วนต่างนั้นคือค่าที่คุณจ่ายเพื่อความเร็วและความแน่นอน'
        : 'The fastest and the most certain, and the least money. The shop has to resell it at the prices above and still make a margin — that gap is what you are paying for speed and certainty.',
    },
    {
      title: th ? 'ฝากขาย' : 'Consign it',
      speed: th ? 'ได้เงินเมื่อขายได้' : 'paid when it sells',
      body: th
        ? 'ร้านตั้งขายให้ในราคาใกล้เคียงข้างบน แล้วหักค่าคอมมิชชันเมื่อขายได้ ปกติได้เงินมากกว่าขายขาด แต่คุณเป็นคนแบกความเสี่ยงว่าของอาจขายไม่ออก และอาจต้องรอเป็นเดือน'
        : 'The shop lists it near the prices above and takes a commission when it sells. Usually nets more than an outright sale, but you carry the risk that it does not sell, and the wait can run to months.',
    },
    {
      title: th ? 'ขายเองผ่าน LINE / Facebook' : 'Sell privately via LINE or Facebook',
      speed: th ? 'ไม่แน่นอน' : 'unpredictable',
      body: th
        ? 'ได้ราคาใกล้เคียงราคาตั้งขายข้างบนมากที่สุด เพราะไม่มีคนกลาง แต่คุณต้องพิสูจน์ความแท้ให้ผู้ซื้อเชื่อเอง รับความเสี่ยงเรื่องการชำระเงิน และอาจใช้เวลานาน'
        : 'Gets closest to the asking prices above, because nobody is taking a cut. In exchange you have to make a stranger believe the piece is real, you carry the payment risk, and it can take a long time.',
    },
  ]

  return (
    <section className="mt-12">
      <h2
        className="font-serif text-2xl text-[#1A1A1A] mb-2"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {th ? 'สามทางเลือกในการขาย' : 'Your three routes'}
      </h2>
      <p className="text-sm text-[#6B6052] mb-6 max-w-2xl leading-relaxed">
        {th
          ? 'ไม่มีร้านไหนในไทยประกาศราคารับซื้อของตัวเอง เพราะนั่นคืออำนาจต่อรองของเขา เราจึงไม่ตั้งตัวเลขนั้นขึ้นมาเอง — แต่ราคาตั้งขายข้างบนคือเพดานที่ทุกข้อเสนอถูกวัดจากมัน'
          : 'No Thai dealer publishes what they will pay you — that is their negotiating position, and we are not going to invent a percentage to fill the gap. What the asking prices above give you is the ceiling every offer you receive is measured against.'}
      </p>

      <div className="grid gap-px bg-[#E8E2D9] border border-[#E8E2D9] sm:grid-cols-3">
        {routes.map(r => (
          <div key={r.title} className="bg-white p-5">
            <p className="text-xs tracking-[0.1em] uppercase text-[#B8954A] mb-2">{r.speed}</p>
            <h3
              className="font-serif text-lg text-[#1A1A1A] mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {r.title}
            </h3>
            <p className="text-sm text-[#6B6052] leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-[#F5F0E8] border border-[#E8E2D9]">
        <p className="text-sm font-medium text-[#1A1A1A] mb-2">
          {th ? 'วิธีที่ได้ราคาดีที่สุด' : 'The method that actually works'}
        </p>
        <ol className="text-sm text-[#6B6052] space-y-1.5 list-decimal pl-5 leading-relaxed">
          <li>
            {th
              ? 'ขอประเมินราคาจากอย่างน้อย 3 ร้าน — ราคาตั้งขายของรุ่นเดียวกันต่างกันมากในแต่ละร้าน ราคารับซื้อก็ต่างกันเช่นกัน'
              : 'Get a valuation from at least three shops. Asking prices for the same model vary widely between them, and so do the offers.'}
          </li>
          <li>
            {th
              ? 'เตรียมกล่อง ใบเสร็จ บัตรรับรอง และถุงผ้าให้ครบ ของครบชุดขายได้ราคาดีกว่าเสมอ'
              : 'Assemble the box, receipt, authentication card and dust bag first. A full set is worth more than the same piece without one.'}
          </li>
          <li>
            {th
              ? 'เทียบข้อเสนอกับราคาตั้งขายข้างบน ถ้าห่างกันมากผิดปกติ ให้ถามร้านว่าเพราะอะไร'
              : 'Measure each offer against the asking prices above. If one sits far below the rest, ask the shop why — there is usually a reason, and sometimes it is a good one.'}
          </li>
        </ol>
      </div>

      {buyers.length > 0 && (
        <div className="mt-8">
          <h3
            className="font-serif text-lg text-[#1A1A1A] mb-1"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {th ? 'ร้านที่รับซื้อ' : 'Shops that buy'}
          </h3>
          <p className="text-xs text-[#9C8B7A] mb-3">
            {th
              ? `จาก ${sources.length} ร้านที่เราติดตามราคา มี ${buyers.length} ร้านที่ประกาศรับซื้อ และ ${consigners.length} ร้านที่รับฝากขาย (ตรวจสอบจากหน้าเว็บของร้านทุกสัปดาห์)`
              : `${buyers.length} of the ${sources.length} shops we track advertise that they buy, and ${consigners.length} take consignment. Re-checked on their own storefronts every week.`}
          </p>
          <ul className="space-y-px bg-[#E8E2D9] border border-[#E8E2D9]">
            {buyers.map(s => (
              <li key={s.id} className="bg-white px-4 py-3 flex flex-wrap items-baseline gap-x-3">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-sm font-medium text-[#1A1A1A] hover:text-[#8C7355]"
                >
                  {s.label}
                </a>
                <span className="text-xs text-[#9C8B7A]">
                  {s.focus === 'watches'
                    ? th ? 'นาฬิกา' : 'watches'
                    : th ? 'กระเป๋า' : 'handbags'}
                </span>
                <span className="text-xs text-[#6B6052] ml-auto">
                  {s.consigns
                    ? th ? 'รับซื้อ + ฝากขาย' : 'buys + consignment'
                    : th ? 'รับซื้อ' : 'buys'}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#9C8B7A] mt-2">
            {th
              ? 'เราไม่ได้รับค่าแนะนำจากร้านเหล่านี้ และไม่มีส่วนได้ส่วนเสียกับผลการเจรจาของคุณ'
              : 'We take no referral fee from any of these shops and have no stake in what you agree with them.'}
          </p>
        </div>
      )}
    </section>
  )
}
