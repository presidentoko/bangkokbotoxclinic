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

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; for?: string; ref?: string; id?: string }>;
}) {
  const params = await searchParams;
  const cfg = getSiteConfig();
  const amount = Math.max(0, Math.min(1_000_000, Number(params.amount) || 0));
  const partnerName = params.for || "";
  const reference = params.ref || "";
  const clinicId = params.id || "";

  if (!amount) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Payment link incomplete</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          This link is missing the amount. Please request a fresh payment link from {cfg.brand}.
        </p>
        <a href="/contact" className="inline-block rounded-lg bg-emerald-600 text-white px-5 py-2.5 font-bold">Contact us</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">{cfg.brand}</div>
        <h1 className="text-3xl font-bold mt-1">Complete your payment</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          Direct Thai bank transfer · No card needed · Dashboard activates within 4 business hours
        </p>
      </div>

      <PromptPayQR
        amountTHB={amount}
        partnerName={partnerName}
        reference={reference}
        clinicId={clinicId}
      />

      <div className="mt-6 text-center text-xs text-[var(--muted)]">
        Questions? <a href="https://line.me/R/ti/p/@405zhjqb" target="_blank" rel="noopener noreferrer" className="font-bold underline">LINE us</a> or email <a href="mailto:billing@bkkclinics.com" className="font-bold underline">billing@bkkclinics.com</a>
      </div>
    </div>
  );
}
