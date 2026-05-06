// 어필리에이트 인라인 슬롯. Klook 검색링크로 deeplink — 미용 패키지 commission.
// 사용처: 카테고리 페이지, 클리닉 상세 페이지 (sticky 또는 inline).

import { klookSearchLink } from "@/lib/affiliate";

export function AffiliateInline({ category, district }: {
  category?: string;
  district?: string;
}) {
  const query = [category, district, "Bangkok"].filter(Boolean).join(" ");
  const href = klookSearchLink(query);
  const label = category
    ? `Compare ${category} packages in ${district || "Bangkok"}`
    : "Compare aesthetic packages in Bangkok";

  return (
    <aside className="my-6 border border-[var(--border)] rounded-xl p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">
            Booking partner
          </div>
          <p className="text-sm font-medium">
            {label} via Klook
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            Pre-booked packages with English support, instant confirmation.
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener sponsored nofollow"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 whitespace-nowrap"
        >
          See packages →
        </a>
      </div>
    </aside>
  );
}

// AdSense placeholder — 환경변수에 클라이언트 ID 있을 때만 렌더.
export function AdSlot({ slot }: { slot: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return null; // dev/initial 단계엔 안 띄움
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
