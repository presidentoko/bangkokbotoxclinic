import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach our team for restaurant partnerships, data corrections, press, or general questions.",
  alternates: { canonical: "/contact" },
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
        For partnerships, data corrections, press, or general questions, email us. We typically respond within 24 hours.
      </p>

      <div className="space-y-3">
        <Reason
          icon="🤝"
          title="Restaurant partnership"
          body="Editor's Pick / Recommended / Featured listings, sponsored placement — see /for-restaurants for pricing and details."
        />
        <Reason
          icon="✏️"
          title="Data correction"
          body="Wrong address, closed restaurant, hours outdated. Tell us the restaurant name + the issue."
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
          Include the relevant restaurant name or page URL when applicable.
        </p>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg"}`}
          className="inline-flex items-center gap-2 bg-black text-white py-3 px-5 rounded-lg font-bold hover:bg-gray-800 text-base"
        >
          <span aria-hidden>✉</span>
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg"}
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
