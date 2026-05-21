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

/** 광고 placeholder — AdSense 환경변수 없을 때도 시각적으로 자리 표시.
 *  실제 광고/sponsored 클리닉 들어갈 위치를 사이트에서 미리 reserve.
 *  운영자가 위치/사이즈/문구 변경 없이 광고 코드만 wiring 하면 됨.
 *  variant: banner(가로 thin), square(정사각), inline(중간 텍스트)
 */
export function AdPlaceholder({
  variant = "banner",
  label = "Sponsored",
  hint,
}: {
  variant?: "banner" | "square" | "inline";
  label?: string;
  hint?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (client) {
    // 실제 AdSense — placeholder 대신 진짜 광고 렌더
    return (
      <ins
        className="adsbygoogle block my-4"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }
  // Placeholder — 운영자가 광고 자리 시각화하기 위해 보이는 박스
  // 모바일에서 광고 자리가 너무 크면 fold 차지 → 모바일 작게
  const size =
    variant === "banner"
      ? "h-16 md:h-32"
      : variant === "square"
      ? "h-32 md:h-56"
      : "h-14 md:h-20";
  return (
    <div
      aria-label="Sponsored slot"
      className={`relative my-6 ${size} border-2 border-dashed border-[var(--border)] rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center gap-1 text-center px-4`}
    >
      <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
        {label}
      </span>
      {hint && <span className="text-xs text-[var(--muted)]">{hint}</span>}
      <span className="text-[10px] text-[var(--muted)] opacity-60">Reserved for sponsored partner</span>
    </div>
  );
}
