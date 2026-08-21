import { getSponsor } from '@/lib/sponsors'

/**
 * Renders a directly-sold placement, or nothing.
 *
 * Server component on purpose: an unsold slot costs zero bytes in the browser,
 * and a sold one is plain HTML in the static page — no script, no layout shift,
 * and no dependency on the visitor having an ad blocker switched off. That is
 * the whole advantage of selling directly, so it would be a shame to give it
 * away by rendering the placement client-side.
 *
 * The "ผู้สนับสนุน" label and the `rel="sponsored nofollow"` on the link are not
 * optional decoration. The label is what keeps the placement from reading as an
 * editorial recommendation, and the rel attribute is what keeps a paid link
 * from being treated as a ranking endorsement — a link scheme penalty would
 * cost far more than the placement earns.
 */
export default function SponsorSlot({ slot, className = '' }: { slot: string; className?: string }) {
  const sponsor = getSponsor(slot)
  if (!sponsor) return null

  return (
    <aside
      aria-label="เนื้อหาจากผู้สนับสนุน"
      className={`border border-amber-200 bg-amber-50/60 rounded-xl p-4 ${className}`}
    >
      <p className="text-[10px] uppercase tracking-widest text-amber-700/70 mb-1.5">
        ผู้สนับสนุน
      </p>
      <div className="flex items-start gap-3">
        {sponsor.icon && (
          <span className="text-2xl leading-none flex-shrink-0" aria-hidden>
            {sponsor.icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <a
            href={sponsor.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="font-bold text-gray-900 text-sm hover:text-orange-600 transition-colors"
          >
            {sponsor.name}
          </a>
          <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{sponsor.blurb}</p>
          {sponsor.phone && (
            <a
              href={`tel:${sponsor.phone.replace(/[^\d+]/g, '')}`}
              className="inline-block mt-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg px-3 py-1.5 transition-colors"
            >
              📞 {sponsor.phone}
            </a>
          )}
        </div>
      </div>
    </aside>
  )
}
