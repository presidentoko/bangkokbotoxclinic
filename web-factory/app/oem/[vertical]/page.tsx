import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { OEM_VERTICALS, findOemVertical, matchedSuppliers } from "@/lib/oemVerticals";
import { CATEGORY_LABELS } from "@/lib/types";
import { SupplierCard } from "@/components/SupplierCard";
import { DbdRegistryTable } from "@/components/DbdRegistryTable";
import { RfqForm } from "@/components/RfqForm";
import { SupplierAlertSignup } from "@/components/SupplierAlertSignup";
import { AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import { ShareButton } from "@/components/ShareButton";
import { BreadcrumbJsonLd, FaqJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  return OEM_VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ vertical: string }> }
): Promise<Metadata> {
  const { vertical } = await params;
  const v = findOemVertical(vertical);
  if (!v) return { title: "Not found" };
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    keywords: [v.title, `${v.title} Thailand`, "Thailand OEM", "Thailand ODM", "Thai manufacturer", "DBD verified"],
    alternates: { canonical: `/oem/${vertical}` },
    twitter: { card: "summary_large_image" },
  };
}

export default async function OemVerticalPage(
  { params }: { params: Promise<{ vertical: string }> }
) {
  const { vertical } = await params;
  const v = findOemVertical(vertical);
  if (!v) notFound();

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(matchedSuppliers(v, db.suppliers));
  const verifiedCount = filtered.filter((r) => r.verified).length;
  const relatedLabel = v.relatedCategorySlug ? CATEGORY_LABELS[v.relatedCategorySlug] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/oem" className="hover:text-[var(--fg)]">OEM / ODM</a>
        <span className="mx-2">›</span>
        <span>{v.title}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
          <span aria-hidden>{v.icon}</span>
          <span>{v.title} in Thailand</span>
        </h1>
        <div className="shrink-0 mt-1">
          <ShareButton url={`/oem/${vertical}`} title={`${v.title} — Thailand Factory Directory`} variant="compact" />
        </div>
      </div>

      <p className="text-[var(--muted)] mb-6 leading-relaxed text-balance max-w-2xl">{v.intro}</p>

      <div className="flex flex-wrap gap-2 text-xs mb-8">
        <span className="bg-[var(--gold-bg)] text-[var(--gold-deep)] px-2.5 py-1 rounded-full font-medium tabular-nums">
          {filtered.length.toLocaleString()} factories
        </span>
        {verifiedCount > 0 && (
          <span className="bg-[var(--gold)] text-white px-2.5 py-1 rounded-full font-medium tabular-nums">
            ✓ {verifiedCount.toLocaleString()} DBD-verified
          </span>
        )}
        {relatedLabel && (
          <a
            href={`/c/${v.relatedCategorySlug}`}
            className="bg-white border border-[var(--border)] px-2.5 py-1 rounded-full font-medium hover:border-[var(--gold)] transition"
          >
            See all {relatedLabel} →
          </a>
        )}
      </div>

      {/* MOQ / lead time / certifications — this is what a buyer researching an
          OEM vertical actually needs before they even open a factory profile.
          Answer-engine bait: structured, sourced, quotable in one block. */}
      <section className="mb-10 grid sm:grid-cols-3 gap-4">
        <InfoCard icon="📦" label="Typical MOQ" body={v.moq} />
        <InfoCard icon="⏱️" label="Typical Lead Time" body={v.leadTime} />
        <InfoCard icon="📋" label="Common Certifications" body={v.certifications.join(" · ")} />
      </section>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No factories matched yet — check back after the next data refresh.</p>
      ) : (
        <section>
          <h2 className="text-xl font-bold mb-4">{v.title} — Ranked by Trust Score</h2>
          <div className="grid gap-3">
            {filtered.slice(0, 12).map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
          <AdSlot slot={`oem-${vertical}-mid`} />
          <div className="my-6">
            <SupplierAlertSignup category={v.title} compact />
          </div>
          {filtered.length > 12 && (
            <div className="grid gap-3 mt-3">
              {filtered.slice(12, 30).map((r, i) => (
                <SupplierCard key={r.id} r={r} rank={i + 13} />
              ))}
            </div>
          )}
        </section>
      )}

      <DbdRegistryTable suppliers={filtered} label={v.title} locale="en" />

      <section className="mt-12 bg-white border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-2">Get matched with 3 {v.title.toLowerCase()} factories</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Tell us your product, target MOQ, and target market — we&apos;ll point you at
          the factories in this list best suited to your order, no commission.
        </p>
        <RfqForm locale="en" supplierName={`OEM inquiry — ${v.title}`} />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">{v.title} — FAQ</h2>
        <div className="space-y-3">
          {v.faqs.map((f, i) => (
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

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Other OEM/ODM verticals
        </h2>
        <div className="flex flex-wrap gap-2">
          {OEM_VERTICALS.filter((x) => x.slug !== v.slug).map((x) => (
            <a
              key={x.slug}
              href={`/oem/${x.slug}`}
              className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition"
            >
              {x.icon} {x.title.replace(/ OEM.*$/, "")}
            </a>
          ))}
        </div>
      </section>

      <CollectionPageJsonLd
        name={v.title}
        description={v.metaDescription}
        url={`/oem/${vertical}`}
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "OEM / ODM", url: "/oem" },
        { name: v.title, url: `/oem/${vertical}` },
      ]} />
      <FaqJsonLd faqs={v.faqs} />
      <ItemListJsonLd
        name={`Top ${v.title} in Thailand`}
        description={v.intro}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}

function InfoCard({ icon, label, body }: { icon: string; label: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </div>
      <p className="text-sm leading-relaxed">{body}</p>
    </div>
  );
}
