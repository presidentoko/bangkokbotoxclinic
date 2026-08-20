// 어필리에이트 inline slot — 비교 카드 형식. Klook + 추가 옵션.

import { klookSearchLink } from "@/lib/affiliate";

type Lang = "en" | "ko" | "th";

const COPY: Record<Lang, {
  sponsored: string; compareIn: string; compareGeneric: string; support: string;
  klook: string; klookDesc: string; tripadvisor: string; tripadvisorDesc: string; disclosure: string;
}> = {
  en: {
    sponsored: "Booking partners · sponsored", compareIn: "Compare {category} packages in {district}", compareGeneric: "Compare aesthetic packages in Bangkok",
    support: "English / Korean support · instant confirmation",
    klook: "Klook", klookDesc: "Pre-booked packages, fixed prices",
    tripadvisor: "Tripadvisor", tripadvisorDesc: "Reviews from international visitors",
    disclosure: "We may earn a small commission on bookings made through these partner links — at no extra cost to you. Organic listings are never paid.",
  },
  ko: {
    sponsored: "예약 파트너 · 광고", compareIn: "{district} {category} 패키지 비교", compareGeneric: "방콕 시술 패키지 비교",
    support: "영어 / 한국어 지원 · 즉시 확정",
    klook: "클룩", klookDesc: "사전 예약 패키지, 고정가",
    tripadvisor: "트립어드바이저", tripadvisorDesc: "해외 방문객 리뷰",
    disclosure: "이 파트너 링크를 통한 예약 시 소정의 수수료를 받을 수 있습니다 — 이용자에게 추가 비용은 없습니다. 오가닉 리스팅은 광고비를 받지 않습니다.",
  },
  th: {
    sponsored: "พาร์ตเนอร์การจอง · สปอนเซอร์", compareIn: "เปรียบเทียบแพ็กเกจ{category}ใน{district}", compareGeneric: "เปรียบเทียบแพ็กเกจความงามในกรุงเทพฯ",
    support: "รองรับภาษาอังกฤษ / เกาหลี · ยืนยันทันที",
    klook: "Klook", klookDesc: "แพ็กเกจจองล่วงหน้า ราคาคงที่",
    tripadvisor: "Tripadvisor", tripadvisorDesc: "รีวิวจากนักท่องเที่ยวต่างชาติ",
    disclosure: "เราอาจได้รับค่าคอมมิชชั่นเล็กน้อยจากการจองผ่านลิงก์พาร์ตเนอร์เหล่านี้ — โดยไม่มีค่าใช้จ่ายเพิ่มเติมสำหรับคุณ รายการทั่วไปไม่มีการจ่ายเงินโฆษณา",
  },
};

export function AffiliateInline({ category, district, lang = "en" }: {
  category?: string;
  district?: string;
  lang?: Lang;
}) {
  const t = COPY[lang] ?? COPY.en;
  const query = [category, district, "Bangkok"].filter(Boolean).join(" ");
  const klook = klookSearchLink(query);
  const label = category
    ? t.compareIn.replace("{category}", category).replace("{district}", district || "Bangkok")
    : t.compareGeneric;

  return (
    <aside className="my-6 border border-[var(--border)] rounded-2xl p-5 bg-gradient-to-br from-violet-50 via-white to-blue-50 shadow-sm">
      <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
            {t.sponsored}
          </div>
          <h3 className="text-base font-bold mt-1">{label}</h3>
        </div>
        <span className="text-xs text-[var(--muted)]">{t.support}</span>
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
              <div className="font-bold text-sm">{t.klook}</div>
              <div className="text-xs text-[var(--muted)]">{t.klookDesc}</div>
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
              <div className="font-bold text-sm">{t.tripadvisor}</div>
              <div className="text-xs text-[var(--muted)]">{t.tripadvisorDesc}</div>
            </div>
          </div>
          <span className="text-emerald-600 group-hover:translate-x-1 transition shrink-0">→</span>
        </a>
      </div>
      <p className="text-[10px] text-[var(--muted)] mt-3 leading-relaxed">
        {t.disclosure}
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

/** AdSense 설정돼 있을 때만 렌더 — 미설정이면 null (2026-07-17 감사 이전엔
 *  운영자용 자리표시 박스를 실사용자에게 노출했음). */

export function AdPlaceholder({
  variant = "banner",
}: {
  variant?: "banner" | "square" | "inline";
  label?: string;
  hint?: string;
  lang?: Lang;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    // AdSense 미설정이면 실사용자에게 빈 자리표시(내부 운영 메모 "Reserved for
    // sponsored partner" 포함)를 보여주던 걸 제거 — 광고 없는 사이트처럼
    // 보이지 않고 마치 미완성/광고 최우선 사이트처럼 보였음 (2026-07-17 감사).
    return null;
  }
  void variant;
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
