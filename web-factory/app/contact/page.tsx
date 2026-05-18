import { BreadcrumbJsonLd } from "@/components/JsonLd";
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
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg";
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Contact</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">Contact</h1>
      <p className="text-base text-[var(--muted)] mb-8 leading-relaxed">
        Partnerships, data corrections, press, or general questions — email us. We typically respond within one business day.
      </p>

      <div className="space-y-3">
        <Reason
          icon="🏭"
          title="Supplier partnership"
          body="Editor's Pick / Recommended / Featured listings, sponsored placement, lead generation — see /for-suppliers for tiers and pricing."
        />
        <Reason
          icon="✏️"
          title="Data correction"
          body="Wrong address, closed plant, hours outdated, miscategorization. Tell us the supplier name and the issue."
        />
        <Reason
          icon="📰"
          title="Press / media"
          body="Industry data, methodology questions, interview requests."
        />
        <Reason
          icon="❓"
          title="General"
          body="Anything else. We read every message."
        />
      </div>

      <div className="mt-8 bg-white border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-2">Email us</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Include the supplier name or page URL where applicable.
        </p>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 bg-black text-white py-3 px-5 rounded-lg font-bold hover:bg-gray-800 text-base"
        >
          <span aria-hidden>✉</span>
          {email}
        </a>
      </div>

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
