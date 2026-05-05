import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { CATEGORY_LABELS, TOPIC_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ClinicJsonLd } from "@/components/JsonLd";
import { LeadCapture } from "@/components/LeadCapture";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  // 모든 클리닉을 정적 빌드 — Tier 미적용 (현재 587개 → 빌드 가능 규모)
  return db.clinics.map((c) => ({ id: c.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) return { title: "Clinic not found" };
  const cats = c.categories.map((x) => CATEGORY_LABELS[x] ?? x).join(", ");
  return {
    title: `${c.name} — Reviews & Trust Score`,
    description: `${c.name} in ${c.district || "Bangkok"}: ★${c.rating} (${c.total_reviews} reviews). Trust Score ${c.trust_score}. ${cats || "Aesthetic clinic"}.`,
  };
}

export default async function ClinicPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) notFound();

  const trend = c.rating_trend.trend;
  const topTopics = c.mentioned_topics.slice(0, 8);
  const samples = [...c.sample_reviews_en, ...c.sample_reviews_th].slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        {c.district && (
          <>
            <span className="mx-2">›</span>
            <a
              href={`/d/${c.district.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-[var(--fg)]"
            >
              {c.district}
            </a>
          </>
        )}
        <span className="mx-2">›</span>
        <span>{c.name}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{c.name}</h1>
      <p className="text-[var(--muted)] mb-4">{c.primary_type} {c.district && `· ${c.district}`}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="bg-yellow-50 text-yellow-900 px-3 py-1 rounded-md text-sm font-semibold">
          ★ {c.rating.toFixed(1)} ({c.total_reviews.toLocaleString()})
        </span>
        <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-md text-sm font-semibold">
          Trust Score {c.trust_score}
        </span>
        {c.local_guide_count > 0 && (
          <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-md text-sm">
            Verified by {c.local_guide_count} Local Guides
          </span>
        )}
        {trend === "improving" && (
          <span className="bg-green-50 text-green-800 px-3 py-1 rounded-md text-sm">
            ↗ Trending up
          </span>
        )}
        {trend === "declining" && (
          <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-md text-sm">
            ↘ Quality declining
          </span>
        )}
        {c.business_status && (
          <span className={`px-3 py-1 rounded-md text-sm ${c.business_status === "Open" ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-700"}`}>
            {c.business_status}
          </span>
        )}
      </div>

      {topTopics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
            What reviewers mention
          </h2>
          <div className="flex flex-wrap gap-2">
            {topTopics.map((t) => (
              <span key={t.topic} className="bg-white border border-[var(--border)] px-3 py-1 rounded-full text-sm">
                {TOPIC_LABELS[t.topic] ?? t.topic} <span className="text-[var(--muted)]">×{t.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {c.categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
            Services mentioned
          </h2>
          <div className="flex flex-wrap gap-2">
            {c.categories.map((cat) => (
              <a
                key={cat}
                href={`/c/${cat}`}
                className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-100"
              >
                {CATEGORY_LABELS[cat] ?? cat}
                {c.service_mentions[cat] ? ` · ${c.service_mentions[cat]} mentions` : ""}
              </a>
            ))}
          </div>
        </section>
      )}

      {samples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
            Real review excerpts
          </h2>
          <div className="grid gap-3">
            {samples.map((r, i) => (
              <blockquote key={i} className="border-l-4 border-[var(--accent)] bg-white px-4 py-3 rounded-r">
                <p className="text-sm">{r.text}</p>
                <footer className="mt-1.5 text-xs text-[var(--muted)]">
                  — {r.author} · ★{r.rating}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Address</div>
          <div className="text-sm">{c.address || "—"}</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Phone</div>
          <div className="text-sm">{c.phone || "—"}</div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <a
          href={c.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[200px] bg-black text-white py-3 px-4 rounded-lg font-bold text-center hover:bg-gray-800"
        >
          View on Google Maps
        </a>
        {c.phone && (
          <a
            href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
            className="flex-1 min-w-[200px] bg-white border border-[var(--border)] py-3 px-4 rounded-lg font-bold text-center hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Call Clinic
          </a>
        )}
        {c.website && (
          <a
            href={c.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1 min-w-[200px] bg-white border border-[var(--border)] py-3 px-4 rounded-lg font-bold text-center hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Visit Website
          </a>
        )}
      </section>

      <LeadCapture clinicName={c.name} context="clinic_detail" />

      <ClinicJsonLd c={c} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        ...(c.district ? [{ name: c.district, url: `/d/${c.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: c.name, url: `/clinic/${c.id}` },
      ]} />
    </div>
  );
}
