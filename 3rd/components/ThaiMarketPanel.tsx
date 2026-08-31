import { Item, formatPriceTHB } from '@/lib/data'
import {
  getThaiEntry,
  getThaiMeta,
  sourceLabel,
  sourceUrl,
  thaiTrend,
} from '@/lib/thai-market'

/**
 * What Thai shops are asking for this, right now, with the listings attached.
 *
 * The listings are the point. Every other price on the page is a statistic a
 * reader has to take on trust; these are six links to somebody's live
 * inventory, so the number above them can be checked in a click. It is also
 * the one thing a dealer's own site cannot show — their price next to four
 * competitors' — which is the whole reason for this site to exist alongside
 * shops that have actual stock.
 *
 * Renders nothing when there is no Thai data. An absent section is honest;
 * an empty one that says "no data" on 137 of 190 pages is clutter.
 */
export function ThaiMarketPanel({ item, locale }: { item: Item; locale: string }) {
  const entry = getThaiEntry(item.slug)
  if (!entry) return null

  const th = locale === 'th'
  const { generated } = getThaiMeta()
  const summary = entry.variant ?? entry.family
  if (!summary) return null

  const isVariant = !!entry.variant
  const trend = thaiTrend(item.slug)
  const dealerCount = entry.sources.length
  const aliases = entry.aliases ?? []
  const aliasTotal = aliases.reduce((n, a) => n + a.count, 0)

  return (
    <section className="my-8 border border-[#B8954A]/40 bg-[#FDFBF7]">
      <div className="px-5 py-4 border-b border-[#E8E2D9]">
        <h2
          className="font-serif text-xl text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {th ? 'ราคาตลาดไทย' : 'The Thai Market'}
        </h2>
        <p className="text-xs text-[#6B6052] mt-1">
          {th
            ? `จากประกาศขายจริงของร้านไทย ${dealerCount} ร้าน · อัปเดต ${generated}`
            : `From live listings at ${dealerCount} Thai ${dealerCount === 1 ? 'dealer' : 'dealers'} · updated ${generated}`}
        </p>
      </div>

      {/* What the shops call it. A reader who got here from a reseller's
          Instagram post is holding the dealer's word for the size, and until
          this line existed the site never once printed it — the notation was
          known to the matcher and invisible to the visitor. */}
      {aliases.length > 0 && (
        <p className="px-5 pt-3 text-sm text-[#6B6052]">
          {th ? 'ร้านไทยเรียกรุ่นนี้ว่า ' : 'Thai dealers call this '}
          {aliases.map((a, i) => (
            <span key={a.name}>
              {i > 0 && (th ? ' หรือ ' : ' or ')}
              <strong className="font-medium text-[#1A1A1A]">{a.name}</strong>
            </span>
          ))}
          {th
            ? ` — พบใน ${aliasTotal} ประกาศจากการเก็บข้อมูลรอบล่าสุด`
            : ` — seen on ${aliasTotal} listing${aliasTotal === 1 ? '' : 's'} in the latest sweep.`}
        </p>
      )}

      <div className="px-5 py-5">
        {isVariant ? (
          <>
            <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-2">
              {th ? 'ราคาที่ร้านไทยตั้งขาย' : 'Thai dealers are asking'}
            </p>
            <p className="text-3xl font-light text-[#1A1A1A]">
              {formatPriceTHB(summary.median)}
            </p>
            <p className="text-sm text-[#6B6052] mt-1">
              {th
                ? `ช่วง ${formatPriceTHB(summary.min)} – ${formatPriceTHB(summary.max)} จาก ${summary.n} รายการ`
                : `${formatPriceTHB(summary.min)} – ${formatPriceTHB(summary.max)} across ${summary.n} listings`}
            </p>
          </>
        ) : (
          <>
            {/* Deliberately not headlined as this item's price. Thai dealers
                title a Birkin "HERMES BIRKIN" with no size, so this is the
                family across every size they had — useful, but not the
                same claim. */}
            <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-2">
              {th
                ? `${entry.family?.label} ทุกขนาด ที่ร้านไทยตั้งขาย`
                : `${entry.family?.label}, all sizes, at Thai dealers`}
            </p>
            <p className="text-2xl font-light text-[#1A1A1A]">
              {formatPriceTHB(summary.min)} – {formatPriceTHB(summary.max)}
            </p>
            <p className="text-sm text-[#6B6052] mt-1">
              {th
                ? `กลาง ${formatPriceTHB(summary.median)} จาก ${summary.n} รายการ`
                : `median ${formatPriceTHB(summary.median)} across ${summary.n} listings`}
            </p>
            <p className="text-xs text-[#8C7355] mt-3 leading-relaxed">
              {th
                ? `ร้านไทยมักไม่ระบุขนาดในชื่อสินค้า ตัวเลขนี้จึงรวมทุกขนาดของ ${entry.family?.label} ไม่ใช่ราคาเฉพาะ ${item.model} — ใช้เป็นกรอบอ้างอิง แล้วสอบถามร้านโดยตรงสำหรับขนาดที่ต้องการ`
                : `Thai dealers rarely put the size in the title, so this covers every ${entry.family?.label} they listed — not the ${item.model} specifically. Treat it as the bracket and ask a dealer for your size.`}
            </p>
          </>
        )}

        {item.retail_price_thb > 0 && isVariant && (
          <p className="text-sm mt-3">
            <span className="text-[#6B6052]">
              {th ? 'เทียบราคาใหม่ ' : 'vs retail '}
              {formatPriceTHB(item.retail_price_thb)}:{' '}
            </span>
            <span
              className={
                summary.median > item.retail_price_thb
                  ? 'text-[#C25B2B] font-medium'
                  : 'text-[#4A7A35] font-medium'
              }
            >
              {summary.median > item.retail_price_thb ? '+' : ''}
              {Math.round(((summary.median - item.retail_price_thb) / item.retail_price_thb) * 100)}%
            </span>
          </p>
        )}

        {trend && (
          <p className="text-sm text-[#6B6052] mt-2">
            {th
              ? `เปลี่ยนแปลง ${trend.pct > 0 ? '+' : ''}${trend.pct}% ตั้งแต่ ${trend.from}`
              : `${trend.pct > 0 ? '+' : ''}${trend.pct}% since ${trend.from}`}
          </p>
        )}
      </div>

      {entry.listings.length > 0 && (
        <div className="border-t border-[#E8E2D9]">
          <p className="px-5 pt-4 text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">
            {th ? 'ประกาศขายจริง' : 'Live listings'}
          </p>
          <ul className="px-5 py-3 divide-y divide-[#F0EBE3]">
            {entry.listings.map(listing => (
              <li key={listing.url} className="py-3 flex items-center gap-3">
                {/* Hotlinked, never copied: the file is served by the dealer,
                    next to the dealer's name and a link to their listing.
                    A plain <img> on purpose — routing these through
                    next/image would bill every thumbnail against the
                    project's image-optimisation allowance to reprocess a
                    picture the shop has already sized for us. Width and
                    height are set so a slow dealer does not shift the page
                    under the reader, and the tile keeps its own background
                    so a dead URL leaves a blank square rather than a broken
                    icon. */}
                {listing.image ? (
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="shrink-0 block w-14 h-14 bg-[#F3EFE8] overflow-hidden"
                  >
                    <img
                      src={listing.image}
                      alt={`${item.brand} ${item.model} — ${sourceLabel(listing.source)}`}
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="w-14 h-14 object-cover"
                    />
                  </a>
                ) : (
                  <span className="shrink-0 block w-14 h-14 bg-[#F3EFE8]" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm text-[#6B6052] hover:text-[#8C7355] underline decoration-[#E8E2D9] underline-offset-2"
                  >
                    <span className="line-clamp-2">{listing.title}</span>
                  </a>
                  <p className="text-xs text-[#9C8B7A] mt-0.5">
                    {sourceLabel(listing.source)}
                  </p>
                </div>
                <span className="text-sm font-medium text-[#1A1A1A] shrink-0 tabular-nums">
                  {formatPriceTHB(listing.price)}
                </span>
              </li>
            ))}
          </ul>
          <p className="px-5 pb-4 text-xs text-[#9C8B7A] leading-relaxed">
            {th ? 'ข้อมูลจาก ' : 'Sourced from '}
            {entry.sources.map((id, i) => (
              <span key={id}>
                {i > 0 && ', '}
                <a
                  href={sourceUrl(id)}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="underline decoration-[#E8E2D9] underline-offset-2 hover:text-[#8C7355]"
                >
                  {sourceLabel(id)}
                </a>
              </span>
            ))}
            {th
              ? ' — เราไม่ได้ขายสินค้าเอง และไม่ได้รับค่าคอมมิชชันจากลิงก์เหล่านี้'
              : ' — we sell nothing ourselves and take no commission on these links.'}
          </p>
        </div>
      )}
    </section>
  )
}
