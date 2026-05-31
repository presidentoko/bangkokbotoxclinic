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

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <a
          href="mailto:thaiconnect33@gmail.com"
          className="bg-white border border-[var(--border)] rounded-xl p-5 hover:border-[var(--fg)] transition"
        >
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Email</div>
          <div className="font-bold text-base break-all">thaiconnect33@gmail.com</div>
          <div className="text-xs text-[var(--muted)] mt-1">Replies within 1 business day</div>
        </a>

        <a
          href="https://line.me/ti/p/~838wyfih"
          target="_blank"
          rel="noopener"
          className="bg-white border border-[var(--border)] rounded-xl p-5 hover:border-[var(--fg)] transition"
        >
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">LINE</div>
          <div className="font-bold text-base">@838wyfih</div>
          <div className="text-xs text-[var(--muted)] mt-1">Fastest for quick RFQ questions</div>
        </a>

        <a
          href="https://wa.me/66610934014"
          target="_blank"
          rel="noopener"
          className="bg-white border border-[var(--border)] rounded-xl p-5 hover:border-[var(--fg)] transition"
        >
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">WhatsApp / Phone</div>
          <div className="font-bold text-base">+66 61 093 4014</div>
          <div className="text-xs text-[var(--muted)] mt-1">EN · KO · TH</div>
        </a>

        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Bangkok office</div>
          <div className="font-bold text-sm leading-snug">
            3rd floor, 272 Than Thip 3 Alley
          </div>
          <div className="text-sm leading-snug">
            Phlabphla, Wang Thonglang
          </div>
          <div className="text-sm leading-snug">
            Bangkok 10310
          </div>
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
    <div className="flex gap-3 p-4 bg-white border border-[var(--border)] rounded-lg">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <div className="font-bold text-sm">{title}</div>
        <p className="text-xs text-[var(--muted)] mt-0.5">{body}</p>
      </div>
    </div>
  );
}
