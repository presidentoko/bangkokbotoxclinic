// /pay?amount=X&for=ClinicName&ref=XXX&id=clinic_id
// Public payment page — owner DMs/emails this link to partner clinic.
// Partner scans QR → pays via Thai bank app → clicks "I paid" → Telegram alert.

import PromptPayQR from "@/components/PromptPayQR";
import { getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Payment — PromptPay",
  description: "Secure Thai bank transfer via PromptPay QR. Direct bank-to-bank, no card data stored.",
  robots: { index: false, follow: false },
};

// 2026-08-20: 예전엔 5,000/8,000/15,000 세 금액만 허용하는 고정 allowlist 였다.
// 광고 단가는 문의가 올 때마다 건별로 정하는데, 그 목록에 없는 금액(예 ฿10,000)
// 으로 링크를 보내면 광고주가 "Payment link invalid" 화면을 보게 된다 — 합의까지
// 끝난 거래가 마지막 단계에서 막히는 셈이다.
// allowlist 를 없애되 검증은 남긴다: 정수, 그리고 오타·장난 링크를 거르는 범위.
const MIN_AMOUNT_THB = 500;
const MAX_AMOUNT_THB = 500000;
function validAmount(n: number): boolean {
  return Number.isInteger(n) && n >= MIN_AMOUNT_THB && n <= MAX_AMOUNT_THB;
}
const PLAN_LABELS: Record<string, string> = {
  cpl: "CPL Leads — ฿50/lead",
  featured: "Featured Listing",
  intelligence: "Market Intelligence",
  pilot: "30-Day Pilot",
};
const ALLOWED_PLANS = new Set(Object.keys(PLAN_LABELS));

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; for?: string; ref?: string; id?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const cfg = getSiteConfig();
  const rawAmount = Number(params.amount) || 0;
  const amount = validAmount(rawAmount) ? rawAmount : 0;
  const rawPlan = params.plan || "";
  const plan = ALLOWED_PLANS.has(rawPlan) ? rawPlan : "";
  const planLabel = PLAN_LABELS[plan] || "";
  const partnerName = params.for || "";
  const reference = params.ref || "";
  const clinicId = params.id || "";

  if (!amount) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Payment link invalid</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          This link is missing a valid amount (it must be a whole number between
          ฿{MIN_AMOUNT_THB.toLocaleString()} and ฿{MAX_AMOUNT_THB.toLocaleString()}).
          Please request a fresh payment link from {cfg.brand}.
        </p>
        <a href="/for-clinics#plans" className="inline-block rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-bold">View plans</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">{cfg.brand}</div>
        <h1 className="text-3xl font-bold mt-1">Complete your payment</h1>
        {planLabel && (
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
            {planLabel}
          </div>
        )}
        <p className="text-sm text-[var(--muted)] mt-2">
          Direct Thai bank transfer · No card needed · Dashboard activates within 4 business hours
        </p>
      </div>

      <PromptPayQR
        amountTHB={amount}
        partnerName={partnerName}
        reference={reference || plan}
        clinicId={clinicId}
      />

      <div className="mt-6 text-center text-xs text-[var(--muted)]">
        Questions? Email <a href="mailto:billing@bkkclinics.com" className="font-bold underline">billing@bkkclinics.com</a>
      </div>
    </div>
  );
}
