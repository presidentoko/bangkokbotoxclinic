// 어필리에이트 inline slot — 비교 카드 형식. Eatigo + Hungry Hub + Klook.

import { klookSearchLink } from "@/lib/affiliate";
import { AffiliateLink } from "@/components/AffiliateLink";

export function AffiliateInline({ category, district }: {
  category?: string;
  district?: string;
}) {
  const query = [category, district, "Bangkok"].filter(Boolean).join(" ");
  const klook = klookSearchLink(query);
  const eatigo = `https://eatigo.com/en/bangkok/search?q=${encodeURIComponent(query)}`;
  const hungry = `https://www.hungryhub.com/en/bangkok/search?q=${encodeURIComponent(query)}`;
  const label = category
    ? `Reserve ${category} restaurants${district ? ` in ${district}` : ""}`
    : "Reserve a restaurant in Bangkok";
  const surface = district ? "detail" : "hub";

  return (
    <aside className="my-6 border border-[var(--border)] rounded-2xl p-5 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-sm">
      <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
            Reservation partners · sponsored
          </div>
          <h3 className="text-base font-bold mt-1">{label}</h3>
        </div>
        <span className="text-xs text-[var(--muted)]">No-fee booking · instant confirm</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <AffiliateLink
          href={eatigo}
          tracking={{ type: "affiliate", provider: "Eatigo", activityType: "restaurant", surface }}
          className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-orange-400 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0">E</div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Eatigo</div>
              <div className="text-xs text-[var(--muted)]">Up to 50% off · time-slot deals</div>
            </div>
          </div>
          <span className="text-orange-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </AffiliateLink>
        <AffiliateLink
          href={hungry}
          tracking={{ type: "affiliate", provider: "HungryHub", activityType: "restaurant", surface }}
          className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-pink-400 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shrink-0">H</div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Hungry Hub</div>
              <div className="text-xs text-[var(--muted)]">All-you-can-eat packages</div>
            </div>
          </div>
          <span className="text-pink-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </AffiliateLink>
        <AffiliateLink
          href={klook}
          tracking={{ type: "affiliate", provider: "Klook", activityType: "restaurant", surface }}
          className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-purple-400 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">K</div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Klook</div>
              <div className="text-xs text-[var(--muted)]">Buffet + dining vouchers</div>
            </div>
          </div>
          <span className="text-purple-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </AffiliateLink>
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-3 leading-relaxed">
        We may earn a small commission on bookings made through these partner links — at no extra cost to you. Organic listings are never paid.
      </p>
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
