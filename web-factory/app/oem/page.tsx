import { loadMasterDb } from "@/lib/data";
import { OEM_VERTICALS, matchedSuppliers } from "@/lib/oemVerticals";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OEM / ODM Factories in Thailand — Find a Manufacturing Partner",
  description:
    "Find OEM/ODM manufacturers in Thailand by product category — cosmetics, food & beverage, garment, furniture, electronics, injection molding, medical devices. DBD-verified factory data, direct contact, no sourcing-agent markup.",
  alternates: {
    canonical: "/oem",
    languages: {
      "en-US": "/oem",
      "x-default": "/oem",
    },
  },
};

const OEM_FAQS = [
  {
    q: "What does OEM/ODM mean in this context?",
    a: "OEM (Original Equipment Manufacturer) means the factory produces goods to your specification under your brand. ODM (Original Design Manufacturer) means the factory can also develop the design or formulation for you, not just execute a spec you supply. Most factories listed here do both, depending on the order.",
  },
  {
    q: "Why Thailand for OEM manufacturing instead of China or Vietnam?",
    a: "Thailand sits in the middle on cost — generally above Vietnam and China on unit labor, but with lower minimum order quantities, faster regional shipping to Southeast Asia and Australia, and BOI (Board of Investment) tax incentives that keep export-oriented factories competitive. It's a stronger fit for smaller brands, faster iteration, and buyers who want to inspect a factory in person without a 20-hour flight.",
  },
  {
    q: "How do I verify a Thai factory is a real, registered company?",
    a: "Every factory in this directory is cross-checked against Thailand's Department of Business Development (DBD) company registry — legal name, 13-digit registration number, registered capital, and founding date, where matched. Look for the DBD registry table on each product category page.",
  },
];

export default async function OemIndexPage() {
  const db = await loadMasterDb();
  const counts = OEM_VERTICALS.map((v) => ({
    v,
    count: matchedSuppliers(v, db.suppliers).length,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>OEM / ODM Factories</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          OEM / ODM Factories in Thailand, by Product
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl text-balance">
          Skip the sourcing-agent markup. Every factory below is cross-checked against
          Thailand&apos;s official DBD company registry and ranked by real Google review
          history — not a paid supplier badge. Pick a product category to see MOQ,
          lead time, and certification norms for that vertical.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {counts.map(({ v, count }) => (
          <a
            key={v.slug}
            href={`/oem/${v.slug}`}
            className="group block bg-white border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--gold)] hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0" aria-hidden>{v.icon}</div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-lg leading-snug group-hover:text-[var(--gold-deep)] transition mb-1">
                  {v.title}
                </h2>
                <p className="text-sm text-[var(--muted)] line-clamp-2 mb-2">{v.intro}</p>
                <span className="inline-block text-xs font-bold text-[var(--gold-deep)] bg-[var(--gold-bg)] px-2 py-0.5 rounded-full tabular-nums">
                  {count.toLocaleString()} factories
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-bold mb-4">OEM/ODM Sourcing — FAQ</h2>
        <div className="space-y-3">
          {OEM_FAQS.map((f, i) => (
            <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
              <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "OEM / ODM Factories", url: "/oem" },
      ]} />
      <FaqJsonLd faqs={OEM_FAQS} />
    </div>
  );
}
