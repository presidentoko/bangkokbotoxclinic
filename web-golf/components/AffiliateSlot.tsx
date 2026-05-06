// Golf affiliate inline slot — 골프 부킹 platform 비교링크.

import { golfsaversSearch, sawasdeeSearch, klookSearchLink } from "@/lib/affiliate";

export function AffiliateInline({ category, district }: {
  category?: string;
  district?: string;
}) {
  const query = [category, district, "Bangkok golf"].filter(Boolean).join(" ");
  const golfsavers = golfsaversSearch(query);
  const sawasdee = sawasdeeSearch(query);
  const klook = klookSearchLink(query);
  const label = district
    ? `Compare green fees in ${district}`
    : "Compare green fees & packages";

  return (
    <aside className="my-6 border border-[var(--border)] rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Booking partners</div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-[var(--muted)] mt-1">
            Compare 3 platforms — green fees, transfers, English/Korean caddy options.
          </p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <a
          href={golfsavers}
          target="_blank"
          rel="noopener sponsored nofollow"
          className="flex-1 min-w-[120px] bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-800 text-center"
        >
          Golfsavers ↗
        </a>
        <a
          href={sawasdee}
          target="_blank"
          rel="noopener sponsored nofollow"
          className="flex-1 min-w-[120px] bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 text-center"
        >
          Sawasdee Golf ↗
        </a>
        <a
          href={klook}
          target="_blank"
          rel="noopener sponsored nofollow"
          className="flex-1 min-w-[120px] bg-orange-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-orange-600 text-center"
        >
          Klook ↗
        </a>
      </div>
    </aside>
  );
}

export function AdSlot({ slot }: { slot: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;
  return (
    <ins
      className="adsbygoogle block my-4"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
