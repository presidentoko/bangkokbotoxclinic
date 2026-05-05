import { loadMasterDb, topByTrust } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { CATEGORY_LABELS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS, CATEGORY_FAQS } from "@/lib/faq";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { LeadCapture } from "@/components/LeadCapture";
import { getSiteConfig, applySiteFilter } from "@/lib/site";

export const dynamic = "force-static";

export default async function HomePage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const top = topByTrust(focused, 50);

  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  // 도시별/카테고리별 카운트는 focused 기준으로 재계산
  const districtMap = new Map<string, number>();
  for (const c of focused) {
    if (c.district) districtMap.set(c.district, (districtMap.get(c.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categoryMap = new Map<string, number>();
  for (const c of focused) {
    for (const cat of c.categories) categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

  // 포커스된 사이트면 그 카테고리 FAQ 사용
  const homeFaqs = cfg.focus !== "all" && CATEGORY_FAQS[cfg.focus]
    ? [...CATEGORY_FAQS[cfg.focus], ...HOME_FAQS]
    : HOME_FAQS;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {cfg.hero}
        </h1>
        <p className="text-[var(--muted)] text-base md:text-lg">
          {cfg.heroSub.replace("Trust Score", `Trust Score from ${totalReviews.toLocaleString()} Google reviews`)}
        </p>
        <p className="text-[var(--muted)] text-sm mt-1">
          {focused.length.toLocaleString()} clinics indexed.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Service</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(([cat, count]) => (
            <a
              key={cat}
              href={`/c/${cat}`}
              className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
            >
              {CATEGORY_LABELS[cat] ?? cat} <span className="text-[var(--muted)]">{count}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By District</h2>
        <div className="flex flex-wrap gap-2">
          {districts.map(([d, count]) => (
            <a
              key={d}
              href={`/d/${encodeURIComponent(d.toLowerCase().replace(/\s+/g, "-"))}`}
              className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
            >
              {d} <span className="text-[var(--muted)]">{count}</span>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Top {top.length} by Trust Score</h2>
        <div className="grid gap-3">
          {top.slice(0, 10).map((c, i) => (
            <ClinicCard key={c.id} clinic={c} rank={i + 1} />
          ))}
        </div>

        <AffiliateInline />

        <div className="grid gap-3 mt-3">
          {top.slice(10).map((c, i) => (
            <ClinicCard key={c.id} clinic={c} rank={i + 11} />
          ))}
        </div>
      </section>

      <LeadCapture context="home" />

      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Frequently asked</h2>
        <div className="space-y-4">
          {homeFaqs.map((f, i) => (
            <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <FaqJsonLd faqs={homeFaqs} />
      <ItemListJsonLd
        name="Top Bangkok Clinics by Trust Score"
        items={top.slice(0, 20).map((c) => ({
          name: c.name,
          url: `/clinic/${c.id}`,
        }))}
      />
    </div>
  );
}
