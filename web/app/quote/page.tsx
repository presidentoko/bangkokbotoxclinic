import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuoteForm from "@/components/auction/QuoteForm";
import { getSiteConfig } from "@/lib/site";

// 견적 경매는 보톡스 사이트에서만 연다 (2026-10-31).
export const metadata: Metadata = {
  title: "Get Botox Quotes from Bangkok Clinics",
  description: "Tell us what you want done. Bangkok clinics send you their prices, you compare and pick one. Free, no account.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  if (getSiteConfig().focus !== "botox") notFound();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Get quotes from Bangkok clinics</h1>
      <p className="text-base text-[var(--muted)] mb-6 leading-relaxed">
        Tell us what you want done. We ask clinics to send you their price, brand and what&apos;s included.
        You compare the quotes side by side and pick one — then we put you in touch. Free, no account.
      </p>
      <ol className="grid sm:grid-cols-3 gap-3 mb-8 text-sm">
        <li className="border border-[var(--border)] rounded-lg p-3"><strong className="block">1. Request</strong>Takes a minute.</li>
        <li className="border border-[var(--border)] rounded-lg p-3"><strong className="block">2. Clinics quote</strong>Within 48 hours.</li>
        <li className="border border-[var(--border)] rounded-lg p-3"><strong className="block">3. You pick</strong>We connect you.</li>
      </ol>
      <QuoteForm />
    </div>
  );
}
