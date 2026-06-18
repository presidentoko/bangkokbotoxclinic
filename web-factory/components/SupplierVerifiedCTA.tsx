"use client";

// Self-serve Verified badge purchase.
// After payment, email proof to NEXT_PUBLIC_CONTACT_EMAIL with company name + DBD reg no.
// - Set NEXT_PUBLIC_STRIPE_VERIFIED_LINK to your Stripe Payment Link URL (create at dashboard.stripe.com/payment-links)
// - Set NEXT_PUBLIC_LINE_OA_URL to your LINE OA URL (e.g. https://line.me/R/ti/p/@yourID)
// - Put your PromptPay QR PNG at public/promptpay-verified.png

const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_VERIFIED_LINK || "";
const LINE_OA = process.env.NEXT_PUBLIC_LINE_OA_URL || "";

export function SupplierVerifiedCTA() {
  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
      <div className="mb-5">
        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          Most popular
        </span>
        <h3 className="text-2xl font-bold">Verified Supplier Badge — ฿5,000</h3>
        <p className="text-sm text-[var(--muted)] mt-1">
          One-time. Badge stays as long as your DBD registration remains active.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 items-start">
        {/* PromptPay QR */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">
            Pay via PromptPay
          </p>
          <img
            src="/promptpay-verified.png"
            alt="PromptPay QR — ฿5,000 Verified Badge"
            className="w-40 h-40 mx-auto rounded-xl border border-[var(--border)] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="text-xs text-[var(--muted)] mt-2">
            Scan with any Thai banking app
          </p>
        </div>

        {/* Online payment + LINE */}
        <div className="space-y-3">
          {STRIPE_LINK && (
            <a
              href={STRIPE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition"
            >
              Pay online — ฿5,000
            </a>
          )}
          {LINE_OA && (
            <a
              href={LINE_OA}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-[#06C755] text-[#06C755] font-bold hover:bg-[#06C755]/5 transition"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.630 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              Chat on LINE OA
            </a>
          )}
          <p className="text-xs text-[var(--muted)] text-center">
            After payment, email your company name + DBD registration number to confirm.
          </p>
        </div>
      </div>
    </div>
  );
}
