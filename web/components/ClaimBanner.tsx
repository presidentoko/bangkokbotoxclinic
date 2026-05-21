// ClaimBanner — stub 클리닉 페이지 상단에 "사장님? 무료 dashboard claim" CTA.
// Server component. inbound 영업 lead 생성. /onboarding/partner?clinic=<id> 로 prefill.

export function ClaimBanner({
  clinicId,
  clinicName,
  accent = "#2563eb",
}: {
  clinicId: string;
  clinicName: string;
  accent?: string;
}) {
  return (
    <aside
      className="mb-5 rounded-xl border-2 p-4 md:p-5 relative overflow-hidden"
      style={{ borderColor: accent, background: `linear-gradient(105deg, ${accent}10 0%, white 60%)` }}
    >
      <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
        <div className="text-3xl md:text-4xl shrink-0 leading-none mt-1" aria-hidden>
          🩺
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-widest font-black mb-1" style={{ color: accent }}>
            Unclaimed listing
          </div>
          <h2 className="font-black text-base md:text-lg leading-snug">
            Is <span className="underline decoration-2 underline-offset-2" style={{ textDecorationColor: accent }}>{clinicName}</span> yours?
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
            Get a <strong className="text-[var(--fg)]">free reputation dashboard</strong> — live Trust Score, AI reply drafts for new reviews,
            and qualified lead routing to your LINE. <strong className="text-[var(--fg)]">No credit card.</strong> 30-day pilot.
          </p>
        </div>
        <a
          href={`/onboarding/partner?clinic=${encodeURIComponent(clinicId)}`}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap"
          style={{ background: accent }}
        >
          Claim this listing <span aria-hidden>→</span>
        </a>
      </div>
    </aside>
  );
}
