import { BookingForm } from "@/components/BookingForm";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach our team for clinic partnerships, data corrections, press, or general questions.",
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
        Use the form below for clinic partnerships, data corrections, press enquiries, or general questions. We typically respond within 24 hours.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-lg mb-3">Common reasons to contact</h2>
          <ul className="space-y-2 text-sm">
            <Reason
              icon="🤝"
              title="Clinic partnership"
              body="CPL, Featured listings, Market intelligence — see /for-clinics for details."
            />
            <Reason
              icon="✏️"
              title="Data correction"
              body="Wrong address, closed clinic, hours outdated. Tell us the clinic name + the issue."
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
          </ul>
        </div>

        <div>
          <BookingForm />
        </div>
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
    <li className="flex gap-3 p-3 bg-white border border-[var(--border)] rounded-lg">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <div className="font-bold text-sm">{title}</div>
        <p className="text-xs text-[var(--muted)] mt-0.5">{body}</p>
      </div>
    </li>
  );
}
