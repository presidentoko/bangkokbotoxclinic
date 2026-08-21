"use client";

// AffiliateInline — supplier directory edition.
// 디렉토리는 사용자가 supplier 에 직접 연락하는 모델 (no booking platform).
// 자리는 두되 상시 노출은 안 함 — 향후 RFQ / verified-supplier upsell slot 으로 활용.

import { useEffect, useRef } from "react";

export function AffiliateInline(_props: { category?: string; district?: string }) {
  // v1: no-op. 추후 RFQ submit form / 'verified supplier' upsell 로 확장.
  return null;
}

// AdSense 슬롯. NEXT_PUBLIC_ADSENSE_CLIENT 가 비어 있으면 아무것도 렌더하지 않는다.
//
// ⚠️ 예전에는 <ins> 태그만 그렸다. AdSense 는 (1) 페이지에 adsbygoogle.js 로더가
// 있고 (2) 슬롯마다 push({}) 를 호출해야 광고를 채우는데 둘 다 없었다. 그래서
// client ID 를 넣는 순간 사이트 13곳에 영구히 빈 상자가 생기는 상태였다.
// 로더는 components/Analytics.tsx 옆의 AdSenseLoader 가 <head> 에 넣고,
// 여기서는 슬롯별 push 를 담당한다.
export function AdSlot({ slot }: { slot: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // 광고 차단기 등으로 로더가 없을 수 있다. 페이지는 그대로 동작해야 한다.
    }
  }, [client]);

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
