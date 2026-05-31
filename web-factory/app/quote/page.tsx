import type { Metadata } from "next";
import { BulkQuoteClient } from "@/components/BulkQuoteClient";

export const metadata: Metadata = {
  title: "Request a Bulk Quote — Contact Multiple Suppliers at Once",
  description:
    "Send one inquiry to every supplier on your shortlist. Build a list as you browse, then request quotes from all of them in a single message.",
  alternates: { canonical: "/quote" },
  robots: { index: false, follow: true },
};

export default function QuotePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Bulk Quote</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Request one quote from your shortlist</h1>
      <p className="text-[var(--muted)] leading-relaxed mb-8">
        Tell us what you need once — we relay your request to every supplier you selected. No middleman fee,
        no repeating yourself for each company.
      </p>
      <BulkQuoteClient />
    </div>
  );
}
