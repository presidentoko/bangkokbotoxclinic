import { notFound } from "next/navigation";
import { GUIDES_TH, findGuideTh } from "@/lib/guides_th";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export async function generateStaticParams() {
  return GUIDES_TH.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuideTh(slug);
  if (!g) return { title: "Guide not found" };
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: {
      canonical: `/th/guide/${slug}`,
      languages: {
        "en-US": `/guide/${slug}`,
        "ko-KR": `/ko/guide/${slug}`,
        "th-TH": `/th/guide/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "th_TH",
      title: g.title,
      description: g.metaDescription,
      publishedTime: g.updated,
      modifiedTime: g.updated,
    },
  };
}

export default async function ThGuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const g = findGuideTh(slug);
  if (!g) notFound();

  const db = await loadMasterDb();
  const featured = topByTrust(db.restaurants, 6);
  const related = (g.related ?? []).map((s) => findGuideTh(s)).filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    inLanguage: "th",
    datePublished: g.updated,
    dateModified: g.updated,
    publisher: { "@type": "Organization", name: "Thailand Golf Guide", url: SITE },
    author: { "@type": "Organization", name: "Thailand Golf Guide Editorial" },
    mainEntityOfPage: `${SITE}/th/guide/${g.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
        <span className="mx-2">›</span>
        <a href="/th/guide" className="hover:text-[var(--fg)]">คู่มือ</a>
        <span className="mx-2">›</span>
        <span>{g.title.replace(/ \(\d{4}\)$/, "")}</span>
      </nav>

      <header className="mb-8">
        <div className="text-xs text-[var(--muted)] mb-2">
          ภาษาไทย · <a href={`/guide/${slug}`} className="underline hover:text-[var(--fg)]">English</a>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          {g.title}
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">{g.intro}</p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          อัปเดต {g.updated} · คู่มือบรรณาธิการ · เป็นอิสระจากสนาม
        </p>
      </header>

      <AdSlot slot="guide-top" />

      <div className="prose prose-sm max-w-none mt-8 space-y-8">
        {g.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 mt-2">{s.heading}</h2>
            <p className="text-base leading-relaxed text-[var(--fg)] whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>

      <AffiliateInline />

      {g.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">คำถามที่พบบ่อย</h2>
          <div className="space-y-3">
            {g.faqs.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">สนามคะแนนความน่าเชื่อถือสูงสุด</h2>
          <p className="text-sm text-[var(--muted)] mb-4">จัดอันดับจากการวิเคราะห์รีวิว Google จริง.</p>
          <div className="grid gap-3">
            {featured.slice(0, 3).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12 border-t border-[var(--border)] pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
            คู่มือที่เกี่ยวข้อง
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => r && (
              <a
                key={r.slug}
                href={`/th/guide/${r.slug}`}
                className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
              >
                <div className="font-medium leading-tight">{r.title.replace(/ \(\d{4}\)$/, "")}</div>
                <p className="text-xs text-[var(--muted)] mt-1">{r.metaDescription.slice(0, 100)}…</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", url: "/th" },
        { name: "คู่มือ", url: "/th/guide" },
        { name: g.title, url: `/th/guide/${g.slug}` },
      ]} />
      <FaqJsonLd faqs={g.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
