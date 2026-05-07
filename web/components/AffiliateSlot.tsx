// 어필리에이트 inline slot — 비교 카드 형식. Klook + 추가 옵션.

import { klookSearchLink } from "@/lib/affiliate";

export function AffiliateInline({ category, district }: {
  category?: string;
  district?: string;
}) {
  const query = [category, district, "Bangkok"].filter(Boolean).join(" ");
  const klook = klookSearchLink(query);
  const label = category
    ? `Compare ${category} packages in ${district || "Bangkok"}`
    : "Compare aesthetic packages in Bangkok";

  return (
    <aside className="my-6 border border-[var(--border)] rounded-2xl p-5 bg-gradient-to-br from-violet-50 via-white to-blue-50 shadow-sm">
      <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
            Booking partners · sponsored
          </div>
          <h3 className="text-base font-bold mt-1">{label}</h3>
        </div>
        <span className="text-xs text-[var(--muted)]">English / Korean support · instant confirmation</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <a
          href={klook}
          target="_blank"
          rel="noopener sponsored nofollow"
          className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-purple-400 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">K</div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Klook</div>
              <div className="text-xs text-[var(--muted)]">Pre-booked packages, fixed prices</div>
            </div>
          </div>
          <span className="text-purple-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </a>
        <a
          href="https://www.tripadvisor.com/Search?q=Bangkok+aesthetic+clinic"
          target="_blank"
          rel="noopener sponsored nofollow"
          className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[var(--border)] hover:border-emerald-400 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">T</div>
            <div className="min-w-0">
              <div className="font-bold text-sm">Tripadvisor</div>
              <div className="text-xs text-[var(--muted)]">Reviews from international visitors</div>
            </div>
          </div>
          <span className="text-emerald-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </a>
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-3 leading-relaxed">
        We may earn a small commission on bookings made through these partner links — at no extra cost to you. Organic listings are never paid.
      </p>
    </aside>
  );
}

// AdSense placeholder — 환경변수에 클라이언트 ID 있을 때만 렌더.
export function AdSlot({ slot }: { slot: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return null;
  }
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
