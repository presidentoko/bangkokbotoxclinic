import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { RfqForm } from "@/components/RfqForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach our team for supplier partnerships, data corrections, press, or general questions.",
  alternates: {
    canonical: "/contact",
    languages: {
      "en-US": "/contact",
      "ko-KR": "/ko/contact",
      "th-TH": "/th/contact",
      "x-default": "/contact",
    },
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Contact</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">Contact</h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        Partnerships, data corrections, press, or general questions — fill in the form and we&apos;ll respond within one business day.
      </p>

      <div className="space-y-3 mb-8">
        <Reason icon="🏭" title="Supplier partnership" body="Editor's Pick / Recommended / Featured listings — see /for-suppliers for tiers and pricing." />
        <Reason icon="✏️" title="Data correction" body="Wrong address, closed plant, hours outdated, miscategorization. Tell us the supplier name and the issue." />
        <Reason icon="📰" title="Press / media" body="Industry data, methodology questions, interview requests." />
        <Reason icon="❓" title="General" body="Anything else. We read every message." />
      </div>

      <RfqForm locale="en" />

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
      ]} />
    </div>
  );
}

function Reason({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3 p-4 bg-white border border-[var(--border)] rounded-lg">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <div className="font-bold text-sm">{title}</div>
        <p className="text-xs text-[var(--muted)] mt-0.5">{body}</p>
      </div>
    </div>
  );
}
