// 골프 어필리에이트 inline slot — 비교 카드 형식 (Golfsavers + Sawasdee + Klook).

import { golfsaversSearch, sawasdeeSearch, klookSearchLink } from "@/lib/affiliate";

export function AffiliateInline({ category, district }: {
  category?: string;
  district?: string;
}) {
  const query = [category, district, "Thailand"].filter(Boolean).join(" ");
  const golfsavers = golfsaversSearch(query);
  const sawasdee = sawasdeeSearch(query);
  const klook = klookSearchLink(query);
  const label = district
    ? `Compare green fees in ${district}`
    : "Compare green fees & packages";

  return (
    <aside className="my-6 border border-[var(--border)] rounded-2xl p-5 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-sm">
      <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
            Booking partners · sponsored
          </div>
          <h3 className="text-base font-bold mt-1">{label}</h3>
        </div>
        <span className="text-xs text-[var(--muted)]">English/Korean caddy · packages · transfer</span>
      </div>
      <div className={`grid gap-2 ${sawasdee ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        <a
          href={golfsavers}
          target="_blank"
          rel="noopener sponsored nofollow"
          className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-emerald-400 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white font-bold text-sm shrink-0">G</div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Golfsavers</div>
              <div className="text-xs text-[var(--muted)]">Thailand specialist · transfers</div>
            </div>
          </div>
          <span className="text-emerald-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </a>
        {/* Only rendered once a real partner URL is configured — see
            sawasdeeSearch(). The hard-coded fallback it used to carry pointed
            at a domain that does not exist. */}
        {sawasdee && (
          <a
            href={sawasdee}
            target="_blank"
            rel="noopener sponsored nofollow"
            className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-blue-400 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0">S</div>
              <div className="min-w-0">
                <div className="font-bold text-sm">Sawasdee Golf</div>
                <div className="text-xs text-[var(--muted)]">Korean tour packages</div>
              </div>
            </div>
            <span className="text-blue-600 group-hover:translate-x-1 transition shrink-0">→</span>
          </a>
        )}
        <a
          href={klook}
          target="_blank"
          rel="noopener sponsored nofollow"
          className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-orange-400 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0">K</div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Klook</div>
              <div className="text-xs text-[var(--muted)]">One-off rounds, instant confirm</div>
            </div>
          </div>
          <span className="text-orange-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </a>
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-3 leading-relaxed">
        We may earn a small commission on bookings made through these partner links — at no extra cost to you. Organic listings are never paid.
      </p>
    </aside>
  );
}

/**
 * Deliberately renders nothing, and did not serve an impression before either.
 *
 * The previous body emitted an `<ins>` and stopped there: no
 * `adsbygoogle.push()` to initialise it, no loader script on the page, and a
 * `slot` prop carrying a label like "home-mid" where AdSense requires the
 * numeric slot ID issued by the dashboard. It was inert only because
 * NEXT_PUBLIC_ADSENSE_CLIENT was unset; the moment that variable is filled in
 * it would have put fourteen empty, never-filled ad frames across the site —
 * in front of the AdSense reviewer, on a site whose review has not happened
 * yet.
 *
 * The fourteen call sites stay so that rebuilding them is a one-file change.
 * web-thaigle/components/AdSlot.tsx is the working version to port: it pushes
 * exactly once per mount, reserves the creative's height so the ad does not
 * shift the page, and resolves a named placement to a real slot ID through
 * lib/ads.ts. Slot IDs cannot be created until the account is approved, which
 * is why that port waits.
 */
export function AdSlot(_: { slot: string }) {
  return null;
}
