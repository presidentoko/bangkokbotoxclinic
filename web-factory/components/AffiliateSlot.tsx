// AffiliateInline — supplier directory edition.
// 디렉토리는 사용자가 supplier 에 직접 연락하는 모델 (no booking platform).
// 자리는 두되 상시 노출은 안 함 — 향후 RFQ / verified-supplier upsell slot 으로 활용.

export function AffiliateInline(_props: { category?: string; district?: string }) {
  // v1: no-op. 추후 RFQ submit form / 'verified supplier' upsell 로 확장.
  return null;
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
